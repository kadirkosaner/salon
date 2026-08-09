import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureCatalogSeeded } from "./catalog";
import { ensureUserSeeded } from "./seed";
import { isoDow, remapDow } from "@/lib/utils";
import { todayForUser } from "./time";
import { emitProgramPublished } from "./activity";
import { parseOrThrow, v, positiveId, isoDate, optionalText, noInput } from "@/lib/validation";
import { z } from "zod";

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
  const todayIso = await todayForUser(sql, userId);
  await sql`
    delete from workouts
    where user_id = ${userId}
      and date >= ${todayIso}::date
      and status in ('planned', 'skipped', 'in_progress')
  `;
}

export const listDiscoverPrograms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(noInput)
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
  .validator(v(positiveId))
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

    const dayIds = days.map((d) => d.id);
    const allEx =
      dayIds.length === 0
        ? []
        : await sql<{
            program_day_id: number;
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
            select pe.program_day_id, pe.id, e.name as exercise_name, pe.detail,
                   pe.sets, pe.rep_lo, pe.rep_hi, pe.rest_sec, pe.load_tag, pe.note,
                   e.form_cues
            from program_exercises pe
            join exercises e on e.id = pe.exercise_id
            where pe.program_day_id = any(${dayIds}::int[])
            order by pe.program_day_id, pe.sort
          `;
    const byDay = new Map<number, typeof allEx>();
    for (const ex of allEx) {
      const list = byDay.get(ex.program_day_id) ?? [];
      list.push(ex);
      byDay.set(ex.program_day_id, list);
    }
    const dayDetails = days.map((d) => ({
      ...d,
      exercises: (byDay.get(d.id) ?? []).map(
        ({ program_day_id: _pd, ...rest }) => rest,
      ),
    }));

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
    v(
      z.object({
        id: positiveId,
        is_public: z.boolean(),
        description: optionalText(2000),
        tags: optionalText(200),
      }),
    ),
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
    if (data.is_public) {
      try {
        await emitProgramPublished(sql, context.userId, data.id);
      } catch {
        /* non-fatal */
      }
    }
    return {
      ok: true as const,
      share_code: code,
      is_public: data.is_public,
    };
  });

export const updateProgramMeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        id: positiveId,
        name: z.string().trim().min(1).max(80).optional(),
        description: optionalText(2000),
        tags: optionalText(200),
      }),
    ),
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
  .validator(v(z.object({
    programId: positiveId.optional(),
    shareCode: z.string().trim().min(4).max(8).optional(),
    setActive: z.boolean().optional(),
    name: z.string().trim().max(80).optional(),
    startDate: isoDate.optional(),
    startSourceDayId: positiveId.optional(),
  })))
  .handler(async ({ context, data }) => {
    const sql0 = await getSql();
    await ensureUserSeeded(sql0, context.userId);
    await ensureCatalogSeeded(sql0);

    let sourceId = data.programId ?? null;
    if (!sourceId && data.shareCode) {
      const code = data.shareCode.trim().toUpperCase();
      const found = await sql0<{ id: number }>`
        select id from programs
        where share_code = ${code} and is_public = true
      `;
      if (found.length === 0) {
        throw new Error("Paylaşım kodu geçersiz veya program gizli.");
      }
      sourceId = found[0]!.id;
    }
    if (!sourceId) throw new Error("Program belirtilmedi.");

    const src = await sql0<{
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

    const todayIso = await todayForUser(sql0, context.userId);
    const startDate = data.startDate ?? todayIso;
    const newName = (data.name?.trim() || s.name).slice(0, 80);

    return withTransaction(async (sql) => {
      await deleteUserPrograms(sql, context.userId);
      await clearFuturePlanned(sql, context.userId);

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

      let anchor = days[0];
      if (data.startSourceDayId) {
        const hit = days.find((d) => d.id === data.startSourceDayId);
        if (hit) anchor = hit;
      }
      const startDow = isoDow(startDate);
      const anchorOrigDow = anchor?.dow ?? 1;

      // Bulk insert remapped days (1 query), then copy all exercises (1 query)
      if (days.length > 0) {
        const values: unknown[] = [];
        const placeholders: string[] = [];
        let p = 1;
        for (const d of days) {
          const newDow = remapDow(d.dow, anchorOrigDow, startDow);
          placeholders.push(
            `($${p++}, $${p++}, $${p++}, $${p++}, $${p++})`,
          );
          values.push(newId, newDow, d.name, d.focus, d.sort);
        }
        await sql.query(
          `insert into program_days (program_id, dow, name, focus, sort)
           values ${placeholders.join(", ")}`,
          values,
        );

        // Match old→new days by sort (stable within a program)
        await sql`
          insert into program_exercises (
            program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
            rest_sec, load_tag, note, sort
          )
          select
            npd.id,
            pe.exercise_id,
            pe.detail,
            pe.sets,
            pe.rep_lo,
            pe.rep_hi,
            pe.rest_sec,
            pe.load_tag,
            pe.note,
            pe.sort
          from program_exercises pe
          join program_days opd
            on opd.id = pe.program_day_id and opd.program_id = ${s.id}
          join program_days npd
            on npd.program_id = ${newId} and npd.sort = opd.sort
          order by npd.sort, pe.sort
        `;
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
  });

/** Leave / abandon current program entirely (no auto-replacement). */
export const abandonProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    return withTransaction(async (sql) => {
      await deleteUserPrograms(sql, context.userId);
      return { ok: true as const };
    });
  });
