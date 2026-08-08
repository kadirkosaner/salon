import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CaZaDWNm.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { g as v, t as authMiddleware } from "./validation-CwL44con.mjs";
import { ensureUserSeeded, searchDataset } from "./seed-CzdWnGfz.mjs";
import { t as ensureUserProfile } from "./social-Bu5LAUW-.mjs";
import { t as ensureCatalogSeeded } from "./catalog-0KNMdLm1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-BRsSXbv3.js
function mapProgram(r, userId) {
	return {
		id: r.id,
		name: r.name,
		description: r.description,
		tags: r.tags,
		share_code: r.share_code,
		clone_count: r.clone_count,
		day_count: r.day_count,
		exercise_count: r.exercise_count,
		author_name: r.author_name ?? "Sporcu",
		is_catalog: r.user_id === "system",
		is_own: r.user_id === userId
	};
}
async function loadPublicPrograms(sql, userId) {
	return (await sql`
    select
      p.id, p.name, p.description, p.tags, p.share_code,
      coalesce(p.clone_count, 0)::int as clone_count,
      p.user_id,
      coalesce(u.name, case when p.user_id = 'system' then 'Salon' else 'Sporcu' end) as author_name,
      (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
      (
        select count(*)::int from program_exercises pe
        join program_days pd on pd.id = pe.program_day_id
        where pd.program_id = p.id
      ) as exercise_count
    from programs p
    left join "user" u on u.id = p.user_id
    where p.is_public = true
    order by p.clone_count desc, p.id desc
    limit 80
  `).map((r) => mapProgram(r, userId));
}
var getDiscoverHome_createServerFn_handler = createServerRpc({
	id: "c4f46824e85c9c073ba7de6e21f0c434366e69a27c7d3244ddd1814614a613ec",
	name: "getDiscoverHome",
	filename: "src/lib/server/discover.ts"
}, (opts) => getDiscoverHome.__executeServer(opts));
var getDiscoverHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDiscoverHome_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	await ensureUserProfile(sql, context.userId);
	const all = await loadPublicPrograms(sql, context.userId);
	const completed = (await sql`
      select count(*)::int as c from workouts
      where user_id = ${context.userId} and status = 'completed'
    `)[0]?.c ?? 0;
	const levelHint = completed < 8 ? "baslangic" : completed < 40 ? "orta" : "ileri";
	const featured = [...all].sort((a, b) => {
		if (a.is_catalog !== b.is_catalog) return a.is_catalog ? -1 : 1;
		const order = (c) => c === "FULL6X" ? 0 : c === "FULL3X" ? 1 : c === "UL4DAY" ? 2 : 9;
		return order(a.share_code) - order(b.share_code);
	}).slice(0, 10);
	const topCloned = [...all].sort((a, b) => b.clone_count - a.clone_count).slice(0, 12);
	const fromFollowing = (await sql`
      select
        p.id, p.name, p.description, p.tags, p.share_code,
        coalesce(p.clone_count, 0)::int as clone_count,
        p.user_id,
        coalesce(u.name, 'Sporcu') as author_name,
        (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
        (
          select count(*)::int from program_exercises pe
          join program_days pd on pd.id = pe.program_day_id
          where pd.program_id = p.id
        ) as exercise_count
      from programs p
      join user_follows f on f.following_id = p.user_id
      left join "user" u on u.id = p.user_id
      where f.follower_id = ${context.userId}
        and p.is_public = true
        and p.user_id <> ${context.userId}
      order by p.clone_count desc, p.id desc
      limit 20
    `).map((r) => mapProgram(r, context.userId));
	const forLevel = all.filter((p) => {
		const tags = (p.tags ?? "").toLowerCase();
		if (levelHint === "baslangic") return tags.includes("baslangic") || tags.includes("beginner");
		if (levelHint === "orta") return tags.includes("orta") || tags.includes("intermediate");
		return tags.includes("ileri") || tags.includes("advanced");
	}).slice(0, 12);
	return {
		featured,
		topCloned,
		fromFollowing,
		forLevel: forLevel.length > 0 ? forLevel : all.filter((p) => p.is_catalog).slice(0, 6),
		levelHint
	};
});
var unifiedSearch_createServerFn_handler = createServerRpc({
	id: "4f16e469083809426eb9ce6433cde4dbda3c7f27ea3afae62a7d955a71e01655",
	name: "unifiedSearch",
	filename: "src/lib/server/discover.ts"
}, (opts) => unifiedSearch.__executeServer(opts));
var unifiedSearch = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ q: string().trim().min(1).max(80) }))).handler(unifiedSearch_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	await ensureUserProfile(sql, context.userId);
	const term = data.q.trim();
	const like = `%${term}%`;
	const people = (await sql`
      select
        u.id, u.name, up.username, u.image, up.avatar_url,
        (select count(*)::int from user_follows f where f.following_id = u.id) as followers,
        (select count(*)::int from user_follows f where f.follower_id = u.id) as following,
        exists(
          select 1 from user_follows f
          where f.follower_id = ${context.userId} and f.following_id = u.id
        ) as is_following,
        exists(
          select 1 from user_follows f
          where f.follower_id = u.id and f.following_id = ${context.userId}
        ) as follows_you,
        (select count(*)::int from programs p
          where p.user_id = u.id and p.is_public = true) as public_programs
      from "user" u
      left join user_profiles up on up.user_id = u.id
      where u.id <> ${context.userId}
        and (
          u.name ilike ${like}
          or coalesce(up.username, '') ilike ${like}
        )
        and coalesce(up.visibility, 'public') <> 'private'
      order by
        case when lower(coalesce(up.username,'')) = lower(${term}) then 0
             when lower(u.name) = lower(${term}) then 1
             else 2 end,
        u.name
      limit 12
    `).map((r) => ({
		id: r.id,
		name: r.name,
		username: r.username,
		image: r.avatar_url || r.image,
		followers: r.followers,
		following: r.following,
		is_following: r.is_following === true,
		follows_you: r.follows_you === true,
		is_self: false,
		public_programs: r.public_programs
	}));
	const progRows = await loadPublicPrograms(sql, context.userId);
	const qLower = term.toLowerCase();
	const programs = progRows.filter((p) => {
		return `${p.name} ${p.description ?? ""} ${p.tags ?? ""} ${p.author_name}`.toLowerCase().includes(qLower);
	}).slice(0, 12);
	const localEx = await sql`
      select id, name, muscle_group, detail
      from exercises
      where (owner_id is null or owner_id = ${context.userId})
        and lower(name) like ${"%" + qLower + "%"}
      order by name
      limit 10
    `;
	const localNames = new Set(localEx.map((e) => e.name.toLowerCase()));
	const dataset = searchDataset(term, 12).filter((e) => !localNames.has(e.name.toLowerCase())).slice(0, 8);
	return {
		people,
		programs,
		exercises: [...localEx.map((e) => ({
			name: e.name,
			muscle_group: e.muscle_group,
			detail: e.detail,
			source: "local",
			id: e.id
		})), ...dataset.map((e) => ({
			name: e.name,
			muscle_group: e.muscle,
			detail: e.note ?? null,
			source: "dataset"
		}))].slice(0, 16)
	};
});
//#endregion
export { getDiscoverHome_createServerFn_handler, unifiedSearch_createServerFn_handler };
