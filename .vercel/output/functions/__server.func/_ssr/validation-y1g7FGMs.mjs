import { n as createMiddleware } from "./ssr.mjs";
import { cn as _enum, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validation-y1g7FGMs.js
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
	const { requireUserId } = await import("./verify.server-DD6vZXR6.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var isoDate = string().regex(/^\d{4}-\d{2}-\d{2}$/, "geçersiz tarih formatı").refine((s) => !Number.isNaN(Date.parse(s + "T12:00:00")), "geçersiz tarih");
_enum([
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
number().min(0).max(1e3).nullable();
number().int().min(0).max(1e3).nullable();
number().int().min(0).max(10).nullable();
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
//#endregion
export { optionalString as a, positiveId as c, sets as d, shortText as f, loadTag as i, repRange as l, v as m, dow as n, optionalText as o, userIdStr as p, isoDate as r, parseOrThrow as s, authMiddleware as t, restSec as u };
