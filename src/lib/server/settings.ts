import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getUserTimeZone, setUserTimeZone } from "./time";
import { ensureUserProfile } from "./social";
import { v, noInput } from "@/lib/validation";
import { z } from "zod";

const themeSchema = z.enum(["obsidian", "carbon"]);
const accentSchema = z.enum([
  "pirinc",
  "bakir",
  "kemik",
  "volt",
  "ates",
  "buz",
  "neon",
  "kehribar",
  "beyaz",
  "ufuk",
]);

export const getSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    const timeZone = await getUserTimeZone(sql, context.userId);
    await sql`
      insert into user_settings (user_id, time_zone)
      values (${context.userId}, ${timeZone})
      on conflict (user_id) do nothing
    `;
    let hapticEnabled = true;
    let notificationsEnabled = true;
    try {
      const rows = await sql<{
        haptic_enabled: boolean;
        notifications_enabled: boolean;
      }>`
        select haptic_enabled, notifications_enabled
        from user_settings
        where user_id = ${context.userId}
      `;
      if (rows[0]) {
        hapticEnabled = rows[0].haptic_enabled !== false;
        notificationsEnabled = rows[0].notifications_enabled !== false;
      }
    } catch {
      /* columns may not exist until migration */
    }
    await ensureUserProfile(sql, context.userId);
    const prof = await sql<{ unit_system: string }>`
      select unit_system from user_profiles where user_id = ${context.userId}
    `;
    let theme: "obsidian" | "carbon" = "obsidian";
    let accent = "pirinc";
    try {
      const themeRows = await sql<{ theme: string; accent: string }>`
        select coalesce(theme, 'obsidian') as theme,
               coalesce(accent, 'pirinc') as accent
        from user_profiles where user_id = ${context.userId}
      `;
      if (themeRows[0]) {
        theme = themeRows[0].theme === "carbon" ? "carbon" : "obsidian";
        accent = themeRows[0].accent || "pirinc";
      }
    } catch {
      /* theme columns until migration 0012 */
    }
    return {
      timeZone,
      hapticEnabled,
      notificationsEnabled,
      unitSystem: (prof[0]?.unit_system as "metric" | "imperial") || "metric",
      theme,
      accent,
    };
  });

export const updateSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        timeZone: z.string().trim().min(1).max(64).optional(),
        hapticEnabled: z.boolean().optional(),
        notificationsEnabled: z.boolean().optional(),
        unitSystem: z.enum(["metric", "imperial"]).optional(),
        theme: themeSchema.optional(),
        accent: accentSchema.optional(),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserProfile(sql, context.userId);
    if (data.timeZone) {
      await setUserTimeZone(sql, context.userId, data.timeZone);
    }
    if (data.hapticEnabled !== undefined) {
      await sql`
        insert into user_settings (user_id, time_zone, haptic_enabled, updated_at)
        values (${context.userId}, 'Europe/Istanbul', ${data.hapticEnabled}, now())
        on conflict (user_id) do update set
          haptic_enabled = ${data.hapticEnabled},
          updated_at = now()
      `;
    }
    if (data.notificationsEnabled !== undefined) {
      await sql`
        insert into user_settings (user_id, time_zone, notifications_enabled, updated_at)
        values (${context.userId}, 'Europe/Istanbul', ${data.notificationsEnabled}, now())
        on conflict (user_id) do update set
          notifications_enabled = ${data.notificationsEnabled},
          updated_at = now()
      `;
    }
    if (data.unitSystem) {
      await sql`
        update user_profiles set unit_system = ${data.unitSystem}, updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    if (data.theme !== undefined || data.accent !== undefined) {
      try {
        if (data.theme !== undefined && data.accent !== undefined) {
          await sql`
            update user_profiles
            set theme = ${data.theme}, accent = ${data.accent}, updated_at = now()
            where user_id = ${context.userId}
          `;
        } else if (data.theme !== undefined) {
          await sql`
            update user_profiles
            set theme = ${data.theme}, updated_at = now()
            where user_id = ${context.userId}
          `;
        } else if (data.accent !== undefined) {
          await sql`
            update user_profiles
            set accent = ${data.accent}, updated_at = now()
            where user_id = ${context.userId}
          `;
        }
      } catch {
        /* columns may not exist until migration */
      }
    }
    return { ok: true as const };
  });

/** Export user data as JSON (GDPR). */
export const exportMyData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    const user = await sql<{
      id: string;
      name: string;
      email: string;
      created_at: string;
    }>`
      select id, name, email, "createdAt"::text as created_at
      from "user" where id = ${context.userId}
    `;
    const profile = await sql<{
      username: string;
      bio: string | null;
      visibility: string;
      unit_system: string;
      measures_public: boolean;
    }>`
      select username, bio, visibility, unit_system, measures_public
      from user_profiles where user_id = ${context.userId}
    `;
    let theme = "obsidian";
    let accent = "pirinc";
    try {
      const ta = await sql<{ theme: string; accent: string }>`
        select coalesce(theme, 'obsidian') as theme,
               coalesce(accent, 'pirinc') as accent
        from user_profiles where user_id = ${context.userId}
      `;
      if (ta[0]) {
        theme = ta[0].theme;
        accent = ta[0].accent;
      }
    } catch {
      /* ignore */
    }
    const workouts = await sql<{
      id: number;
      date: string;
      day_name: string;
      status: string;
      notes: string | null;
    }>`
      select id, date::text as date, day_name, status, notes
      from workouts where user_id = ${context.userId}
      order by date desc limit 500
    `;
    const measures = await sql<{
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
      from body_measurements where user_id = ${context.userId}
      order by date desc limit 200
    `;
    const programs = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      is_public: boolean;
      share_code: string | null;
    }>`
      select id, name, description, tags, is_public, share_code
      from programs where user_id = ${context.userId}
    `;
    return {
      exported_at: new Date().toISOString(),
      user: user[0]
        ? {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            created_at: user[0].created_at,
          }
        : null,
      profile: profile[0]
        ? {
            username: profile[0].username,
            bio: profile[0].bio,
            visibility: profile[0].visibility,
            unit_system: profile[0].unit_system,
            measures_public: profile[0].measures_public === true,
            theme,
            accent,
          }
        : null,
      workouts: workouts.map((w) => ({
        id: Number(w.id),
        date: w.date,
        day_name: w.day_name,
        status: w.status,
        notes: w.notes,
      })),
      measures: measures.map((m) => ({
        date: m.date,
        body_weight: m.body_weight,
        waist: m.waist,
        chest: m.chest,
        arm: m.arm,
        thigh: m.thigh,
      })),
      programs: programs.map((p) => ({
        id: Number(p.id),
        name: p.name,
        description: p.description,
        tags: p.tags,
        is_public: p.is_public === true,
        share_code: p.share_code,
      })),
    };
  });

/** Hard-delete account (cascade via FKs). */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({ confirm: z.literal("DELETE") })))
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`delete from "user" where id = ${context.userId}`;
    return { ok: true as const };
  });
