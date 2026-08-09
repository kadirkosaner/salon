import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { addDaysISO, isoDow } from "@/lib/utils";
import { ensureUserSeeded } from "./seed";
import { v,
  isoDate,
  positiveId,
  workoutStatus,
  weightKg,
  reps,
  rir,
  sets,
  restSec,
  repRange,
  loadTag,
  optionalText,
  parseOrThrow, noInput } from "@/lib/validation";
import { z } from "zod";
import {
  emitPersonalRecordIfAny,
  emitWorkoutCompleted,
} from "./activity";

export type WorkoutSetRow = {
  id: number;
  set_index: number;
  weight: string | null;
  reps: number | null;
  rir: number | null;
  completed: boolean;
};

export type WorkoutExerciseRow = {
  id: number;
  exercise_id: number;
  exercise_name: string;
  detail: string | null;
  unit: string;
  muscle_group: string;
  target_sets: number;
  target_rep_lo: number;
  target_rep_hi: number;
  rest_sec: number;
  load_tag: string;
  note: string | null;
  sort: number;
  sets: WorkoutSetRow[];
  lastTime: {
    date: string;
    sets: { weight: number | null; reps: number | null }[];
  } | null;
  suggestedWeight: number | null;
};

export type WorkoutDetail = {
  id: number;
  date: string;
  program_day_id: number | null;
  day_name: string;
  status: string;
  notes: string | null;
  exercises: WorkoutExerciseRow[];
};

export const listWorkoutsInRange = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(z.object({ from: isoDate, to: isoDate })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);

    // Rolling fill: keep program days planned through the requested range
    // (and at least ~4 weeks ahead of today). Past history is never rewritten.
    try {
      await ensureRollingHorizon(sql, context.userId, {
        coverUntil: data.to,
      });
    } catch {
      // no active program or empty days — list still works
    }

    return sql<{
      id: number;
      date: string;
      day_name: string;
      status: string;
    }>`
      select id, date::text as date, day_name, status
      from workouts
      where user_id = ${context.userId}
        and date >= ${data.from}::date
        and date <= ${data.to}::date
      order by date
    `;
  });

export const getWorkoutByDate = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(v(isoDate))
  .handler(async ({ context, data: date }): Promise<WorkoutDetail | null> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    try {
      await ensureRollingHorizon(sql, context.userId, { coverUntil: date });
    } catch {
      /* ignore */
    }
    const rows = await sql<{ id: number }>`
      select id from workouts where user_id = ${context.userId} and date = ${date}::date
    `;
    if (rows.length === 0) return null;
    return loadWorkout(sql, rows[0]!.id, context.userId);
  });

export const createWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    date: isoDate,
    programDayId: positiveId.nullable().optional(),
  })))
  .handler(async ({ context, data }): Promise<WorkoutDetail> => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);

    const existing = await sql<{ id: number }>`
      select id from workouts where user_id = ${context.userId} and date = ${data.date}::date
    `;

    if (existing.length > 0) {
      const loaded = (await loadWorkout(sql, existing[0]!.id, context.userId))!;
      if (loaded.exercises.length > 0) return loaded;

      // Empty shell only — wipe and re-create when we can resolve a real program day
      let canFill = data.programDayId != null;
      if (!canFill) {
        const dow = isoDow(data.date);
        const day = await sql<{ id: number }>`
          select pd.id
          from program_days pd
          join programs p on p.id = pd.program_id
          where p.user_id = ${context.userId}
            and p.is_active = true
            and (p.valid_from is null or p.valid_from <= ${data.date}::date)
            and (p.valid_to is null or p.valid_to >= ${data.date}::date)
            and pd.dow = ${dow}
          limit 1
        `;
        canFill = day.length > 0;
      }
      if (!canFill) {
        throw new Error(
          "Bu seans boş ve program günü yok. Keşfet’ten program seç, sonra program gününü seç.",
        );
      }
      await sql`delete from workouts where id = ${loaded.id}`;
      return materializeWorkout(
        sql,
        context.userId,
        data.date,
        data.programDayId ?? null,
      );
    }

    return materializeWorkout(sql, context.userId, data.date, data.programDayId ?? null);
  });

