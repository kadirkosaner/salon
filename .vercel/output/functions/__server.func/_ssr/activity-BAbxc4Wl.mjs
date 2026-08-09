import { r as createServerFn } from "./ssr.mjs";
import { gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-BAbxc4Wl.js
var STREAK_MILESTONES = [
	4,
	8,
	12,
	26,
	52
];
/** Build workout snapshot + insert workout_completed (idempotent). */
async function emitWorkoutCompleted(sql, userId, workoutId) {
	const rows = await sql`
    select id, day_name, date::text as date, status
    from workouts
    where id = ${workoutId} and user_id = ${userId}
  `;
	if (rows.length === 0 || rows[0].status !== "completed") return;
	const w = rows[0];
	const stats = await sql`
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
		exercise_count: stats[0]?.exercise_count ?? 0
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
async function emitPersonalRecordIfAny(sql, userId, setId) {
	const cur = await sql`
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
	const s = cur[0];
	if (!s.completed || s.weight == null) return null;
	const weight = Number(s.weight);
	if (!(weight > 0)) return null;
	const prev = await sql`
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
		workout_id: s.workout_id
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
		unit: "kg"
	};
}
async function emitProgramPublished(sql, userId, programId) {
	const rows = await sql`
    select
      p.id, p.name, p.share_code,
      (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count
    from programs p
    where p.id = ${programId} and p.user_id = ${userId} and p.is_public = true
  `;
	if (rows.length === 0) return;
	const p = rows[0];
	const payload = {
		name: p.name,
		day_count: p.day_count,
		share_code: p.share_code
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
async function maybeEmitStreakMilestone(sql, userId) {
	const weeks = await sql`
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
	for (const w of weeks) if (w.c >= 4) streak += 1;
	else break;
	if (!STREAK_MILESTONES.includes(streak)) return;
	await sql`
    insert into activity_events (user_id, type, subject_id, payload)
    values (
      ${userId},
      'streak_milestone',
      ${streak},
      ${JSON.stringify({ weeks: streak })}::jsonb
    )
    on conflict do nothing
  `;
}
var getFeed = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	cursor: string().optional(),
	limit: number().int().min(1).max(40).optional()
}))).handler(createSsrRpc("ddc04f5e713c3ee6337569cc64d4af84a9252a35bbc71179e77999333b8ab76e"));
/** Public feed for empty state: recent public events from anyone. */
var getDiscoverFeed = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("6cb0c44585db7d8adacdd8c95d252849c501333dca44120d4aa2c9fe7ec0d939"));
var getSuggestedAthletes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ limit: number().int().min(1).max(60).optional() }).optional())).handler(createSsrRpc("815336a91630b55d7790f232560835ec12ae22f07542e483fa2f63e840a3c607"));
var likeActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("b66254c464d8c31c49eea4fc973c144639a8a31522c53452a4e60348ff47cf14"));
var unlikeActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("58b4f02b7793785fc64c7613e546f98d7c8af2d6467867ee79df990ca6ef30d0"));
var listComments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("fd090c0d36f73268aca4ab7f0e9a95212df4560e2020a912fac561986c5dce02"));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	eventId: positiveId,
	body: string().trim().min(1).max(500),
	parentId: positiveId.optional().nullable()
}))).handler(createSsrRpc("423e37c6daeab9d0f4f6942a042f43d19935b23e347eff79c6b7bbfeae49a504"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	body: string().trim().min(1).max(500)
}))).handler(createSsrRpc("7a0c98e192d64503b0df204d840fb6bfe64686d67100215dca7fb3920c48ec9d"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("a9259dbd5bfc0d4c2a8d12cffe8794d3cf06a5aaa152c357ec37e153a7b58b19"));
var likeComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("a37c0f262d17b61a8f05d6ee3aeaf88ae09b564351351463d874d115437e7c2f"));
var unlikeComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("4e540399f07bff695ae4dbb99eeb0ecd338936c3c391bd365decded7bb8e5879"));
var deleteActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("a044e278ec1c2b11f87b769d51ef8016bbbd8c280f81537be435a24a0cfa4ea0"));
//#endregion
export { emitWorkoutCompleted as a, getSuggestedAthletes as c, listComments as d, unlikeActivity as f, emitProgramPublished as i, likeActivity as l, deleteActivity as n, getDiscoverFeed as o, unlikeComment as p, emitPersonalRecordIfAny as r, getFeed as s, addComment as t, likeComment as u };
