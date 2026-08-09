import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { v, positiveId } from "@/lib/validation";

/**
 * Relative strength = best weight / latest body_weight.
 * Uses the user's most recent body_weight (not the weight on set day) —
 * cheaper and accurate enough for distribution ranking.
 */

const filtersSchema = z
  .object({
    /** absolute = raw kg; relative = kg / bodyweight */
    measure: z.enum(["relative", "absolute"]).optional(),
    /** bodyweight band in kg [min, max] */
    weightBand: z
      .object({ min: z.number().positive(), max: z.number().positive() })
      .optional(),
    ageMin: z.number().int().min(13).max(100).optional(),
    ageMax: z.number().int().min(13).max(100).optional(),
    sex: z.enum(["female", "male"]).optional(),
  })
  .optional();

export type BenchmarkSlice = {
  exerciseId: number;
  pool: number;
  p10: number | null;
  p50: number | null;
  p90: number | null;
  /** Max value in the pool (absolute kg by default). */
  best: number | null;
  myValue: number | null;
  myPercentile: number | null;
  measure: "relative" | "absolute";
  widened: string | null;
  enough: boolean;
};

export type BenchmarksResult = {
  optedIn: boolean;
  hasBodyWeight: boolean;
  slices: BenchmarkSlice[];
};

function ageFromBirth(iso: string | null): number | null {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 13 && age < 120 ? age : null;
}

/**
 * Batch exercise benchmarks for open accordion cards.
 * One round-trip for all exerciseIds — never N queries per session open.
 */
export const getExerciseBenchmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        exerciseIds: z.array(positiveId).min(1).max(12),
        filters: filtersSchema,
      }),
    ),
  )
  .handler(async ({ context, data }): Promise<BenchmarksResult> => {
    const sql = await getSql();
    const me = context.userId;
    const measure = data.filters?.measure ?? "absolute";
    let weightBand = data.filters?.weightBand;
    let ageMin = data.filters?.ageMin;
    let ageMax = data.filters?.ageMax;
    let sex = data.filters?.sex;

    // Cap demographic filters at 2
    const demoKeys = [
      weightBand ? "weight" : null,
      ageMin != null || ageMax != null ? "age" : null,
      sex ? "sex" : null,
    ].filter(Boolean) as string[];
    if (demoKeys.length > 2) {
      // keep first two by priority: weight > age > sex
      const keep = new Set(demoKeys.slice(0, 2));
      if (!keep.has("weight")) weightBand = undefined;
      if (!keep.has("age")) {
        ageMin = undefined;
        ageMax = undefined;
      }
      if (!keep.has("sex")) sex = undefined;
    }

    const meProfile = await sql<{
      comparison_opt_in: boolean;
      visibility: string;
      sex: string | null;
      birth_date: string | null;
    }>`
      select
        coalesce(comparison_opt_in, true) as comparison_opt_in,
        coalesce(visibility, 'public') as visibility,
        sex,
        birth_date::text as birth_date
      from user_profiles
      where user_id = ${me}
    `;
    const optIn = meProfile[0]?.comparison_opt_in !== false;
    if (!optIn) {
      return { optedIn: false, hasBodyWeight: false, slices: [] };
    }

    // Reciprocity: cannot filter on fields you haven't filled
    const myAge = ageFromBirth(meProfile[0]?.birth_date ?? null);
    if ((ageMin != null || ageMax != null) && myAge == null) {
      ageMin = undefined;
      ageMax = undefined;
    }
    if (sex && !meProfile[0]?.sex) {
      sex = undefined;
    }

    const bwRows = await sql<{ body_weight: number | null }>`
      select body_weight::float8 as body_weight
      from body_measurements
      where user_id = ${me} and body_weight is not null
      order by date desc
      limit 1
    `;
    const myBw = bwRows[0]?.body_weight ?? null;
    const hasBodyWeight = myBw != null && myBw > 0;

    if (measure === "relative" && !hasBodyWeight) {
      // No relative pool without body weight — return absolute empty shells
      return {
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
          measure: "relative" as const,
          widened: null,
          enough: false,
        })),
      };
    }

    if (weightBand && !hasBodyWeight) {
      weightBand = undefined;
    }

    const ids = data.exerciseIds;
    // Best completed set per (user, exercise) in last 90 days
    // Eligible users: comparison_opt_in, not private, followers only if I follow them
    type BestRow = {
      exercise_id: number;
      user_id: string;
      best_weight: number;
      body_weight: number | null;
      value: number;
    };

    const best = await sql<BestRow>`
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
          and we.exercise_id = any(${ids}::int[])
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

    // Apply class filters in JS (small pools; keeps SQL portable on PGLite)
    let widened: string | null = null;
    function applyFilters(rows: BestRow[]): BestRow[] {
      return rows.filter((r) => {
        if (weightBand && r.body_weight != null) {
          if (r.body_weight < weightBand.min || r.body_weight > weightBand.max)
            return false;
        } else if (weightBand && r.body_weight == null) {
          return false;
        }
        // age/sex need profile — re-query map would be needed; skip in first pass if no profile join fields
        return true;
      });
    }

    // Enrich age/sex for filter if needed
    let enriched = best;
    if (ageMin != null || ageMax != null || sex) {
      const userIds = [...new Set(best.map((r) => r.user_id))];
      if (userIds.length > 0) {
        const profs = await sql<{
          user_id: string;
          sex: string | null;
          birth_date: string | null;
        }>`
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

    // k < 5 widen: drop filters step by step
    if (filtered.length < 5 && (weightBand || ageMin != null || sex)) {
      filtered = applyFilters(
        best.filter(() => true), // full best then re-apply nothing
      );
      // actually use raw best without demo filters
      filtered = best.filter((r) => {
        if (measure === "relative" && (r.body_weight == null || r.body_weight <= 0))
          return false;
        return true;
      });
      widened =
        "Not enough data in this class — showing everyone.";
    }

    const byEx = new Map<number, number[]>();
    const myByEx = new Map<number, number>();
    for (const r of filtered) {
      const list = byEx.get(r.exercise_id) ?? [];
      list.push(r.value);
      byEx.set(r.exercise_id, list);
      if (r.user_id === me) myByEx.set(r.exercise_id, r.value);
    }

    function percentile(sorted: number[], p: number): number | null {
      if (sorted.length === 0) return null;
      const idx = (p / 100) * (sorted.length - 1);
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return sorted[lo]!;
      const w = idx - lo;
      return sorted[lo]! * (1 - w) + sorted[hi]! * w;
    }

    function myPercentile(sorted: number[], mine: number): number | null {
      if (sorted.length === 0) return null;
      const below = sorted.filter((v) => v < mine).length;
      return Math.round((below / sorted.length) * 100);
    }

    const slices: BenchmarkSlice[] = data.exerciseIds.map((exerciseId) => {
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
        best: vals.length ? vals[vals.length - 1]! : null,
        myValue: mine,
        myPercentile: enough && mine != null ? myPercentile(vals, mine) : null,
        measure,
        widened: enough ? widened : null,
        enough,
      };
    });

    return { optedIn: true, hasBodyWeight, slices };
  });

