import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureCatalogSeeded } from "./catalog";
import { ensureUserSeeded } from "./seed";
import { isoDow } from "@/lib/utils";
import type { Sql } from "@/lib/db";

export type PublicProgramCard = {
  id: number;
  name: string;
  description: string | null;
  tags: string | null;
  share_code: string | null;
  clone_count: number;
  day_count: number;
  exercise_count: number;
  author_name: string;
  is_catalog: boolean;
  is_own: boolean;
};

function makeShareCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * 32)]!;
  return s;
}

/** Delete all of a user's personal programs (cascade days/exercises). */
async function deleteUserPrograms(sql: Sql, userId: string) {
  await sql`
    update workouts set program_day_id = null
    where user_id = ${userId}
  `;
  await sql`delete from programs where user_id = ${userId}`;
}

/** Drop future planned shells so new program can fill the calendar. */
async function clearFuturePlanned(sql: Sql, userId: string) {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  await sql`
    delete from workouts
    where user_id = ${userId}
      and date >= ${todayIso}::date
      and status in ('planned', 'skipped', 'in_progress')
  `;
}

/**
 * Remap program day DOWs so `startSourceDayId` lands on `startDate`'s weekday,
 * preserving relative gaps between sessions (rest days stay as empty DOWs).
 */
function remapDow(
  originalDow: number,
  anchorOriginalDow: number,
  startDateDow: number,
): number {
  const rel = (originalDow - anchorOriginalDow + 7) % 7;
  return ((startDateDow - 1 + rel) % 7) + 1;
}

