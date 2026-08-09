import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { i as withTransaction, r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { ensureUserSeeded } from "./seed-DlydNDJa.mjs";
import { r as ensureUserProfile } from "./social-BjKrIrtg.mjs";
import { a as notify } from "./notifications-WEvd4wDq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/posts-OS4f1CEn.js
var postBody = string().trim().min(1).max(500);
function extractMentions(body) {
	const hits = body.match(/@([a-zA-Z0-9_]{3,20})/g) ?? [];
	return [...new Set(hits.map((h) => h.slice(1).toLowerCase()))];
}
function extractHashtags(body) {
	const hits = body.match(/#([\p{L}\p{N}_]{2,40})/gu) ?? [];
	return [...new Set(hits.map((h) => h.slice(1).toLowerCase()))];
}
async function rateLimitPosts(sql, userId) {
	if (((await sql`
    select count(*)::int as c from posts
    where user_id = ${userId}
      and created_at > now() - interval '1 hour'
  `)[0]?.c ?? 0) >= 30) throw new Error("Rate limit: too many posts this hour.");
}
var createPost_createServerFn_handler = createServerRpc({
	id: "9a441e5ecf31d0e6db8f41b458bd431e94be334995ce09f28fde78c493ae50b7",
	name: "createPost",
	filename: "src/lib/server/posts.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	body: postBody,
	attachedWorkoutId: positiveId.optional().nullable(),
	attachedProgramId: positiveId.optional().nullable()
}))).handler(createPost_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureUserProfile(sql, context.userId);
	await rateLimitPosts(sql, context.userId);
	if (data.attachedWorkoutId) {
		if ((await sql`
        select id from workouts
        where id = ${data.attachedWorkoutId} and user_id = ${context.userId}
      `).length === 0) throw new Error("Workout not found.");
	}
	if (data.attachedProgramId) {
		if ((await sql`
        select id from programs
        where id = ${data.attachedProgramId} and user_id = ${context.userId}
      `).length === 0) throw new Error("Program not found.");
	}
	const tags = extractHashtags(data.body);
	const mentions = extractMentions(data.body);
	const result = await withTransaction(async (tx) => {
		const postId = (await tx`
        insert into posts (user_id, body, attached_workout_id, attached_program_id)
        values (
          ${context.userId},
          ${data.body},
          ${data.attachedWorkoutId ?? null},
          ${data.attachedProgramId ?? null}
        )
        returning id
      `)[0].id;
		let workoutSummary = null;
		if (data.attachedWorkoutId) {
			const w = await tx`
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
			if (w[0]) workoutSummary = {
				day_name: w[0].day_name,
				date: w[0].date,
				tonnage: Math.round(Number(w[0].tonnage)),
				exercise_count: w[0].exercise_count
			};
		}
		let programSummary = null;
		if (data.attachedProgramId) {
			const p = await tx`
          select p.name,
            (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count
          from programs p where p.id = ${data.attachedProgramId}
        `;
			if (p[0]) programSummary = {
				name: p[0].name,
				day_count: p[0].day_count
			};
		}
		const payload = {
			body: data.body,
			hashtags: tags,
			workout_id: data.attachedWorkoutId ?? null,
			program_id: data.attachedProgramId ?? null,
			workout: workoutSummary,
			program: programSummary
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
	for (const uname of mentions) {
		const users = await sql`
        select user_id from user_profiles
        where lower(username) = ${uname}
        limit 1
      `;
		if (users[0]) await notify(sql, {
			userId: users[0].user_id,
			actorId: context.userId,
			type: "mention",
			subjectType: "post",
			subjectId: result.postId
		});
	}
	return { id: result.postId };
});
var updatePost_createServerFn_handler = createServerRpc({
	id: "8bbcdf3ab074c88a163788bcf79a696ab81d4768cbf63ee63c532564f7c53463",
	name: "updatePost",
	filename: "src/lib/server/posts.ts"
}, (opts) => updatePost.__executeServer(opts));
var updatePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	body: postBody
}))).handler(updatePost_createServerFn_handler, async ({ context, data }) => {
	if ((await (await getSql())`
      select id from posts where id = ${data.id} and user_id = ${context.userId}
    `).length === 0) throw new Error("Post not found.");
	const tags = extractHashtags(data.body);
	await withTransaction(async (tx) => {
		await tx`
        update posts
        set body = ${data.body}, edited_at = now()
        where id = ${data.id} and user_id = ${context.userId}
      `;
		await tx`
        update activity_events
        set payload = payload || ${JSON.stringify({
			body: data.body,
			hashtags: tags
		})}::jsonb
        where type = 'user_post' and subject_id = ${data.id} and user_id = ${context.userId}
      `;
	});
	return { ok: true };
});
var deletePost_createServerFn_handler = createServerRpc({
	id: "db2bb5661c551c81866504ac9d5724cb106fca369d7130d1f99763e692ed75a9",
	name: "deletePost",
	filename: "src/lib/server/posts.ts"
}, (opts) => deletePost.__executeServer(opts));
var deletePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(deletePost_createServerFn_handler, async ({ context, data: id }) => {
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
var reportPost_createServerFn_handler = createServerRpc({
	id: "b6cbcd750f78dad39869f5ba2141dbf3165667d81bd2d703a729a45e689cd07e",
	name: "reportPost",
	filename: "src/lib/server/posts.ts"
}, (opts) => reportPost.__executeServer(opts));
var reportPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	reason: string().trim().max(200).optional()
}))).handler(reportPost_createServerFn_handler, async ({ context, data }) => {
	return { ok: true };
});
var listMyRecentWorkouts_createServerFn_handler = createServerRpc({
	id: "e79740d2468a191b43278a2a4896d553f9f01c623b41dfac83ec1cb19135fc03",
	name: "listMyRecentWorkouts",
	filename: "src/lib/server/posts.ts"
}, (opts) => listMyRecentWorkouts.__executeServer(opts));
var listMyRecentWorkouts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(listMyRecentWorkouts_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, day_name, date::text as date
      from workouts
      where user_id = ${context.userId} and status = 'completed'
      order by date desc
      limit 10
    `;
});
//#endregion
export { createPost_createServerFn_handler, deletePost_createServerFn_handler, listMyRecentWorkouts_createServerFn_handler, reportPost_createServerFn_handler, updatePost_createServerFn_handler };
