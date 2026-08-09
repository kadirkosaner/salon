import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-CAcJWai0.js
/**
* Safety net if migration 0016 has not run yet on this PGLite instance.
* Matches 0016_onboarding.sql: add column + backfill existing profiles only
* when the column was just created (so new signups keep null onboarded_at).
*/
var getOnboardingStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("cf95c44ac65697d4000e76d3056279880e4a5f7279730bcffebadc4adf40af20"));
/** Mark onboarding finished (complete or skip). */
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("bac1cf5f409befad194a9d2819359f64dafef4d1c35bdc1d1633ed0289aed22d"));
var saveOnboardingWeight = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	weightKg: number().min(1).max(1e3),
	unitSystem: _enum(["metric", "imperial"])
}))).handler(createSsrRpc("866e7916e383a6a0a2ffee0b4f5ce8ef765ef673f07f7ce3564f961549773a61"));
var saveOnboardingAppearance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	theme: _enum(["obsidian", "carbon"]),
	accent: string().min(2).max(20)
}))).handler(createSsrRpc("93485e081daa9a81cc5666fe1ae75678985db063305fdf5276d8c24488463ee7"));
/** Catalog suggestions filtered by preferred training days/week. */
var getOnboardingPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	daysPerWeek: number().int().min(2).max(6).optional(),
	locale: string().optional()
}))).handler(createSsrRpc("6c681d328573957b5a36941ef07febb24749286d796546d1bcd1464f232cb730"));
var isOnboarded = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("d6c5810d6838e0caeeb115ba1e32758df3fc237bf89ae3b4f579a2798243acec"));
//#endregion
export { saveOnboardingAppearance as a, isOnboarded as i, getOnboardingPrograms as n, saveOnboardingWeight as o, getOnboardingStatus as r, completeOnboarding as t };
