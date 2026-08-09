import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, d as reps, f as restSec, i as loadTag, l as positiveId, m as sets, p as rir, r as isoDate, s as optionalText, t as authMiddleware, u as repRange, v as weightKg, y as workoutStatus } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workouts-Co7BI8CT.js
var listWorkoutsInRange = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	from: isoDate,
	to: isoDate
}))).handler(createSsrRpc("c470ce496b95c9afdde529cbf005d46ee94dc975539d9b6621c922d51795a182"));
var getWorkoutByDate = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(isoDate)).handler(createSsrRpc("879445236f81bc8637c1953d8ef815391e749af0f994bc78513ce6f22c30c6f9"));
var createWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	date: isoDate,
	programDayId: positiveId.nullable().optional()
}))).handler(createSsrRpc("e182973a651642b29b1973d1c35de9338c54625555633269f5cc40ea83ace408"));
var updateWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	status: workoutStatus.optional(),
	notes: optionalText(2e3),
	day_name: string().trim().max(80).optional()
}))).handler(createSsrRpc("5740b898ff2b8a3912750e367ca6d84cec314df9865bdec0573f089208464972"));
/**
* Skip / reschedule:
* - postpone_week: shift ALL planned sessions in that ISO week by +1 day
* - skip_week: mark only this session skipped (not this week)
* - tomorrow / next_free: kept as aliases → postpone_week for backwards compat
*/
var skipWorkout = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	mode: _enum([
		"skip_week",
		"tomorrow",
		"next_free",
		"postpone_week"
	])
}))).handler(createSsrRpc("8a6ef6d33b6ce0ad083bb720c90041620b058b1a4a1f936e060e6dc4cd22ad71"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("124a8196e107618fd2bfc73f3170758380308d2a732d8b12b09d6b2fdf3b1923"));
/**
* Delete only future planned/skipped sessions from today forward.
* Completed (and past completed) history is never touched.
*/
var clearFutureWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("3ed198a712ba243748c19883d294a55c8673b5cb99729de6cea884039eec9619"));
var updateWorkoutSet = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	weight: weightKg.optional(),
	reps: reps.optional(),
	rir: rir.optional(),
	completed: boolean().optional()
}))).handler(createSsrRpc("0aa88f3b0eabf3b1b7d35bdf0f95f7c192faaecdbe09741c3383e9a4cd53c14a"));
var addWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	workoutId: positiveId,
	exerciseId: positiveId,
	sets: sets.optional(),
	rep_lo: repRange.optional(),
	rep_hi: repRange.optional(),
	rest_sec: restSec.optional(),
	load_tag: loadTag.optional()
}))).handler(createSsrRpc("da6f4422ac456ec8d3de4e92022c49907399b21f4818e1991f97c80565997136"));
var deleteWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("d15162f3aac5ef71e27a4432278e1b880f9f5a5acf078e52eb9a73b92685b5a8"));
/** Swap a workout exercise for a similar/library alternative; keeps set rows. */
var swapWorkoutExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	workoutExerciseId: positiveId,
	newExerciseId: positiveId
}))).handler(createSsrRpc("0fd7ffd0ad309e1a3b86498de81aa8d817b86201e8a02ebe9b35898dbf514be0"));
/**
* Write this session's exercise list onto the linked program day
* (or active program day for that weekday). Future sessions use the new list.
*/
var saveWorkoutToProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({ workoutId: positiveId }))).handler(createSsrRpc("0abaad264c031de8d875ed3c3f2037cc5b223eb2089d8830ed8f3416a337d624"));
/**
* Rolling horizon filler.
* - Never touches completed / skipped past sessions with exercises
* - Only creates missing future (and empty-shell) days that have a program day
* - Keeps at least `minAheadDays` from today filled, and always covers `coverUntil` if given
* So the calendar continuously extends as time passes — not a one-shot "4 weeks dump".
*/
/**
* Manual / clone entry: extends rolling horizon.
* `weeks` kept for API compat — maps to minAheadDays = weeks * 7.
*/
var generateWorkouts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	fromDate: isoDate.optional(),
	weeks: number().int().min(1).max(52).optional(),
	untilDate: isoDate.optional()
}))).handler(createSsrRpc("5d9dcfe0ba767a8b7f8e4598dfde4f07e08af8efdb0827ea0bcd28da03832044"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	untilDate: isoDate.optional(),
	daysAhead: number().int().min(1).max(120).optional()
}).default({}))).handler(createSsrRpc("a44538cec3761e97a74f2c188ba695b160f7d023a550829ceab7769bd128c2d2"));
/** Public/social workout detail — privacy enforced server-side. */
var getPublicWorkout = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("7d2d9941a491051447adf4078c81417e7de54a569e10302b6e90bc1a9e796d67"));
//#endregion
export { generateWorkouts as a, listWorkoutsInRange as c, swapWorkoutExercise as d, updateWorkout as f, deleteWorkoutExercise as i, saveWorkoutToProgram as l, clearFutureWorkouts as n, getPublicWorkout as o, updateWorkoutSet as p, createWorkout as r, getWorkoutByDate as s, addWorkoutExercise as t, skipWorkout as u };
