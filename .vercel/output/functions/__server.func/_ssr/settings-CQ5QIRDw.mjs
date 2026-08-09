import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, pn as literal, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CQ5QIRDw.js
var themeSchema = _enum(["obsidian", "carbon"]);
var accentSchema = _enum([
	"pirinc",
	"bakir",
	"kemik",
	"volt",
	"ates",
	"buz",
	"neon",
	"kehribar",
	"beyaz",
	"ufuk"
]);
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("9b36a4c1185958551fcc8de1b888777de8a08ebe75806d2780396ecc0b4eafe7"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	timeZone: string().trim().min(1).max(64).optional(),
	hapticEnabled: boolean().optional(),
	notificationsEnabled: boolean().optional(),
	unitSystem: _enum(["metric", "imperial"]).optional(),
	theme: themeSchema.optional(),
	accent: accentSchema.optional()
}))).handler(createSsrRpc("0e182776be6283b912be100cdaf806931752666530bbee6f8ea2a74039c779ba"));
/** Export user data as JSON (GDPR). */
var exportMyData = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("f234a67bab3f7e8438c0cb607261fbb8bcc91ecc48658176705bb3bcbd5fb747"));
/** Hard-delete account (cascade via FKs). */
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({ confirm: literal("DELETE") }))).handler(createSsrRpc("7fd971e076a0cb90d76d0d895765ba1c55eb0ec3cdccd5478850ef7f1c566420"));
//#endregion
export { updateSettings as i, exportMyData as n, getSettings as r, deleteMyAccount as t };
