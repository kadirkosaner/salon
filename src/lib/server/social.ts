import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";

export type PublicUserCard = {
  id: string;
  name: string;
  image: string | null;
  followers: number;
  following: number;
  is_following: boolean;
  is_self: boolean;
  public_programs: number;
};

export type ProfileHub = {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
  followers: number;
  following: number;
  is_self: boolean;
  is_following: boolean;
  streak: number;
  total_sessions: number;
  total_volume: number;
  week_volume: number;
  week_sessions: number;
  active_program: string | null;
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
};

function startOfWeekMonday(d = new Date()): string {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

async function loadProfileHub(
  sql: Awaited<ReturnType<typeof getSql>>,
  viewerId: string,
  userId: string,
): Promise<ProfileHub> {
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

  const weekStart = startOfWeekMonday();
  const weekEnd = addDays(weekStart, 6);

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

  const prog = await sql<{ name: string }>`
    select name from programs
    where user_id = ${userId} and is_active = true
    order by id desc limit 1
  `;

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
    measurement: m
      ? {
          date: m.date,
          body_weight: m.body_weight != null ? Number(m.body_weight) : null,
          waist: m.waist != null ? Number(m.waist) : null,
          chest: m.chest != null ? Number(m.chest) : null,
          arm: m.arm != null ? Number(m.arm) : null,
          thigh: m.thigh != null ? Number(m.thigh) : null,
        }
      : null,
    recent: recent.map((r) => ({
      id: r.id,
      date: r.date,
      day_name: r.day_name,
      status: r.status,
      tonnage: Math.round(Number(r.tonnage)),
    })),
    programs,
  };
}

/** Own profile hub (stats, measures, activity). */
export const getMyProfileHub = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return loadProfileHub(sql, context.userId, context.userId);
  });

export const searchUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((q: string) => q)
  .handler(async ({ context, data: q }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const term = q.trim();
    if (term.length < 1) return [] as PublicUserCard[];

    const rows = await sql<{
      id: string;
      name: string;
      image: string | null;
      followers: number;
      following: number;
      is_following: boolean;
      public_programs: number;
    }>`
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
    `;

    return rows.map((r) => ({
      ...r,
      is_self: false,
    }));
  });

export const listFollowing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return sql<{
      id: string;
      name: string;
      image: string | null;
      followers: number;
    }>`
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

export const listFollowers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      name: string;
      image: string | null;
      is_following: boolean;
    }>`
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

export const getUserProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return loadProfileHub(sql, context.userId, userId);
  });

export const followUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((userId: string) => userId)
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
  .validator((userId: string) => userId)
  .handler(async ({ context, data: userId }) => {
    const sql = await getSql();
    await sql`
      delete from user_follows
      where follower_id = ${context.userId} and following_id = ${userId}
    `;
    return { ok: true };
  });
