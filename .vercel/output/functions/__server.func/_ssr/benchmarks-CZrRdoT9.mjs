import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, un as array } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/benchmarks-CZrRdoT9.js
/**
* Relative strength = best weight / latest body_weight.
* Uses the user's most recent body_weight (not the weight on set day) —
* cheaper and accurate enough for distribution ranking.
*/
var filtersSchema = object({
	/** absolute = raw kg; relative = kg / bodyweight */
	measure: _enum(["relative", "absolute"]).optional(),
	/** bodyweight band in kg [min, max] */
	weightBand: object({
		min: number().positive(),
		max: number().positive()
	}).optional(),
	ageMin: number().int().min(13).max(100).optional(),
	ageMax: number().int().min(13).max(100).optional(),
	sex: _enum(["female", "male"]).optional()
}).optional();
/**
* Batch exercise benchmarks for open accordion cards.
* One round-trip for all exerciseIds — never N queries per session open.
*/
var getExerciseBenchmarks = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	exerciseIds: array(positiveId).min(1).max(12),
	filters: filtersSchema
}))).handler(createSsrRpc("d88f3f34ec37da22acf5ae69ab1a7eca9b4fedf6d5233a78645344d12f473a35"));
/** Program social: how many active clones + followed avatars */
var getProgramSocial = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ programId: positiveId.optional() }).optional())).handler(createSsrRpc("42dc490839f431eba28612c277c6792c477e7c155835b00552bd9d13c0c32a6f"));
var getComparisonOptIn = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ef9788b6584c3426dac92d4f12c7a406c06453dcced42f251812435e76d3d53a"));
var setComparisonOptIn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({ optIn: boolean() }))).handler(createSsrRpc("f82ef311a6c6c8a59ccfb58d73809efcc733af3dfac6b6bb1e3d73e66f5247c9"));
//#endregion
export { setComparisonOptIn as i, getExerciseBenchmarks as n, getProgramSocial as r, getComparisonOptIn as t };
