import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded, searchDataset } from "./seed";
import { ensureCatalogSeeded } from "./catalog";
import { ensureUserProfile, type PublicUserCard } from "./social";
import type { PublicProgramCard } from "./share";
import { v, noInput } from "@/lib/validation";
import { z } from "zod";

export type DiscoverShelves = {
  featured: PublicProgramCard[];
  topCloned: PublicProgramCard[];
  fromFollowing: PublicProgramCard[];
  forLevel: PublicProgramCard[];
  levelHint: "baslangic" | "orta" | "ileri";
};

function mapProgram(
  r: {
    id: number;
    name: string;
    description: string | null;
    tags: string | null;
    share_code: string | null;
    clone_count: number;
    user_id: string;
    author_name: string | null;
    day_count: number;
    exercise_count: number;
  },
  userId: string,
): PublicProgramCard {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    tags: r.tags,
    share_code: r.share_code,
    clone_count: r.clone_count,
    day_count: r.day_count,
    exercise_count: r.exercise_count,
    author_name: r.author_name ?? "Sporcu",
    is_catalog: r.user_id === "system",
    is_own: r.user_id === userId,
  };
}

async function loadPublicPrograms(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
) {
  const rows = await sql<{
    id: number;
    name: string;
    description: string | null;
    tags: string | null;
    share_code: string | null;
    clone_count: number;
    user_id: string;
    author_name: string | null;
    day_count: number;
    exercise_count: number;
  }>`
    select
      p.id, p.name, p.description, p.tags, p.share_code,
      coalesce(p.clone_count, 0)::int as clone_count,
      p.user_id,
      coalesce(u.name, case when p.user_id = 'system' then 'Salon' else 'Sporcu' end) as author_name,
      (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
      (
        select count(*)::int from program_exercises pe
        join program_days pd on pd.id = pe.program_day_id
        where pd.program_id = p.id
      ) as exercise_count
    from programs p
    left join "user" u on u.id = p.user_id
    where p.is_public = true
    order by p.clone_count desc, p.id desc
    limit 80
  `;
  return rows.map((r) => mapProgram(r, userId));
}

export const getDiscoverHome = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }): Promise<DiscoverShelves> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureCatalogSeeded(sql);
    await ensureUserProfile(sql, context.userId);

    const all = await loadPublicPrograms(sql, context.userId);

    const stats = await sql<{ c: number }>`
      select count(*)::int as c from workouts
      where user_id = ${context.userId} and status = 'completed'
    `;
    const completed = stats[0]?.c ?? 0;
    const levelHint: DiscoverShelves["levelHint"] =
      completed < 8 ? "baslangic" : completed < 40 ? "orta" : "ileri";

    const featured = [...all]
      .sort((a, b) => {
        if (a.is_catalog !== b.is_catalog) return a.is_catalog ? -1 : 1;
        const order = (c: string | null) =>
          c === "FULL6X" ? 0 : c === "FULL3X" ? 1 : c === "UL4DAY" ? 2 : 9;
        return order(a.share_code) - order(b.share_code);
      })
      .slice(0, 10);

    const topCloned = [...all]
      .sort((a, b) => b.clone_count - a.clone_count)
      .slice(0, 12);

    const followRows = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      share_code: string | null;
      clone_count: number;
      user_id: string;
      author_name: string | null;
      day_count: number;
      exercise_count: number;
    }>`
      select
        p.id, p.name, p.description, p.tags, p.share_code,
        coalesce(p.clone_count, 0)::int as clone_count,
        p.user_id,
        coalesce(u.name, 'Sporcu') as author_name,
        (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
        (
          select count(*)::int from program_exercises pe
          join program_days pd on pd.id = pe.program_day_id
          where pd.program_id = p.id
        ) as exercise_count
      from programs p
      join user_follows f on f.following_id = p.user_id
      left join "user" u on u.id = p.user_id
      where f.follower_id = ${context.userId}
        and p.is_public = true
        and p.user_id <> ${context.userId}
      order by p.clone_count desc, p.id desc
      limit 20
    `;
    const fromFollowing = followRows.map((r) => mapProgram(r, context.userId));

    const forLevel = all
      .filter((p) => {
        const tags = (p.tags ?? "").toLowerCase();
        if (levelHint === "baslangic")
          return tags.includes("baslangic") || tags.includes("beginner");
        if (levelHint === "orta")
          return tags.includes("orta") || tags.includes("intermediate");
        return tags.includes("ileri") || tags.includes("advanced");
      })
      .slice(0, 12);

    const levelFilled =
      forLevel.length > 0
        ? forLevel
        : all.filter((p) => p.is_catalog).slice(0, 6);

    return {
      featured,
      topCloned,
      fromFollowing,
      forLevel: levelFilled,
      levelHint,
    };
  });

export type UnifiedSearchResult = {
  people: PublicUserCard[];
  programs: PublicProgramCard[];
  exercises: Array<{
    name: string;
    muscle_group: string;
    detail: string | null;
    source: "local" | "dataset";
    id?: number;
  }>;
};

export const unifiedSearch = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.object({ q: z.string().trim().min(1).max(80) })))
  .handler(async ({ context, data }): Promise<UnifiedSearchResult> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureCatalogSeeded(sql);
    await ensureUserProfile(sql, context.userId);

    const term = data.q.trim();
    const like = `%${term}%`;

    const peopleRows = await sql<{
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
        u.id, u.name, up.username, u.image, up.avatar_url,
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
        and coalesce(up.visibility, 'public') <> 'private'
      order by
        case when lower(coalesce(up.username,'')) = lower(${term}) then 0
             when lower(u.name) = lower(${term}) then 1
             else 2 end,
        u.name
      limit 12
    `;

    const people: PublicUserCard[] = peopleRows.map((r) => ({
      id: r.id,
      name: r.name,
      username: r.username,
      image: r.avatar_url || r.image,
      followers: r.followers,
      following: r.following,
      is_following: r.is_following === true,
      follows_you: r.follows_you === true,
      is_self: false,
      public_programs: r.public_programs,
    }));

    const progRows = await loadPublicPrograms(sql, context.userId);
    const qLower = term.toLowerCase();
    const programs = progRows
      .filter((p) => {
        const hay =
          `${p.name} ${p.description ?? ""} ${p.tags ?? ""} ${p.author_name}`.toLowerCase();
        return hay.includes(qLower);
      })
      .slice(0, 12);

    const localEx = await sql<{
      id: number;
      name: string;
      muscle_group: string;
      detail: string | null;
    }>`
      select id, name, muscle_group, detail
      from exercises
      where (owner_id is null or owner_id = ${context.userId})
        and lower(name) like ${"%" + qLower + "%"}
      order by name
      limit 10
    `;

    const localNames = new Set(localEx.map((e) => e.name.toLowerCase()));
    const dataset = searchDataset(term, 12)
      .filter((e) => !localNames.has(e.name.toLowerCase()))
      .slice(0, 8);

    const exercises = [
      ...localEx.map((e) => ({
        name: e.name,
        muscle_group: e.muscle_group,
        detail: e.detail,
        source: "local" as const,
        id: e.id,
      })),
      ...dataset.map((e) => ({
        name: e.name,
        muscle_group: e.muscle,
        detail: e.note ?? null,
        source: "dataset" as const,
      })),
    ].slice(0, 16);

    return { people, programs, exercises };
  });
