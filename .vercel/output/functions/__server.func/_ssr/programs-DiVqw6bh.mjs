import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, f as restSec, h as shortText, i as loadTag, l as positiveId, m as sets, n as dow, o as optionalString, s as optionalText, t as authMiddleware, u as repRange } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programs-DiVqw6bh.js
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("594d4eb468e641b2e1946099093db375f6f1335f8f5b3d3720ed9d6ff2863e83"));
var getActiveProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("492c59b7ae7e87a93f0769074a3c2fa0854245b8937346ac25ac0fe0be29fbaa"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("61e9a16a1abc76676e3cf0c280b82fd182926a7567dc10b2a449c17d772964b0"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	name: string().trim().min(1).max(80).optional(),
	is_active: boolean().optional()
}))).handler(createSsrRpc("7d209b75950cfadfb3f425e5be3df3130811f3686b85de936ad37d1c9a0c1e67"));
var createProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	name: shortText(80),
	description: optionalString(2e3),
	days: array(object({
		dow,
		name: shortText(80),
		focus: optionalString(120)
	})).optional()
}))).handler(createSsrRpc("8a16d13a104ad0eb47aabfcb0ade826b60488383d12df868462b9100f3ac1c4d"));
var addProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	programId: positiveId,
	dow,
	name: shortText(80),
	focus: optionalString(120)
}))).handler(createSsrRpc("180e5f28add199b638c547f437ff49db577dcfb38a348ac1eb58726514921478"));
var updateProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	name: string().trim().min(1).max(80).optional(),
	focus: optionalText(120),
	dow: dow.optional()
}))).handler(createSsrRpc("74ce8358fb9f645b4a65bddfa53b671c7cb791d330732af11f921ff837afbf30"));
var setWeekSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	programId: positiveId,
	schedule: array(object({
		dow,
		programDayId: positiveId.nullable()
	}))
}))).handler(createSsrRpc("96e1b82b9f2474048cbb4be14e225026ad5b6b579f8087abe490b8784554afea"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("6637fb9fa085c3e6eacb39f6981ae5ee927aff958e463ab6ec97a24a7aa1796b"));
var addProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	programDayId: positiveId,
	exerciseId: positiveId,
	detail: optionalString(200),
	sets,
	rep_lo: repRange,
	rep_hi: repRange,
	rest_sec: restSec,
	load_tag: loadTag,
	note: optionalString(500)
}))).handler(createSsrRpc("773184e549ab922b8d89769e473ae3c026091da75cf449fa7ed279007e484eec"));
var updateProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	exerciseId: positiveId.optional(),
	sets: sets.optional(),
	rep_lo: repRange.optional(),
	rep_hi: repRange.optional(),
	rest_sec: restSec.optional(),
	load_tag: loadTag.optional(),
	note: optionalText(500),
	detail: optionalText(200)
}))).handler(createSsrRpc("1d2a464c009ca9b8b62e8a6cd535660f8d5df3a1b1861cb9d1d28bd1c2fc21f7"));
var deleteProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(createSsrRpc("99da0c2636d87cf261b75fbbc00e9f514f5d93b67429467266c8b2d972db8fc2"));
var reorderProgramExercises = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	programDayId: positiveId,
	orderedIds: array(positiveId).max(100)
}))).handler(createSsrRpc("ac897f0a9d04feec42896d48947c132ac44208b96298cf5c5eaf86b6a523ab72"));
//#endregion
export { addProgramDay, addProgramExercise, createProgram, deleteProgramExercise, getActiveProgram, reorderProgramExercises, setWeekSchedule, updateProgramDay, updateProgramExercise };
