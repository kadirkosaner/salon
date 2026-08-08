import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";

export type ProgramExerciseRow = {
  id: number;
  exercise_id: number;
  exercise_name: string;
  detail: string | null;
  unit: string;
  sets: number;
  rep_lo: number;
  rep_hi: number;
  rest_sec: number;
  load_tag: string;
  note: string | null;
  sort: number;
  form_cues: string | null;
  muscle_group: string;
};

export type ProgramDayRow = {
  id: number;
  program_id: number;
  dow: number;
  name: string;
  focus: string | null;
  sort: number;
  exercises: ProgramExerciseRow[];
};

export type ProgramDetail = {
  id: number;
  name: string;
  description: string | null;
  tags: string | null;
  is_active: boolean;
  is_public: boolean;
  share_code: string | null;
  clone_count: number;
  valid_from: string;
  valid_to: string | null;
  days: ProgramDayRow[];
};

export const listPrograms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return sql<{
      id: number;
      name: string;
      description: string | null;
      is_active: boolean;
      is_public: boolean;
      share_code: string | null;
      valid_from: string;
      valid_to: string | null;
    }>`
      select id, name, description, is_active, is_public, share_code,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs
      where user_id = ${context.userId}
      order by is_active desc, valid_from desc
    `;
  });

export const getActiveProgram = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<ProgramDetail | null> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const progs = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      is_active: boolean;
      is_public: boolean;
      share_code: string | null;
      clone_count: number;
      valid_from: string;
      valid_to: string | null;
    }>`
      select id, name, description, tags, is_active, is_public, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs
      where user_id = ${context.userId} and is_active = true
      order by id desc
      limit 1
    `;
    if (progs.length === 0) return null;
    return loadProgram(sql, progs[0]!);
  });

export const getProgram = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }): Promise<ProgramDetail | null> => {
    const sql = await getSql();
    const progs = await sql<{
      id: number;
      name: string;
      description: string | null;
      tags: string | null;
      is_active: boolean;
      is_public: boolean;
      share_code: string | null;
      clone_count: number;
      valid_from: string;
      valid_to: string | null;
    }>`
      select id, name, description, tags, is_active, is_public, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs where id = ${id} and user_id = ${context.userId}
    `;
    if (progs.length === 0) return null;
    return loadProgram(sql, progs[0]!);
  });

async function loadProgram(
  sql: Awaited<ReturnType<typeof getSql>>,
  p: {
    id: number;
    name: string;
    description: string | null;
    tags: string | null;
    is_active: boolean;
    is_public: boolean;
    share_code: string | null;
    clone_count: number;
    valid_from: string;
    valid_to: string | null;
  },
): Promise<ProgramDetail> {
  const days = await sql<{
    id: number;
    program_id: number;
    dow: number;
    name: string;
    focus: string | null;
    sort: number;
  }>`
    select id, program_id, dow, name, focus, sort
    from program_days where program_id = ${p.id}
    order by sort, dow
  `;

  const resultDays: ProgramDayRow[] = [];
  for (const d of days) {
    const exercises = await sql<ProgramExerciseRow>`
      select pe.id, pe.exercise_id, e.name as exercise_name,
             pe.detail, e.unit, pe.sets, pe.rep_lo, pe.rep_hi,
             pe.rest_sec, pe.load_tag, pe.note, pe.sort,
             e.form_cues, coalesce(e.muscle_group, 'diger') as muscle_group
      from program_exercises pe
      join exercises e on e.id = pe.exercise_id
      where pe.program_day_id = ${d.id}
      order by pe.sort
    `;
    resultDays.push({ ...d, exercises });
  }

  return { ...p, days: resultDays };
}

export const updateProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; name?: string; is_active?: boolean }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.name !== undefined) {
      await sql`
        update programs set name = ${data.name}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    if (data.is_active !== undefined) {
      await sql`
        update programs set is_active = ${data.is_active}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    }
    return { ok: true };
  });

