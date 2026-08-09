import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/benchmarks-D2zJ2_O4.js
/**
* Relative strength = best weight / latest body_weight.
* Uses the user's most recent body_weight (not the weight on set day) —
* cheaper and accurate enough for distribution ranking.
*/
var filtersSchema = object({
	/** absolute = raw kg; relative = kg / bodyweight */
	measure: _enum(["relative", "absolute"]).optional(),
	/** bodyweight band in kg [min, max] */
	weightBand: object({
		min: number().positive(),
		max: number().positive()
	}).optional(),
	ageMin: number().int().min(13).max(100).optional(),
	ageMax: number().int().min(13).max(100).optional(),
	sex: _enum(["female", "male"]).optional()
}).optional();
function ageFromBirth(iso) {
	if (!iso) return null;
	const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
	if (Number.isNaN(d.getTime())) return null;
	const now = /* @__PURE__ */ new Date();
	let age = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || m === 0 && now.getDate() < d.getDate()) age -= 1;
	return age >= 13 && age < 120 ? age : null;
}
/**
* Batch exercise benchmarks for open accordion cards.
* One round-trip for all exerciseIds — never N queries per session open.
*/
var getExerciseBenchmarks_createServerFn_handler = createServerRpc({
	id: "d88f3f34ec37da22acf5ae69ab1a7eca9b4fedf6d5233a78645344d12f473a35",
	name: "getExerciseBenchmarks",
	filename: "src/lib/server/benchmarks.ts"
}, (opts) => getExerciseBenchmarks.__executeServer(opts));
var getExerciseBenchmarks = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	exerciseIds: array(positiveId).min(1).max(12),
	filters: filtersSchema
}))).handler(getExerciseBenchmarks_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const me = context.userId;
	const measure = data.filters?.measure ?? "absolute";
	let weightBand = data.filters?.weightBand;
	let ageMin = data.filters?.ageMin;
	let ageMax = data.filters?.ageMax;
	let sex = data.filters?.sex;
	const demoKeys = [
		weightBand ? "weight" : null,
		ageMin != null || ageMax != null ? "age" : null,
		sex ? "sex" : null
	].filter(Boolean);
	if (demoKeys.length > 2) {
		const keep = new Set(demoKeys.slice(0, 2));
		if (!keep.has("weight")) weightBand = void 0;
		if (!keep.has("age")) {
			ageMin = void 0;
			ageMax = void 0;
		}
		if (!keep.has("sex")) sex = void 0;
	}
	const meProfile = await sql`
      select
        coalesce(comparison_opt_in, true) as comparison_opt_in,
        coalesce(visibility, 'public') as visibility,
        sex,
        birth_date::text as birth_date
      from user_profiles
      where user_id = ${me}
    `;
	if (!(meProfile[0]?.comparison_opt_in !== false)) return {
		optedIn: false,
		hasBodyWeight: false,
		slices: []
	};
	const myAge = ageFromBirth(meProfile[0]?.birth_date ?? null);
	if ((ageMin != null || ageMax != null) && myAge == null) {
		ageMin = void 0;
		ageMax = void 0;
	}
	if (sex && !meProfile[0]?.sex) sex = void 0;
	const myBw = (await sql`
      select body_weight::float8 as body_weight
      from body_measurements
      where user_id = ${me} and body_weight is not null
      order by date desc
      limit 1
    `)[0]?.body_weight ?? null;
	const hasBodyWeight = myBw != null && myBw > 0;
	if (measure === "relative" && !hasBodyWeight) return {
		optedIn: true,
		hasBodyWeight: false,
		slices: data.exerciseIds.map((exerciseId) => ({
			exerciseId,
			pool: 0,
			p10: null,
			p50: null,
			p90: null,
			best: null,
			myValue: null,
			myPercentile: null,
			measure: "relative",
			widened: null,
			enough: false
		}))
	};
	if (weightBand && !hasBodyWeight) weightBand = void 0;
	const best = await sql`
      with eligible as (
        select
          u.id as user_id,
          up.visibility,
          up.sex,
          up.birth_date,
          coalesce(up.comparison_opt_in, true) as comparison_opt_in,
          (
            select bm.body_weight::float8
            from body_measurements bm
            where bm.user_id = u.id and bm.body_weight is not null
            order by bm.date desc
            limit 1
          ) as body_weight
        from "user" u
        left join user_profiles up on up.user_id = u.id
        where coalesce(up.comparison_opt_in, true) = true
          and coalesce(up.visibility, 'public') <> 'private'
          and (
            coalesce(up.visibility, 'public') = 'public'
            or u.id = ${me}
            or exists (
              select 1 from user_follows f
              where f.follower_id = ${me} and f.following_id = u.id
            )
          )
      ),
      best_sets as (
        select
          we.exercise_id,
          w.user_id,
          max(ws.weight::float8) as best_weight
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        join workouts w on w.id = we.workout_id
        where ws.completed = true
          and ws.weight is not null
          and w.status = 'completed'
          and w.date >= (current_date - interval '90 days')
          and we.exercise_id = any(${data.exerciseIds}::int[])
        group by we.exercise_id, w.user_id
      )
      select
        b.exercise_id,
        b.user_id,
        b.best_weight,
        e.body_weight,
        case
          when ${measure} = 'relative' and e.body_weight is not null and e.body_weight > 0
            then b.best_weight / e.body_weight
          else b.best_weight
        end as value
      from best_sets b
      join eligible e on e.user_id = b.user_id
      where (
        ${measure} <> 'relative'
        or (e.body_weight is not null and e.body_weight > 0)
      )
    `;
	let widened = null;
	function applyFilters(rows) {
		return rows.filter((r) => {
			if (weightBand && r.body_weight != null) {
				if (r.body_weight < weightBand.min || r.body_weight > weightBand.max) return false;
			} else if (weightBand && r.body_weight == null) return false;
			return true;
		});
	}
	let enriched = best;
	if (ageMin != null || ageMax != null || sex) {
		const userIds = [...new Set(best.map((r) => r.user_id))];
		if (userIds.length > 0) {
			const profs = await sql`
          select user_id, sex, birth_date::text as birth_date
          from user_profiles
          where user_id = any(${userIds}::text[])
        `;
			const map = new Map(profs.map((p) => [p.user_id, p]));
			enriched = best.filter((r) => {
				const p = map.get(r.user_id);
				if (sex) {
					if (!p?.sex || p.sex !== sex) return false;
				}
				if (ageMin != null || ageMax != null) {
					const a = ageFromBirth(p?.birth_date ?? null);
					if (a == null) return false;
					if (ageMin != null && a < ageMin) return false;
					if (ageMax != null && a > ageMax) return false;
				}
				return true;
			});
		}
	}
	let filtered = applyFilters(enriched);
	if (filtered.length < 5 && (weightBand || ageMin != null || sex)) {
		filtered = applyFilters(best.filter(() => true));
		filtered = best.filter((r) => {
			if (measure === "relative" && (r.body_weight == null || r.body_weight <= 0)) return false;
			return true;
		});
		widened = "Not enough data in this class — showing everyone.";
	}
	const byEx = /* @__PURE__ */ new Map();
	const myByEx = /* @__PURE__ */ new Map();
	for (const r of filtered) {
		const list = byEx.get(r.exercise_id) ?? [];
		list.push(r.value);
		byEx.set(r.exercise_id, list);
		if (r.user_id === me) myByEx.set(r.exercise_id, r.value);
	}
	function percentile(sorted, p) {
		if (sorted.length === 0) return null;
		const idx = p / 100 * (sorted.length - 1);
		const lo = Math.floor(idx);
		const hi = Math.ceil(idx);
		if (lo === hi) return sorted[lo];
		const w = idx - lo;
		return sorted[lo] * (1 - w) + sorted[hi] * w;
	}
	function myPercentile(sorted, mine) {
		if (sorted.length === 0) return null;
		const below = sorted.filter((v) => v < mine).length;
		return Math.round(below / sorted.length * 100);
	}
	return {
		optedIn: true,
		hasBodyWeight,
		slices: data.exerciseIds.map((exerciseId) => {
			const vals = (byEx.get(exerciseId) ?? []).slice().sort((a, b) => a - b);
			const pool = vals.length;
			const enough = pool >= 5;
			const mine = myByEx.get(exerciseId) ?? null;
			return {
				exerciseId,
				pool,
				p10: enough ? percentile(vals, 10) : null,
				p50: enough ? percentile(vals, 50) : null,
				p90: enough ? percentile(vals, 90) : null,
				best: vals.length ? vals[vals.length - 1] : null,
				myValue: mine,
				myPercentile: enough && mine != null ? myPercentile(vals, mine) : null,
				measure,
				widened: enough ? widened : null,
				enough
			};
		})
	};
});
var getProgramSocial_createServerFn_handler = createServerRpc({
	id: "42dc490839f431eba28612c277c6792c477e7c155835b00552bd9d13c0c32a6f",
	name: "getProgramSocial",
	filename: "src/lib/server/benchmarks.ts"
}, (opts) => getProgramSocial.__executeServer(opts));
var getProgramSocial = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ programId: positiveId.optional() }).optional())).handler(getProgramSocial_createServerFn_handler, async ({ context, data: _data }) => {
	const sql = await getSql();
	const me = context.userId;
	const mine = await sql`
      select id, source_program_id, valid_from::text as valid_from
      from programs
      where user_id = ${me} and is_active = true
      order by id desc
      limit 1
    `;
	if (mine.length === 0) return {
		count: 0,
		following: [],
		peers: [],
		todayDone: 0
	};
	const src = mine[0].source_program_id ?? mine[0].id;
	const mineFrom = mine[0].valid_from;
	const cnt = await sql`
      select count(*)::int as c
      from programs p
      left join user_profiles up on up.user_id = p.user_id
      where p.is_active = true
        and (
          p.source_program_id = ${src}
          or p.id = ${src}
          or p.source_program_id = (select source_program_id from programs where id = ${src})
        )
        and (
          p.user_id = ${me}
          or (
            coalesce(up.visibility, 'public') <> 'private'
            and (
              coalesce(up.visibility, 'public') = 'public'
              or exists (
                select 1 from user_follows f
                where f.follower_id = ${me} and f.following_id = p.user_id
              )
            )
          )
        )
    `;
	const peers = await sql`
      select
        u.id,
        coalesce(u.name, 'User') as name,
        coalesce(up.avatar_url, u.image) as image,
        up.username,
        p.valid_from::text as valid_from,
        exists (
          select 1 from user_follows f
          where f.follower_id = ${me} and f.following_id = u.id
        ) as is_following,
        (u.id = ${me}) as is_self
      from programs p
      join "user" u on u.id = p.user_id
      left join user_profiles up on up.user_id = u.id
      where p.is_active = true
        and (
          p.source_program_id = ${src}
          or p.id = ${src}
          or p.source_program_id = (select source_program_id from programs where id = ${src})
        )
        and (
          p.user_id = ${me}
          or (
            coalesce(up.visibility, 'public') <> 'private'
            and (
              coalesce(up.visibility, 'public') = 'public'
              or exists (
                select 1 from user_follows f
                where f.follower_id = ${me} and f.following_id = p.user_id
              )
            )
          )
        )
      order by
        (u.id = ${me}) desc,
        exists (
          select 1 from user_follows f
          where f.follower_id = ${me} and f.following_id = u.id
        ) desc,
        p.valid_from asc
      limit 40
    `;
	const todayDone = await sql`
      select count(distinct w.user_id)::int as c
      from workouts w
      join programs p on p.user_id = w.user_id and p.is_active = true
      where w.date = current_date
        and w.status = 'completed'
        and w.user_id <> ${me}
        and (
          p.source_program_id = ${src}
          or p.id = ${src}
        )
    `;
	function weekNum(from) {
		const a = (/* @__PURE__ */ new Date(from + "T12:00:00")).getTime();
		return Math.max(1, Math.floor((Date.now() - a) / 6048e5) + 1);
	}
	const peerIds = peers.map((f) => f.id);
	const streakMap = /* @__PURE__ */ new Map();
	if (peerIds.length > 0) {
		const days = await sql`
        select user_id, date::text as d
        from workouts
        where user_id = any(${peerIds}::text[])
          and status = 'completed'
          and date >= (current_date - interval '60 days')
        order by user_id, d desc
      `;
		const byUser = /* @__PURE__ */ new Map();
		for (const r of days) {
			const s = byUser.get(r.user_id) ?? /* @__PURE__ */ new Set();
			s.add(r.d);
			byUser.set(r.user_id, s);
		}
		for (const [uid, set] of byUser) {
			let streak = 0;
			const cur = /* @__PURE__ */ new Date();
			for (let i = 0; i < 60; i++) {
				const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
				if (set.has(key)) {
					streak += 1;
					cur.setDate(cur.getDate() - 1);
					continue;
				}
				if (i === 0) {
					cur.setDate(cur.getDate() - 1);
					continue;
				}
				break;
			}
			streakMap.set(uid, streak);
		}
	}
	const peerOut = peers.map((f) => ({
		id: f.id,
		name: f.name,
		image: f.image,
		username: f.username,
		week: weekNum(f.is_self ? mineFrom : f.valid_from),
		streak: streakMap.get(f.id) ?? 0,
		isFollowing: f.is_following,
		isSelf: f.is_self
	}));
	return {
		count: cnt[0]?.c ?? 0,
		following: peerOut.filter((p) => p.isFollowing && !p.isSelf).slice(0, 12),
		peers: peerOut,
		todayDone: todayDone[0]?.c ?? 0
	};
});
var getComparisonOptIn_createServerFn_handler = createServerRpc({
	id: "ef9788b6584c3426dac92d4f12c7a406c06453dcced42f251812435e76d3d53a",
	name: "getComparisonOptIn",
	filename: "src/lib/server/benchmarks.ts"
}, (opts) => getComparisonOptIn.__executeServer(opts));
var getComparisonOptIn = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getComparisonOptIn_createServerFn_handler, async ({ context }) => {
	return { optIn: (await (await getSql())`
      select coalesce(comparison_opt_in, true) as comparison_opt_in
      from user_profiles
      where user_id = ${context.userId}
    `)[0]?.comparison_opt_in !== false };
});
var setComparisonOptIn_createServerFn_handler = createServerRpc({
	id: "f82ef311a6c6c8a59ccfb58d73809efcc733af3dfac6b6bb1e3d73e66f5247c9",
	name: "setComparisonOptIn",
	filename: "src/lib/server/benchmarks.ts"
}, (opts) => setComparisonOptIn.__executeServer(opts));
var setComparisonOptIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({ optIn: boolean() }))).handler(setComparisonOptIn_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into user_profiles (user_id, username, comparison_opt_in)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.optIn}
      )
      on conflict (user_id) do update set
        comparison_opt_in = ${data.optIn}
    `;
	return { ok: true };
});
//#endregion
export { getComparisonOptIn_createServerFn_handler, getExerciseBenchmarks_createServerFn_handler, getProgramSocial_createServerFn_handler, setComparisonOptIn_createServerFn_handler };
