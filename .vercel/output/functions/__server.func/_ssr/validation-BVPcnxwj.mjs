import { n as createMiddleware } from "./ssr.mjs";
import { cn as _enum, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validation-BVPcnxwj.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out (auth on — the default, including live preview) -> throws
* `UnauthorizedError` (see `verify.server.ts`). Only when auth is explicitly
* disabled (`VITE_AUTH_ENABLED=false`) does it resolve the shared dev user and
* never throw. Use it on every server function that touches per-user data, and
* scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-Bm2YFrbd.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-DdaYS3Bg.mjs");
	const { requireUserId } = await import("./verify.server-cgPfRlMF.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var isoDate = string().regex(/^\d{4}-\d{2}-\d{2}$/, "geçersiz tarih formatı").refine((s) => !Number.isNaN(Date.parse(s + "T12:00:00")), "geçersiz tarih");
var workoutStatus = _enum([
	"planned",
	"in_progress",
	"completed",
	"skipped"
]);
var loadTag = _enum([
	"hafif",
	"orta_hafif",
	"orta",
	"orta_agir",
	"agir"
]);
var positiveId = number().int().positive();
var weightKg = number().min(0).max(1e3).nullable();
var reps = number().int().min(0).max(1e3).nullable();
var rir = number().int().min(0).max(10).nullable();
string().trim().toUpperCase().regex(/^[A-HJ-NP-Z2-9]{6}$/, "geçersiz paylaşım kodu");
string().trim().toUpperCase().regex(/^[A-HJ-NP-Z2-9]{4,8}$/, "geçersiz paylaşım kodu");
var dow = number().int().min(1).max(7);
var sets = number().int().min(1).max(20);
var restSec = number().int().min(0).max(900);
var repRange = number().int().min(1).max(500);
var shortText = (max = 80) => string().trim().min(1).max(max);
var optionalText = (max = 2e3) => string().trim().max(max).nullable().optional();
var optionalString = (max = 2e3) => string().trim().max(max).optional();
var userIdStr = string().trim().min(1).max(128);
/** Parse helper for createServerFn validators — throws friendly Error on Zod fail. */
function parseOrThrow(schema, data) {
	const r = schema.safeParse(data);
	if (r.success) return r.data;
	const msg = r.error.issues.map((i) => i.message).join("; ") || "Geçersiz veri";
	throw new Error(msg);
}
function v(schema) {
	return (data) => parseOrThrow(schema, data);
}
/**
* Server fns that take no client payload (GET/POST with auth-only context).
* Accepts undefined / null / {} from the RPC layer and returns undefined.
*/
function noInput(data) {
	if (data != null && typeof data === "object" && !Array.isArray(data) && Object.keys(data).length > 0) {}
}
//#endregion
export { v as _, noInput as a, parseOrThrow as c, reps as d, restSec as f, userIdStr as g, shortText as h, loadTag as i, positiveId as l, sets as m, dow as n, optionalString as o, rir as p, isoDate as r, optionalText as s, authMiddleware as t, repRange as u, weightKg as v, workoutStatus as y };
