import { createServerFn } from "@tanstack/react-start";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";
import { v, userIdStr, parseOrThrow, noInput } from "@/lib/validation";
import { z } from "zod";
import { todayForUser, startOfWeekMonday as startOfWeekPg } from "./time";
import {
  isValidUsername,
  normalizeUsername,
  slugFromIdentity,
  USERNAME_MAX,
  USERNAME_MIN,
} from "@/lib/username";

export type PublicUserCard = {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  followers: number;
  following: number;
  is_following: boolean;
  follows_you: boolean;
  is_self: boolean;
  public_programs: number;
};

export type HeatDay = { date: string; count: number };

export type ProfileHub = {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  image: string | null;
  email: string | null;
  visibility: "public" | "followers" | "private";
  unit_system: "metric" | "imperial";
  measures_public: boolean;
  username_confirmed: boolean;
  /** Full hub hidden by privacy */
  restricted: boolean;
  followers: number;
  following: number;
  is_self: boolean;
  is_following: boolean;
  follows_you: boolean;
  streak: number;
  total_sessions: number;
  total_volume: number;
  week_volume: number;
  week_sessions: number;
  active_program: string | null;
  heatmap: HeatDay[];
  measurement: {
    date: string;
    body_weight: number | null;
    waist: number | null;
    chest: number | null;
    arm: number | null;
    thigh: number | null;
  } | null;
  recent: {
    id: number;
    date: string;
    day_name: string;
    status: string;
    tonnage: number;
  }[];
  programs: {
    id: number;
    name: string;
    description: string | null;
    share_code: string | null;
    day_count: number;
    clone_count: number;
  }[];
  records: { name: string; weight: number; date: string }[];
};

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

async function allocateUsername(
  sql: Sql,
  base: string,
  excludeUserId?: string,
): Promise<string> {
  let candidate = base.slice(0, USERNAME_MAX);
  if (candidate.length < USERNAME_MIN) candidate = "sporcu";
  if (!isValidUsername(candidate)) {
    candidate = "sporcu";
  }
  for (let i = 0; i < 50; i++) {
    const tryName =
      i === 0
        ? candidate
        : `${candidate.slice(0, USERNAME_MAX - String(i).length - 1)}_${i}`;
    const rows = await sql<{ user_id: string }>`
      select user_id from user_profiles
      where lower(username) = ${tryName}
      limit 1
    `;
    if (rows.length === 0) return tryName;
    if (excludeUserId && rows[0]!.user_id === excludeUserId) return tryName;
  }
  return `u_${Date.now().toString(36).slice(-8)}`;
}

/** Ensure a user_profiles row exists (auto username). Idempotent. */
export async function ensureUserProfile(
  sql: Sql,
  userId: string,
): Promise<void> {
  const existing = await sql<{ user_id: string }>`
    select user_id from user_profiles where user_id = ${userId} limit 1
  `;
  if (existing.length > 0) return;

  const users = await sql<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  if (users.length === 0) return;
  const base = slugFromIdentity(users[0]!.name, users[0]!.email);
  const username = await allocateUsername(sql, base, userId);
  await sql`
    insert into user_profiles (user_id, username, username_confirmed)
    values (${userId}, ${username}, false)
    on conflict (user_id) do nothing
  `;
}

function looksLikeUserId(key: string): boolean {
  // Better Auth / seeded ids: long, dashed, or non-username charset
  if (key.length > 24) return true;
  if (key.includes("-")) return true;
  if (!/^[a-z0-9_]+$/i.test(key)) return true;
  return false;
}

async function resolveUserId(
  sql: Sql,
  usernameOrId: string,
): Promise<string | null> {
  const key = usernameOrId.trim();
  if (!key) return null;

  // Prefer raw user id when the path looks like an id (legacy /u/$userId links)
  if (looksLikeUserId(key)) {
    const byId = await sql<{ id: string }>`
      select id from "user" where id = ${key} limit 1
    `;
    if (byId[0]) return byId[0].id;
  }

  // Username (case-insensitive)
  const byName = await sql<{ user_id: string }>`
    select user_id from user_profiles
    where lower(username) = ${key.toLowerCase()}
    limit 1
  `;
  if (byName[0]) return byName[0].user_id;

  // Fallback id for short ids that still exist
  const byId = await sql<{ id: string }>`
    select id from "user" where id = ${key} limit 1
  `;
  return byId[0]?.id ?? null;
}