/** Program social: how many active clones + followed avatars */
export const getProgramSocial = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.object({ programId: positiveId.optional() }).optional()))
  .handler(async ({ context, data: _data }) => {
    const sql = await getSql();
    const me = context.userId;

    // Active program source for me
    const mine = await sql<{
      id: number;
      source_program_id: number | null;
      valid_from: string;
    }>`
      select id, source_program_id, valid_from::text as valid_from
      from programs
      where user_id = ${me} and is_active = true
      order by id desc
      limit 1
    `;
    if (mine.length === 0) {
      return {
        count: 0,
        following: [] as {
          id: string;
          name: string;
          image: string | null;
          username: string | null;
          week: number;
          streak: number;
          isFollowing: boolean;
          isSelf: boolean;
        }[],
        peers: [] as {
          id: string;
          name: string;
          image: string | null;
          username: string | null;
          week: number;
          streak: number;
          isFollowing: boolean;
          isSelf: boolean;
        }[],
        todayDone: 0,
      };
    }
    const src = mine[0]!.source_program_id ?? mine[0]!.id;
    const mineFrom = mine[0]!.valid_from;

    // Same-source match (include self)
    // Count: everyone on this program lineage I can see, including me
    const cnt = await sql<{ c: number }>`
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

    // Peers: you first, then following, then public others
    const peers = await sql<{
      id: string;
      name: string;
      image: string | null;
      username: string | null;
      valid_from: string;
      is_following: boolean;
      is_self: boolean;
    }>`
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

    const todayDone = await sql<{ c: number }>`
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

    function weekNum(from: string): number {
      const a = new Date(from + "T12:00:00").getTime();
      const n = Date.now();
      return Math.max(1, Math.floor((n - a) / (7 * 86400000)) + 1);
    }

    // Batch streaks for peer list (one query)
    const peerIds = peers.map((f) => f.id);
    const streakMap = new Map<string, number>();
    if (peerIds.length > 0) {
      const days = await sql<{ user_id: string; d: string }>`
        select user_id, date::text as d
        from workouts
        where user_id = any(${peerIds}::text[])
          and status = 'completed'
          and date >= (current_date - interval '60 days')
        order by user_id, d desc
      `;
      const byUser = new Map<string, Set<string>>();
      for (const r of days) {
        const s = byUser.get(r.user_id) ?? new Set();
        s.add(r.d);
        byUser.set(r.user_id, s);
      }
      for (const [uid, set] of byUser) {
        let streak = 0;
        const cur = new Date();
        for (let i = 0; i < 60; i++) {
          const y = cur.getFullYear();
          const m = String(cur.getMonth() + 1).padStart(2, "0");
          const day = String(cur.getDate()).padStart(2, "0");
          const key = `${y}-${m}-${day}`;
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
      isSelf: f.is_self,
    }));

    return {
      count: cnt[0]?.c ?? 0,
      following: peerOut.filter((p) => p.isFollowing && !p.isSelf).slice(0, 12),
      peers: peerOut,
      todayDone: todayDone[0]?.c ?? 0,
    };
  });

export const setComparisonOptIn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({ optIn: z.boolean() })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into user_profiles (user_id, username, comparison_opt_in)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.optIn}
      )
      on conflict (user_id) do update set
        comparison_opt_in = ${data.optIn}
    `;
    return { ok: true as const };
  });