export const updateWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    id: positiveId,
    status: workoutStatus.optional(),
    notes: optionalText(2000),
    day_name: z.string().trim().max(80).optional(),
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from workouts where id = ${data.id} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Antrenman bulunamadı.");
    if (data.status !== undefined) {
      await sql`update workouts set status = ${data.status} where id = ${data.id}`;
      if (data.status === "completed") {
        try {
          await emitWorkoutCompleted(sql, context.userId, data.id);
        } catch {
          /* non-fatal */
        }
      }
    }
    if (data.notes !== undefined) {
      await sql`update workouts set notes = ${data.notes} where id = ${data.id}`;
    }
    if (data.day_name !== undefined) {
      await sql`update workouts set day_name = ${data.day_name} where id = ${data.id}`;
    }
    return { ok: true };
  });

/**
 * Skip / reschedule:
 * - postpone_week: shift ALL planned sessions in that ISO week by +1 day
 * - skip_week: mark only this session skipped (not this week)
 * - tomorrow / next_free: kept as aliases → postpone_week for backwards compat
 */
export const skipWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    id: positiveId,
    mode: z.enum(["skip_week", "tomorrow", "next_free", "postpone_week"]),
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      date: string;
      program_day_id: number | null;
      day_name: string;
      status: string;
    }>`
      select id, date::text as date, program_day_id, day_name, status
      from workouts
      where id = ${data.id} and user_id = ${context.userId}
    `;
    if (rows.length === 0) throw new Error("Antrenman bulunamadı.");
    const w = rows[0]!;

    if (data.mode === "skip_week") {
      await sql`update workouts set status = 'skipped' where id = ${w.id}`;
      return {
        ok: true as const,
        mode: "skip_week" as const,
        newDate: null as string | null,
        shifted: 0,
      };
    }

    // Ertele: o haftadaki tüm planlı seanslar +1 gün
    const mode =
      data.mode === "postpone_week" ||
      data.mode === "tomorrow" ||
      data.mode === "next_free"
        ? "postpone_week"
        : data.mode;

    if (mode === "postpone_week") {
      const shifted = await postponeWeekByOneDay(sql, context.userId, w.date);
      // After shift, the same session content is on w.date+1
      const newDate = addDaysISO(w.date, 1);
      return {
        ok: true as const,
        mode: "postpone_week" as const,
        newDate,
        shifted,
      };
    }

    return {
      ok: true as const,
      mode: data.mode,
      newDate: null as string | null,
      shifted: 0,
    };
  });

/**
 * Shift every planned/in_progress workout in the ISO week (Mon–Sun)
 * containing `anchorDate` by +1 calendar day.
 * Completed/skipped sessions stay put.
 * Process from latest date first to avoid unique(date) collisions.
 */
async function postponeWeekByOneDay(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  anchorDate: string,
): Promise<number> {
  const dow = isoDow(anchorDate); // 1=Mon … 7=Sun
  const weekStart = addDaysISO(anchorDate, 1 - dow);
  const weekEnd = addDaysISO(weekStart, 6);

  const sessions = await sql<{
    id: number;
    date: string;
    status: string;
  }>`
    select id, date::text as date, status
    from workouts
    where user_id = ${userId}
      and date >= ${weekStart}::date
      and date <= ${weekEnd}::date
      and status in ('planned', 'in_progress')
    order by date desc, id desc
  `;

  if (sessions.length === 0) return 0;

  let shifted = 0;
  for (const s of sessions) {
    const target = addDaysISO(s.date, 1);

    // Target occupied?
    const occ = await sql<{ id: number; status: string }>`
      select id, status from workouts
      where user_id = ${userId} and date = ${target}::date and id != ${s.id}
    `;
    if (occ.length > 0) {
      const st = occ[0]!.status;
      if (st === "completed") {
        // Never overwrite a completed day — push this session further
        let free = addDaysISO(target, 1);
        for (let i = 0; i < 14; i++) {
          const hit = await sql<{ id: number; status: string }>`
            select id, status from workouts
            where user_id = ${userId} and date = ${free}::date
          `;
          if (hit.length === 0) break;
          if (
            hit[0]!.status === "planned" ||
            hit[0]!.status === "in_progress" ||
            hit[0]!.status === "skipped"
          ) {
            await sql`delete from workouts where id = ${hit[0]!.id}`;
            break;
          }
          // completed or other — keep searching
          free = addDaysISO(free, 1);
        }
        await sql`update workouts set date = ${free}::date where id = ${s.id}`;
        shifted += 1;
        continue;
      }
      // planned / skipped / in_progress on target — remove (will be re-placed if it was in week, already processed if later)
      await sql`delete from workouts where id = ${occ[0]!.id}`;
    }

    await sql`update workouts set date = ${target}::date where id = ${s.id}`;
    shifted += 1;
  }

  return shifted;
}

