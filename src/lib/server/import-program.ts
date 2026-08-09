import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";
import { matchExerciseName, parseProgramText } from "@/lib/program-parser";
import { todayForUser } from "./time";
import { v, optionalString } from "@/lib/validation";
import { z } from "zod";

export const previewProgramImport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(v(z.string().trim().min(1).max(50_000)))
  .handler(async ({ context, data: text }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const lib = await sql<{ id: number; name: string }>`
      select id, name from exercises
      where owner_id is null or owner_id = ${context.userId}
    `;
    const parsed = parseProgramText(text);
    return {
      programName: parsed.programName,
      days: parsed.days.map((d) => ({
        dow: d.dow,
        name: d.name,
        focus: d.focus,
        exercises: d.exercises.map((e) => {
          const m = matchExerciseName(e.name, lib);
          return {
            name: e.name,
            matched: m?.name ?? null,
            sets: e.sets,
            rep_lo: e.rep_lo,
            rep_hi: e.rep_hi,
            rest_sec: e.rest_sec,
            load_tag: e.load_tag,
          };
        }),
      })),
      unmatched: parsed.unmatched,
      warnings: parsed.warnings,
    };
  });

export type ImportPreview = Awaited<ReturnType<typeof previewProgramImport>>;

export const commitProgramImport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    v(
      z.object({
        text: z.string().trim().min(1).max(50_000),
        programName: optionalString(80),
        replaceActive: z.boolean().optional(),
      }),
    ),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureUserSeeded(sql, context.userId);
    const parsed = parseProgramText(data.text);
    if (parsed.days.length === 0) {
      throw new Error(
        "Program algılanamadı. Her satıra bir hareket yaz (örn. Bench Press 4x8-10 120s).",
      );
    }

    const lib = await sql<{ id: number; name: string }>`
      select id, name from exercises
      where owner_id is null or owner_id = ${context.userId}
    `;

    const name = (data.programName?.trim() || parsed.programName || "Kişisel Program").slice(
      0,
      80,
    );

    return withTransaction(async (sql) => {
      if (data.replaceActive !== false) {
        await sql`
          update workouts set program_day_id = null
          where user_id = ${context.userId}
        `;
        await sql`delete from programs where user_id = ${context.userId}`;
        // Drop orphan future shells (same as clone/abandon) so calendar refills
        const todayIso = await todayForUser(sql, context.userId);
        await sql`
          delete from workouts
          where user_id = ${context.userId}
            and date >= ${todayIso}::date
            and status in ('planned', 'skipped', 'in_progress')
        `;
      }

      const prog = await sql<{ id: number }>`
        insert into programs (user_id, name, is_active, valid_from)
        values (${context.userId}, ${name}, true, '2000-01-01'::date)
        returning id
      `;
      const programId = prog[0]!.id;

      // Resolve exercise ids first (create custom ones if needed)
      type ResolvedEx = {
        dayIndex: number;
        sort: number;
        exerciseId: number;
        detail: string | null;
        sets: number;
        rep_lo: number;
        rep_hi: number;
        rest_sec: number;
        load_tag: string;
        note: string | null;
      };
      const resolved: ResolvedEx[] = [];
      const customNames = new Map<string, number>(); // lower name → id

      for (let di = 0; di < parsed.days.length; di++) {
        const day = parsed.days[di]!;
        for (let ei = 0; ei < day.exercises.length; ei++) {
          const pe = day.exercises[ei]!;
          const matched = matchExerciseName(pe.name, lib);
          let exerciseId = matched?.id;
          if (!exerciseId) {
            const key = pe.name.toLowerCase();
            if (customNames.has(key)) {
              exerciseId = customNames.get(key)!;
            } else {
              const created = await sql<{ id: number }>`
                insert into exercises (owner_id, name, unit, muscle_group)
                values (${context.userId}, ${pe.name}, 'kg', 'diger')
                returning id
              `;
              exerciseId = created[0]!.id;
              customNames.set(key, exerciseId);
              lib.push({ id: exerciseId, name: pe.name });
            }
          }
          resolved.push({
            dayIndex: di,
            sort: ei,
            exerciseId,
            detail: pe.detail,
            sets: pe.sets,
            rep_lo: pe.rep_lo,
            rep_hi: pe.rep_hi,
            rest_sec: pe.rest_sec,
            load_tag: pe.load_tag,
            note: pe.note,
          });
        }
      }

      // Bulk insert days
      {
        const values: unknown[] = [];
        const placeholders: string[] = [];
        let p = 1;
        for (let di = 0; di < parsed.days.length; di++) {
          const day = parsed.days[di]!;
          placeholders.push(
            `($${p++}, $${p++}, $${p++}, $${p++}, $${p++})`,
          );
          values.push(programId, day.dow, day.name, day.focus, di);
        }
        if (placeholders.length > 0) {
          await sql.query(
            `insert into program_days (program_id, dow, name, focus, sort)
             values ${placeholders.join(", ")}`,
            values,
          );
        }
      }

      // Map day sort → program_day id
      const dayRows = await sql<{ id: number; sort: number }>`
        select id, sort from program_days
        where program_id = ${programId}
        order by sort
      `;
      const dayIdBySort = new Map(dayRows.map((r) => [r.sort, r.id]));

      // Bulk insert all program_exercises
      if (resolved.length > 0) {
        const values: unknown[] = [];
        const placeholders: string[] = [];
        let p = 1;
        for (const r of resolved) {
          const dayId = dayIdBySort.get(r.dayIndex);
          if (dayId == null) continue;
          placeholders.push(
            `($${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++}, $${p++})`,
          );
          values.push(
            dayId,
            r.exerciseId,
            r.detail,
            r.sets,
            r.rep_lo,
            r.rep_hi,
            r.rest_sec,
            r.load_tag,
            r.note,
            r.sort,
          );
        }
        if (placeholders.length > 0) {
          await sql.query(
            `insert into program_exercises (
              program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
              rest_sec, load_tag, note, sort
            ) values ${placeholders.join(", ")}`,
            values,
          );
        }
      }

      return {
        id: programId,
        name,
        days: parsed.days.length,
        exercises: resolved.length,
      };
    });
  });
