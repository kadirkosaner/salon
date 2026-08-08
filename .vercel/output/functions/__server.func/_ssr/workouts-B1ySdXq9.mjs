import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CTxDUoTG.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { t as authMiddleware } from "./validation-y1g7FGMs.mjs";
import { ensureUserSeeded } from "./seed-CsjEKKCE.mjs";
import { a as isoDow, t as addDaysISO } from "./utils-BtReAY3a.mjs";
import { a as emitWorkoutCompleted, r as emitPersonalRecordIfAny } from "./activity-DRd5c8gl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workouts-B1ySdXq9.js
var listWorkoutsInRange_createServerFn_handler = createServerRpc({
	id: "c470ce496b95c9afdde529cbf005d46ee94dc975539d9b6621c922d51795a182",
	name: "listWorkoutsInRange",
	filename: "src/lib/server/workouts.ts"
}, (opts) => listWorkoutsInRange.__executeServer(opts));
var listWorkoutsInRange = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listWorkoutsInRange_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	try {
		await ensureRollingHorizon(sql, context.userId, { coverUntil: data.to });
	} catch {}
	return sql`
      select id, date::text as date, day_name, status
      from workouts
      where user_id = ${context.userId}
        and date >= ${data.from}::date
        and date <= ${data.to}::date
      order by date
    `;
});
var getWorkoutByDate_createServerFn_handler = createServerRpc({
	id: "879445236f81bc8637c1953d8ef815391e749af0f994bc78513ce6f22c30c6f9",
	name: "getWorkoutByDate",
	filename: "src/lib/server/workouts.ts"
}, (opts) => getWorkoutByDate.__executeServer(opts));
var getWorkoutByDate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((date) => date).handler(getWorkoutByDate_createServerFn_handler, async ({ context, data: date }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	try {
		await ensureRollingHorizon(sql, context.userId, { coverUntil: date });
	} catch {}
	const rows = await sql`
      select id from workouts where user_id = ${context.userId} and date = ${date}::date
    `;
	if (rows.length === 0) return null;
	return loadWorkout(sql, rows[0].id, context.userId);
});
var createWorkout_createServerFn_handler = createServerRpc({
	id: "e182973a651642b29b1973d1c35de9338c54625555633269f5cc40ea83ace408",
	name: "createWorkout",
	filename: "src/lib/server/workouts.ts"
}, (opts) => createWorkout.__executeServer(opts));
var createWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createWorkout_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const existing = await sql`
      select id from workouts where user_id = ${context.userId} and date = ${data.date}::date
    `;
	if (existing.length > 0) {
		const loaded = await loadWorkout(sql, existing[0].id, context.userId);
		if (loaded.exercises.length > 0) return loaded;
		let canFill = data.programDayId != null;
		if (!canFill) {
			const dow = isoDow(data.date);
			canFill = (await sql`
          select pd.id
          from program_days pd
          join programs p on p.id = pd.program_id
          where p.user_id = ${context.userId}
            and p.is_active = true
            and (p.valid_from is null or p.valid_from <= ${data.date}::date)
            and (p.valid_to is null or p.valid_to >= ${data.date}::date)
            and pd.dow = ${dow}
          limit 1
        `).length > 0;
		}
		if (!canFill) throw new Error("Bu seans boş ve program günü yok. Keşfet’ten program seç, sonra program gününü seç.");
		await sql`delete from workouts where id = ${loaded.id}`;
		return materializeWorkout(sql, context.userId, data.date, data.programDayId ?? null);
	}
	return materializeWorkout(sql, context.userId, data.date, data.programDayId ?? null);
});
var updateWorkout_createServerFn_handler = createServerRpc({
	id: "5740b898ff2b8a3912750e367ca6d84cec314df9865bdec0573f089208464972",
	name: "updateWorkout",
	filename: "src/lib/server/workouts.ts"
}, (opts) => updateWorkout.__executeServer(opts));
var updateWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateWorkout_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from workouts where id = ${data.id} and user_id = ${context.userId}
    `).length === 0) throw new Error("Antrenman bulunamadı.");
	if (data.status !== void 0) {
		await sql`update workouts set status = ${data.status} where id = ${data.id}`;
		if (data.status === "completed") try {
			await emitWorkoutCompleted(sql, context.userId, data.id);
		} catch {}
	}
	if (data.notes !== void 0) await sql`update workouts set notes = ${data.notes} where id = ${data.id}`;
	if (data.day_name !== void 0) await sql`update workouts set day_name = ${data.day_name} where id = ${data.id}`;
	return { ok: true };
});
var skipWorkout_createServerFn_handler = createServerRpc({
	id: "8a6ef6d33b6ce0ad083bb720c90041620b058b1a4a1f936e060e6dc4cd22ad71",
	name: "skipWorkout",
	filename: "src/lib/server/workouts.ts"
}, (opts) => skipWorkout.__executeServer(opts));
var skipWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(skipWorkout_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const rows = await sql`
      select id, date::text as date, program_day_id, day_name, status
      from workouts
      where id = ${data.id} and user_id = ${context.userId}
    `;
	if (rows.length === 0) throw new Error("Antrenman bulunamadı.");
	const w = rows[0];
	if (data.mode === "skip_week") {
		await sql`update workouts set status = 'skipped' where id = ${w.id}`;
		return {
			ok: true,
			mode: "skip_week",
			newDate: null,
			shifted: 0
		};
	}
	if ((data.mode === "postpone_week" || data.mode === "tomorrow" || data.mode === "next_free" ? "postpone_week" : data.mode) === "postpone_week") {
		const shifted = await postponeWeekByOneDay(sql, context.userId, w.date);
		return {
			ok: true,
			mode: "postpone_week",
			newDate: addDaysISO(w.date, 1),
			shifted
		};
	}
	return {
		ok: true,
		mode: data.mode,
		newDate: null,
		shifted: 0
	};
});
/**
* Shift every planned/in_progress workout in the ISO week (Mon–Sun)
* containing `anchorDate` by +1 calendar day.
* Completed/skipped sessions stay put.
* Process from latest date first to avoid unique(date) collisions.
*/
async function postponeWeekByOneDay(sql, userId, anchorDate) {
	const dow = isoDow(anchorDate);
	const weekStart = addDaysISO(anchorDate, 1 - dow);
	const sessions = await sql`
    select id, date::text as date, status
    from workouts
    where user_id = ${userId}
      and date >= ${weekStart}::date
      and date <= ${addDaysISO(weekStart, 6)}::date
      and status in ('planned', 'in_progress')
    order by date desc, id desc
  `;
	if (sessions.length === 0) return 0;
	let shifted = 0;
	for (const s of sessions) {
		const target = addDaysISO(s.date, 1);
		const occ = await sql`
      select id, status from workouts
      where user_id = ${userId} and date = ${target}::date and id != ${s.id}
    `;
		if (occ.length > 0) {
			if (occ[0].status === "completed") {
				let free = addDaysISO(target, 1);
				for (let i = 0; i < 14; i++) {
					const hit = await sql`
            select id, status from workouts
            where user_id = ${userId} and date = ${free}::date
          `;
					if (hit.length === 0) break;
					if (hit[0].status === "planned" || hit[0].status === "in_progress" || hit[0].status === "skipped") {
						await sql`delete from workouts where id = ${hit[0].id}`;
						break;
					}
					free = addDaysISO(free, 1);
				}
				await sql`update workouts set date = ${free}::date where id = ${s.id}`;
				shifted += 1;
				continue;
			}
			await sql`delete from workouts where id = ${occ[0].id}`;
		}
		await sql`update workouts set date = ${target}::date where id = ${s.id}`;
		shifted += 1;
	}
	return shifted;
}
var deleteWorkout_createServerFn_handler = createServerRpc({
	id: "124a8196e107618fd2bfc73f3170758380308d2a732d8b12b09d6b2fdf3b1923",
	name: "deleteWorkout",
	filename: "src/lib/server/workouts.ts"
}, (opts) => deleteWorkout.__executeServer(opts));
var deleteWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteWorkout_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`delete from workouts where id = ${id} and user_id = ${context.userId}`;
	return { ok: true };
});
var clearFutureWorkouts_createServerFn_handler = createServerRpc({
	id: "3ed198a712ba243748c19883d294a55c8673b5cb99729de6cea884039eec9619",
	name: "clearFutureWorkouts",
	filename: "src/lib/server/workouts.ts"
}, (opts) => clearFutureWorkouts.__executeServer(opts));
var clearFutureWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(clearFutureWorkouts_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const today = /* @__PURE__ */ new Date();
	const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
	return { deleted: (await sql`
      delete from workouts
      where user_id = ${context.userId}
        and date >= ${todayIso}::date
        and status in ('planned', 'skipped')
      returning id
    `).length };
});
var updateWorkoutSet_createServerFn_handler = createServerRpc({
	id: "0aa88f3b0eabf3b1b7d35bdf0f95f7c192faaecdbe09741c3383e9a4cd53c14a",
	name: "updateWorkoutSet",
	filename: "src/lib/server/workouts.ts"
}, (opts) => updateWorkoutSet.__executeServer(opts));
var updateWorkoutSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateWorkoutSet_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select ws.id from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where ws.id = ${data.id} and w.user_id = ${context.userId}
    `).length === 0) throw new Error("Set bulunamadı.");
	if (data.weight !== void 0) await sql`update workout_sets set weight = ${data.weight} where id = ${data.id}`;
	if (data.reps !== void 0) await sql`update workout_sets set reps = ${data.reps} where id = ${data.id}`;
	if (data.rir !== void 0) await sql`update workout_sets set rir = ${data.rir} where id = ${data.id}`;
	let pr = null;
	if (data.completed !== void 0) {
		await sql`update workout_sets set completed = ${data.completed} where id = ${data.id}`;
		if (data.completed) {
			const stats = await sql`
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
			} catch {}
			if (stats[0] && stats[0].total > 0 && stats[0].total === stats[0].done) {
				await sql`update workouts set status = 'completed' where id = ${stats[0].workout_id}`;
				try {
					await emitWorkoutCompleted(sql, context.userId, stats[0].workout_id);
				} catch {}
			} else if (stats[0]) await sql`
            update workouts set status = 'planned'
            where id = ${stats[0].workout_id} and status = 'skipped'
          `;
		}
	}
	return {
		ok: true,
		pr
	};
});
var addWorkoutExercise_createServerFn_handler = createServerRpc({
	id: "da6f4422ac456ec8d3de4e92022c49907399b21f4818e1991f97c80565997136",
	name: "addWorkoutExercise",
	filename: "src/lib/server/workouts.ts"
}, (opts) => addWorkoutExercise.__executeServer(opts));
var addWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addWorkoutExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from workouts where id = ${data.workoutId} and user_id = ${context.userId}
    `).length === 0) throw new Error("Antrenman bulunamadı.");
	const ex = await sql`
      select name, detail, unit from exercises
      where id = ${data.exerciseId}
        and (owner_id is null or owner_id = ${context.userId})
    `;
	if (ex.length === 0) throw new Error("Hareket bulunamadı.");
	const maxSort = await sql`
      select coalesce(max(sort), -1)::int as m from workout_exercises where workout_id = ${data.workoutId}
    `;
	const sets = data.sets ?? 3;
	const we = await sql`
      insert into workout_exercises (
        workout_id, exercise_id, exercise_name, detail, unit,
        target_sets, target_rep_lo, target_rep_hi, rest_sec, load_tag, sort
      ) values (
        ${data.workoutId}, ${data.exerciseId}, ${ex[0].name}, ${ex[0].detail}, ${ex[0].unit},
        ${sets}, ${data.rep_lo ?? 8}, ${data.rep_hi ?? 12}, ${data.rest_sec ?? 90},
        ${data.load_tag ?? "orta"}, ${(maxSort[0]?.m ?? -1) + 1}
      ) returning id
    `;
	for (let s = 1; s <= sets; s++) await sql`
        insert into workout_sets (workout_exercise_id, set_index)
        values (${we[0].id}, ${s})
      `;
	return { id: we[0].id };
});
var deleteWorkoutExercise_createServerFn_handler = createServerRpc({
	id: "d15162f3aac5ef71e27a4432278e1b880f9f5a5acf078e52eb9a73b92685b5a8",
	name: "deleteWorkoutExercise",
	filename: "src/lib/server/workouts.ts"
}, (opts) => deleteWorkoutExercise.__executeServer(opts));
var deleteWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteWorkoutExercise_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from workout_exercises we
      using workouts w
      where we.id = ${id} and we.workout_id = w.id and w.user_id = ${context.userId}
    `;
	return { ok: true };
});
var swapWorkoutExercise_createServerFn_handler = createServerRpc({
	id: "0fd7ffd0ad309e1a3b86498de81aa8d817b86201e8a02ebe9b35898dbf514be0",
	name: "swapWorkoutExercise",
	filename: "src/lib/server/workouts.ts"
}, (opts) => swapWorkoutExercise.__executeServer(opts));
var swapWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(swapWorkoutExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const owned = await sql`
      select we.id, we.workout_id
      from workout_exercises we
      join workouts w on w.id = we.workout_id
      where we.id = ${data.workoutExerciseId} and w.user_id = ${context.userId}
    `;
	if (owned.length === 0) throw new Error("Hareket bulunamadı.");
	const ex = await sql`
      select id, name, detail, unit from exercises
      where id = ${data.newExerciseId}
        and (owner_id is null or owner_id = ${context.userId})
    `;
	if (ex.length === 0) throw new Error("Yeni hareket bulunamadı.");
	await sql`
      update workout_exercises set
        exercise_id = ${ex[0].id},
        exercise_name = ${ex[0].name},
        detail = ${ex[0].detail},
        unit = ${ex[0].unit}
      where id = ${data.workoutExerciseId}
    `;
	return loadWorkout(sql, owned[0].workout_id, context.userId);
});
var saveWorkoutToProgram_createServerFn_handler = createServerRpc({
	id: "0abaad264c031de8d875ed3c3f2037cc5b223eb2089d8830ed8f3416a337d624",
	name: "saveWorkoutToProgram",
	filename: "src/lib/server/workouts.ts"
}, (opts) => saveWorkoutToProgram.__executeServer(opts));
var saveWorkoutToProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveWorkoutToProgram_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const w = await sql`
      select id, date::text as date, program_day_id, day_name
      from workouts
      where id = ${data.workoutId} and user_id = ${context.userId}
    `;
	if (w.length === 0) throw new Error("Antrenman bulunamadı.");
	const workout = w[0];
	let programDayId = workout.program_day_id;
	if (programDayId == null) {
		const dow = isoDow(workout.date);
		const day = await sql`
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
			const prog = await sql`
          select id from programs
          where user_id = ${context.userId} and is_active = true
          order by id desc limit 1
        `;
			if (prog.length === 0) throw new Error("Aktif program yok. Önce Keşfet’ten program seç.");
			programDayId = (await sql`
          insert into program_days (program_id, dow, name, sort)
          values (
            ${prog[0].id},
            ${dow},
            ${workout.day_name || "Antrenman"},
            ${dow}
          )
          returning id
        `)[0].id;
		} else programDayId = day[0].id;
		await sql`
        update workouts set program_day_id = ${programDayId}
        where id = ${workout.id}
      `;
	}
	if ((await sql`
      select pd.id
      from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${programDayId} and p.user_id = ${context.userId}
    `).length === 0) throw new Error("Program günü bulunamadı.");
	const exercises = await sql`
      select exercise_id, detail, target_sets, target_rep_lo, target_rep_hi,
             rest_sec, load_tag, note, sort
      from workout_exercises
      where workout_id = ${workout.id}
      order by sort
    `;
	if (exercises.length === 0) throw new Error("Seans boş — programa yazılacak hareket yok.");
	await sql`delete from program_exercises where program_day_id = ${programDayId}`;
	for (const ex of exercises) await sql`
        insert into program_exercises (
          program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
          rest_sec, load_tag, note, sort
        ) values (
          ${programDayId}, ${ex.exercise_id}, ${ex.detail},
          ${ex.target_sets}, ${ex.target_rep_lo}, ${ex.target_rep_hi},
          ${ex.rest_sec}, ${ex.load_tag}, ${ex.note}, ${ex.sort}
        )
      `;
	await sql`
      update program_days set name = ${workout.day_name}
      where id = ${programDayId}
    `;
	return {
		ok: true,
		programDayId,
		exerciseCount: exercises.length
	};
});
/**
* Rolling horizon filler.
* - Never touches completed / skipped past sessions with exercises
* - Only creates missing future (and empty-shell) days that have a program day
* - Keeps at least `minAheadDays` from today filled, and always covers `coverUntil` if given
* So the calendar continuously extends as time passes — not a one-shot "4 weeks dump".
*/
async function ensureRollingHorizon(sql, userId, opts) {
	const minAhead = opts?.minAheadDays ?? 28;
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	if ((await sql`
    select id from programs
    where user_id = ${userId} and is_active = true
    limit 1
  `).length === 0) return {
		created: 0,
		replaced: 0
	};
	let start = opts?.fromDate && opts.fromDate > todayStr ? opts.fromDate : todayStr;
	if (opts?.fromDate && opts.fromDate <= todayStr) {
		const maxBack = addDaysISO(todayStr, -7);
		start = opts.fromDate < maxBack ? maxBack : opts.fromDate;
	}
	let end = addDaysISO(todayStr, minAhead);
	if (opts?.coverUntil && opts.coverUntil > end) end = opts.coverUntil;
	if ((await sql`
    select max(date)::text as d from workouts
    where user_id = ${userId}
      and date >= ${todayStr}::date
      and status in ('planned', 'in_progress')
  `)[0]?.d) {}
	let created = 0;
	let replaced = 0;
	let cursor = start;
	for (let i = 0; i < 120; i++) {
		if (cursor > end) break;
		const dateStr = cursor;
		const day = await sql`
      select pd.id, pd.name
      from program_days pd
      join programs p on p.id = pd.program_id
      where p.user_id = ${userId}
        and p.is_active = true
        and (p.valid_from is null or p.valid_from <= ${dateStr}::date)
        and (p.valid_to is null or p.valid_to >= ${dateStr}::date)
        and pd.dow = ${isoDow(dateStr)}
      order by p.id desc
      limit 1
    `;
		if (day.length > 0) {
			const existing = await sql`
        select w.id from workouts w
        where w.user_id = ${userId} and w.date = ${dateStr}::date
      `;
			if (existing.length === 0) {
				await materializeWorkout(sql, userId, dateStr, day[0].id);
				created += 1;
			} else {
				const meta = await sql`
          select
            (select count(*)::int from workout_exercises we where we.workout_id = w.id) as n,
            w.status
          from workouts w
          where w.id = ${existing[0].id}
        `;
				const n = meta[0]?.n ?? 0;
				const status = meta[0]?.status ?? "planned";
				if (n === 0 && status !== "completed" && status !== "skipped") {
					await sql`delete from workouts where id = ${existing[0].id}`;
					await materializeWorkout(sql, userId, dateStr, day[0].id);
					replaced += 1;
				}
			}
		}
		cursor = addDaysISO(cursor, 1);
	}
	return {
		created,
		replaced
	};
}
/**
* Manual / clone entry: extends rolling horizon.
* `weeks` kept for API compat — maps to minAheadDays = weeks * 7.
*/
var generateWorkouts_createServerFn_handler = createServerRpc({
	id: "5d9dcfe0ba767a8b7f8e4598dfde4f07e08af8efdb0827ea0bcd28da03832044",
	name: "generateWorkouts",
	filename: "src/lib/server/workouts.ts"
}, (opts) => generateWorkouts.__executeServer(opts));
var generateWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(generateWorkouts_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const weeks = data.weeks ?? 4;
	const minAheadDays = Math.max(weeks * 7, 28);
	return ensureRollingHorizon(sql, context.userId, {
		fromDate: data.fromDate,
		minAheadDays,
		coverUntil: data.untilDate
	});
});
var ensureWorkoutHorizon_createServerFn_handler = createServerRpc({
	id: "a44538cec3761e97a74f2c188ba695b160f7d023a550829ceab7769bd128c2d2",
	name: "ensureWorkoutHorizon",
	filename: "src/lib/server/workouts.ts"
}, (opts) => ensureWorkoutHorizon.__executeServer(opts));
var ensureWorkoutHorizon = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d = {}) => d ?? {}).handler(ensureWorkoutHorizon_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return ensureRollingHorizon(sql, context.userId, {
		coverUntil: data.untilDate,
		minAheadDays: data.daysAhead ?? 28
	});
});
async function materializeWorkout(sql, userId, date, programDayId) {
	let dayName = "Antrenman";
	let resolvedDayId = programDayId;
	let programExercises = [];
	if (resolvedDayId == null) {
		const day = await sql`
      select pd.id, pd.name
      from program_days pd
      join programs p on p.id = pd.program_id
      where p.user_id = ${userId}
        and p.is_active = true
        and (p.valid_from is null or p.valid_from <= ${date}::date)
        and (p.valid_to is null or p.valid_to >= ${date}::date)
        and pd.dow = ${isoDow(date)}
      order by p.id desc
      limit 1
    `;
		if (day.length > 0) {
			resolvedDayId = day[0].id;
			dayName = day[0].name;
		}
	} else {
		const day = await sql`
      select pd.id, pd.name
      from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${resolvedDayId} and p.user_id = ${userId}
    `;
		if (day.length === 0) throw new Error("Program günü bulunamadı.");
		dayName = day[0].name;
	}
	if (resolvedDayId != null) programExercises = await sql`
      select pe.exercise_id, e.name as exercise_name,
             coalesce(pe.detail, e.detail) as detail, e.unit,
             pe.sets, pe.rep_lo, pe.rep_hi, pe.rest_sec, pe.load_tag, pe.note, pe.sort
      from program_exercises pe
      join exercises e on e.id = pe.exercise_id
      where pe.program_day_id = ${resolvedDayId}
      order by pe.sort
    `;
	if (programExercises.length === 0) {
		if (resolvedDayId == null) throw new Error("Aktif programın yok veya bu güne program atanmamış. Keşfet’ten program seç, sonra program gününü seçerek oluştur.");
		throw new Error("Bu program gününde hareket yok. Program’dan hareket ekle, sonra tekrar dene.");
	}
	const workoutId = (await sql`
    insert into workouts (user_id, date, program_day_id, day_name, status)
    values (${userId}, ${date}::date, ${resolvedDayId}, ${dayName}, 'planned')
    returning id
  `)[0].id;
	for (const pe of programExercises) {
		const we = await sql`
      insert into workout_exercises (
        workout_id, exercise_id, exercise_name, detail, unit,
        target_sets, target_rep_lo, target_rep_hi, rest_sec, load_tag, note, sort
      ) values (
        ${workoutId}, ${pe.exercise_id}, ${pe.exercise_name}, ${pe.detail}, ${pe.unit},
        ${pe.sets}, ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag}, ${pe.note}, ${pe.sort}
      ) returning id
    `;
		for (let s = 1; s <= pe.sets; s++) await sql`
        insert into workout_sets (workout_exercise_id, set_index)
        values (${we[0].id}, ${s})
      `;
	}
	return await loadWorkout(sql, workoutId, userId);
}
async function loadWorkout(sql, workoutId, userId) {
	const rows = await sql`
    select id, date::text as date, program_day_id, day_name, status, notes
    from workouts where id = ${workoutId} and user_id = ${userId}
  `;
	if (rows.length === 0) return null;
	const w = rows[0];
	const exercises = await sql`
    select we.id, we.exercise_id, we.exercise_name, we.detail, we.unit,
           coalesce(e.muscle_group, 'diger') as muscle_group,
           we.target_sets, we.target_rep_lo, we.target_rep_hi, we.rest_sec,
           we.load_tag, we.note, we.sort
    from workout_exercises we
    left join exercises e on e.id = we.exercise_id
    where we.workout_id = ${workoutId}
    order by we.sort
  `;
	const result = [];
	for (const ex of exercises) {
		const sets = await sql`
      select id, set_index, weight::text as weight, reps, rir, completed
      from workout_sets where workout_exercise_id = ${ex.id}
      order by set_index
    `;
		const lastDate = await sql`
      select max(w2.date)::text as date from workouts w2
      join workout_exercises we2 on we2.workout_id = w2.id
      where w2.user_id = ${userId}
        and we2.exercise_id = ${ex.exercise_id}
        and w2.date < ${w.date}::date
        and w2.status = 'completed'
    `;
		let lastTime = null;
		let suggestedWeight = null;
		if (lastDate[0]?.date) {
			const lastSets = await sql`
        select ws.weight::text as weight, ws.reps
        from workout_sets ws
        join workout_exercises we on we.id = ws.workout_exercise_id
        join workouts w2 on w2.id = we.workout_id
        where w2.user_id = ${userId}
          and we.exercise_id = ${ex.exercise_id}
          and w2.date = ${lastDate[0].date}::date
        order by ws.set_index
      `;
			lastTime = {
				date: lastDate[0].date,
				sets: lastSets.map((s) => ({
					weight: s.weight != null ? Number(s.weight) : null,
					reps: s.reps
				}))
			};
			const maxW = Math.max(...lastSets.map((s) => s.weight != null ? Number(s.weight) : 0), 0);
			if (maxW > 0) suggestedWeight = lastSets.length > 0 && lastSets.every((s) => s.reps != null && s.reps >= ex.target_rep_hi) ? Math.round(maxW * 1.025 / 2.5) * 2.5 : maxW;
		}
		result.push({
			...ex,
			sets,
			lastTime,
			suggestedWeight
		});
	}
	return {
		id: w.id,
		date: w.date,
		program_day_id: w.program_day_id,
		day_name: w.day_name,
		status: w.status,
		notes: w.notes,
		exercises: result
	};
}
//#endregion
export { addWorkoutExercise_createServerFn_handler, clearFutureWorkouts_createServerFn_handler, createWorkout_createServerFn_handler, deleteWorkoutExercise_createServerFn_handler, deleteWorkout_createServerFn_handler, ensureWorkoutHorizon_createServerFn_handler, generateWorkouts_createServerFn_handler, getWorkoutByDate_createServerFn_handler, listWorkoutsInRange_createServerFn_handler, saveWorkoutToProgram_createServerFn_handler, skipWorkout_createServerFn_handler, swapWorkoutExercise_createServerFn_handler, updateWorkoutSet_createServerFn_handler, updateWorkout_createServerFn_handler };
