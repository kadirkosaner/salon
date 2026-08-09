import { r as createServerFn } from "./ssr.mjs";
import { gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { ensureUserSeeded, searchDataset } from "./seed-DlydNDJa.mjs";
import { r as ensureUserProfile } from "./social-BjKrIrtg.mjs";
import { t as ensureCatalogSeeded } from "./catalog-CK8l1uze.mjs";
import { t as translatePrograms } from "./translations-B6V3kAoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-DRVIRLg_.js
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
		author_name: r.author_name ?? "User",
		is_catalog: r.user_id === "system",
		is_own: r.user_id === userId
	};
}
async function loadPublicPrograms(sql, userId, locale = "en") {
	const rows = await sql`
    select
      p.id, p.name, p.description, p.tags, p.share_code,
      coalesce(p.clone_count, 0)::int as clone_count,
      p.user_id,
      coalesce(u.name, case when p.user_id = 'system' then 'Salon' else 'User' end) as author_name,
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
  `;
	const tr = await translatePrograms(sql, rows, locale);
	return rows.map((r) => {
		const hit = tr.get(r.id);
		const base = mapProgram(r, userId);
		if (!hit) return base;
		return {
			...base,
			name: hit.name,
			description: hit.description
		};
	});
}
var getDiscoverHome_createServerFn_handler = createServerRpc({
	id: "c4f46824e85c9c073ba7de6e21f0c434366e69a27c7d3244ddd1814614a613ec",
	name: "getDiscoverHome",
	filename: "src/lib/server/discover.ts"
}, (opts) => getDiscoverHome.__executeServer(opts));
var getDiscoverHome = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ locale: string().optional() }).optional())).handler(getDiscoverHome_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	await ensureUserProfile(sql, context.userId);
	const locale = data?.locale ?? "en";
	const all = await loadPublicPrograms(sql, context.userId, locale);
	const completed = (await sql`
      select count(*)::int as c from workouts
      where user_id = ${context.userId} and status = 'completed'
    `)[0]?.c ?? 0;
	const levelHint = completed < 8 ? "baslangic" : completed < 40 ? "orta" : "ileri";
	const followMapped = (await sql`
      select
        p.id, p.name, p.description, p.tags, p.share_code,
        coalesce(p.clone_count, 0)::int as clone_count,
        p.user_id,
        coalesce(u.name, 'User') as author_name,
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
	const followTr = await translatePrograms(sql, followMapped, locale);
	const followWithTr = followMapped.map((p) => {
		const hit = followTr.get(p.id);
		return hit ? {
			...p,
			name: hit.name,
			description: hit.description
		} : p;
	});
	/** Each program appears on at most one shelf (priority order). */
	const used = /* @__PURE__ */ new Set();
	function take(list, n) {
		const out = [];
		for (const p of list) {
			if (used.has(p.id)) continue;
			used.add(p.id);
			out.push(p);
			if (out.length >= n) break;
		}
		return out;
	}
	const FEATURED_ORDER = [
		"FULL6X",
		"PPL6XX",
		"UL4DAY",
		"STR5XX",
		"ATH5XX",
		"DB4HYP",
		"FULL3X"
	];
	const featuredSorted = [...all].sort((a, b) => {
		if (a.is_catalog !== b.is_catalog) return a.is_catalog ? -1 : 1;
		const ia = FEATURED_ORDER.indexOf(a.share_code ?? "");
		const ib = FEATURED_ORDER.indexOf(b.share_code ?? "");
		const ra = ia === -1 ? 99 : ia;
		const rb = ib === -1 ? 99 : ib;
		if (ra !== rb) return ra - rb;
		return b.clone_count - a.clone_count;
	});
	const newSorted = [...all].sort((a, b) => {
		if (b.clone_count !== a.clone_count) return b.clone_count - a.clone_count;
		return b.id - a.id;
	});
	const levelFiltered = all.filter((p) => {
		const tags = (p.tags ?? "").toLowerCase();
		if (levelHint === "baslangic") return tags.includes("baslangic") || tags.includes("beginner");
		if (levelHint === "orta") return tags.includes("orta") || tags.includes("intermediate");
		return tags.includes("ileri") || tags.includes("advanced");
	});
	const fromFollowing = take(followWithTr, 8);
	return {
		featured: take(featuredSorted, 6),
		topCloned: take(newSorted, 6),
		fromFollowing,
		forLevel: take(levelFiltered, 6),
		levelHint
	};
});
var unifiedSearch_createServerFn_handler = createServerRpc({
	id: "4f16e469083809426eb9ce6433cde4dbda3c7f27ea3afae62a7d955a71e01655",
	name: "unifiedSearch",
	filename: "src/lib/server/discover.ts"
}, (opts) => unifiedSearch.__executeServer(opts));
var unifiedSearch = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	q: string().trim().min(1).max(80),
	locale: string().optional()
}))).handler(unifiedSearch_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	await ensureUserProfile(sql, context.userId);
	const term = data.q.trim();
	const locale = data.locale ?? "en";
	const like = `%${term}%`;
	const codeNorm = term.toUpperCase();
	const isShareCode = /^[A-HJ-NP-Z2-9]{6}$/.test(codeNorm);
	let shareCodeHit = null;
	if (isShareCode) {
		const codeRows = await sql`
        select
          p.id, p.name, p.description, p.tags, p.share_code,
          coalesce(p.clone_count, 0)::int as clone_count,
          p.user_id,
          coalesce(u.name, case when p.user_id = 'system' then 'Salon' else 'User' end) as author_name,
          (select count(*)::int from program_days pd where pd.program_id = p.id) as day_count,
          (
            select count(*)::int from program_exercises pe
            join program_days pd on pd.id = pe.program_day_id
            where pd.program_id = p.id
          ) as exercise_count
        from programs p
        left join "user" u on u.id = p.user_id
        where p.is_public = true
          and upper(p.share_code) = ${codeNorm}
        limit 1
      `;
		if (codeRows[0]) {
			shareCodeHit = mapProgram(codeRows[0], context.userId);
			const hit = (await translatePrograms(sql, [{
				id: shareCodeHit.id,
				name: shareCodeHit.name,
				description: shareCodeHit.description
			}], locale)).get(shareCodeHit.id);
			if (hit) shareCodeHit = {
				...shareCodeHit,
				name: hit.name,
				description: hit.description
			};
		}
	}
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
	const progRows = await loadPublicPrograms(sql, context.userId, locale);
	const qLower = term.toLowerCase();
	const programs = progRows.filter((p) => {
		if (shareCodeHit && p.id === shareCodeHit.id) return false;
		return `${p.name} ${p.description ?? ""} ${p.tags ?? ""} ${p.author_name} ${p.share_code ?? ""}`.toLowerCase().includes(qLower);
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
		}))].slice(0, 16),
		shareCodeHit,
		shareCodeMiss: isShareCode && !shareCodeHit,
		shareCodeQuery: isShareCode ? codeNorm : null
	};
});
//#endregion
export { getDiscoverHome_createServerFn_handler, unifiedSearch_createServerFn_handler };
