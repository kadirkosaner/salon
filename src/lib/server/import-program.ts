import { createServerFn } from "@tanstack/react-start";
import { getSql, withTransaction } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureUserSeeded } from "./seed";
import { matchExerciseName, parseProgramText } from "@/lib/program-parser";
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
      }

      const prog = await sql<{ id: number }>`
        insert into programs (user_id, name, is_active, valid_from)
        values (${context.userId}, ${name}, true, '2000-01-01'::date)
        returning id
      `;
      const programId = prog[0]!.id;
      let totalExercises = 0;

      for (let di = 0; di < parsed.days.length; di++) {
        const day = parsed.days[di]!;
        const dayRow = await sql<{ id: number }>`
          insert into program_days (program_id, dow, name, focus, sort)
          values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
          returning id
        `;
        const dayId = dayRow[0]!.id;

        for (let ei = 0; ei < day.exercises.length; ei++) {
          const pe = day.exercises[ei]!;
          const matched = matchExerciseName(pe.name, lib);
          let exerciseId = matched?.id;
          if (!exerciseId) {
            const created = await sql<{ id: number }>`
              insert into exercises (owner_id, name, unit, muscle_group)
              values (${context.userId}, ${pe.name}, 'kg', 'diger')
              returning id
            `;
            exerciseId = created[0]!.id;
            lib.push({ id: exerciseId, name: pe.name });
          }

          await sql`
            insert into program_exercises (
              program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
              rest_sec, load_tag, note, sort
            ) values (
              ${dayId}, ${exerciseId}, ${pe.detail},
              ${pe.sets}, ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec},
              ${pe.load_tag}, ${pe.note}, ${ei}
            )
          `;
          totalExercises += 1;
        }
      }

      return {
        id: programId,
        name,
        days: parsed.days.length,
        exercises: totalExercises,
      };
    });
  });