export const createProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      name: string;
      description?: string;
      /** Optional starter days: { dow, name, focus? }[] */
      days?: Array<{ dow: number; name: string; focus?: string }>;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();

    // New program replaces active one (past completed workouts stay)
    await sql`
      update programs set is_active = false
      where user_id = ${context.userId} and is_active = true
    `;

    // Drop future planned shells so horizon refills for the new program
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    await sql`
      delete from workouts
      where user_id = ${context.userId}
        and date >= ${todayIso}::date
        and status in ('planned', 'skipped', 'in_progress')
    `;

    const rows = await sql<{ id: number }>`
      insert into programs (user_id, name, description, is_active, valid_from)
      values (
        ${context.userId},
        ${data.name.trim() || "Yeni Program"},
        ${data.description?.trim() || null},
        true,
        '2000-01-01'::date
      )
      returning id
    `;
    const programId = rows[0]!.id;

    const days =
      data.days && data.days.length > 0
        ? data.days
        : [
            { dow: 1, name: "Gün 1", focus: undefined as string | undefined },
            { dow: 2, name: "Gün 2", focus: undefined },
            { dow: 3, name: "Gün 3", focus: undefined },
          ];

    let sort = 0;
    for (const d of days) {
      if (d.dow < 1 || d.dow > 7) continue;
      await sql`
        insert into program_days (program_id, dow, name, focus, sort)
        values (
          ${programId}, ${d.dow}, ${d.name.trim() || `Gün ${d.dow}`},
          ${d.focus ?? null}, ${sort}
        )
      `;
      sort += 1;
    }

    return { id: programId, name: data.name.trim() || "Yeni Program" };
  });

export const addProgramDay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { programId: number; dow: number; name: string; focus?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from programs where id = ${data.programId} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Program bulunamadı.");
    const maxSort = await sql<{ m: number }>`
      select coalesce(max(sort), -1)::int as m from program_days where program_id = ${data.programId}
    `;
    const rows = await sql<{ id: number }>`
      insert into program_days (program_id, dow, name, focus, sort)
      values (
        ${data.programId}, ${data.dow}, ${data.name}, ${data.focus ?? null},
        ${(maxSort[0]?.m ?? -1) + 1}
      )
      returning id
    `;
    return { id: rows[0]!.id };
  });

export const updateProgramDay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; name?: string; focus?: string | null; dow?: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.id} and p.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Gün bulunamadı.");
    if (data.name !== undefined) {
      await sql`update program_days set name = ${data.name} where id = ${data.id}`;
    }
    if (data.focus !== undefined) {
      await sql`update program_days set focus = ${data.focus} where id = ${data.id}`;
    }
    if (data.dow !== undefined) {
      await sql`update program_days set dow = ${data.dow} where id = ${data.id}`;
    }
    return { ok: true };
  });

export const setWeekSchedule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      programId: number;
      schedule: Array<{ dow: number; programDayId: number | null }>;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from programs where id = ${data.programId} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Program bulunamadı.");

    const days = await sql<{ id: number; dow: number }>`
      select id, dow from program_days where program_id = ${data.programId}
    `;
    const dayIds = new Set(days.map((d) => d.id));

    let temp = 100;
    for (const d of days) {
      await sql`update program_days set dow = ${temp} where id = ${d.id}`;
      temp += 1;
    }

    const usedDayIds = new Set<number>();
    for (const slot of data.schedule) {
      if (slot.dow < 1 || slot.dow > 7) continue;
      if (slot.programDayId == null) continue;
      if (!dayIds.has(slot.programDayId)) {
        throw new Error("Geçersiz program günü.");
      }
      if (usedDayIds.has(slot.programDayId)) {
        throw new Error("Aynı program günü iki hafta gününe atanamaz.");
      }
      usedDayIds.add(slot.programDayId);
      await sql`
        update program_days set dow = ${slot.dow} where id = ${slot.programDayId}
      `;
    }

    const assignedDows = new Set(
      data.schedule.filter((s) => s.programDayId != null).map((s) => s.dow),
    );
    const freeDows = [1, 2, 3, 4, 5, 6, 7].filter((d) => !assignedDows.has(d));
    let freeIdx = 0;
    for (const d of days) {
      if (usedDayIds.has(d.id)) continue;
      const park = freeDows[freeIdx] ?? 7;
      freeIdx += 1;
      await sql`update program_days set dow = ${park} where id = ${d.id}`;
    }

    return { ok: true };
  });