export const deleteWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from workouts where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });

/**
 * Delete only future planned/skipped sessions from today forward.
 * Completed (and past completed) history is never touched.
 */
export const clearFutureWorkouts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(noInput)
  .handler(async ({ context }) => {
    const sql = await getSql();
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const rows = await sql<{ id: number }>`
      delete from workouts
      where user_id = ${context.userId}
        and date >= ${todayIso}::date
        and status in ('planned', 'skipped')
      returning id
    `;
    return { deleted: rows.length };
  });

export const updateWorkoutSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    id: positiveId,
    weight: weightKg.optional(),
    reps: reps.optional(),
    rir: rir.optional(),
    completed: z.boolean().optional(),
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select ws.id from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where ws.id = ${data.id} and w.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Set bulunamadı.");
    if (data.weight !== undefined) {
      await sql`update workout_sets set weight = ${data.weight} where id = ${data.id}`;
    }
    if (data.reps !== undefined) {
      await sql`update workout_sets set reps = ${data.reps} where id = ${data.id}`;
    }
    if (data.rir !== undefined) {
      await sql`update workout_sets set rir = ${data.rir} where id = ${data.id}`;
    }
    let pr: {
      exercise_name: string;
      weight: number;
      prev_weight: number | null;
      unit: string;
    } | null = null;
    if (data.completed !== undefined) {
      await sql`update workout_sets set completed = ${data.completed} where id = ${data.id}`;
      if (data.completed) {
        const stats = await sql<{ total: number; done: number; workout_id: number }>`
          select count(*)::int as total,
                 count(*) filter (where ws2.completed)::int as done,
                 w.id as workout_id
          from workout_sets ws
          join workout_exercises we on we.id = ws.workout_exercise_id
          join workouts w on w.id = we.workout_id
          join workout_exercises we2 on we2.workout_id = w.id
          join workout_sets ws2 on ws2.workout_exercise_id = we2.id
          where ws.id = ${data.id}
          group by w.id
        `;
        try {
          pr = await emitPersonalRecordIfAny(sql, context.userId, data.id);
        } catch {
          /* non-fatal */
        }
        if (stats[0] && stats[0].total > 0 && stats[0].total === stats[0].done) {
          await sql`update workouts set status = 'completed' where id = ${stats[0].workout_id}`;
          try {
            await emitWorkoutCompleted(sql, context.userId, stats[0].workout_id);
          } catch {
            /* non-fatal */
          }
        } else if (stats[0]) {
          await sql`
            update workouts set status = 'planned'
            where id = ${stats[0].workout_id} and status = 'skipped'
          `;
        }
      }
    }
    return { ok: true as const, pr };
  });

export const addWorkoutExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    workoutId: positiveId,
    exerciseId: positiveId,
    sets: sets.optional(),
    rep_lo: repRange.optional(),
    rep_hi: repRange.optional(),
    rest_sec: restSec.optional(),
    load_tag: loadTag.optional(),
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from workouts where id = ${data.workoutId} and user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Antrenman bulunamadı.");
    const ex = await sql<{ name: string; detail: string | null; unit: string }>`
      select name, detail, unit from exercises
      where id = ${data.exerciseId}
        and (owner_id is null or owner_id = ${context.userId})
    `;
    if (ex.length === 0) throw new Error("Hareket bulunamadı.");
    const maxSort = await sql<{ m: number }>`
      select coalesce(max(sort), -1)::int as m from workout_exercises where workout_id = ${data.workoutId}
    `;
    const sets = data.sets ?? 3;
    const we = await sql<{ id: number }>`
      insert into workout_exercises (
        workout_id, exercise_id, exercise_name, detail, unit,
        target_sets, target_rep_lo, target_rep_hi, rest_sec, load_tag, sort
      ) values (
        ${data.workoutId}, ${data.exerciseId}, ${ex[0]!.name}, ${ex[0]!.detail}, ${ex[0]!.unit},
        ${sets}, ${data.rep_lo ?? 8}, ${data.rep_hi ?? 12}, ${data.rest_sec ?? 90},
        ${data.load_tag ?? "orta"}, ${(maxSort[0]?.m ?? -1) + 1}
      ) returning id
    `;
    for (let s = 1; s <= sets; s++) {
      await sql`
        insert into workout_sets (workout_exercise_id, set_index)
        values (${we[0]!.id}, ${s})
      `;
    }
    return { id: we[0]!.id };
  });