async function loadProfileHub(
  sql: Sql,
  viewerId: string,
  userId: string,
): Promise<ProfileHub> {
  await ensureUserProfile(sql, userId);

  const users = await sql<{
    id: string;
    name: string;
    image: string | null;
    email: string;
  }>`
    select id, name, image, email from "user" where id = ${userId}
  `;
  if (users.length === 0) throw new Error("Kullanıcı bulunamadı.");
  const u = users[0]!;
  const isSelf = viewerId === userId;

  const prof = await sql<{
    username: string;
    bio: string | null;
    avatar_url: string | null;
    visibility: string;
    unit_system: string;
    measures_public: boolean;
    username_confirmed: boolean;
  }>`
    select username, bio, avatar_url, visibility, unit_system,
           measures_public, username_confirmed
    from user_profiles where user_id = ${userId}
  `;
  const p = prof[0]!;

  const stats = await sql<{ followers: number; following: number }>`
    select
      (select count(*)::int from user_follows where following_id = ${userId}) as followers,
      (select count(*)::int from user_follows where follower_id = ${userId}) as following
  `;

  const isFollowing =
    !isSelf &&
    (
      await sql<{ e: boolean }>`
        select exists(
          select 1 from user_follows
          where follower_id = ${viewerId} and following_id = ${userId}
        ) as e
      `
    )[0]?.e === true;

  const followsYou =
    !isSelf &&
    (
      await sql<{ e: boolean }>`
        select exists(
          select 1 from user_follows
          where follower_id = ${userId} and following_id = ${viewerId}
        ) as e
      `
    )[0]?.e === true;

  const visibility = (p.visibility as ProfileHub["visibility"]) || "public";
  let canView = isSelf;
  if (!canView) {
    if (visibility === "public") canView = true;
    else if (visibility === "followers") canView = isFollowing;
    else canView = false;
  }

  const image = p.avatar_url || u.image;
  const baseRestricted: ProfileHub = {
    id: u.id,
    name: u.name,
    username: p.username,
    bio: canView ? p.bio : null,
    image,
    email: isSelf ? u.email : null,
    visibility,
    unit_system: (p.unit_system as ProfileHub["unit_system"]) || "metric",
    measures_public: p.measures_public,
    username_confirmed: p.username_confirmed === true,
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
    records: [],
  };

  if (!canView) return baseRestricted;

  const todayIso = await todayForUser(sql, viewerId);
  const weekStart = await startOfWeekPg(sql, todayIso);
  const weekEnd = addDays(weekStart, 6);
  const heatStart = addDays(todayIso, -180);

  const totals = await sql<{
    total_sessions: number;
    total_volume: string;
    week_sessions: number;
    week_volume: string;
  }>`
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

  const completedByDate = await sql<{ date: string }>`
    select date::text as date from workouts
    where user_id = ${userId}
      and status = 'completed'
      and date >= ${addDays(weekStart, -7 * 52)}::date
  `;
  const weekSessions = totals[0]?.week_sessions ?? 0;
  let streak = 0;
  const startI = weekSessions >= 4 ? 0 : 1;
  for (let i = startI; i < 52; i++) {
    const ws = addDays(weekStart, -7 * i);
    const we = addDays(ws, 6);
    const n = completedByDate.filter((r) => r.date >= ws && r.date <= we).length;
    if (n >= 4) streak += 1;
    else break;
  }

  const heatRows = await sql<{ date: string; c: number }>`
    select date::text as date, count(*)::int as c
    from workouts
    where user_id = ${userId}
      and status = 'completed'
      and date >= ${heatStart}::date
    group by date
  `;
  const heatmap = heatRows.map((r) => ({ date: r.date, count: r.c }));

  const prog = await sql<{ name: string }>`
    select name from programs
    where user_id = ${userId} and is_active = true
    order by id desc limit 1
  `;

  const showMeasures = isSelf || p.measures_public;
  let measurement: ProfileHub["measurement"] = null;
  if (showMeasures) {
    const measure = await sql<{
      date: string;
      body_weight: string | null;
      waist: string | null;
      chest: string | null;
      arm: string | null;
      thigh: string | null;
    }>`
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
    const m = measure[0];
    if (m) {
      measurement = {
        date: m.date,
        body_weight: m.body_weight != null ? Number(m.body_weight) : null,
        waist: m.waist != null ? Number(m.waist) : null,
        chest: m.chest != null ? Number(m.chest) : null,
        arm: m.arm != null ? Number(m.arm) : null,
        thigh: m.thigh != null ? Number(m.thigh) : null,
      };
    }
  }

  const recent = await sql<{
    id: number;
    date: string;
    day_name: string;
    status: string;
    tonnage: string;
  }>`
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

  const programs = await sql<{
    id: number;
    name: string;
    description: string | null;
    share_code: string | null;
    day_count: number;
    clone_count: number;
  }>`
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

  const records = await sql<{ name: string; weight: string; date: string }>`
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

  return {
    ...baseRestricted,
    restricted: false,
    bio: p.bio,
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
      tonnage: Math.round(Number(r.tonnage)),
    })),
    programs,
    records: records.map((r) => ({
      name: r.name,
      weight: Number(r.weight),
      date: r.date,
    })),
  };
}

/** Own profile hub (stats, measures, activity). */
export const getMyProfileHub = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureUserProfile(sql, context.userId);
    return loadProfileHub(sql, context.userId, context.userId);
  });

export const searchUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.string().trim().max(80)))
  .handler(async ({ context, data: q }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const term = q.trim();
    if (term.length < 1) return [] as PublicUserCard[];
    const like = `%${term}%`;

    const rows = await sql<{
      id: string;
      name: string;
      username: string | null;
      image: string | null;
      avatar_url: string | null;
      followers: number;
      following: number;
      is_following: boolean;
      follows_you: boolean;
      public_programs: number;
    }>`
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
    `;

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      username: r.username,
      image: r.avatar_url || r.image,
      followers: r.followers,
      following: r.following,
      is_following: r.is_following,
      follows_you: r.follows_you,
      is_self: false,
      public_programs: r.public_programs,
    }));
  });

export const listFollowing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return sql<{
      id: string;
      name: string;
      username: string | null;
      image: string | null;
      followers: number;
    }>`
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