export const listDiscoverPrograms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureCatalogSeeded(sql);
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
      order by
        case when p.user_id = 'system' then 0 else 1 end,
        case p.share_code
          when 'FULL6X' then 0
          when 'FULL3X' then 1
          when 'UL4DAY' then 2
          else 3
        end,
        p.clone_count desc,
        p.id desc
      limit 60
    `;
    return rows.map(
      (r): PublicProgramCard => ({
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
        is_own: r.user_id === context.userId,
      }),
    );
  });

export const getPublicProgramDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await ensureCatalogSeeded(sql);
    const progs = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      share_code: string | null;
      clone_count: number;
      user_id: string;
      is_public: boolean;
    }>`
      select id, name, description, tags, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             user_id, is_public
      from programs where id = ${id}
    `;
    if (progs.length === 0) throw new Error("Program bulunamadı.");
    const p = progs[0]!;
    if (!p.is_public && p.user_id !== context.userId) {
      throw new Error("Bu program gizli.");
    }

    const days = await sql<{
      id: number;
      dow: number;
      name: string;
      focus: string | null;
    }>`
      select id, dow, name, focus from program_days
      where program_id = ${id}
      order by sort, dow
    `;

    const dayDetails = [];
    for (const d of days) {
      const exercises = await sql<{
        id: number;
        exercise_name: string;
        detail: string | null;
        sets: number;
        rep_lo: number;
        rep_hi: number;
        rest_sec: number;
        load_tag: string;
        note: string | null;
        form_cues: string | null;
      }>`
        select pe.id, e.name as exercise_name, pe.detail, pe.sets, pe.rep_lo, pe.rep_hi,
               pe.rest_sec, pe.load_tag, pe.note, e.form_cues
        from program_exercises pe
        join exercises e on e.id = pe.exercise_id
        where pe.program_day_id = ${d.id}
        order by pe.sort
      `;
      dayDetails.push({ ...d, exercises });
    }

    const author = await sql<{ name: string | null }>`
      select name from "user" where id = ${p.user_id}
    `;

    return {
      ...p,
      author_name:
        p.user_id === "system" ? "Salon" : (author[0]?.name ?? "Sporcu"),
      is_catalog: p.user_id === "system",
      is_own: p.user_id === context.userId,
      days: dayDetails,
    };
  });

export const publishProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      id: number;
      is_public: boolean;
      description?: string | null;
      tags?: string | null;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ id: number; share_code: string | null }>`
      select id, share_code from programs
      where id = ${data.id} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Program bulunamadı.");
    let code = owned[0]!.share_code;
    if (data.is_public && !code) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = makeShareCode();
        const exists = await sql`select id from programs where share_code = ${candidate}`;
        if (exists.length === 0) {
          code = candidate;
          break;
        }
      }
      if (!code) throw new Error("Paylaşım kodu üretilemedi.");
    }
    await sql`
      update programs set
        is_public = ${data.is_public},
        share_code = ${code},
        description = coalesce(${data.description ?? null}, description),
        tags = coalesce(${data.tags ?? null}, tags)
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return {
      ok: true as const,
      share_code: code,
      is_public: data.is_public,
    };
  });

export const updateProgramMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      id: number;
      name?: string;
      description?: string | null;
      tags?: string | null;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from programs where id = ${data.id} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Program bulunamadı.");
    if (data.name !== undefined) {
      await sql`
        update programs set name = ${data.name.trim() || "Program"}
        where id = ${data.id}
      `;
    }
    if (data.description !== undefined) {
      await sql`
        update programs set description = ${data.description}
        where id = ${data.id}
      `;
    }
    if (data.tags !== undefined) {
      await sql`update programs set tags = ${data.tags} where id = ${data.id}`;
    }
    return { ok: true as const };
  });

/**
 * Clone a public/catalog program as the user's active program.
 * Optional startDate + startSourceDayId remaps weekdays so the chosen
 * session lands on the chosen start day (relative rest gaps preserved).
 */
export const cloneProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      programId?: number;
      shareCode?: string;
      setActive?: boolean;
      name?: string;
      /** YYYY-MM-DD — first day the program becomes active */
      startDate?: string;
      /** Source program_days.id that should land on startDate */
      startSourceDayId?: number;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    await ensureCatalogSeeded(sql);

    let sourceId = data.programId ?? null;
    if (!sourceId && data.shareCode) {
      const code = data.shareCode.trim().toUpperCase();
      const found = await sql<{ id: number }>`
        select id from programs
        where share_code = ${code} and is_public = true
      `;
      if (found.length === 0) {
        throw new Error("Paylaşım kodu geçersiz veya program gizli.");
      }
      sourceId = found[0]!.id;
    }
    if (!sourceId) throw new Error("Program belirtilmedi.");

    const src = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      is_public: boolean;
      user_id: string;
    }>`
      select id, name, description, tags, is_public, user_id
      from programs where id = ${sourceId}
    `;
    if (src.length === 0) throw new Error("Program bulunamadı.");
    const s = src[0]!;
    if (!s.is_public && s.user_id !== context.userId && s.user_id !== "system") {
      throw new Error("Bu program kopyalanamaz.");
    }

    await deleteUserPrograms(sql, context.userId);
    await clearFuturePlanned(sql, context.userId);

    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const startDate =
      data.startDate && /^\d{4}-\d{2}-\d{2}$/.test(data.startDate)
        ? data.startDate
        : todayIso;

    const newName = (data.name?.trim() || s.name).slice(0, 80);

    const prog = await sql<{ id: number }>`
      insert into programs (
        user_id, name, description, tags, is_active, valid_from,
        is_public, source_program_id
      ) values (
        ${context.userId}, ${newName}, ${s.description}, ${s.tags},
        true, ${startDate}::date,
        false, ${s.id}
      )
      returning id
    `;
    const newId = prog[0]!.id;

    const days = await sql<{
      id: number;
      dow: number;
      name: string;
      focus: string | null;
      sort: number;
    }>`
      select id, dow, name, focus, sort from program_days
      where program_id = ${s.id}
      order by sort, dow
    `;

    // Anchor: chosen start session (or first by sort)
    let anchor = days[0];
    if (data.startSourceDayId) {
      const hit = days.find((d) => d.id === data.startSourceDayId);
      if (hit) anchor = hit;
    }
    const startDow = isoDow(startDate);
    const anchorOrigDow = anchor?.dow ?? 1;

    for (const d of days) {
      const newDow = remapDow(d.dow, anchorOrigDow, startDow);
      const dayRow = await sql<{ id: number }>`
        insert into program_days (program_id, dow, name, focus, sort)
        values (${newId}, ${newDow}, ${d.name}, ${d.focus}, ${d.sort})
        returning id
      `;
      const newDayId = dayRow[0]!.id;
      const exercises = await sql<{
        exercise_id: number;
        detail: string | null;
        sets: number;
        rep_lo: number;
        rep_hi: number;
        rest_sec: number;
        load_tag: string;
        note: string | null;
        sort: number;
      }>`
        select exercise_id, detail, sets, rep_lo, rep_hi, rest_sec, load_tag, note, sort
        from program_exercises where program_day_id = ${d.id}
        order by sort
      `;
      for (const pe of exercises) {
        await sql`
          insert into program_exercises (
            program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
            rest_sec, load_tag, note, sort
          ) values (
            ${newDayId}, ${pe.exercise_id}, ${pe.detail}, ${pe.sets},
            ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag},
            ${pe.note}, ${pe.sort}
          )
        `;
      }
    }

    await sql`
      update programs set clone_count = coalesce(clone_count, 0) + 1
      where id = ${s.id}
    `;

    return {
      id: newId,
      name: newName,
      startDate,
      startDow,
      startDayName: anchor?.name ?? null,
    };
  });

/** Leave / abandon current program entirely (no auto-replacement). */
export const abandonProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await deleteUserPrograms(sql, context.userId);
    return { ok: true as const };
  });