export const deleteWorkoutExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(positiveId))
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from workout_exercises we
      using workouts w
      where we.id = ${id} and we.workout_id = w.id and w.user_id = ${context.userId}
    `;
    return { ok: true };
  });

/** Swap a workout exercise for a similar/library alternative; keeps set rows. */
export const swapWorkoutExercise = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    workoutExerciseId: positiveId,
    newExerciseId: positiveId,
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql<{ id: number; workout_id: number }>`
      select we.id, we.workout_id
      from workout_exercises we
      join workouts w on w.id = we.workout_id
      where we.id = ${data.workoutExerciseId} and w.user_id = ${context.userId}
    `;
    if (owned.length === 0) throw new Error("Hareket bulunamadı.");

    const ex = await sql<{
      id: number;
      name: string;
      detail: string | null;
      unit: string;
    }>`
      select id, name, detail, unit from exercises
      where id = ${data.newExerciseId}
        and (owner_id is null or owner_id = ${context.userId})
    `;
    if (ex.length === 0) throw new Error("Yeni hareket bulunamadı.");

    await sql`
      update workout_exercises set
        exercise_id = ${ex[0]!.id},
        exercise_name = ${ex[0]!.name},
        detail = ${ex[0]!.detail},
        unit = ${ex[0]!.unit}
      where id = ${data.workoutExerciseId}
    `;

    return loadWorkout(sql, owned[0]!.workout_id, context.userId);
  });

/**
 * Write this session's exercise list onto the linked program day
 * (or active program day for that weekday). Future sessions use the new list.
 */
export const saveWorkoutToProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({ workoutId: positiveId })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const w = await sql<{
      id: number;
      date: string;
      program_day_id: number | null;
      day_name: string;
    }>`
      select id, date::text as date, program_day_id, day_name
      from workouts
      where id = ${data.workoutId} and user_id = ${context.userId}
    `;
    if (w.length === 0) throw new Error("Antrenman bulunamadı.");
    const workout = w[0]!;

    let programDayId = workout.program_day_id;
    if (programDayId == null) {
      const dow = isoDow(workout.date);
      const day = await sql<{ id: number }>`
        select pd.id
        from program_days pd
        join programs p on p.id = pd.program_id
        where p.user_id = ${context.userId}
          and p.is_active = true
          and pd.dow = ${dow}
        order by p.id desc
        limit 1
      `;
      if (day.length === 0) {
        const prog = await sql<{ id: number }>`
          select id from programs
          where user_id = ${context.userId} and is_active = true
          order by id desc limit 1
        `;
        if (prog.length === 0) {
          throw new Error("Aktif program yok. Önce Keşfet’ten program seç.");
        }
        const created = await sql<{ id: number }>`
          insert into program_days (program_id, dow, name, sort)
          values (
            ${prog[0]!.id},
            ${dow},
            ${workout.day_name || "Antrenman"},
            ${dow}
          )
          returning id
        `;
        programDayId = created[0]!.id;
      } else {
        programDayId = day[0]!.id;
      }
      await sql`
        update workouts set program_day_id = ${programDayId}
        where id = ${workout.id}
      `;
    }

    // Own the program day
    const ownedDay = await sql<{ id: number }>`
      select pd.id
      from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${programDayId} and p.user_id = ${context.userId}
    `;
    if (ownedDay.length === 0) throw new Error("Program günü bulunamadı.");

    const exercises = await sql<{
      exercise_id: number;
      detail: string | null;
      target_sets: number;
      target_rep_lo: number;
      target_rep_hi: number;
      rest_sec: number;
      load_tag: string;
      note: string | null;
      sort: number;
    }>`
      select exercise_id, detail, target_sets, target_rep_lo, target_rep_hi,
             rest_sec, load_tag, note, sort
      from workout_exercises
      where workout_id = ${workout.id}
      order by sort
    `;

    if (exercises.length === 0) {
      throw new Error("Seans boş — programa yazılacak hareket yok.");
    }

    await sql`delete from program_exercises where program_day_id = ${programDayId}`;

    for (const ex of exercises) {
      await sql`
        insert into program_exercises (
          program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
          rest_sec, load_tag, note, sort
        ) values (
          ${programDayId}, ${ex.exercise_id}, ${ex.detail},
          ${ex.target_sets}, ${ex.target_rep_lo}, ${ex.target_rep_hi},
          ${ex.rest_sec}, ${ex.load_tag}, ${ex.note}, ${ex.sort}
        )
      `;
    }

    await sql`
      update program_days set name = ${workout.day_name}
      where id = ${programDayId}
    `;

    return {
      ok: true as const,
      programDayId,
      exerciseCount: exercises.length,
    };
  });

/**
 * Rolling horizon filler.
 * - Never touches completed / skipped past sessions with exercises
 * - Only creates missing future (and empty-shell) days that have a program day
 * - Keeps at least `minAheadDays` from today filled, and always covers `coverUntil` if given
 * So the calendar continuously extends as time passes — not a one-shot "4 weeks dump".
 */
async function ensureRollingHorizon(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  opts?: { coverUntil?: string; minAheadDays?: number; fromDate?: string },
): Promise<{ created: number; replaced: number }> {
  const minAhead = opts?.minAheadDays ?? 28;
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const hasProgram = await sql<{ id: number }>`
    select id from programs
    where user_id = ${userId} and is_active = true
    limit 1
  `;
  if (hasProgram.length === 0) {
    return { created: 0, replaced: 0 };
  }

  // Start: today (or explicit), never rewrite deep past for auto-fill
  // Allow fromDate for manual "fill from X" but default is today
  let start = opts?.fromDate && opts.fromDate > todayStr ? opts.fromDate : todayStr;
  if (opts?.fromDate && opts.fromDate <= todayStr) {
    // Manual backfill of empty recent days only (e.g. last 3 days) — max 7 days back
    const maxBack = addDaysISO(todayStr, -7);
    start = opts.fromDate < maxBack ? maxBack : opts.fromDate;
  }

  // End: max(today + minAhead, coverUntil, lastExistingFuture + minAhead/2)
  let end = addDaysISO(todayStr, minAhead);
  if (opts?.coverUntil && opts.coverUntil > end) end = opts.coverUntil;

  const lastFuture = await sql<{ d: string | null }>`
    select max(date)::text as d from workouts
    where user_id = ${userId}
      and date >= ${todayStr}::date
      and status in ('planned', 'in_progress')
  `;
  if (lastFuture[0]?.d) {
    // If already have plans, still ensure at least minAhead from today
    // (end already set). When user scrolls further, coverUntil extends end.
  }

  // --- Bulk horizon fill (O(1) SQL, no per-day round-trips) ---

  // 1) Drop hollow shells (planned/in_progress with zero exercises)
  const hollow = await sql<{ id: number }>`
    delete from workouts w
    where w.user_id = ${userId}
      and w.date >= ${start}::date
      and w.date <= ${end}::date
      and w.status not in ('completed', 'skipped')
      and not exists (
        select 1 from workout_exercises we where we.workout_id = w.id
      )
    returning w.id
  `;
  const replaced = hollow.length;

  // 2) Insert missing workout rows for active program days in range
  const createdRows = await sql<{ id: number }>`
    with series as (
      select gs::date as d,
             extract(isodow from gs)::int as dow
      from generate_series(${start}::date, ${end}::date, interval '1 day') as gs
    ),
    active_days as (
      select distinct on (pd.dow)
        pd.id as program_day_id,
        pd.name as day_name,
        pd.dow,
        p.valid_from,
        p.valid_to
      from program_days pd
      join programs p on p.id = pd.program_id
      where p.user_id = ${userId}
        and p.is_active = true
      order by pd.dow, p.id desc
    ),
    wanted as (
      select s.d, ad.program_day_id, ad.day_name
      from series s
      join active_days ad on ad.dow = s.dow
      where (ad.valid_from is null or ad.valid_from <= s.d)
        and (ad.valid_to is null or ad.valid_to >= s.d)
        and not exists (
          select 1 from workouts w
          where w.user_id = ${userId} and w.date = s.d
        )
    )
    insert into workouts (user_id, date, program_day_id, day_name, status)
    select ${userId}, wanted.d, wanted.program_day_id, wanted.day_name, 'planned'
    from wanted
    returning id
  `;
  const created = createdRows.length;

  // 3) Materialize exercises for any planned workout in range still missing rows
  await sql`
    insert into workout_exercises (
      workout_id, exercise_id, exercise_name, detail, unit,
      target_sets, target_rep_lo, target_rep_hi, rest_sec, load_tag, note, sort
    )
    select
      w.id,
      pe.exercise_id,
      e.name,
      coalesce(pe.detail, e.detail),
      coalesce(e.unit, 'kg'),
      pe.sets,
      pe.rep_lo,
      pe.rep_hi,
      pe.rest_sec,
      pe.load_tag,
      pe.note,
      pe.sort
    from workouts w
    join program_exercises pe on pe.program_day_id = w.program_day_id
    join exercises e on e.id = pe.exercise_id
    where w.user_id = ${userId}
      and w.date >= ${start}::date
      and w.date <= ${end}::date
      and w.program_day_id is not null
      and not exists (
        select 1 from workout_exercises we where we.workout_id = w.id
      )
  `;

  // 4) Generate sets for exercises that have none
  await sql`
    insert into workout_sets (workout_exercise_id, set_index)
    select we.id, gs
    from workout_exercises we
    join workouts w on w.id = we.workout_id
    cross join lateral generate_series(1, greatest(we.target_sets, 1)) as gs
    where w.user_id = ${userId}
      and w.date >= ${start}::date
      and w.date <= ${end}::date
      and not exists (
        select 1 from workout_sets ws where ws.workout_exercise_id = we.id
      )
  `;

  return { created, replaced };
}

/**
 * Manual / clone entry: extends rolling horizon.
 * `weeks` kept for API compat — maps to minAheadDays = weeks * 7.
 */
export const generateWorkouts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    fromDate: isoDate.optional(),
    weeks: z.number().int().min(1).max(52).optional(),
    untilDate: isoDate.optional(),
  })))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);

    const weeks = data.weeks ?? 4;
    const minAheadDays = Math.max(weeks * 7, 28);
    return ensureRollingHorizon(sql, context.userId, {
      fromDate: data.fromDate,
      minAheadDays,
      coverUntil: data.untilDate,
    });
  });

/** Explicit ensure for clients that only open a far future date */
export const ensureWorkoutHorizon = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.object({
    untilDate: isoDate.optional(),
    daysAhead: z.number().int().min(1).max(120).optional(),
  }).default({})))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    return ensureRollingHorizon(sql, context.userId, {
      coverUntil: data.untilDate,
      minAheadDays: data.daysAhead ?? 28,
    });
  });

async function materializeWorkout(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  date: string,
  programDayId: number | null,
): Promise<WorkoutDetail> {
  let dayName = "Antrenman";
  let resolvedDayId = programDayId;
  let programExercises: Array<{
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
  }> = [];

  if (resolvedDayId == null) {
    const dow = isoDow(date);
    const day = await sql<{ id: number; name: string }>`
      select pd.id, pd.name
      from program_days pd
      join programs p on p.id = pd.program_id
      where p.user_id = ${userId}
        and p.is_active = true
        and (p.valid_from is null or p.valid_from <= ${date}::date)
        and (p.valid_to is null or p.valid_to >= ${date}::date)
        and pd.dow = ${dow}
      order by p.id desc
      limit 1
    `;
    if (day.length > 0) {
      resolvedDayId = day[0]!.id;
      dayName = day[0]!.name;
    }
  } else {
    const day = await sql<{ id: number; name: string }>`
      select pd.id, pd.name
      from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${resolvedDayId} and p.user_id = ${userId}
    `;
    if (day.length === 0) throw new Error("Program günü bulunamadı.");
    dayName = day[0]!.name;
  }

  if (resolvedDayId != null) {
    programExercises = await sql`
      select pe.exercise_id, e.name as exercise_name,
             coalesce(pe.detail, e.detail) as detail, e.unit,
             pe.sets, pe.rep_lo, pe.rep_hi, pe.rest_sec, pe.load_tag, pe.note, pe.sort
      from program_exercises pe
      join exercises e on e.id = pe.exercise_id
      where pe.program_day_id = ${resolvedDayId}
      order by pe.sort
    `;
  }

  // Never create hollow sessions — user thinks "add failed"
  if (programExercises.length === 0) {
    if (resolvedDayId == null) {
      throw new Error(
        "Aktif programın yok veya bu güne program atanmamış. Keşfet’ten program seç, sonra program gününü seçerek oluştur.",
      );
    }
    throw new Error(
      "Bu program gününde hareket yok. Program’dan hareket ekle, sonra tekrar dene.",
    );
  }

  const w = await sql<{ id: number }>`
    insert into workouts (user_id, date, program_day_id, day_name, status)
    values (${userId}, ${date}::date, ${resolvedDayId}, ${dayName}, 'planned')
    returning id
  `;
  const workoutId = w[0]!.id;

  // Set-based copy of program exercises → workout_exercises
  await sql`
    insert into workout_exercises (
      workout_id, exercise_id, exercise_name, detail, unit,
      target_sets, target_rep_lo, target_rep_hi, rest_sec, load_tag, note, sort
    )
    select
      ${workoutId},
      pe.exercise_id,
      e.name,
      coalesce(pe.detail, e.detail),
      coalesce(e.unit, 'kg'),
      pe.sets,
      pe.rep_lo,
      pe.rep_hi,
      pe.rest_sec,
      pe.load_tag,
      pe.note,
      pe.sort
    from program_exercises pe
    join exercises e on e.id = pe.exercise_id
    where pe.program_day_id = ${resolvedDayId}
    order by pe.sort
  `;

  // Generate sets from target_sets in one insert
  await sql`
    insert into workout_sets (workout_exercise_id, set_index)
    select we.id, gs
    from workout_exercises we
    cross join lateral generate_series(1, we.target_sets) as gs
    where we.workout_id = ${workoutId}
  `;

  return (await loadWorkout(sql, workoutId, userId))!;
}

async function loadWorkout(
  sql: Awaited<ReturnType<typeof getSql>>,
  workoutId: number,
  userId: string,
): Promise<WorkoutDetail | null> {
  const rows = await sql<{
    id: number;
    date: string;
    program_day_id: number | null;
    day_name: string;
    status: string;
    notes: string | null;
  }>`
    select id, date::text as date, program_day_id, day_name, status, notes
    from workouts where id = ${workoutId} and user_id = ${userId}
  `;
  if (rows.length === 0) return null;
  const w = rows[0]!;

  const exercises = await sql<{
    id: number;
    exercise_id: number;
    exercise_name: string;
    detail: string | null;
    unit: string;
    muscle_group: string;
    target_sets: number;
    target_rep_lo: number;
    target_rep_hi: number;
    rest_sec: number;
    load_tag: string;
    note: string | null;
    sort: number;
  }>`
    select we.id, we.exercise_id, we.exercise_name, we.detail, we.unit,
           coalesce(e.muscle_group, 'diger') as muscle_group,
           we.target_sets, we.target_rep_lo, we.target_rep_hi, we.rest_sec,
           we.load_tag, we.note, we.sort
    from workout_exercises we
    left join exercises e on e.id = we.exercise_id
    where we.workout_id = ${workoutId}
    order by we.sort
  `;

  // Batch all sets for this workout (1 query instead of N)
  const allSets = await sql<WorkoutSetRow & { workout_exercise_id: number }>`
    select ws.id, ws.set_index, ws.weight::text as weight, ws.reps, ws.rir, ws.completed,
           ws.workout_exercise_id
    from workout_sets ws
    join workout_exercises we on we.id = ws.workout_exercise_id
    where we.workout_id = ${workoutId}
    order by ws.workout_exercise_id, ws.set_index
  `;
  const setsByEx = new Map<number, WorkoutSetRow[]>();
  for (const s of allSets) {
    const row: WorkoutSetRow = {
      id: s.id,
      set_index: s.set_index,
      weight: s.weight,
      reps: s.reps,
      rir: s.rir,
      completed: s.completed,
    };
    const list = setsByEx.get(s.workout_exercise_id) ?? [];
    list.push(row);
    setsByEx.set(s.workout_exercise_id, list);
  }

  // Last completed session per exercise_id (2 queries total, not 2N)
  const exerciseIds = exercises.map((e) => e.exercise_id);
  const lastByEx = new Map<
    number,
    { date: string; sets: { weight: number | null; reps: number | null }[] }
  >();
  if (exerciseIds.length > 0) {
    // Distinct last date per exercise_id via lateral-friendly subquery
    const lastDates = await sql<{ exercise_id: number; date: string }>`
      select we2.exercise_id, max(w2.date)::text as date
      from workouts w2
      join workout_exercises we2 on we2.workout_id = w2.id
      where w2.user_id = ${userId}
        and w2.date < ${w.date}::date
        and w2.status = 'completed'
        and we2.exercise_id in (
          select we.exercise_id from workout_exercises we
          where we.workout_id = ${workoutId}
        )
      group by we2.exercise_id
    `;
    if (lastDates.length > 0) {
      const lastSets = await sql<{
        exercise_id: number;
        date: string;
        weight: string | null;
        reps: number | null;
        set_index: number;
      }>`
        select we.exercise_id, w2.date::text as date,
               ws.weight::text as weight, ws.reps, ws.set_index
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        join workouts w2 on w2.id = we.workout_id
        where w2.user_id = ${userId}
          and w2.status = 'completed'
          and we.exercise_id in (
            select we0.exercise_id from workout_exercises we0
            where we0.workout_id = ${workoutId}
          )
          and (we.exercise_id, w2.date) in (
            select we2.exercise_id, max(w2b.date)
            from workouts w2b
            join workout_exercises we2 on we2.workout_id = w2b.id
            where w2b.user_id = ${userId}
              and w2b.date < ${w.date}::date
              and w2b.status = 'completed'
              and we2.exercise_id in (
                select we0.exercise_id from workout_exercises we0
                where we0.workout_id = ${workoutId}
              )
            group by we2.exercise_id
          )
        order by we.exercise_id, ws.set_index
      `;
      for (const s of lastSets) {
        const cur = lastByEx.get(s.exercise_id) ?? { date: s.date, sets: [] };
        cur.date = s.date;
        cur.sets.push({
          weight: s.weight != null ? Number(s.weight) : null,
          reps: s.reps,
        });
        lastByEx.set(s.exercise_id, cur);
      }
      void lastDates;
    }
  }

  const result: WorkoutExerciseRow[] = exercises.map((ex) => {
    const sets = setsByEx.get(ex.id) ?? [];
    const last = lastByEx.get(ex.exercise_id) ?? null;
    let suggestedWeight: number | null = null;
    let lastTime: WorkoutExerciseRow["lastTime"] = null;
    if (last) {
      lastTime = { date: last.date, sets: last.sets };
      const maxW = Math.max(
        ...last.sets.map((s) => (s.weight != null ? s.weight : 0)),
        0,
      );
      if (maxW > 0) {
        const allTop =
          last.sets.length > 0 &&
          last.sets.every((s) => s.reps != null && s.reps >= ex.target_rep_hi);
        suggestedWeight = allTop
          ? Math.round((maxW * 1.025) / 2.5) * 2.5
          : maxW;
      }
    }
    return { ...ex, sets, lastTime, suggestedWeight };
  });

  return {
    id: w.id,
    date: w.date,
    program_day_id: w.program_day_id,
    day_name: w.day_name,
    status: w.status,
    notes: w.notes,
    exercises: result,
  };
}