export const listFollowers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      name: string;
      username: string | null;
      image: string | null;
      is_following: boolean;
    }>`
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

/** Resolve profile by username or raw user id. */
export const getUserProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.string().trim().min(1).max(128)))
  .handler(async ({ context, data: key }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const userId = await resolveUserId(sql, key);
    if (!userId) throw new Error("Kullanıcı bulunamadı.");
    // Redirect hint: if looked up by id and has username, client can rewrite URL
    return loadProfileHub(sql, context.userId, userId);
  });

const profileUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(USERNAME_MIN)
    .max(USERNAME_MAX)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
  bio: z.string().trim().max(160).nullable().optional(),
  avatar_url: z
    .string()
    .max(400_000)
    .nullable()
    .optional(),
  visibility: z.enum(["public", "followers", "private"]).optional(),
  unit_system: z.enum(["metric", "imperial"]).optional(),
  measures_public: z.boolean().optional(),
  confirm_username: z.boolean().optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(profileUpdateSchema))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureUserProfile(sql, context.userId);

    if (data.username != null) {
      const u = normalizeUsername(data.username);
      if (!isValidUsername(u)) {
        throw new Error("Geçersiz kullanıcı adı.");
      }
      const taken = await sql<{ user_id: string }>`
        select user_id from user_profiles
        where lower(username) = ${u} and user_id <> ${context.userId}
        limit 1
      `;
      if (taken.length > 0) throw new Error("Bu kullanıcı adı alınmış.");
      await sql`
        update user_profiles set
          username = ${u},
          username_confirmed = true,
          updated_at = now()
        where user_id = ${context.userId}
      `;
    } else if (data.confirm_username) {
      await sql`
        update user_profiles set
          username_confirmed = true,
          updated_at = now()
        where user_id = ${context.userId}
      `;
    }

    if (data.bio !== undefined) {
      const bio = data.bio?.trim() || null;
      await sql`
        update user_profiles set bio = ${bio}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }

    if (data.avatar_url !== undefined) {
      const av = data.avatar_url;
      if (av && !av.startsWith("data:image/") && !av.startsWith("http")) {
        throw new Error("Geçersiz avatar.");
      }
      if (av && av.length > 350_000) {
        throw new Error("Avatar çok büyük (max ~250KB).");
      }
      await sql`
        update user_profiles set avatar_url = ${av}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }

    if (data.visibility) {
      await sql`
        update user_profiles set visibility = ${data.visibility}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    if (data.unit_system) {
      await sql`
        update user_profiles set unit_system = ${data.unit_system}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    if (data.measures_public != null) {
      await sql`
        update user_profiles set measures_public = ${data.measures_public}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }

    return loadProfileHub(sql, context.userId, context.userId);
  });

export const followUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(userIdStr))
  .handler(async ({ context, data: userId }) => {
    if (userId === context.userId) throw new Error("Kendini takip edemezsin.");
    const sql = await getSql();
    const exists = await sql`select id from "user" where id = ${userId}`;
    if (exists.length === 0) throw new Error("Kullanıcı yok.");
    await sql`
      insert into user_follows (follower_id, following_id)
      values (${context.userId}, ${userId})
      on conflict do nothing
    `;
    return { ok: true };
  });

export const unfollowUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(userIdStr))
  .handler(async ({ context, data: userId }) => {
    const sql = await getSql();
    await sql`
      delete from user_follows
      where follower_id = ${context.userId} and following_id = ${userId}
    `;
    return { ok: true };
  });