export const deleteProgramDay = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from program_days pd
      using programs p
      where pd.id = ${id} and pd.program_id = p.id and p.user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const addProgramExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      programDayId: number;
      exerciseId: number;
      detail?: string;
      sets: number;
      rep_lo: number;
      rep_hi: number;
      rest_sec: number;
      load_tag: string;
      note?: string;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.programDayId} and p.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Gün bulunamadı.");
    const maxSort = await sql<{ m: number }>`
      select coalesce(max(sort), -1)::int as m from program_exercises where program_day_id = ${data.programDayId}
    `;
    const rows = await sql<{ id: number }>`
      insert into program_exercises (
        program_day_id, exercise_id, detail, sets, rep_lo, rep_hi, rest_sec, load_tag, note, sort
      ) values (
        ${data.programDayId}, ${data.exerciseId}, ${data.detail ?? null}, ${data.sets},
        ${data.rep_lo}, ${data.rep_hi}, ${data.rest_sec}, ${data.load_tag},
        ${data.note ?? null}, ${(maxSort[0]?.m ?? -1) + 1}
      ) returning id
    `;
    return { id: rows[0]!.id };
  });

export const updateProgramExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      id: number;
      exerciseId?: number;
      sets?: number;
      rep_lo?: number;
      rep_hi?: number;
      rest_sec?: number;
      load_tag?: string;
      note?: string | null;
      detail?: string | null;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select pe.id from program_exercises pe
      join program_days pd on pd.id = pe.program_day_id
      join programs p on p.id = pd.program_id
      where pe.id = ${data.id} and p.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Hareket bulunamadı.");
    if (data.exerciseId !== undefined) {
      const ex = await sql`
        select id from exercises
        where id = ${data.exerciseId}
          and (owner_id is null or owner_id = ${context.userId})
      `;
      if (ex.length === 0) throw new Error("Hareket kütüphanede yok.");
      await sql`update program_exercises set exercise_id = ${data.exerciseId} where id = ${data.id}`;
    }
    if (data.sets !== undefined)
      await sql`update program_exercises set sets = ${data.sets} where id = ${data.id}`;
    if (data.rep_lo !== undefined)
      await sql`update program_exercises set rep_lo = ${data.rep_lo} where id = ${data.id}`;
    if (data.rep_hi !== undefined)
      await sql`update program_exercises set rep_hi = ${data.rep_hi} where id = ${data.id}`;
    if (data.rest_sec !== undefined)
      await sql`update program_exercises set rest_sec = ${data.rest_sec} where id = ${data.id}`;
    if (data.load_tag !== undefined)
      await sql`update program_exercises set load_tag = ${data.load_tag} where id = ${data.id}`;
    if (data.note !== undefined)
      await sql`update program_exercises set note = ${data.note} where id = ${data.id}`;
    if (data.detail !== undefined)
      await sql`update program_exercises set detail = ${data.detail} where id = ${data.id}`;
    return { ok: true };
  });

export const deleteProgramExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from program_exercises pe
      using program_days pd, programs p
      where pe.id = ${id}
        and pe.program_day_id = pd.id
        and pd.program_id = p.id
        and p.user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const reorderProgramExercises = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { programDayId: number; orderedIds: number[] }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.programDayId} and p.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Gün bulunamadı.");
    for (let i = 0; i < data.orderedIds.length; i++) {
      await sql`
        update program_exercises set sort = ${i}
        where id = ${data.orderedIds[i]!} and program_day_id = ${data.programDayId}
      `;
    }
    return { ok: true };
  });
