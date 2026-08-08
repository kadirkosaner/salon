import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CaZaDWNm.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { c as positiveId, g as v, s as parseOrThrow, t as authMiddleware } from "./validation-CwL44con.mjs";
import { ensureUserSeeded } from "./seed-CzdWnGfz.mjs";
import { t as ensureUserProfile } from "./social-Bu5LAUW-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-nIgrslDT.js
/** Build workout snapshot + insert workout_completed (idempotent). */
function mapPayload(raw) {
	if (raw == null) return {};
	if (typeof raw === "string") try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
	if (typeof raw === "object") return raw;
	return {};
}
var getFeed_createServerFn_handler = createServerRpc({
	id: "ddc04f5e713c3ee6337569cc64d4af84a9252a35bbc71179e77999333b8ab76e",
	name: "getFeed",
	filename: "src/lib/server/activity.ts"
}, (opts) => getFeed.__executeServer(opts));
var getFeed = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	cursor: string().optional(),
	limit: number().int().min(1).max(40).optional()
}))).handler(getFeed_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureUserProfile(sql, context.userId);
	const limit = data.limit ?? 15;
	const cursor = data.cursor ?? null;
	const rows = await sql`
      select
        e.id,
        e.type,
        e.subject_id,
        e.payload,
        e.created_at::text as created_at,
        u.id as author_id,
        u.name as author_name,
        u.image as author_image,
        up.username,
        up.avatar_url,
        (select count(*)::int from activity_likes al where al.event_id = e.id) as like_count,
        (select count(*)::int from activity_comments ac where ac.event_id = e.id) as comment_count,
        exists(
          select 1 from activity_likes al
          where al.event_id = e.id and al.user_id = ${context.userId}
        ) as liked_by_me
      from activity_events e
      join "user" u on u.id = e.user_id
      left join user_profiles up on up.user_id = e.user_id
      where (
        e.user_id = ${context.userId}
        or (
          coalesce(up.visibility, 'public') = 'public'
          and (
            e.user_id in (
              select following_id from user_follows where follower_id = ${context.userId}
            )
            or e.user_id = ${context.userId}
          )
        )
        or (
          coalesce(up.visibility, 'public') = 'followers'
          and exists(
            select 1 from user_follows f
            where f.follower_id = ${context.userId} and f.following_id = e.user_id
          )
        )
      )
      and (
        ${cursor}::timestamptz is null
        or e.created_at < ${cursor}::timestamptz
      )
      order by e.created_at desc
      limit ${limit + 1}
    `;
	const slice = rows.slice(0, limit);
	const nextCursor = rows.length > limit && slice.length > 0 ? slice[slice.length - 1].created_at : null;
	return {
		items: slice.map((r) => ({
			id: Number(r.id),
			type: r.type,
			subject_id: r.subject_id != null ? Number(r.subject_id) : null,
			payload: mapPayload(r.payload),
			created_at: r.created_at,
			author: {
				id: r.author_id,
				name: r.author_name,
				username: r.username,
				image: r.avatar_url || r.author_image
			},
			like_count: r.like_count,
			comment_count: r.comment_count,
			liked_by_me: r.liked_by_me === true,
			is_mine: r.author_id === context.userId
		})),
		nextCursor
	};
});
var getDiscoverFeed_createServerFn_handler = createServerRpc({
	id: "6cb0c44585db7d8adacdd8c95d252849c501333dca44120d4aa2c9fe7ec0d939",
	name: "getDiscoverFeed",
	filename: "src/lib/server/activity.ts"
}, (opts) => getDiscoverFeed.__executeServer(opts));
var getDiscoverFeed = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDiscoverFeed_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return (await sql`
      select
        e.id, e.type, e.subject_id, e.payload,
        e.created_at::text as created_at,
        u.id as author_id, u.name as author_name, u.image as author_image,
        up.username, up.avatar_url,
        (select count(*)::int from activity_likes al where al.event_id = e.id) as like_count,
        (select count(*)::int from activity_comments ac where ac.event_id = e.id) as comment_count,
        exists(
          select 1 from activity_likes al
          where al.event_id = e.id and al.user_id = ${context.userId}
        ) as liked_by_me
      from activity_events e
      join "user" u on u.id = e.user_id
      left join user_profiles up on up.user_id = e.user_id
      where coalesce(up.visibility, 'public') = 'public'
      order by e.created_at desc
      limit 20
    `).map((r) => ({
		id: Number(r.id),
		type: r.type,
		subject_id: r.subject_id != null ? Number(r.subject_id) : null,
		payload: mapPayload(r.payload),
		created_at: r.created_at,
		author: {
			id: r.author_id,
			name: r.author_name,
			username: r.username,
			image: r.avatar_url || r.author_image
		},
		like_count: r.like_count,
		comment_count: r.comment_count,
		liked_by_me: r.liked_by_me === true,
		is_mine: r.author_id === context.userId
	}));
});
var getSuggestedAthletes_createServerFn_handler = createServerRpc({
	id: "815336a91630b55d7790f232560835ec12ae22f07542e483fa2f63e840a3c607",
	name: "getSuggestedAthletes",
	filename: "src/lib/server/activity.ts"
}, (opts) => getSuggestedAthletes.__executeServer(opts));
var getSuggestedAthletes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSuggestedAthletes_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return sql`
      select
        u.id,
        u.name,
        up.username,
        coalesce(up.avatar_url, u.image) as image,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers,
        (select count(*)::int from programs p where p.user_id = u.id and p.is_public = true) as public_programs,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following
      from "user" u
      left join user_profiles up on up.user_id = u.id
      where u.id <> ${context.userId}
        and coalesce(up.visibility, 'public') = 'public'
      order by followers desc, public_programs desc
      limit 8
    `;
});
var likeActivity_createServerFn_handler = createServerRpc({
	id: "b66254c464d8c31c49eea4fc973c144639a8a31522c53452a4e60348ff47cf14",
	name: "likeActivity",
	filename: "src/lib/server/activity.ts"
}, (opts) => likeActivity.__executeServer(opts));
var likeActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(likeActivity_createServerFn_handler, async ({ context, data: eventId }) => {
	await (await getSql())`
      insert into activity_likes (event_id, user_id)
      values (${eventId}, ${context.userId})
      on conflict do nothing
    `;
	return { ok: true };
});
var unlikeActivity_createServerFn_handler = createServerRpc({
	id: "58b4f02b7793785fc64c7613e546f98d7c8af2d6467867ee79df990ca6ef30d0",
	name: "unlikeActivity",
	filename: "src/lib/server/activity.ts"
}, (opts) => unlikeActivity.__executeServer(opts));
var unlikeActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(unlikeActivity_createServerFn_handler, async ({ context, data: eventId }) => {
	await (await getSql())`
      delete from activity_likes
      where event_id = ${eventId} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var listComments_createServerFn_handler = createServerRpc({
	id: "fd090c0d36f73268aca4ab7f0e9a95212df4560e2020a912fac561986c5dce02",
	name: "listComments",
	filename: "src/lib/server/activity.ts"
}, (opts) => listComments.__executeServer(opts));
var listComments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(positiveId)).handler(listComments_createServerFn_handler, async ({ context, data: eventId }) => {
	return (await getSql())`
      select
        c.id, c.body, c.created_at::text as created_at, c.user_id,
        u.name, up.username,
        coalesce(up.avatar_url, u.image) as image
      from activity_comments c
      join "user" u on u.id = c.user_id
      left join user_profiles up on up.user_id = c.user_id
      where c.event_id = ${eventId}
      order by c.created_at asc
      limit 100
    `;
});
var addComment_createServerFn_handler = createServerRpc({
	id: "423e37c6daeab9d0f4f6942a042f43d19935b23e347eff79c6b7bbfeae49a504",
	name: "addComment",
	filename: "src/lib/server/activity.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => parseOrThrow(object({
	eventId: positiveId,
	body: string().trim().min(1).max(280)
}), d)).handler(addComment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`select id from activity_events where id = ${data.eventId}`).length === 0) throw new Error("Olay bulunamadı.");
	return { id: (await sql`
      insert into activity_comments (event_id, user_id, body)
      values (${data.eventId}, ${context.userId}, ${data.body})
      returning id
    `)[0].id };
});
var deleteActivity_createServerFn_handler = createServerRpc({
	id: "a044e278ec1c2b11f87b769d51ef8016bbbd8c280f81537be435a24a0cfa4ea0",
	name: "deleteActivity",
	filename: "src/lib/server/activity.ts"
}, (opts) => deleteActivity.__executeServer(opts));
var deleteActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(positiveId)).handler(deleteActivity_createServerFn_handler, async ({ context, data: eventId }) => {
	await (await getSql())`
      delete from activity_events
      where id = ${eventId} and user_id = ${context.userId}
    `;
	return { ok: true };
});
//#endregion
export { addComment_createServerFn_handler, deleteActivity_createServerFn_handler, getDiscoverFeed_createServerFn_handler, getFeed_createServerFn_handler, getSuggestedAthletes_createServerFn_handler, likeActivity_createServerFn_handler, listComments_createServerFn_handler, unlikeActivity_createServerFn_handler };
