import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { n as DEFAULT_PROGRAM_DESCRIPTION, r as DEFAULT_PROGRAM_NAME, t as DEFAULT_PROGRAM } from "./library-DXw4XNK8.mjs";
import { a as isoDow } from "./utils-BtReAY3a.mjs";
import { r as getSql } from "./db-CFyZej8J.mjs";
import { a as ensureUserSeeded, n as createServerRpc } from "./seed-Dy9IlGmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/share-Bndvru9U.js
var CATALOG = [
	{
		key: "fullsplit6",
		name: DEFAULT_PROGRAM_NAME,
		description: DEFAULT_PROGRAM_DESCRIPTION,
		tags: "katalog,fullsplit,6gun,ileri",
		share_code: "FULL6X",
		days: DEFAULT_PROGRAM
	},
	{
		key: "full3",
		name: "Full Body (3 gün)",
		description: "Başlangıç ve yoğun tempo için. Pazartesi / Çarşamba / Cuma full body.",
		tags: "katalog,baslangic,fullbody",
		share_code: "FULL3X",
		days: [
			{
				dow: 1,
				name: "FULL A",
				focus: "İtiş + bacak + core",
				exercises: [
					{
						exercise: "Squat",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 150,
						load_tag: "agir"
					},
					{
						exercise: "Dumbbell Bench Press",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 120,
						load_tag: "orta_agir"
					},
					{
						exercise: "Lat Pulldown",
						sets: 3,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Seated Dumbbell Shoulder Press",
						sets: 2,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Plank",
						sets: 3,
						rep_lo: 20,
						rep_hi: 40,
						rest_sec: 60,
						load_tag: "hafif"
					}
				]
			},
			{
				dow: 3,
				name: "FULL B",
				focus: "Çekiş + hinge + kol",
				exercises: [
					{
						exercise: "Romanian Deadlift",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 150,
						load_tag: "agir"
					},
					{
						exercise: "Chest-Supported Row",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 120,
						load_tag: "orta_agir"
					},
					{
						exercise: "Incline Dumbbell Press",
						sets: 3,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Biceps Curl",
						sets: 2,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 60,
						load_tag: "orta"
					},
					{
						exercise: "Triceps Pushdown",
						sets: 2,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 60,
						load_tag: "orta"
					}
				]
			},
			{
				dow: 5,
				name: "FULL C",
				focus: "Bacak + omuz + core",
				exercises: [
					{
						exercise: "Leg Press",
						sets: 3,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 120,
						load_tag: "orta_agir"
					},
					{
						exercise: "Dumbbell Row",
						sets: 3,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Lateral Raise",
						sets: 3,
						rep_lo: 12,
						rep_hi: 15,
						rest_sec: 60,
						load_tag: "hafif"
					},
					{
						exercise: "Standing Calf Raise",
						sets: 3,
						rep_lo: 12,
						rep_hi: 15,
						rest_sec: 60,
						load_tag: "orta"
					},
					{
						exercise: "Mekik",
						sets: 3,
						rep_lo: 12,
						rep_hi: 15,
						rest_sec: 45,
						load_tag: "hafif"
					}
				]
			}
		]
	},
	{
		key: "ul4",
		name: "Upper / Lower (4 gün)",
		description: "Dengeli 4 günlük üst-alt split. Pazartesi–Perşembe aktif, hafta sonu serbest.",
		tags: "katalog,upperlower,orta",
		share_code: "UL4DAY",
		days: [
			{
				dow: 1,
				name: "UPPER A",
				focus: "Göğüs · Sırt · Omuz",
				exercises: [
					{
						exercise: "Barbell Bench Press",
						sets: 4,
						rep_lo: 5,
						rep_hi: 8,
						rest_sec: 150,
						load_tag: "agir"
					},
					{
						exercise: "Barbell Row",
						sets: 4,
						rep_lo: 6,
						rep_hi: 8,
						rest_sec: 120,
						load_tag: "agir"
					},
					{
						exercise: "Seated Dumbbell Shoulder Press",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Lat Pulldown",
						sets: 3,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Biceps Curl",
						sets: 2,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 60,
						load_tag: "orta"
					}
				]
			},
			{
				dow: 2,
				name: "LOWER A",
				focus: "Squat pattern",
				exercises: [
					{
						exercise: "Squat",
						sets: 4,
						rep_lo: 5,
						rep_hi: 8,
						rest_sec: 180,
						load_tag: "agir"
					},
					{
						exercise: "Romanian Deadlift",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 120,
						load_tag: "orta_agir"
					},
					{
						exercise: "Leg Press",
						sets: 3,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Standing Calf Raise",
						sets: 4,
						rep_lo: 10,
						rep_hi: 15,
						rest_sec: 60,
						load_tag: "orta"
					}
				]
			},
			{
				dow: 4,
				name: "UPPER B",
				focus: "Hacim odaklı üst",
				exercises: [
					{
						exercise: "Incline Dumbbell Press",
						sets: 4,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 120,
						load_tag: "orta_agir"
					},
					{
						exercise: "Chest-Supported Row",
						sets: 4,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta"
					},
					{
						exercise: "Lateral Raise",
						sets: 3,
						rep_lo: 12,
						rep_hi: 15,
						rest_sec: 60,
						load_tag: "hafif"
					},
					{
						exercise: "Face Pull",
						sets: 3,
						rep_lo: 12,
						rep_hi: 15,
						rest_sec: 60,
						load_tag: "hafif"
					},
					{
						exercise: "Triceps Pushdown",
						sets: 3,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 60,
						load_tag: "orta"
					}
				]
			},
			{
				dow: 5,
				name: "LOWER B",
				focus: "Kalça + hamstring",
				exercises: [
					{
						exercise: "Deadlift",
						sets: 3,
						rep_lo: 3,
						rep_hi: 5,
						rest_sec: 180,
						load_tag: "agir"
					},
					{
						exercise: "Hip Thrust",
						sets: 3,
						rep_lo: 8,
						rep_hi: 12,
						rest_sec: 90,
						load_tag: "orta_agir"
					},
					{
						exercise: "Leg Curl",
						sets: 3,
						rep_lo: 10,
						rep_hi: 12,
						rest_sec: 75,
						load_tag: "orta"
					},
					{
						exercise: "Bulgarian Split Squat",
						sets: 3,
						rep_lo: 8,
						rep_hi: 10,
						rest_sec: 90,
						load_tag: "orta"
					}
				]
			}
		]
	}
];
var CATALOG_VERSION = "fullsplit6-v1";
async function insertProgramDays(sql, programId, days, byName) {
	for (let di = 0; di < days.length; di++) {
		const day = days[di];
		const dayId = (await sql`
      insert into program_days (program_id, dow, name, focus, sort)
      values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
      returning id
    `)[0].id;
		for (let ei = 0; ei < day.exercises.length; ei++) {
			const pe = day.exercises[ei];
			const exerciseId = byName.get(pe.exercise);
			if (!exerciseId) continue;
			await sql`
        insert into program_exercises (
          program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
          rest_sec, load_tag, note, sort
        ) values (
          ${dayId}, ${exerciseId}, ${pe.detail ?? null}, ${pe.sets},
          ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag},
          ${pe.note ?? null}, ${ei}
        )
      `;
		}
	}
}
/** Seed / refresh Salon catalog (user_id = system). Always sync FULL SPLIT. */
async function ensureCatalogSeeded(sql) {
	try {
		await sql`select description, is_public, share_code from programs limit 0`;
	} catch {
		return;
	}
	await sql`
    delete from programs
    where user_id = 'system' and share_code = 'PPL6XX'
  `;
	const lib = await sql`
    select id, name from exercises where owner_id is null
  `;
	for (const missing of ["Topuklara Dokunma", "Makas"]) if (!lib.some((e) => e.name === missing)) await sql`
        insert into exercises (owner_id, name, detail, unit, muscle_group)
        values (null, ${missing}, null, 'kg', 'core')
      `;
	const lib2 = await sql`
    select id, name from exercises where owner_id is null
  `;
	const byName = new Map(lib2.map((e) => [e.name, e.id]));
	for (const cat of CATALOG) {
		const existing = await sql`
      select id, tags from programs
      where user_id = 'system' and share_code = ${cat.share_code}
    `;
		if (existing.length > 0) {
			const id = existing[0].id;
			if (!(existing[0].tags ?? "").includes(CATALOG_VERSION) && cat.key === "fullsplit6") {
				await sql`delete from program_days where program_id = ${id}`;
				await sql`
          update programs set
            name = ${cat.name},
            description = ${cat.description},
            tags = ${`${cat.tags},${CATALOG_VERSION}`}
          where id = ${id}
        `;
				await insertProgramDays(sql, id, cat.days, byName);
			}
			continue;
		}
		await insertProgramDays(sql, (await sql`
      insert into programs (
        user_id, name, description, tags, is_active, valid_from,
        is_public, share_code, clone_count
      ) values (
        'system', ${cat.name}, ${cat.description},
        ${`${cat.tags},${CATALOG_VERSION}`},
        false, current_date, true, ${cat.share_code}, 0
      )
      returning id
    `)[0].id, cat.days, byName);
	}
}
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
	const today = /* @__PURE__ */ new Date();
	await sql`
    delete from workouts
    where user_id = ${userId}
      and date >= ${`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`}::date
      and status in ('planned', 'skipped', 'in_progress')
  `;
}
/**
* Remap program day DOWs so `startSourceDayId` lands on `startDate`'s weekday,
* preserving relative gaps between sessions (rest days stay as empty DOWs).
*/
function remapDow(originalDow, anchorOriginalDow, startDateDow) {
	const rel = (originalDow - anchorOriginalDow + 7) % 7;
	return (startDateDow - 1 + rel) % 7 + 1;
}
var listDiscoverPrograms_createServerFn_handler = createServerRpc({
	id: "6d2b000444254eed06cba44d7955f6d54391af4ed14919699d492338be3cafcd",
	name: "listDiscoverPrograms",
	filename: "src/lib/server/share.ts"
}, (opts) => listDiscoverPrograms.__executeServer(opts));
var listDiscoverPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDiscoverPrograms_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
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
    `).map((r) => ({
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
		is_own: r.user_id === context.userId
	}));
});
var getPublicProgramDetail_createServerFn_handler = createServerRpc({
	id: "8ed95332c23efdc012d2d678efa7cc61217d2f31e89f6d84896e63e5d24a8fb0",
	name: "getPublicProgramDetail",
	filename: "src/lib/server/share.ts"
}, (opts) => getPublicProgramDetail.__executeServer(opts));
var getPublicProgramDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getPublicProgramDetail_createServerFn_handler, async ({ context, data: id }) => {
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
	if (!p.is_public && p.user_id !== context.userId) throw new Error("Bu program gizli.");
	const days = await sql`
      select id, dow, name, focus from program_days
      where program_id = ${id}
      order by sort, dow
    `;
	const dayDetails = [];
	for (const d of days) {
		const exercises = await sql`
        select pe.id, e.name as exercise_name, pe.detail, pe.sets, pe.rep_lo, pe.rep_hi,
               pe.rest_sec, pe.load_tag, pe.note, e.form_cues
        from program_exercises pe
        join exercises e on e.id = pe.exercise_id
        where pe.program_day_id = ${d.id}
        order by pe.sort
      `;
		dayDetails.push({
			...d,
			exercises
		});
	}
	const author = await sql`
      select name from "user" where id = ${p.user_id}
    `;
	return {
		...p,
		author_name: p.user_id === "system" ? "Salon" : author[0]?.name ?? "Sporcu",
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
var publishProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(publishProgram_createServerFn_handler, async ({ context, data }) => {
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
var updateProgramMeta = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProgramMeta_createServerFn_handler, async ({ context, data }) => {
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
var cloneProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(cloneProgram_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	await ensureCatalogSeeded(sql);
	let sourceId = data.programId ?? null;
	if (!sourceId && data.shareCode) {
		const found = await sql`
        select id from programs
        where share_code = ${data.shareCode.trim().toUpperCase()} and is_public = true
      `;
		if (found.length === 0) throw new Error("Paylaşım kodu geçersiz veya program gizli.");
		sourceId = found[0].id;
	}
	if (!sourceId) throw new Error("Program belirtilmedi.");
	const src = await sql`
      select id, name, description, tags, is_public, user_id
      from programs where id = ${sourceId}
    `;
	if (src.length === 0) throw new Error("Program bulunamadı.");
	const s = src[0];
	if (!s.is_public && s.user_id !== context.userId && s.user_id !== "system") throw new Error("Bu program kopyalanamaz.");
	await deleteUserPrograms(sql, context.userId);
	await clearFuturePlanned(sql, context.userId);
	const today = /* @__PURE__ */ new Date();
	const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
	const startDate = data.startDate && /^\d{4}-\d{2}-\d{2}$/.test(data.startDate) ? data.startDate : todayIso;
	const newName = (data.name?.trim() || s.name).slice(0, 80);
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
	for (const d of days) {
		const newDayId = (await sql`
        insert into program_days (program_id, dow, name, focus, sort)
        values (${newId}, ${remapDow(d.dow, anchorOrigDow, startDow)}, ${d.name}, ${d.focus}, ${d.sort})
        returning id
      `)[0].id;
		const exercises = await sql`
        select exercise_id, detail, sets, rep_lo, rep_hi, rest_sec, load_tag, note, sort
        from program_exercises where program_day_id = ${d.id}
        order by sort
      `;
		for (const pe of exercises) await sql`
          insert into program_exercises (
            program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
            rest_sec, load_tag, note, sort
          ) values (
            ${newDayId}, ${pe.exercise_id}, ${pe.detail}, ${pe.sets},
            ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec}, ${pe.load_tag},
            ${pe.note}, ${pe.sort}
          )
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
var abandonProgram_createServerFn_handler = createServerRpc({
	id: "75941c3f22f18a3c6aef4550ffa7bc1475c743df3a517aaebe8057f21412cb03",
	name: "abandonProgram",
	filename: "src/lib/server/share.ts"
}, (opts) => abandonProgram.__executeServer(opts));
var abandonProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(abandonProgram_createServerFn_handler, async ({ context }) => {
	await deleteUserPrograms(await getSql(), context.userId);
	return { ok: true };
});
//#endregion
export { abandonProgram_createServerFn_handler, cloneProgram_createServerFn_handler, getPublicProgramDetail_createServerFn_handler, listDiscoverPrograms_createServerFn_handler, publishProgram_createServerFn_handler, updateProgramMeta_createServerFn_handler };
