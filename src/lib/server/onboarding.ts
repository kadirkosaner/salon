import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { v, noInput } from "@/lib/validation";
import { todayForUser } from "@/lib/server/time";
import { ensureUserSeeded } from "@/lib/server/seed";
import { ensureCatalogSeeded } from "@/lib/server/catalog";
import type { PublicProgramCard } from "@/lib/server/share";

/**
 * Safety net if migration 0016 has not run yet on this PGLite instance.
 * Matches 0016_onboarding.sql: add column + backfill existing profiles only
 * when the column was just created (so new signups keep null onboarded_at).
 */
async function ensureOnboardingColumn(sql: Awaited<ReturnType<typeof getSql>>) {
  try {
    await sql`select onboarded_at from user_profiles limit 0`;
    return;
  } catch {
    /* column missing — apply below */
  }
  try {
    await sql`alter table user_profiles add column if not exists onboarded_at timestamptz`;
    // Backfill only rows that already existed (created before this moment).
    // New profiles created after the column exists stay null until onboarding.
    await sql`
      update user_profiles
      set onboarded_at = coalesce(created_at, now())
      where onboarded_at is null
        and created_at < now() - interval '2 seconds'
    `;
  } catch {
    /* ignore */
  }
}

export type OnboardingStatus = {
  onboarded: boolean;
  hasWeight: boolean;
  hasProgram: boolean;
  hasBirthDate: boolean;
  hasSex: boolean;
  hasHeight: boolean;
  unitSystem: "metric" | "imperial";
  theme: "obsidian" | "carbon";
  accent: string;
  weightKg: number | null;
  displayName: string | null;
};

export const getOnboardingStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }): Promise<OnboardingStatus> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureOnboardingColumn(sql);

    const prof = await sql<{
      onboarded_at: string | null;
      unit_system: string | null;
      theme: string | null;
      accent: string | null;
      birth_date: string | null;
      sex: string | null;
      height_cm: string | null;
    }>`
      select
        onboarded_at::text as onboarded_at,
        unit_system,
        theme,
        accent,
        birth_date::text as birth_date,
        sex,
        height_cm::text as height_cm
      from user_profiles
      where user_id = ${context.userId}
    `;

    const onboarded = prof[0]?.onboarded_at != null;

    const bw = await sql<{ body_weight: number | null }>`
      select body_weight::float8 as body_weight
      from body_measurements
      where user_id = ${context.userId} and body_weight is not null
      order by date desc
      limit 1
    `;

    const prog = await sql<{ id: number }>`
      select id from programs
      where user_id = ${context.userId} and is_active = true
      limit 1
    `;

    const user = await sql<{ name: string | null }>`
      select name from "user" where id = ${context.userId} limit 1
    `;

    return {
      onboarded,
      hasWeight: bw[0]?.body_weight != null,
      hasProgram: prog.length > 0,
      hasBirthDate: !!prof[0]?.birth_date,
      hasSex: !!prof[0]?.sex && prof[0]!.sex !== "unspecified",
      hasHeight: prof[0]?.height_cm != null,
      unitSystem:
        prof[0]?.unit_system === "imperial" ? "imperial" : "metric",
      theme: prof[0]?.theme === "carbon" ? "carbon" : "obsidian",
      accent: prof[0]?.accent || "pirinc",
      weightKg: bw[0]?.body_weight ?? null,
      displayName: user[0]?.name ?? null,
    };
  });

/** Mark onboarding finished (complete or skip). */
export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureOnboardingColumn(sql);
    await sql`
      insert into user_profiles (user_id, username, onboarded_at)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        now()
      )
      on conflict (user_id) do update set
        onboarded_at = coalesce(user_profiles.onboarded_at, now()),
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const saveOnboardingWeight = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        // Display units (kg or lb); range checked after conversion to kg.
        weightKg: z.number().min(1).max(1000),
        unitSystem: z.enum(["metric", "imperial"]),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const today = await todayForUser(sql, context.userId);
    const kg =
      data.unitSystem === "imperial"
        ? Math.round(data.weightKg * 0.453592 * 10) / 10
        : data.weightKg;

    if (kg < 20 || kg > 400) {
      throw new Error("Weight out of range");
    }

    await sql`
      insert into body_measurements (user_id, date, body_weight)
      values (${context.userId}, ${today}::date, ${kg})
      on conflict (user_id, date) do update set
        body_weight = excluded.body_weight
    `;
    await sql`
      insert into user_profiles (user_id, username, unit_system)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.unitSystem}
      )
      on conflict (user_id) do update set
        unit_system = ${data.unitSystem},
        updated_at = now()
    `;
    return { ok: true as const, weightKg: kg };
  });

export const saveOnboardingAppearance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        theme: z.enum(["obsidian", "carbon"]),
        accent: z.string().min(2).max(20),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await sql`
      insert into user_profiles (user_id, username, theme, accent)
      values (
        ${context.userId},
        ${"user_" + context.userId.slice(0, 8)},
        ${data.theme},
        ${data.accent}
      )
      on conflict (user_id) do update set
        theme = ${data.theme},
        accent = ${data.accent},
        updated_at = now()
    `;
    return { ok: true as const };
  });

/** Catalog suggestions filtered by preferred training days/week. */
export const getOnboardingPrograms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        daysPerWeek: z.number().int().min(2).max(6).optional(),
        locale: z.string().optional(),
      }),
    ),
  )
  .handler(async ({ data }): Promise<PublicProgramCard[]> => {
    const sql = await getSql();
    await ensureCatalogSeeded(sql);
    const days = data.daysPerWeek ?? 3;
    const locale = data.locale ?? "en";

    const rows = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      share_code: string | null;
      day_count: number;
      exercise_count: number;
      clone_count: number;
    }>`
      select
        p.id,
        p.name,
        p.description,
        p.tags,
        p.share_code,
        (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
        (
          select count(*)::int from program_exercises pe
          join program_days pd on pd.id = pe.program_day_id
          where pd.program_id = p.id
        ) as exercise_count,
        coalesce(p.clone_count, 0)::int as clone_count
      from programs p
      where p.user_id = 'system' and p.is_public = true
      order by p.id
    `;

    const scored = rows
      .map((r) => ({
        ...r,
        score: Math.abs(r.day_count - days) * 10 + (r.day_count === days ? 0 : 1),
      }))
      .sort((a, b) => a.score - b.score || a.id - b.id)
      .slice(0, 4);

    const out: PublicProgramCard[] = [];
    for (const r of scored) {
      let name = r.name;
      let description = r.description;
      if (locale.startsWith("tr")) {
        try {
          const tr = await sql<{ name: string; description: string | null }>`
            select name, description from program_translations
            where program_id = ${r.id} and locale = 'tr'
            limit 1
          `;
          if (tr[0]) {
            name = tr[0].name;
            description = tr[0].description ?? description;
          }
        } catch {
          /* no translations table */
        }
      }
      out.push({
        id: r.id,
        name,
        description,
        tags: r.tags,
        share_code: r.share_code,
        day_count: r.day_count,
        exercise_count: r.exercise_count,
        clone_count: r.clone_count,
        is_catalog: true,
        author_name: "Salon",
        is_own: false,
      });
    }
    return out;
  });

export const isOnboarded = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureOnboardingColumn(sql);
    try {
      const rows = await sql<{ onboarded_at: string | null }>`
        select onboarded_at::text as onboarded_at
        from user_profiles
        where user_id = ${context.userId}
      `;
      if (rows.length === 0) return { onboarded: false };
      return { onboarded: rows[0]!.onboarded_at != null };
    } catch {
      return { onboarded: true };
    }
  });
