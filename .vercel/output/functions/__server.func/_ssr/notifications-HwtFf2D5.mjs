import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-HwtFf2D5.js
var getUnreadNotificationCount_createServerFn_handler = createServerRpc({
	id: "5521be837aedf7467a52448f35adc9b10978e543f372200fc1597fe9d5a650e8",
	name: "getUnreadNotificationCount",
	filename: "src/lib/server/notifications.ts"
}, (opts) => getUnreadNotificationCount.__executeServer(opts));
var getUnreadNotificationCount = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(noInput).handler(getUnreadNotificationCount_createServerFn_handler, async ({ context }) => {
	return { count: (await (await getSql())`
      select count(*)::int as c
      from notifications
      where user_id = ${context.userId} and read_at is null
    `)[0]?.c ?? 0 };
});
var listNotifications_createServerFn_handler = createServerRpc({
	id: "f26b0655ad34c0b9c71f1538e0b04cd971fcd1232cd75bf437abc011f1c3837a",
	name: "listNotifications",
	filename: "src/lib/server/notifications.ts"
}, (opts) => listNotifications.__executeServer(opts));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	limit: number().int().min(1).max(50).optional(),
	cursor: string().optional()
}))).handler(listNotifications_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const limit = data.limit ?? 30;
	const cursor = data.cursor ?? null;
	const rows = await sql`
      select
        n.id, n.type, n.subject_type, n.subject_id,
        n.read_at::text as read_at,
        n.created_at::text as created_at,
        u.id as actor_id, u.name as actor_name, u.image as actor_image,
        up.username, up.avatar_url,
        case
          when n.subject_type = 'activity' and n.subject_id ~ '^[0-9]+$'
            then n.subject_id::int
          when n.subject_type = 'comment' and ac.event_id is not null
            then ac.event_id
          else null
        end as activity_id
      from notifications n
      join "user" u on u.id = n.actor_id
      left join user_profiles up on up.user_id = n.actor_id
      left join activity_comments ac
        on n.subject_type = 'comment'
        and n.subject_id ~ '^[0-9]+$'
        and ac.id = n.subject_id::int
      where n.user_id = ${context.userId}
        and (
          ${cursor}::timestamptz is null
          or n.created_at < ${cursor}::timestamptz
        )
      order by n.created_at desc
      limit ${limit + 1}
    `;
	const grouped = [];
	const seen = /* @__PURE__ */ new Map();
	for (const r of rows.slice(0, limit)) {
		const key = `${r.type}:${r.subject_type}:${r.subject_id}`;
		const existing = seen.get(key);
		if (existing && !existing.read_at && !r.read_at) {
			existing.others += 1;
			continue;
		}
		const item = {
			id: Number(r.id),
			type: r.type,
			subject_type: r.subject_type,
			subject_id: r.subject_id,
			activity_id: r.activity_id != null ? Number(r.activity_id) : null,
			read_at: r.read_at,
			created_at: r.created_at,
			actor: {
				id: r.actor_id,
				name: r.actor_name,
				username: r.username,
				image: r.avatar_url || r.actor_image
			},
			others: 0
		};
		seen.set(key, item);
		grouped.push(item);
	}
	return {
		items: grouped,
		nextCursor: rows.length > limit && rows.length > 0 ? rows[Math.min(limit, rows.length) - 1].created_at : null
	};
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "6f216c7e584f6b453ee91207a5f57e80905bbe37d57d28d14b16b3beaac6c7d1",
	name: "markNotificationsRead",
	filename: "src/lib/server/notifications.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	ids: array(positiveId).max(100).optional(),
	all: boolean().optional()
}))).handler(markNotificationsRead_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.all) {
		await sql`
        update notifications
        set read_at = now()
        where user_id = ${context.userId} and read_at is null
      `;
		return { ok: true };
	}
	if (data.ids?.length) for (const id of data.ids) await sql`
          update notifications
          set read_at = now()
          where id = ${id} and user_id = ${context.userId} and read_at is null
        `;
	return { ok: true };
});
//#endregion
export { getUnreadNotificationCount_createServerFn_handler, listNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler };
