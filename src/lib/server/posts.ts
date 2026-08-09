import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { v, positiveId, noInput } from "@/lib/validation";
import { z } from "zod";
import { ensureUserSeeded } from "./seed";
import { ensureUserProfile } from "./social";
import { notify } from "./notifications";

const postBody = z.string().trim().min(1).max(500);

export function extractMentions(body: string): string[] {
  const hits = body.match(/@([a-zA-Z0-9_]{3,20})/g) ?? [];
  return [...new Set(hits.map((h) => h.slice(1).toLowerCase()))];
}

export function extractHashtags(body: string): string[] {
  const hits = body.match(/#([\p{L}\p{N}_]{2,40})/gu) ?? [];
  return [...new Set(hits.map((h) => h.slice(1).toLowerCase()))];
}

async function rateLimitPosts(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<{ c: number }>`
    select count(*)::int as c from posts
    where user_id = ${userId}
      and created_at > now() - interval '1 hour'
  `;
  if ((rows[0]?.c ?? 0) >= 30) throw new Error("Rate limit: too many posts this hour.");
}

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        body: postBody,
        attachedWorkoutId: positiveId.optional().nullable(),
        attachedProgramId: positiveId.optional().nullable(),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureUserProfile(sql, context.userId);
    await rateLimitPosts(sql, context.userId);

    if (data.attachedWorkoutId) {
      const w = await sql`
        select id from workouts
        where id = ${data.attachedWorkoutId} and user_id = ${context.userId}
      `;
      if (w.length === 0) throw new Error("Workout not found.");
    }
    if (data.attachedProgramId) {
      const p = await sql`
        select id from programs
        where id = ${data.attachedProgramId} and user_id = ${context.userId}
      `;
      if (p.length === 0) throw new Error("Program not found.");
    }

    const tags = extractHashtags(data.body);
    const mentions = extractMentions(data.body);

    const result = await withTransaction(async (tx) => {
      const rows = await tx<{ id: number }>`
        insert into posts (user_id, body, attached_workout_id, attached_program_id)
        values (
          ${context.userId},
          ${data.body},
          ${data.attachedWorkoutId ?? null},
          ${data.attachedProgramId ?? null}
        )
        returning id
      `;
      const postId = rows[0]!.id;

      let workoutSummary: Record<string, unknown> | null = null;
      if (data.attachedWorkoutId) {
        const w = await tx<{
          day_name: string;
          date: string;
          tonnage: string;
          exercise_count: number;
        }>`
          select
            w.day_name,
            w.date::text as date,
            coalesce((
              select sum(ws.weight * ws.reps)
              from workout_sets ws
              join workout_exercises we on we.id = ws.workout_exercise_id
              where we.workout_id = w.id and ws.completed = true
                and ws.weight is not null and ws.reps is not null
            ), 0)::text as tonnage,
            (select count(*)::int from workout_exercises we where we.workout_id = w.id) as exercise_count
          from workouts w
          where w.id = ${data.attachedWorkoutId}
        `;
        if (w[0]) {
          workoutSummary = {
            day_name: w[0].day_name,
            date: w[0].date,
            tonnage: Math.round(Number(w[0].tonnage)),
            exercise_count: w[0].exercise_count,
          };
        }
      }

      let programSummary: Record<string, unknown> | null = null;
      if (data.attachedProgramId) {
        const p = await tx<{ name: string; day_count: number }>`
          select p.name,
            (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count
          from programs p where p.id = ${data.attachedProgramId}
        `;
        if (p[0]) {
          programSummary = { name: p[0].name, day_count: p[0].day_count };
        }
      }

      const payload = {
        body: data.body,
        hashtags: tags,
        workout_id: data.attachedWorkoutId ?? null,
        program_id: data.attachedProgramId ?? null,
        workout: workoutSummary,
        program: programSummary,
      };

      await tx`
        insert into activity_events (user_id, type, subject_id, payload)
        values (
          ${context.userId},
          'user_post',
          ${postId},
          ${JSON.stringify(payload)}::jsonb
        )
        on conflict do nothing
      `;

      return { postId };
    });

    // Mentions → notifications
    for (const uname of mentions) {
      const users = await sql<{ user_id: string }>`
        select user_id from user_profiles
        where lower(username) = ${uname}
        limit 1
      `;
      if (users[0]) {
        await notify(sql, {
          userId: users[0].user_id,
          actorId: context.userId,
          type: "mention",
          subjectType: "post",
          subjectId: result.postId,
        });
      }
    }

    return { id: result.postId };
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        id: positiveId,
        body: postBody,
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from posts where id = ${data.id} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Post not found.");

    const tags = extractHashtags(data.body);
    await withTransaction(async (tx) => {
      await tx`
        update posts
        set body = ${data.body}, edited_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
      await tx`
        update activity_events
        set payload = payload || ${JSON.stringify({ body: data.body, hashtags: tags })}::jsonb
        where type = 'user_post' and subject_id = ${data.id} and user_id = ${context.userId}
      `;
    });
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: id }) => {
    await withTransaction(async (tx) => {
      await tx`
        delete from activity_events
        where type = 'user_post' and subject_id = ${id} and user_id = ${context.userId}
      `;
      await tx`
        delete from posts where id = ${id} and user_id = ${context.userId}
      `;
    });
    return { ok: true };
  });

export const reportPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({ id: positiveId, reason: z.string().trim().max(200).optional() })))
  .handler(async ({ context, data }) => {
    // Soft report: just acknowledge (no storage table this round — prevents abuse via rate)
    void context;
    void data;
    return { ok: true };
  });

export const listMyRecentWorkouts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ id: number; day_name: string; date: string }>`
      select id, day_name, date::text as date
      from workouts
      where user_id = ${context.userId} and status = 'completed'
      order by date desc
      limit 10
    `;
  });
