import { r as createServerFn } from "./ssr.mjs";
import { dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { _ as v, a as noInput, l as positiveId, r as isoDate, s as optionalText, t as authMiddleware } from "./validation-BVPcnxwj.mjs";
import { i as withTransaction, r as getSql } from "./db-DdbNJQxT.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { ensureUserSeeded } from "./seed-DlydNDJa.mjs";
import { i as emitProgramPublished } from "./activity-BAbxc4Wl.mjs";
import { c as remapDow, s as isoDow } from "./utils-DKNImH2A.mjs";
import { todayForUser } from "./time-BN4ZvYw3.mjs";
import { t as ensureCatalogSeeded } from "./catalog-CK8l1uze.mjs";
import { t as translatePrograms } from "./translations-B6V3kAoC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-eQhTn2Gq.js
function makeShareCode() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let s = "";
	for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * 32)];
	return s;
}
/** Delete all of a user's personal programs (cascade days/exercises). */
async function deleteUserPrograms(sql, userId) {
	await sql`
    update workouts set program_day_id = null
    where user_id = ${userId}
  `;
	await sql`delete from programs where user_id = ${userId}`;
}
/** Drop future planned shells so new program can fill the calendar. */
async function clearFuturePlanned(sql, userId) {
	await sql`
    delete from workouts
    where user_id = ${userId}
      and date >= ${await todayForUser(sql, userId)}::date
      and status in ('planned', 'skipped', 'in_progress')
  `;
}
var listDiscoverPrograms_createServerFn_handler = createServerRpc({
	id: "6d2b000444254eed06cba44d7955f6d54391af4ed14919699d492338be3cafcd",
	name: "listDiscoverPrograms",
	filename: "src/lib/server/share.ts"
}, (opts) => listDiscoverPrograms.__executeServer(opts));
var listDiscoverPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({ locale: string().optional() }).optional())).handler(listDiscoverPrograms_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	const locale = data?.locale ?? "en";
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
      order by
        case when p.user_id = 'system' then 0 else 1 end,
        case p.share_code
          when 'FULL6X' then 0
          when 'FULL3X' then 1
          when 'UL4DAY' then 2
          else 3
        end,
        p.clone_count desc,
        p.id desc
      limit 60
    `;
	const tr = await translatePrograms(sql, rows.map((r) => ({
		id: r.id,
		name: r.name,
		description: r.description
	})), locale);
	return rows.map((r) => {
		const hit = tr.get(r.id);
		return {
			id: r.id,
			name: hit?.name ?? r.name,
			description: hit?.description ?? r.description,
			tags: r.tags,
			share_code: r.share_code,
			clone_count: r.clone_count,
			day_count: r.day_count,
			exercise_count: r.exercise_count,
			author_name: r.author_name ?? "User",
			is_catalog: r.user_id === "system",
			is_own: r.user_id === context.userId
		};
	});
});
var getPublicProgramDetail_createServerFn_handler = createServerRpc({
	id: "8ed95332c23efdc012d2d678efa7cc61217d2f31e89f6d84896e63e5d24a8fb0",
	name: "getPublicProgramDetail",
	filename: "src/lib/server/share.ts"
}, (opts) => getPublicProgramDetail.__executeServer(opts));
var getPublicProgramDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	locale: string().optional()
}))).handler(getPublicProgramDetail_createServerFn_handler, async ({ context, data }) => {
	const id = data.id;
	const locale = data.locale ?? "en";
	const sql = await getSql();
	await ensureCatalogSeeded(sql);
	const progs = await sql`
      select id, name, description, tags, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             user_id, is_public
      from programs where id = ${id}
    `;
	if (progs.length === 0) throw new Error("Program bulunamadı.");
	const p = progs[0];
	const tr = (await translatePrograms(sql, [{
		id: p.id,
		name: p.name,
		description: p.description
	}], locale)).get(p.id);
	if (tr) {
		p.name = tr.name;
		p.description = tr.description;
	}
	if (!p.is_public && p.user_id !== context.userId) throw new Error("Bu program gizli.");
	const days = await sql`
      select id, dow, name, focus from program_days
      where program_id = ${id}
      order by sort, dow
    `;
	const dayIds = days.map((d) => d.id);
	const allEx = dayIds.length === 0 ? [] : await sql`
            select pe.program_day_id, pe.id, e.name as exercise_name, pe.detail,
                   pe.sets, pe.rep_lo, pe.rep_hi, pe.rest_sec, pe.load_tag, pe.note,
                   e.form_cues
            from program_exercises pe
            join exercises e on e.id = pe.exercise_id
            where pe.program_day_id = any(${dayIds}::int[])
            order by pe.program_day_id, pe.sort
          `;
	const byDay = /* @__PURE__ */ new Map();
	for (const ex of allEx) {
		const list = byDay.get(ex.program_day_id) ?? [];
		list.push(ex);
		byDay.set(ex.program_day_id, list);
	}
	const dayDetails = days.map((d) => ({
		...d,
		exercises: (byDay.get(d.id) ?? []).map(({ program_day_id: _pd, ...rest }) => rest)
	}));
	const author = await sql`
      select name from "user" where id = ${p.user_id}
    `;
	return {
		...p,
		author_name: p.user_id === "system" ? "Salon" : author[0]?.name ?? "User",
		is_catalog: p.user_id === "system",
		is_own: p.user_id === context.userId,
		days: dayDetails
	};
});
var publishProgram_createServerFn_handler = createServerRpc({
	id: "4312477b45dbbfc69b6ed18219f898c149adb6df6eb1777809c50fcf94a806a5",
	name: "publishProgram",
	filename: "src/lib/server/share.ts"
}, (opts) => publishProgram.__executeServer(opts));
var publishProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	is_public: boolean(),
	description: optionalText(2e3),
	tags: optionalText(200)
}))).handler(publishProgram_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const owned = await sql`
      select id, share_code from programs
      where id = ${data.id} and user_id = ${context.userId}
    `;
	if (owned.length === 0) throw new Error("Program bulunamadı.");
	let code = owned[0].share_code;
	if (data.is_public && !code) {
		for (let attempt = 0; attempt < 8; attempt++) {
			const candidate = makeShareCode();
			if ((await sql`select id from programs where share_code = ${candidate}`).length === 0) {
				code = candidate;
				break;
			}
		}
		if (!code) throw new Error("Paylaşım kodu üretilemedi.");
	}
	await sql`
      update programs set
        is_public = ${data.is_public},
        share_code = ${code},
        description = coalesce(${data.description ?? null}, description),
        tags = coalesce(${data.tags ?? null}, tags)
      where id = ${data.id} and user_id = ${context.userId}
    `;
	if (data.is_public) try {
		await emitProgramPublished(sql, context.userId, data.id);
	} catch {}
	return {
		ok: true,
		share_code: code,
		is_public: data.is_public
	};
});
var updateProgramMeta_createServerFn_handler = createServerRpc({
	id: "51a99a75ec2b797b2a652d1abc3b9af80ebab339ca49be6d184880428fbecbe2",
	name: "updateProgramMeta",
	filename: "src/lib/server/share.ts"
}, (opts) => updateProgramMeta.__executeServer(opts));
var updateProgramMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	id: positiveId,
	name: string().trim().min(1).max(80).optional(),
	description: optionalText(2e3),
	tags: optionalText(200)
}))).handler(updateProgramMeta_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from programs where id = ${data.id} and user_id = ${context.userId}
    `).length === 0) throw new Error("Program bulunamadı.");
	if (data.name !== void 0) await sql`
        update programs set name = ${data.name.trim() || "Program"}
        where id = ${data.id}
      `;
	if (data.description !== void 0) await sql`
        update programs set description = ${data.description}
        where id = ${data.id}
      `;
	if (data.tags !== void 0) await sql`update programs set tags = ${data.tags} where id = ${data.id}`;
	return { ok: true };
});
var cloneProgram_createServerFn_handler = createServerRpc({
	id: "2fdb5dc60c83dfbec29c79203d6e5f4f6c450805d2b8dc566f1fabcdf49a93b0",
	name: "cloneProgram",
	filename: "src/lib/server/share.ts"
}, (opts) => cloneProgram.__executeServer(opts));
var cloneProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	programId: positiveId.optional(),
	shareCode: string().trim().min(4).max(8).optional(),
	setActive: boolean().optional(),
	name: string().trim().max(80).optional(),
	startDate: isoDate.optional(),
	startSourceDayId: positiveId.optional()
}))).handler(cloneProgram_createServerFn_handler, async ({ context, data }) => {
	const sql0 = await getSql();
	await ensureUserSeeded(sql0, context.userId);
	await ensureCatalogSeeded(sql0);
	let sourceId = data.programId ?? null;
	if (!sourceId && data.shareCode) {
		const found = await sql0`
        select id from programs
        where share_code = ${data.shareCode.trim().toUpperCase()} and is_public = true
      `;
		if (found.length === 0) throw new Error("Paylaşım kodu geçersiz veya program gizli.");
		sourceId = found[0].id;
	}
	if (!sourceId) throw new Error("Program belirtilmedi.");
	const src = await sql0`
      select id, name, description, tags, is_public, user_id
      from programs where id = ${sourceId}
    `;
	if (src.length === 0) throw new Error("Program bulunamadı.");
	const s = src[0];
	if (!s.is_public && s.user_id !== context.userId && s.user_id !== "system") throw new Error("Bu program kopyalanamaz.");
	const todayIso = await todayForUser(sql0, context.userId);
	const startDate = data.startDate ?? todayIso;
	const newName = (data.name?.trim() || s.name).slice(0, 80);
	return withTransaction(async (sql) => {
		await deleteUserPrograms(sql, context.userId);
		await clearFuturePlanned(sql, context.userId);
		const newId = (await sql`
        insert into programs (
          user_id, name, description, tags, is_active, valid_from,
          is_public, source_program_id
        ) values (
          ${context.userId}, ${newName}, ${s.description}, ${s.tags},
          true, ${startDate}::date,
          false, ${s.id}
        )
        returning id
      `)[0].id;
		const days = await sql`
        select id, dow, name, focus, sort from program_days
        where program_id = ${s.id}
        order by sort, dow
      `;
		let anchor = days[0];
		if (data.startSourceDayId) {
			const hit = days.find((d) => d.id === data.startSourceDayId);
			if (hit) anchor = hit;
		}
		const startDow = isoDow(startDate);
		const anchorOrigDow = anchor?.dow ?? 1;
		if (days.length > 0) {
			const values = [];
			const placeholders = [];
			let p = 1;
			for (const d of days) {
				const newDow = remapDow(d.dow, anchorOrigDow, startDow);
				placeholders.push(`($${p++}, $${p++}, $${p++}, $${p++}, $${p++})`);
				values.push(newId, newDow, d.name, d.focus, d.sort);
			}
			await sql.query(`insert into program_days (program_id, dow, name, focus, sort)
           values ${placeholders.join(", ")}`, values);
			await sql`
          insert into program_exercises (
            program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
            rest_sec, load_tag, note, sort
          )
          select
            npd.id,
            pe.exercise_id,
            pe.detail,
            pe.sets,
            pe.rep_lo,
            pe.rep_hi,
            pe.rest_sec,
            pe.load_tag,
            pe.note,
            pe.sort
          from program_exercises pe
          join program_days opd
            on opd.id = pe.program_day_id and opd.program_id = ${s.id}
          join program_days npd
            on npd.program_id = ${newId} and npd.sort = opd.sort
          order by npd.sort, pe.sort
        `;
		}
		await sql`
        update programs set clone_count = coalesce(clone_count, 0) + 1
        where id = ${s.id}
      `;
		return {
			id: newId,
			name: newName,
			startDate,
			startDow,
			startDayName: anchor?.name ?? null
		};
	});
});
var abandonProgram_createServerFn_handler = createServerRpc({
	id: "75941c3f22f18a3c6aef4550ffa7bc1475c743df3a517aaebe8057f21412cb03",
	name: "abandonProgram",
	filename: "src/lib/server/share.ts"
}, (opts) => abandonProgram.__executeServer(opts));
var abandonProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(noInput).handler(abandonProgram_createServerFn_handler, async ({ context }) => {
	return withTransaction(async (sql) => {
		await sql`
        update programs set is_active = false
        where user_id = ${context.userId}
      `;
		await clearFuturePlanned(sql, context.userId);
		await deleteUserPrograms(sql, context.userId);
		await clearFuturePlanned(sql, context.userId);
		return { ok: true };
	});
});
//#endregion
export { abandonProgram_createServerFn_handler, cloneProgram_createServerFn_handler, getPublicProgramDetail_createServerFn_handler, listDiscoverPrograms_createServerFn_handler, publishProgram_createServerFn_handler, updateProgramMeta_createServerFn_handler };
