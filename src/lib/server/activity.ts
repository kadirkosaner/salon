import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";
import { ensureUserProfile } from "./social";
import { v, positiveId, parseOrThrow } from "@/lib/validation";
import { z } from "zod";

export type ActivityType =
  | "workout_completed"
  | "personal_record"
  | "program_published"
  | "streak_milestone";

export type FeedItem = {
  id: number;
  type: ActivityType;
  subject_id: number | null;
  payload: {
    day_name?: string;
    date?: string;
    tonnage?: number;
    exercise_count?: number;
    exercise_name?: string;
    weight?: number;
    prev_weight?: number | null;
    unit?: string;
    workout_id?: number;
    name?: string;
    day_count?: number;
    share_code?: string | null;
    weeks?: number;
  };
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string | null;
    image: string | null;
  };
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  is_mine: boolean;
};

export type FeedPage = {
  items: FeedItem[];
  nextCursor: string | null;
};

const STREAK_MILESTONES = [4, 8, 12, 26, 52];

/** Build workout snapshot + insert workout_completed (idempotent). */
export async function emitWorkoutCompleted(
  sql: Sql,
  userId: string,
  workoutId: number,
): Promise<void> {
  const rows = await sql<{
    id: number;
    day_name: string;
    date: string;
    status: string;
  }>`
    select id, day_name, date::text as date, status
    from workouts
    where id = ${workoutId} and user_id = ${userId}
  `;
  if (rows.length === 0 || rows[0]!.status !== "completed") return;
  const w = rows[0]!;

  const stats = await sql<{
    tonnage: string;
    exercise_count: number;
  }>`
    select
      coalesce(sum(ws.weight * ws.reps), 0)::text as tonnage,
      (
        select count(*)::int from workout_exercises we
        where we.workout_id = ${workoutId}
      ) as exercise_count
    from workout_sets ws
    join workout_exercises we on we.id = ws.workout_exercise_id
    where we.workout_id = ${workoutId}
      and ws.completed = true
      and we.unit = 'kg'
      and ws.weight is not null and ws.reps is not null
  `;

  const payload = {
    day_name: w.day_name,
    date: w.date,
    tonnage: Math.round(Number(stats[0]?.tonnage ?? 0)),
    exercise_count: stats[0]?.exercise_count ?? 0,
  };

  await sql`
    insert into activity_events (user_id, type, subject_id, payload)
    values (
      ${userId},
      'workout_completed',
      ${workoutId},
      ${JSON.stringify(payload)}::jsonb
    )
    on conflict do nothing
  `;

  await maybeEmitStreakMilestone(sql, userId);
}

/** When a set is completed with a weight PR for that exercise name. */
export type PrEmitResult = {
  exercise_name: string;
  weight: number;
  prev_weight: number | null;
  unit: string;
} | null;

export async function emitPersonalRecordIfAny(
  sql: Sql,
  userId: string,
  setId: number,
): Promise<PrEmitResult> {
  const cur = await sql<{
    set_id: number;
    weight: string | null;
    exercise_name: string;
    workout_id: number;
    completed: boolean;
  }>`
    select
      ws.id as set_id,
      ws.weight::text as weight,
      we.exercise_name,
      we.workout_id,
      ws.completed
    from workout_sets ws
    join workout_exercises we on we.id = ws.workout_exercise_id
    join workouts w on w.id = we.workout_id
    where ws.id = ${setId} and w.user_id = ${userId}
  `;
  if (cur.length === 0) return null;
  const s = cur[0]!;
  if (!s.completed || s.weight == null) return null;
  const weight = Number(s.weight);
  if (!(weight > 0)) return null;

  const prev = await sql<{ max_w: string | null }>`
    select max(ws.weight)::text as max_w
    from workout_sets ws
    join workout_exercises we on we.id = ws.workout_exercise_id
    join workouts w on w.id = we.workout_id
    where w.user_id = ${userId}
      and we.exercise_name = ${s.exercise_name}
      and ws.completed = true
      and ws.id <> ${setId}
      and we.unit = 'kg'
      and ws.weight is not null
  `;
  const prevW = prev[0]?.max_w != null ? Number(prev[0].max_w) : 0;
  if (weight <= prevW) return null;

  const payload = {
    exercise_name: s.exercise_name,
    weight,
    prev_weight: prevW > 0 ? prevW : null,
    unit: "kg",
    workout_id: s.workout_id,
  };

  await sql`
    insert into activity_events (user_id, type, subject_id, payload)
    values (
      ${userId},
      'personal_record',
      ${setId},
      ${JSON.stringify(payload)}::jsonb
    )
    on conflict do nothing
  `;
  return {
    exercise_name: s.exercise_name,
    weight,
    prev_weight: prevW > 0 ? prevW : null,
    unit: "kg",
  };
}

