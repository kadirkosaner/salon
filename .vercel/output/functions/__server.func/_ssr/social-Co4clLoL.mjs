import { r as createServerFn } from "./ssr.mjs";
import { cn as _enum, dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { m as v, p as userIdStr, s as parseOrThrow, t as authMiddleware } from "./validation-y1g7FGMs.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
import { r as slugFromIdentity, t as isValidUsername } from "./username-DNrJudLp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-Co4clLoL.js
async function allocateUsername(sql, base, excludeUserId) {
	let candidate = base.slice(0, 20);
	if (candidate.length < 3) candidate = "sporcu";
	if (!isValidUsername(candidate)) candidate = "sporcu";
	for (let i = 0; i < 50; i++) {
		const tryName = i === 0 ? candidate : `${candidate.slice(0, 20 - String(i).length - 1)}_${i}`;
		const rows = await sql`
      select user_id from user_profiles
      where lower(username) = ${tryName}
      limit 1
    `;
		if (rows.length === 0) return tryName;
		if (excludeUserId && rows[0].user_id === excludeUserId) return tryName;
	}
	return `u_${Date.now().toString(36).slice(-8)}`;
}
/** Ensure a user_profiles row exists (auto username). Idempotent. */
async function ensureUserProfile(sql, userId) {
	if ((await sql`
    select user_id from user_profiles where user_id = ${userId} limit 1
  `).length > 0) return;
	const users = await sql`
    select name, email from "user" where id = ${userId} limit 1
  `;
	if (users.length === 0) return;
	await sql`
    insert into user_profiles (user_id, username, username_confirmed)
    values (${userId}, ${await allocateUsername(sql, slugFromIdentity(users[0].name, users[0].email), userId)}, false)
    on conflict (user_id) do nothing
  `;
}
/** Own profile hub (stats, measures, activity). */
var getMyProfileHub = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dcffd40a8afe60207067f5b87cecae9756d9504ba2c8232485aae25fbe0e1074"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(string().trim().max(80))).handler(createSsrRpc("d05e65867b4933b54ef5627cd1ae652e99f56d8ef8b17e77de48c8b6202812c1"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("77aefd561628bc160bf92f337ebc8febab564be724c1bb0d561ff8b10d5edd2a"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("807140b5c76a90c2fad6097751739cd559fc4f2f5bd23001e96fc44ee9a9ad30"));
/** Resolve profile by username or raw user id. */
var getUserProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(string().trim().min(1).max(128))).handler(createSsrRpc("19d1cb38e56874c5c5f6510e87194380872bf11f93bf1cce71905e981218f32a"));
var profileUpdateSchema = object({
	username: string().trim().toLowerCase().min(3).max(20).regex(/^[a-z0-9_]+$/).optional(),
	bio: string().trim().max(160).nullable().optional(),
	avatar_url: string().max(4e5).nullable().optional(),
	visibility: _enum([
		"public",
		"followers",
		"private"
	]).optional(),
	unit_system: _enum(["metric", "imperial"]).optional(),
	measures_public: boolean().optional(),
	confirm_username: boolean().optional()
});
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => parseOrThrow(profileUpdateSchema, d)).handler(createSsrRpc("ef6b1785d1951b525ca21d36ad0a0468815741b3ab610edc1a12ded206599685"));
var followUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(userIdStr)).handler(createSsrRpc("c7a400c7f9b0406c032c6adbaba9a904b310de1d4d2546b4498d581195683f76"));
var unfollowUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(userIdStr)).handler(createSsrRpc("5068934b9dde26ae93ddd83a0a2b8194a6c3c5e7f20ec10f7f2deed2d93e3017"));
//#endregion
export { unfollowUser as a, getUserProfile as i, followUser as n, updateMyProfile as o, getMyProfileHub as r, ensureUserProfile as t };
