import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { r as getSql } from "./db-CFyZej8J.mjs";
import { a as ensureUserSeeded, n as createServerRpc } from "./seed-Dy9IlGmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-CV5aoLVB.js
function startOfWeekMonday(d = /* @__PURE__ */ new Date()) {
	const x = new Date(d);
	const day = x.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	x.setDate(x.getDate() + diff);
	return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
function addDays(iso, n) {
	const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
async function loadProfileHub(sql, viewerId, userId) {
	const users = await sql`
    select id, name, image, email from "user" where id = ${userId}
  `;
	if (users.length === 0) throw new Error("Kullanıcı bulunamadı.");
	const u = users[0];
	const isSelf = viewerId === userId;
	const stats = await sql`
    select
      (select count(*)::int from user_follows where following_id = ${userId}) as followers,
      (select count(*)::int from user_follows where follower_id = ${userId}) as following
  `;
	const isFollowing = !isSelf && (await sql`
        select exists(
          select 1 from user_follows
          where follower_id = ${viewerId} and following_id = ${userId}
        ) as e
      `)[0]?.e === true;
	const weekStart = startOfWeekMonday();
	const weekEnd = addDays(weekStart, 6);
	const totals = await sql`
    select
      (
        select count(*)::int from workouts
        where user_id = ${userId} and status = 'completed'
      ) as total_sessions,
      (
        select coalesce(sum(ws.weight * ws.reps), 0)::text
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        join workouts w on w.id = we.workout_id
        where w.user_id = ${userId}
          and w.status = 'completed'
          and ws.completed = true
          and we.unit = 'kg'
          and ws.weight is not null and ws.reps is not null
      ) as total_volume,
      (
        select count(*)::int from workouts
        where user_id = ${userId}
          and status = 'completed'
          and date >= ${weekStart}::date and date <= ${weekEnd}::date
      ) as week_sessions,
      (
        select coalesce(sum(ws.weight * ws.reps), 0)::text
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        join workouts w on w.id = we.workout_id
        where w.user_id = ${userId}
          and w.status = 'completed'
          and w.date >= ${weekStart}::date and w.date <= ${weekEnd}::date
          and ws.completed = true
          and we.unit = 'kg'
          and ws.weight is not null and ws.reps is not null
      ) as week_volume
  `;
	const completedByDate = await sql`
    select date::text as date from workouts
    where user_id = ${userId}
      and status = 'completed'
      and date >= ${addDays(weekStart, -364)}::date
  `;
	const weekSessions = totals[0]?.week_sessions ?? 0;
	let streak = 0;
	const startI = weekSessions >= 4 ? 0 : 1;
	for (let i = startI; i < 52; i++) {
		const ws = addDays(weekStart, -7 * i);
		const we = addDays(ws, 6);
		if (completedByDate.filter((r) => r.date >= ws && r.date <= we).length >= 4) streak += 1;
		else break;
	}
	const prog = await sql`
    select name from programs
    where user_id = ${userId} and is_active = true
    order by id desc limit 1
  `;
	const measure = await sql`
    select date::text as date,
           body_weight::text as body_weight,
           waist::text as waist,
           chest::text as chest,
           arm::text as arm,
           thigh::text as thigh
    from body_measurements
    where user_id = ${userId}
    order by date desc
    limit 1
  `;
	const recent = await sql`
    select w.id, w.date::text as date, w.day_name, w.status,
      (
        select coalesce(sum(ws.weight * ws.reps), 0)::text
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        where we.workout_id = w.id and ws.completed = true
          and we.unit = 'kg' and ws.weight is not null and ws.reps is not null
      ) as tonnage
    from workouts w
    where w.user_id = ${userId}
      and w.status = 'completed'
    order by w.date desc
    limit 8
  `;
	const programs = await sql`
    select
      p.id, p.name, p.description, p.share_code,
      coalesce(p.clone_count, 0)::int as clone_count,
      (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count
    from programs p
    where p.user_id = ${userId}
      and (${isSelf} or p.is_public = true)
    order by p.is_active desc, p.clone_count desc, p.id desc
    limit 12
  `;
	const m = measure[0];
	return {
		id: u.id,
		name: u.name,
		image: u.image,
		email: isSelf ? u.email : null,
		followers: stats[0]?.followers ?? 0,
		following: stats[0]?.following ?? 0,
		is_self: isSelf,
		is_following: isFollowing,
		streak,
		total_sessions: totals[0]?.total_sessions ?? 0,
		total_volume: Math.round(Number(totals[0]?.total_volume ?? 0)),
		week_volume: Math.round(Number(totals[0]?.week_volume ?? 0)),
		week_sessions: weekSessions,
		active_program: prog[0]?.name ?? null,
		measurement: m ? {
			date: m.date,
			body_weight: m.body_weight != null ? Number(m.body_weight) : null,
			waist: m.waist != null ? Number(m.waist) : null,
			chest: m.chest != null ? Number(m.chest) : null,
			arm: m.arm != null ? Number(m.arm) : null,
			thigh: m.thigh != null ? Number(m.thigh) : null
		} : null,
		recent: recent.map((r) => ({
			id: r.id,
			date: r.date,
			day_name: r.day_name,
			status: r.status,
			tonnage: Math.round(Number(r.tonnage))
		})),
		programs
	};
}
/** Own profile hub (stats, measures, activity). */
var getMyProfileHub_createServerFn_handler = createServerRpc({
	id: "dcffd40a8afe60207067f5b87cecae9756d9504ba2c8232485aae25fbe0e1074",
	name: "getMyProfileHub",
	filename: "src/lib/server/social.ts"
}, (opts) => getMyProfileHub.__executeServer(opts));
var getMyProfileHub = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfileHub_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return loadProfileHub(sql, context.userId, context.userId);
});
var searchUsers_createServerFn_handler = createServerRpc({
	id: "d05e65867b4933b54ef5627cd1ae652e99f56d8ef8b17e77de48c8b6202812c1",
	name: "searchUsers",
	filename: "src/lib/server/social.ts"
}, (opts) => searchUsers.__executeServer(opts));
var searchUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((q) => q).handler(searchUsers_createServerFn_handler, async ({ context, data: q }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const term = q.trim();
	if (term.length < 1) return [];
	return (await sql`
      select
        u.id,
        u.name,
        u.image,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers,
        (select count(*)::int from user_follows f where f.follower_id = u.id) as following,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following,
        (select count(*)::int from programs p
          where p.user_id = u.id and p.is_public = true) as public_programs
      from "user" u
      where u.id <> ${context.userId}
        and (
          u.name ilike ${"%" + term + "%"}
          or u.email ilike ${"%" + term + "%"}
        )
      order by u.name
      limit 30
    `).map((r) => ({
		...r,
		is_self: false
	}));
});
var listFollowing_createServerFn_handler = createServerRpc({
	id: "77aefd561628bc160bf92f337ebc8febab564be724c1bb0d561ff8b10d5edd2a",
	name: "listFollowing",
	filename: "src/lib/server/social.ts"
}, (opts) => listFollowing.__executeServer(opts));
var listFollowing = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFollowing_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return sql`
      select
        u.id, u.name, u.image,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers
      from user_follows uf
      join "user" u on u.id = uf.following_id
      where uf.follower_id = ${context.userId}
      order by uf.created_at desc
      limit 50
    `;
});
var listFollowers_createServerFn_handler = createServerRpc({
	id: "807140b5c76a90c2fad6097751739cd559fc4f2f5bd23001e96fc44ee9a9ad30",
	name: "listFollowers",
	filename: "src/lib/server/social.ts"
}, (opts) => listFollowers.__executeServer(opts));
var listFollowers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listFollowers_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select
        u.id, u.name, u.image,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following
      from user_follows uf
      join "user" u on u.id = uf.follower_id
      where uf.following_id = ${context.userId}
      order by uf.created_at desc
      limit 50
    `;
});
var getUserProfile_createServerFn_handler = createServerRpc({
	id: "19d1cb38e56874c5c5f6510e87194380872bf11f93bf1cce71905e981218f32a",
	name: "getUserProfile",
	filename: "src/lib/server/social.ts"
}, (opts) => getUserProfile.__executeServer(opts));
var getUserProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((userId) => userId).handler(getUserProfile_createServerFn_handler, async ({ context, data: userId }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return loadProfileHub(sql, context.userId, userId);
});
var followUser_createServerFn_handler = createServerRpc({
	id: "c7a400c7f9b0406c032c6adbaba9a904b310de1d4d2546b4498d581195683f76",
	name: "followUser",
	filename: "src/lib/server/social.ts"
}, (opts) => followUser.__executeServer(opts));
var followUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(followUser_createServerFn_handler, async ({ context, data: userId }) => {
	if (userId === context.userId) throw new Error("Kendini takip edemezsin.");
	const sql = await getSql();
	if ((await sql`select id from "user" where id = ${userId}`).length === 0) throw new Error("Kullanıcı yok.");
	await sql`
      insert into user_follows (follower_id, following_id)
      values (${context.userId}, ${userId})
      on conflict do nothing
    `;
	return { ok: true };
});
var unfollowUser_createServerFn_handler = createServerRpc({
	id: "5068934b9dde26ae93ddd83a0a2b8194a6c3c5e7f20ec10f7f2deed2d93e3017",
	name: "unfollowUser",
	filename: "src/lib/server/social.ts"
}, (opts) => unfollowUser.__executeServer(opts));
var unfollowUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((userId) => userId).handler(unfollowUser_createServerFn_handler, async ({ context, data: userId }) => {
	await (await getSql())`
      delete from user_follows
      where follower_id = ${context.userId} and following_id = ${userId}
    `;
	return { ok: true };
});
//#endregion
export { followUser_createServerFn_handler, getMyProfileHub_createServerFn_handler, getUserProfile_createServerFn_handler, listFollowers_createServerFn_handler, listFollowing_createServerFn_handler, searchUsers_createServerFn_handler, unfollowUser_createServerFn_handler };
