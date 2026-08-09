import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { t as createSsrRpc } from "./createSsrRpc-D75-wYbG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-WEvd4wDq.js
var notifications_WEvd4wDq_exports = /* @__PURE__ */ __exportAll({
	a: () => notify,
	i: () => notifications_exports,
	n: () => listNotifications,
	r: () => markNotificationsRead,
	t: () => getUnreadNotificationCount
});
var notifications_exports = /* @__PURE__ */ __exportAll$1({
	getUnreadNotificationCount: () => getUnreadNotificationCount,
	listNotifications: () => listNotifications,
	markNotificationsRead: () => markNotificationsRead,
	notify: () => notify
});
/** Create a notification unless actor == recipient. Honors notifications_enabled. */
async function notify(sql, opts) {
	if (opts.userId === opts.actorId) return;
	const pref = await sql`
    select coalesce(notifications_enabled, true) as notifications_enabled
    from user_settings
    where user_id = ${opts.userId}
    limit 1
  `;
	if (pref[0] && pref[0].notifications_enabled === false) return;
	await sql`
    insert into notifications (user_id, actor_id, type, subject_type, subject_id)
    values (
      ${opts.userId},
      ${opts.actorId},
      ${opts.type},
      ${opts.subjectType},
      ${String(opts.subjectId)}
    )
  `;
}
var getUnreadNotificationCount = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(createSsrRpc("5521be837aedf7467a52448f35adc9b10978e543f372200fc1597fe9d5a650e8"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	limit: number().int().min(1).max(50).optional(),
	cursor: string().optional()
}))).handler(createSsrRpc("f26b0655ad34c0b9c71f1538e0b04cd971fcd1232cd75bf437abc011f1c3837a"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	ids: array(positiveId).max(100).optional(),
	all: boolean().optional()
}))).handler(createSsrRpc("6f216c7e584f6b453ee91207a5f57e80905bbe37d57d28d14b16b3beaac6c7d1"));
//#endregion
export { notify as a, notifications_WEvd4wDq_exports as i, listNotifications as n, markNotificationsRead as r, getUnreadNotificationCount as t };
