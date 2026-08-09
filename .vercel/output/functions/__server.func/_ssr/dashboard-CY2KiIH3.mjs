import { r as createServerFn } from "./ssr.mjs";
import { _ as v, a as noInput, h as shortText, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { o as MAIN_LIFTS } from "./library-DGJU16Cf.mjs";
import { ensureUserSeeded } from "./seed-DlydNDJa.mjs";
import { t as addDaysISO } from "./utils-DKNImH2A.mjs";
import { startOfWeekMonday, todayForUser } from "./time-BN4ZvYw3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CY2KiIH3.js
var getDashboard_createServerFn_handler = createServerRpc({
	id: "9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12",
	name: "getDashboard",
	filename: "src/lib/server/dashboard.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const todayIso = await todayForUser(sql, context.userId);
	const weekStart = await startOfWeekMonday(sql, todayIso);
	const weekEnd = addDaysISO(weekStart, 6);
	const rangeStart = addDaysISO(weekStart, -77);
	const weekWorkouts = await sql`
      select id, date::text as date, day_name, status
      from workouts
      where user_id = ${context.userId}
        and date >= ${weekStart}::date and date <= ${weekEnd}::date
      order by date
    `;
	const completedThisWeek = weekWorkouts.filter((w) => w.status === "completed").length;
	const plannedThisWeek = weekWorkouts.filter((w) => w.status === "planned" || w.status === "completed").length;
	const volumeByDate = await sql`
      select w.date::text as date, coalesce(sum(ws.weight * ws.reps), 0)::text as tonnage
      from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where w.user_id = ${context.userId}
        and w.date >= ${rangeStart}::date and w.date <= ${weekEnd}::date
        and w.status = 'completed'
        and ws.completed = true
        and we.unit = 'kg'
        and ws.weight is not null and ws.reps is not null
      group by w.date
    `;
	const volumeByWeek = [];
	let weekVolume = 0;
	for (let i = 11; i >= 0; i--) {
		const ws = addDaysISO(weekStart, -7 * i);
		const we = addDaysISO(ws, 6);
		let tonnage = 0;
		for (const row of volumeByDate) if (row.date >= ws && row.date <= we) tonnage += Number(row.tonnage);
		if (i === 0) weekVolume = tonnage;
		volumeByWeek.push({
			week: ws.slice(5),
			tonnage: Math.round(tonnage)
		});
	}
	const completedByDate = await sql`
      select date::text as date from workouts
      where user_id = ${context.userId}
        and status = 'completed'
        and date >= ${addDaysISO(weekStart, -364)}::date
    `;
	let streak = 0;
	const startI = completedThisWeek >= 4 ? 0 : 1;
	for (let i = startI; i < 52; i++) {
		const ws = addDaysISO(weekStart, -7 * i);
		const we = addDaysISO(ws, 6);
		if (completedByDate.filter((r) => r.date >= ws && r.date <= we).length >= 4) streak += 1;
		else break;
	}
	const next = await sql`
      select w.id, w.date::text as date, w.day_name,
             (select count(*)::int from workout_exercises we where we.workout_id = w.id) as exercise_count
      from workouts w
      where w.user_id = ${context.userId}
        and w.date >= ${todayIso}::date
        and w.status = 'planned'
      order by w.date
      limit 1
    `;
	const muscle = await sql`
      select e.muscle_group, count(*)::int as sets
      from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join exercises e on e.id = we.exercise_id
      join workouts w on w.id = we.workout_id
      where w.user_id = ${context.userId}
        and w.date >= ${weekStart}::date and w.date <= ${weekEnd}::date
        and ws.completed = true
      group by e.muscle_group
      order by sets desc
    `;
	const allPr = await sql`
      select distinct on (we.exercise_name)
        we.exercise_name as name, ws.weight::text as weight, w.date::text as date
      from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where w.user_id = ${context.userId}
        and w.status = 'completed'
        and ws.completed = true
        and ws.weight is not null
      order by we.exercise_name, ws.weight desc, w.date desc
    `;
	const mainSet = new Set(MAIN_LIFTS);
	const records = allPr.filter((r) => mainSet.has(r.name)).map((r) => ({
		name: r.name,
		weight: Number(r.weight),
		date: r.date
	}));
	const recent = await sql`
      select w.id, w.date::text as date, w.day_name, w.status,
        (
          select coalesce(sum(ws.weight * ws.reps), 0)::text
          from workout_sets ws
          join workout_exercises we on we.id = ws.workout_exercise_id
          where we.workout_id = w.id and ws.completed = true
            and we.unit = 'kg' and ws.weight is not null and ws.reps is not null
        ) as tonnage
      from workouts w
      where w.user_id = ${context.userId}
        and w.status = 'completed'
      order by w.date desc
      limit 5
    `;
	let progressExercise = MAIN_LIFTS[0];
	let progress = [];
	const progressSeries = await sql`
      select we.exercise_name as name, w.date::text as date, max(ws.weight)::text as weight
      from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where w.user_id = ${context.userId}
        and w.status = 'completed'
        and ws.completed = true
        and ws.weight is not null
      group by we.exercise_name, w.date
      order by w.date
    `;
	for (const name of MAIN_LIFTS) {
		const series = progressSeries.filter((s) => s.name === name);
		if (series.length > 0) {
			progressExercise = name;
			progress = series.map((s) => ({
				date: s.date,
				weight: Number(s.weight)
			}));
			break;
		}
	}
	const activeProg = await sql`
      select id from programs
      where user_id = ${context.userId} and is_active = true
      limit 1
    `;
	return {
		week: {
			completed: completedThisWeek,
			planned: plannedThisWeek || weekWorkouts.length,
			volume: Math.round(weekVolume)
		},
		hasActiveProgram: activeProg.length > 0,
		streak,
		next: next[0] ?? null,
		volumeByWeek,
		muscleGroups: muscle,
		records,
		recent: recent.map((r) => ({
			...r,
			tonnage: Math.round(Number(r.tonnage))
		})),
		progressExercise,
		progress
	};
});
var getExerciseProgress_createServerFn_handler = createServerRpc({
	id: "85d38fe238ed62e55e52afe9bdc24ec519e505fc89d618f452f6db1887b0a6e6",
	name: "getExerciseProgress",
	filename: "src/lib/server/dashboard.ts"
}, (opts) => getExerciseProgress.__executeServer(opts));
var getExerciseProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(shortText(120))).handler(getExerciseProgress_createServerFn_handler, async ({ context, data: name }) => {
	return (await (await getSql())`
      select w.date::text as date, max(ws.weight)::text as weight
      from workout_sets ws
      join workout_exercises we on we.id = ws.workout_exercise_id
      join workouts w on w.id = we.workout_id
      where w.user_id = ${context.userId}
        and we.exercise_name = ${name}
        and w.status = 'completed'
        and ws.completed = true
        and ws.weight is not null
      group by w.date
      order by w.date
    `).map((s) => ({
		date: s.date,
		weight: Number(s.weight)
	}));
});
//#endregion
export { getDashboard_createServerFn_handler, getExerciseProgress_createServerFn_handler };
