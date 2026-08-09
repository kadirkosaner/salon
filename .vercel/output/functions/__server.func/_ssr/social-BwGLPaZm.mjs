import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, g as userIdStr, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { ensureUserSeeded } from "./seed-DlydNDJa.mjs";
import { i as slugFromIdentity, n as isValidUsername, r as normalizeUsername } from "./username-Bdxea3be.mjs";
import { startOfWeekMonday, todayForUser } from "./time-BN4ZvYw3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-BwGLPaZm.js
function addDays(iso, n) {
	const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
	d.setDate(d.getDate() + n);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
async function allocateUsername(sql, base, excludeUserId) {
	let candidate = base.slice(0, 20);
	if (candidate.length < 3) candidate = "user";
	if (!isValidUsername(candidate)) candidate = "user";
	for (let i = 0; i < 50; i++) {
		const tryName = i === 0 ? candidate : `${candidate.slice(0, 20 - String(i).length - 1)}_${i}`;
		const rows = await sql`
      select user_id from user_profiles
      where lower(username) = ${tryName}
      limit 1
    `;
		if (rows.length === 0) return tryName;
		if (excludeUserId && rows[0].user_id === excludeUserId) return tryName;
	}
	return `u_${Date.now().toString(36).slice(-8)}`;
}
/** Ensure a user_profiles row exists (auto username). Idempotent. */
async function ensureUserProfile(sql, userId) {
	if ((await sql`
    select user_id from user_profiles where user_id = ${userId} limit 1
  `).length > 0) return;
	const users = await sql`
    select name, email from "user" where id = ${userId} limit 1
  `;
	if (users.length === 0) return;
	await sql`
    insert into user_profiles (user_id, username, username_confirmed)
    values (${userId}, ${await allocateUsername(sql, slugFromIdentity(users[0].name, users[0].email), userId)}, true)
    on conflict (user_id) do nothing
  `;
}
function looksLikeUserId(key) {
	if (key.length > 24) return true;
	if (key.includes("-")) return true;
	if (!/^[a-z0-9_]+$/i.test(key)) return true;
	return false;
}
async function resolveUserId(sql, usernameOrId) {
	const key = usernameOrId.trim();
	if (!key) return null;
	if (looksLikeUserId(key)) {
		const byId = await sql`
      select id from "user" where id = ${key} limit 1
    `;
		if (byId[0]) return byId[0].id;
	}
	const byName = await sql`
    select user_id from user_profiles
    where lower(username) = ${key.toLowerCase()}
    limit 1
  `;
	if (byName[0]) return byName[0].user_id;
	return (await sql`
    select id from "user" where id = ${key} limit 1
  `)[0]?.id ?? null;
}
async function loadProfileHub(sql, viewerId, userId) {
	await ensureUserProfile(sql, userId);
	const users = await sql`
    select id, name, image, email from "user" where id = ${userId}
  `;
	if (users.length === 0) throw new Error("Kullanıcı bulunamadı.");
	const u = users[0];
	const isSelf = viewerId === userId;
	const p = (await sql`
    select username, bio, avatar_url, visibility, unit_system, coalesce(verified, false) as verified,
           measures_public, username_confirmed,
           birth_date::text as birth_date, sex, height_cm::text as height_cm,
           coalesce(details_public, false) as details_public
    from user_profiles where user_id = ${userId}
  `)[0];
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
	const followsYou = !isSelf && (await sql`
        select exists(
          select 1 from user_follows
          where follower_id = ${userId} and following_id = ${viewerId}
        ) as e
      `)[0]?.e === true;
	const visibility = p.visibility || "public";
	let canView = isSelf;
	if (!canView) if (visibility === "public") canView = true;
	else if (visibility === "followers") canView = isFollowing;
	else canView = false;
	const image = p.avatar_url || u.image;
	const baseRestricted = {
		id: u.id,
		name: u.name,
		username: p.username,
		bio: canView ? p.bio : null,
		image,
		email: isSelf ? u.email : null,
		visibility,
		verified: p.verified === true,
		unit_system: p.unit_system || "metric",
		measures_public: p.measures_public,
		username_confirmed: p.username_confirmed === true,
		birth_date: null,
		sex: null,
		height_cm: null,
		details_public: p.details_public === true,
		restricted: !canView,
		followers: stats[0]?.followers ?? 0,
		following: stats[0]?.following ?? 0,
		is_self: isSelf,
		is_following: isFollowing,
		follows_you: followsYou,
		streak: 0,
		total_sessions: 0,
		total_volume: 0,
		week_volume: 0,
		week_sessions: 0,
		active_program: null,
		heatmap: [],
		measurement: null,
		recent: [],
		programs: [],
		records: []
	};
	if (!canView) return baseRestricted;
	const todayIso = await todayForUser(sql, viewerId);
	const weekStart = await startOfWeekMonday(sql, todayIso);
	const weekEnd = addDays(weekStart, 6);
	const heatStart = addDays(todayIso, -84);
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
	const heatmap = (await sql`
    select date::text as date, count(*)::int as c
    from workouts
    where user_id = ${userId}
      and status = 'completed'
      and date >= ${heatStart}::date
    group by date
  `).map((r) => ({
		date: r.date,
		count: r.c
	}));
	const prog = await sql`
    select name from programs
    where user_id = ${userId} and is_active = true
    order by id desc limit 1
  `;
	const showMeasures = isSelf || p.measures_public;
	let measurement = null;
	if (showMeasures) {
		const m = (await sql`
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
    `)[0];
		if (m) measurement = {
			date: m.date,
			body_weight: m.body_weight != null ? Number(m.body_weight) : null,
			waist: m.waist != null ? Number(m.waist) : null,
			chest: m.chest != null ? Number(m.chest) : null,
			arm: m.arm != null ? Number(m.arm) : null,
			thigh: m.thigh != null ? Number(m.thigh) : null
		};
	}
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
	const records = await sql`
    select we.exercise_name as name,
           max(ws.weight)::text as weight,
           max(w.date)::text as date
    from workout_sets ws
    join workout_exercises we on we.id = ws.workout_exercise_id
    join workouts w on w.id = we.workout_id
    where w.user_id = ${userId}
      and w.status = 'completed'
      and ws.completed = true
      and we.unit = 'kg'
      and ws.weight is not null
    group by we.exercise_name
    order by max(ws.weight) desc
    limit 8
  `;
	const showDetails = isSelf || p.details_public === true;
	const sexVal = p.sex === "female" || p.sex === "male" || p.sex === "unspecified" ? p.sex : null;
	return {
		...baseRestricted,
		restricted: false,
		bio: p.bio,
		birth_date: showDetails ? p.birth_date : null,
		sex: showDetails ? sexVal : null,
		height_cm: showDetails && p.height_cm != null ? Number(p.height_cm) : null,
		details_public: p.details_public === true,
		streak,
		total_sessions: totals[0]?.total_sessions ?? 0,
		total_volume: Math.round(Number(totals[0]?.total_volume ?? 0)),
		week_volume: Math.round(Number(totals[0]?.week_volume ?? 0)),
		week_sessions: weekSessions,
		active_program: prog[0]?.name ?? null,
		heatmap,
		measurement,
		recent: recent.map((r) => ({
			id: r.id,
			date: r.date,
			day_name: r.day_name,
			status: r.status,
			tonnage: Math.round(Number(r.tonnage))
		})),
		programs,
		records: records.map((r) => ({
			name: r.name,
			weight: Number(r.weight),
			date: r.date
		}))
	};
}
/** Own profile hub (stats, measures, activity). */
var getMyProfileHub_createServerFn_handler = createServerRpc({
	id: "dcffd40a8afe60207067f5b87cecae9756d9504ba2c8232485aae25fbe0e1074",
	name: "getMyProfileHub",
	filename: "src/lib/server/social.ts"
}, (opts) => getMyProfileHub.__executeServer(opts));
var getMyProfileHub = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(getMyProfileHub_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureUserProfile(sql, context.userId);
	return loadProfileHub(sql, context.userId, context.userId);
});
var searchUsers_createServerFn_handler = createServerRpc({
	id: "d05e65867b4933b54ef5627cd1ae652e99f56d8ef8b17e77de48c8b6202812c1",
	name: "searchUsers",
	filename: "src/lib/server/social.ts"
}, (opts) => searchUsers.__executeServer(opts));
var searchUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(string().trim().max(80))).handler(searchUsers_createServerFn_handler, async ({ context, data: q }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const term = q.trim();
	if (term.length < 1) return [];
	const like = `%${term}%`;
	return (await sql`
      select
        u.id,
        u.name,
        up.username,
        u.image,
        up.avatar_url,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers,
        (select count(*)::int from user_follows f where f.follower_id = u.id) as following,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following,
        exists(
          select 1 from user_follows f
          where f.follower_id = u.id and f.following_id = ${context.userId}
        ) as follows_you,
        (select count(*)::int from programs p
          where p.user_id = u.id and p.is_public = true) as public_programs
      from "user" u
      left join user_profiles up on up.user_id = u.id
      where u.id <> ${context.userId}
        and (
          u.name ilike ${like}
          or coalesce(up.username, '') ilike ${like}
        )
      order by u.name
      limit 30
    `).map((r) => ({
		id: r.id,
		name: r.name,
		username: r.username,
		image: r.avatar_url || r.image,
		followers: r.followers,
		following: r.following,
		is_following: r.is_following,
		follows_you: r.follows_you,
		is_self: false,
		public_programs: r.public_programs
	}));
});
var listFollowing_createServerFn_handler = createServerRpc({
	id: "77aefd561628bc160bf92f337ebc8febab564be724c1bb0d561ff8b10d5edd2a",
	name: "listFollowing",
	filename: "src/lib/server/social.ts"
}, (opts) => listFollowing.__executeServer(opts));
var listFollowing = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(listFollowing_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return sql`
      select
        u.id, u.name, up.username,
        coalesce(up.avatar_url, u.image) as image,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers
      from user_follows uf
      join "user" u on u.id = uf.following_id
      left join user_profiles up on up.user_id = u.id
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
var listFollowers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(listFollowers_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select
        u.id, u.name, up.username,
        coalesce(up.avatar_url, u.image) as image,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following
      from user_follows uf
      join "user" u on u.id = uf.follower_id
      left join user_profiles up on up.user_id = u.id
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
var getUserProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(string().trim().min(1).max(128))).handler(getUserProfile_createServerFn_handler, async ({ context, data: key }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const userId = await resolveUserId(sql, key);
	if (!userId) throw new Error("Kullanıcı bulunamadı.");
	return loadProfileHub(sql, context.userId, userId);
});
var profileUpdateSchema = object({
	username: string().trim().toLowerCase().min(3).max(20).regex(/^[a-z0-9_]+$/).optional(),
	bio: string().trim().max(160).nullable().optional(),
	avatar_url: string().max(4e5).nullable().optional(),
	visibility: _enum([
		"public",
		"followers",
		"private"
	]).optional(),
	unit_system: _enum(["metric", "imperial"]).optional(),
	measures_public: boolean().optional(),
	confirm_username: boolean().optional(),
	birth_date: string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
	sex: _enum([
		"female",
		"male",
		"unspecified"
	]).nullable().optional(),
	height_cm: number().min(80).max(250).nullable().optional(),
	details_public: boolean().optional()
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "ef6b1785d1951b525ca21d36ad0a0468815741b3ab610edc1a12ded206599685",
	name: "updateMyProfile",
	filename: "src/lib/server/social.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(profileUpdateSchema)).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureUserProfile(sql, context.userId);
	if (data.username != null) {
		const u = normalizeUsername(data.username);
		if (!isValidUsername(u)) throw new Error("Geçersiz kullanıcı adı.");
		if ((await sql`
        select user_id from user_profiles
        where lower(username) = ${u} and user_id <> ${context.userId}
        limit 1
      `).length > 0) throw new Error("Bu kullanıcı adı alınmış.");
		await sql`
        update user_profiles set
          username = ${u},
          username_confirmed = true,
          updated_at = now()
        where user_id = ${context.userId}
      `;
	} else if (data.confirm_username) await sql`
        update user_profiles set
          username_confirmed = true,
          updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.bio !== void 0) await sql`
        update user_profiles set bio = ${data.bio?.trim() || null}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.avatar_url !== void 0) {
		const av = data.avatar_url;
		if (av && !av.startsWith("data:image/") && !av.startsWith("http")) throw new Error("Geçersiz avatar.");
		if (av && av.length > 35e4) throw new Error("Avatar çok büyük (max ~250KB).");
		await sql`
        update user_profiles set avatar_url = ${av}, updated_at = now()
        where user_id = ${context.userId}
      `;
	}
	if (data.visibility) await sql`
        update user_profiles set visibility = ${data.visibility}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.unit_system) await sql`
        update user_profiles set unit_system = ${data.unit_system}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.measures_public != null) await sql`
        update user_profiles set measures_public = ${data.measures_public}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.birth_date !== void 0) {
		if (data.birth_date) {
			const d = /* @__PURE__ */ new Date(data.birth_date + "T12:00:00");
			const age = ((/* @__PURE__ */ new Date()).getTime() - d.getTime()) / 315576e5;
			if (Number.isNaN(d.getTime()) || age < 13 || age > 120) throw new Error("Invalid birth date");
		}
		await sql`
        update user_profiles set birth_date = ${data.birth_date}, updated_at = now()
        where user_id = ${context.userId}
      `;
	}
	if (data.sex !== void 0) await sql`
        update user_profiles set sex = ${data.sex}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.height_cm !== void 0) await sql`
        update user_profiles set height_cm = ${data.height_cm}, updated_at = now()
        where user_id = ${context.userId}
      `;
	if (data.details_public != null) await sql`
        update user_profiles set details_public = ${data.details_public}, updated_at = now()
        where user_id = ${context.userId}
      `;
	return loadProfileHub(sql, context.userId, context.userId);
});
var followUser_createServerFn_handler = createServerRpc({
	id: "c7a400c7f9b0406c032c6adbaba9a904b310de1d4d2546b4498d581195683f76",
	name: "followUser",
	filename: "src/lib/server/social.ts"
}, (opts) => followUser.__executeServer(opts));
var followUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(userIdStr)).handler(followUser_createServerFn_handler, async ({ context, data: userId }) => {
	if (userId === context.userId) throw new Error("Kendini takip edemezsin.");
	const sql = await getSql();
	if ((await sql`select id from "user" where id = ${userId}`).length === 0) throw new Error("Kullanıcı yok.");
	if ((await sql`
      insert into user_follows (follower_id, following_id)
      values (${context.userId}, ${userId})
      on conflict do nothing
      returning follower_id
    `).length) {
		const { notify } = await import("./notifications-WEvd4wDq.mjs").then((n) => n.i).then((n) => n.i);
		await notify(sql, {
			userId,
			actorId: context.userId,
			type: "follow",
			subjectType: "user",
			subjectId: context.userId
		});
	}
	return { ok: true };
});
var unfollowUser_createServerFn_handler = createServerRpc({
	id: "5068934b9dde26ae93ddd83a0a2b8194a6c3c5e7f20ec10f7f2deed2d93e3017",
	name: "unfollowUser",
	filename: "src/lib/server/social.ts"
}, (opts) => unfollowUser.__executeServer(opts));
var unfollowUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(userIdStr)).handler(unfollowUser_createServerFn_handler, async ({ context, data: userId }) => {
	await (await getSql())`
      delete from user_follows
      where follower_id = ${context.userId} and following_id = ${userId}
    `;
	return { ok: true };
});
var checkUsernameAvailable_createServerFn_handler = createServerRpc({
	id: "019488682270bb85dd67c083bcc556d52cd4ef953bf253d5639a1abd4ee9ddb7",
	name: "checkUsernameAvailable",
	filename: "src/lib/server/social.ts"
}, (opts) => checkUsernameAvailable.__executeServer(opts));
var checkUsernameAvailable = createServerFn({ method: "GET" }).validator(v(object({ username: string().trim().min(1).max(32) }))).handler(checkUsernameAvailable_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const u = normalizeUsername(data.username);
	if (!isValidUsername(u)) return {
		available: false,
		normalized: u,
		reason: "invalid",
		suggestions: []
	};
	if ((await sql`
      select user_id from user_profiles where lower(username) = ${u} limit 1
    `).length === 0) return {
		available: true,
		normalized: u,
		reason: null,
		suggestions: []
	};
	const suggestions = [];
	for (let i = 1; i <= 6 && suggestions.length < 3; i++) {
		const cand = `${u.slice(0, 20 - String(i).length)}${i}`;
		if (!isValidUsername(cand)) continue;
		if ((await sql`
        select user_id from user_profiles where lower(username) = ${cand} limit 1
      `).length === 0) suggestions.push(cand);
	}
	return {
		available: false,
		normalized: u,
		reason: "taken",
		suggestions
	};
});
var claimRegisterUsername_createServerFn_handler = createServerRpc({
	id: "52a9f85993bcf84badbcc4b40dc94b6fefcc58acbba1bb30d1ee718b4338814e",
	name: "claimRegisterUsername",
	filename: "src/lib/server/social.ts"
}, (opts) => claimRegisterUsername.__executeServer(opts));
var claimRegisterUsername = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	username: string().trim().toLowerCase().min(3).max(20).regex(/^[a-z0-9_]+$/),
	birth_date: string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
	sex: _enum([
		"female",
		"male",
		"unspecified"
	]).nullable().optional(),
	height_cm: number().min(80).max(250).nullable().optional()
}))).handler(claimRegisterUsername_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const u = normalizeUsername(data.username);
	if (!isValidUsername(u)) throw new Error("Invalid username");
	if ((await sql`
      select user_id from user_profiles
      where lower(username) = ${u} and user_id <> ${context.userId}
      limit 1
    `).length > 0) throw new Error("Username taken");
	const birthDate = data.birth_date ?? null;
	if (birthDate) {
		const d = /* @__PURE__ */ new Date(birthDate + "T12:00:00");
		const age = ((/* @__PURE__ */ new Date()).getTime() - d.getTime()) / 315576e5;
		if (Number.isNaN(d.getTime()) || age < 13 || age > 120) throw new Error("Invalid birth date");
	}
	const sex = data.sex ?? null;
	const heightCm = data.height_cm ?? null;
	await sql`
      insert into user_profiles (
        user_id, username, username_confirmed, birth_date, sex, height_cm
      )
      values (
        ${context.userId}, ${u}, true, ${birthDate}, ${sex}, ${heightCm}
      )
      on conflict (user_id) do update set
        username = ${u},
        username_confirmed = true,
        birth_date = coalesce(${birthDate}, user_profiles.birth_date),
        sex = coalesce(${sex}, user_profiles.sex),
        height_cm = coalesce(${heightCm}, user_profiles.height_cm),
        updated_at = now()
    `;
	return {
		ok: true,
		username: u
	};
});
//#endregion
export { checkUsernameAvailable_createServerFn_handler, claimRegisterUsername_createServerFn_handler, followUser_createServerFn_handler, getMyProfileHub_createServerFn_handler, getUserProfile_createServerFn_handler, listFollowers_createServerFn_handler, listFollowing_createServerFn_handler, searchUsers_createServerFn_handler, unfollowUser_createServerFn_handler, updateMyProfile_createServerFn_handler };