export async function emitProgramPublished(
  sql: Sql,
  userId: string,
  programId: number,
): Promise<void> {
  const rows = await sql<{
    id: number;
    name: string;
    share_code: string | null;
    day_count: number;
  }>`
    select
      p.id, p.name, p.share_code,
      (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count
    from programs p
    where p.id = ${programId} and p.user_id = ${userId} and p.is_public = true
  `;
  if (rows.length === 0) return;
  const p = rows[0]!;
  const payload = {
    name: p.name,
    day_count: p.day_count,
    share_code: p.share_code,
  };
  await sql`
    insert into activity_events (user_id, type, subject_id, payload)
    values (
      ${userId},
      'program_published',
      ${programId},
      ${JSON.stringify(payload)}::jsonb
    )
    on conflict do nothing
  `;
}

async function maybeEmitStreakMilestone(sql: Sql, userId: string): Promise<void> {
  // Count consecutive weeks with ≥4 completed sessions (simple: last 52 weeks)
  const weeks = await sql<{ week_start: string; c: number }>`
    select
      date_trunc('week', date)::date::text as week_start,
      count(*)::int as c
    from workouts
    where user_id = ${userId} and status = 'completed'
    group by 1
    order by 1 desc
    limit 60
  `;
  let streak = 0;
  // PG date_trunc week is Monday in ISO mode for recent PG; accept gaps via sequential check
  for (const w of weeks) {
    if (w.c >= 4) streak += 1;
    else break;
  }
  if (!STREAK_MILESTONES.includes(streak)) return;
  const payload = { weeks: streak };
  await sql`
    insert into activity_events (user_id, type, subject_id, payload)
    values (
      ${userId},
      'streak_milestone',
      ${streak},
      ${JSON.stringify(payload)}::jsonb
    )
    on conflict do nothing
  `;
}

function mapPayload(raw: unknown): FeedItem["payload"] {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as FeedItem["payload"];
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as FeedItem["payload"];
  return {};
}

export const getFeed = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(40).optional(),
      }),
    ),
  )
  .handler(async ({ context, data }): Promise<FeedPage> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureUserProfile(sql, context.userId);
    const limit = data.limit ?? 15;
    const cursor = data.cursor ?? null;

    // Visibility-aware: own events always; others if public or (followers + I follow)
    const rows = await sql<{
      id: number;
      type: string;
      subject_id: number | null;
      payload: unknown;
      created_at: string;
      author_id: string;
      author_name: string;
      author_image: string | null;
      username: string | null;
      avatar_url: string | null;
      like_count: number;
      comment_count: number;
      liked_by_me: boolean;
    }>`
      select
        e.id,
        e.type,
        e.subject_id,
        e.payload,
        e.created_at::text as created_at,
        u.id as author_id,
        u.name as author_name,
        u.image as author_image,
        up.username,
        up.avatar_url,
        (select count(*)::int from activity_likes al where al.event_id = e.id) as like_count,
        (select count(*)::int from activity_comments ac where ac.event_id = e.id) as comment_count,
        exists(
          select 1 from activity_likes al
          where al.event_id = e.id and al.user_id = ${context.userId}
        ) as liked_by_me
      from activity_events e
      join "user" u on u.id = e.user_id
      left join user_profiles up on up.user_id = e.user_id
      where (
        e.user_id = ${context.userId}
        or (
          coalesce(up.visibility, 'public') = 'public'
          and (
            e.user_id in (
              select following_id from user_follows where follower_id = ${context.userId}
            )
            or e.user_id = ${context.userId}
          )
        )
        or (
          coalesce(up.visibility, 'public') = 'followers'
          and exists(
            select 1 from user_follows f
            where f.follower_id = ${context.userId} and f.following_id = e.user_id
          )
        )
      )
      and (
        ${cursor}::timestamptz is null
        or e.created_at < ${cursor}::timestamptz
      )
      order by e.created_at desc
      limit ${limit + 1}
    `;

    // Also show public events from non-followed users when feed is thin? Spec says following + own only.
    // Empty state handled client-side with suggestions.

    const slice = rows.slice(0, limit);
    const hasMore = rows.length > limit;
    const nextCursor =
      hasMore && slice.length > 0
        ? slice[slice.length - 1]!.created_at
        : null;

    return {
      items: slice.map((r) => ({
        id: Number(r.id),
        type: r.type as ActivityType,
        subject_id: r.subject_id != null ? Number(r.subject_id) : null,
        payload: mapPayload(r.payload),
        created_at: r.created_at,
        author: {
          id: r.author_id,
          name: r.author_name,
          username: r.username,
          image: r.avatar_url || r.author_image,
        },
        like_count: r.like_count,
        comment_count: r.comment_count,
        liked_by_me: r.liked_by_me === true,
        is_mine: r.author_id === context.userId,
      })),
      nextCursor,
    };
  });

/** Public feed for empty state: recent public events from anyone. */
export const getDiscoverFeed = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const rows = await sql<{
      id: number;
      type: string;
      subject_id: number | null;
      payload: unknown;
      created_at: string;
      author_id: string;
      author_name: string;
      author_image: string | null;
      username: string | null;
      avatar_url: string | null;
      like_count: number;
      comment_count: number;
      liked_by_me: boolean;
    }>`
      select
        e.id, e.type, e.subject_id, e.payload,
        e.created_at::text as created_at,
        u.id as author_id, u.name as author_name, u.image as author_image,
        up.username, up.avatar_url,
        (select count(*)::int from activity_likes al where al.event_id = e.id) as like_count,
        (select count(*)::int from activity_comments ac where ac.event_id = e.id) as comment_count,
        exists(
          select 1 from activity_likes al
          where al.event_id = e.id and al.user_id = ${context.userId}
        ) as liked_by_me
      from activity_events e
      join "user" u on u.id = e.user_id
      left join user_profiles up on up.user_id = e.user_id
      where coalesce(up.visibility, 'public') = 'public'
      order by e.created_at desc
      limit 20
    `;
    return rows.map((r) => ({
      id: Number(r.id),
      type: r.type as ActivityType,
      subject_id: r.subject_id != null ? Number(r.subject_id) : null,
      payload: mapPayload(r.payload),
      created_at: r.created_at,
      author: {
        id: r.author_id,
        name: r.author_name,
        username: r.username,
        image: r.avatar_url || r.author_image,
      },
      like_count: r.like_count,
      comment_count: r.comment_count,
      liked_by_me: r.liked_by_me === true,
      is_mine: r.author_id === context.userId,
    })) as FeedItem[];
  });

export const getSuggestedAthletes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return sql<{
      id: string;
      name: string;
      username: string | null;
      image: string | null;
      followers: number;
      public_programs: number;
      is_following: boolean;
    }>`
      select
        u.id,
        u.name,
        up.username,
        coalesce(up.avatar_url, u.image) as image,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers,
        (select count(*)::int from programs p where p.user_id = u.id and p.is_public = true) as public_programs,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following
      from "user" u
      left join user_profiles up on up.user_id = u.id
      where u.id <> ${context.userId}
        and coalesce(up.visibility, 'public') = 'public'
      order by followers desc, public_programs desc
      limit 8
    `;
  });

export const likeActivity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    await sql`
      insert into activity_likes (event_id, user_id)
      values (${eventId}, ${context.userId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const unlikeActivity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    await sql`
      delete from activity_likes
      where event_id = ${eventId} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const listComments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    void context;
    return sql<{
      id: number;
      body: string;
      created_at: string;
      user_id: string;
      name: string;
      username: string | null;
      image: string | null;
    }>`
      select
        c.id, c.body, c.created_at::text as created_at, c.user_id,
        u.name, up.username,
        coalesce(up.avatar_url, u.image) as image
      from activity_comments c
      join "user" u on u.id = c.user_id
      left join user_profiles up on up.user_id = c.user_id
      where c.event_id = ${eventId}
      order by c.created_at asc
      limit 100
    `;
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d) =>
      parseOrThrow(
        z.object({
          eventId: positiveId,
          body: z.string().trim().min(1).max(280),
        }),
        d,
      ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const exists = await sql`select id from activity_events where id = ${data.eventId}`;
    if (exists.length === 0) throw new Error("Olay bulunamadı.");
    const rows = await sql<{ id: number }>`
      insert into activity_comments (event_id, user_id, body)
      values (${data.eventId}, ${context.userId}, ${data.body})
      returning id
    `;
    return { id: rows[0]!.id };
  });

export const deleteActivity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    await sql`
      delete from activity_events
      where id = ${eventId} and user_id = ${context.userId}
    `;
    return { ok: true };
  });
