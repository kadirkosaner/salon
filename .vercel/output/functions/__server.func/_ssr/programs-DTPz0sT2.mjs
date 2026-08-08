import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { r as getSql } from "./db-CFyZej8J.mjs";
import { a as ensureUserSeeded, n as createServerRpc } from "./seed-Dy9IlGmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programs-DTPz0sT2.js
var listPrograms_createServerFn_handler = createServerRpc({
	id: "594d4eb468e641b2e1946099093db375f6f1335f8f5b3d3720ed9d6ff2863e83",
	name: "listPrograms",
	filename: "src/lib/server/programs.ts"
}, (opts) => listPrograms.__executeServer(opts));
var listPrograms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPrograms_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	return sql`
      select id, name, description, is_active, is_public, share_code,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs
      where user_id = ${context.userId}
      order by is_active desc, valid_from desc
    `;
});
var getActiveProgram_createServerFn_handler = createServerRpc({
	id: "492c59b7ae7e87a93f0769074a3c2fa0854245b8937346ac25ac0fe0be29fbaa",
	name: "getActiveProgram",
	filename: "src/lib/server/programs.ts"
}, (opts) => getActiveProgram.__executeServer(opts));
var getActiveProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getActiveProgram_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const progs = await sql`
      select id, name, description, tags, is_active, is_public, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs
      where user_id = ${context.userId} and is_active = true
      order by id desc
      limit 1
    `;
	if (progs.length === 0) return null;
	return loadProgram(sql, progs[0]);
});
var getProgram_createServerFn_handler = createServerRpc({
	id: "61e9a16a1abc76676e3cf0c280b82fd182926a7567dc10b2a449c17d772964b0",
	name: "getProgram",
	filename: "src/lib/server/programs.ts"
}, (opts) => getProgram.__executeServer(opts));
var getProgram = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getProgram_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const progs = await sql`
      select id, name, description, tags, is_active, is_public, share_code,
             coalesce(clone_count, 0)::int as clone_count,
             valid_from::text as valid_from, valid_to::text as valid_to
      from programs where id = ${id} and user_id = ${context.userId}
    `;
	if (progs.length === 0) return null;
	return loadProgram(sql, progs[0]);
});
async function loadProgram(sql, p) {
	const days = await sql`
    select id, program_id, dow, name, focus, sort
    from program_days where program_id = ${p.id}
    order by sort, dow
  `;
	const resultDays = [];
	for (const d of days) {
		const exercises = await sql`
      select pe.id, pe.exercise_id, e.name as exercise_name,
             pe.detail, e.unit, pe.sets, pe.rep_lo, pe.rep_hi,
             pe.rest_sec, pe.load_tag, pe.note, pe.sort,
             e.form_cues, coalesce(e.muscle_group, 'diger') as muscle_group
      from program_exercises pe
      join exercises e on e.id = pe.exercise_id
      where pe.program_day_id = ${d.id}
      order by pe.sort
    `;
		resultDays.push({
			...d,
			exercises
		});
	}
	return {
		...p,
		days: resultDays
	};
}
var updateProgram_createServerFn_handler = createServerRpc({
	id: "7d209b75950cfadfb3f425e5be3df3130811f3686b85de936ad37d1c9a0c1e67",
	name: "updateProgram",
	filename: "src/lib/server/programs.ts"
}, (opts) => updateProgram.__executeServer(opts));
var updateProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProgram_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.name !== void 0) await sql`
        update programs set name = ${data.name}
        where id = ${data.id} and user_id = ${context.userId}
      `;
	if (data.is_active !== void 0) await sql`
        update programs set is_active = ${data.is_active}
        where id = ${data.id} and user_id = ${context.userId}
      `;
	return { ok: true };
});
var createProgram_createServerFn_handler = createServerRpc({
	id: "8a16d13a104ad0eb47aabfcb0ade826b60488383d12df868462b9100f3ac1c4d",
	name: "createProgram",
	filename: "src/lib/server/programs.ts"
}, (opts) => createProgram.__executeServer(opts));
var createProgram = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createProgram_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`
      update programs set is_active = false
      where user_id = ${context.userId} and is_active = true
    `;
	const today = /* @__PURE__ */ new Date();
	const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
	await sql`
      delete from workouts
      where user_id = ${context.userId}
        and date >= ${todayIso}::date
        and status in ('planned', 'skipped', 'in_progress')
    `;
	const programId = (await sql`
      insert into programs (user_id, name, description, is_active, valid_from)
      values (
        ${context.userId},
        ${data.name.trim() || "Yeni Program"},
        ${data.description?.trim() || null},
        true,
        '2000-01-01'::date
      )
      returning id
    `)[0].id;
	const days = data.days && data.days.length > 0 ? data.days : [
		{
			dow: 1,
			name: "Gün 1",
			focus: void 0
		},
		{
			dow: 2,
			name: "Gün 2",
			focus: void 0
		},
		{
			dow: 3,
			name: "Gün 3",
			focus: void 0
		}
	];
	let sort = 0;
	for (const d of days) {
		if (d.dow < 1 || d.dow > 7) continue;
		await sql`
        insert into program_days (program_id, dow, name, focus, sort)
        values (
          ${programId}, ${d.dow}, ${d.name.trim() || `Gün ${d.dow}`},
          ${d.focus ?? null}, ${sort}
        )
      `;
		sort += 1;
	}
	return {
		id: programId,
		name: data.name.trim() || "Yeni Program"
	};
});
var addProgramDay_createServerFn_handler = createServerRpc({
	id: "180e5f28add199b638c547f437ff49db577dcfb38a348ac1eb58726514921478",
	name: "addProgramDay",
	filename: "src/lib/server/programs.ts"
}, (opts) => addProgramDay.__executeServer(opts));
var addProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addProgramDay_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from programs where id = ${data.programId} and user_id = ${context.userId}
    `).length === 0) throw new Error("Program bulunamadı.");
	const maxSort = await sql`
      select coalesce(max(sort), -1)::int as m from program_days where program_id = ${data.programId}
    `;
	return { id: (await sql`
      insert into program_days (program_id, dow, name, focus, sort)
      values (
        ${data.programId}, ${data.dow}, ${data.name}, ${data.focus ?? null},
        ${(maxSort[0]?.m ?? -1) + 1}
      )
      returning id
    `)[0].id };
});
var updateProgramDay_createServerFn_handler = createServerRpc({
	id: "74ce8358fb9f645b4a65bddfa53b671c7cb791d330732af11f921ff837afbf30",
	name: "updateProgramDay",
	filename: "src/lib/server/programs.ts"
}, (opts) => updateProgramDay.__executeServer(opts));
var updateProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProgramDay_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.id} and p.user_id = ${context.userId}
    `).length === 0) throw new Error("Gün bulunamadı.");
	if (data.name !== void 0) await sql`update program_days set name = ${data.name} where id = ${data.id}`;
	if (data.focus !== void 0) await sql`update program_days set focus = ${data.focus} where id = ${data.id}`;
	if (data.dow !== void 0) await sql`update program_days set dow = ${data.dow} where id = ${data.id}`;
	return { ok: true };
});
var setWeekSchedule_createServerFn_handler = createServerRpc({
	id: "96e1b82b9f2474048cbb4be14e225026ad5b6b579f8087abe490b8784554afea",
	name: "setWeekSchedule",
	filename: "src/lib/server/programs.ts"
}, (opts) => setWeekSchedule.__executeServer(opts));
var setWeekSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setWeekSchedule_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from programs where id = ${data.programId} and user_id = ${context.userId}
    `).length === 0) throw new Error("Program bulunamadı.");
	const days = await sql`
      select id, dow from program_days where program_id = ${data.programId}
    `;
	const dayIds = new Set(days.map((d) => d.id));
	let temp = 100;
	for (const d of days) {
		await sql`update program_days set dow = ${temp} where id = ${d.id}`;
		temp += 1;
	}
	const usedDayIds = /* @__PURE__ */ new Set();
	for (const slot of data.schedule) {
		if (slot.dow < 1 || slot.dow > 7) continue;
		if (slot.programDayId == null) continue;
		if (!dayIds.has(slot.programDayId)) throw new Error("Geçersiz program günü.");
		if (usedDayIds.has(slot.programDayId)) throw new Error("Aynı program günü iki hafta gününe atanamaz.");
		usedDayIds.add(slot.programDayId);
		await sql`
        update program_days set dow = ${slot.dow} where id = ${slot.programDayId}
      `;
	}
	const assignedDows = new Set(data.schedule.filter((s) => s.programDayId != null).map((s) => s.dow));
	const freeDows = [
		1,
		2,
		3,
		4,
		5,
		6,
		7
	].filter((d) => !assignedDows.has(d));
	let freeIdx = 0;
	for (const d of days) {
		if (usedDayIds.has(d.id)) continue;
		const park = freeDows[freeIdx] ?? 7;
		freeIdx += 1;
		await sql`update program_days set dow = ${park} where id = ${d.id}`;
	}
	return { ok: true };
});
var deleteProgramDay_createServerFn_handler = createServerRpc({
	id: "6637fb9fa085c3e6eacb39f6981ae5ee927aff958e463ab6ec97a24a7aa1796b",
	name: "deleteProgramDay",
	filename: "src/lib/server/programs.ts"
}, (opts) => deleteProgramDay.__executeServer(opts));
var deleteProgramDay = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteProgramDay_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from program_days pd
      using programs p
      where pd.id = ${id} and pd.program_id = p.id and p.user_id = ${context.userId}
    `;
	return { ok: true };
});
var addProgramExercise_createServerFn_handler = createServerRpc({
	id: "773184e549ab922b8d89769e473ae3c026091da75cf449fa7ed279007e484eec",
	name: "addProgramExercise",
	filename: "src/lib/server/programs.ts"
}, (opts) => addProgramExercise.__executeServer(opts));
var addProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addProgramExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.programDayId} and p.user_id = ${context.userId}
    `).length === 0) throw new Error("Gün bulunamadı.");
	const maxSort = await sql`
      select coalesce(max(sort), -1)::int as m from program_exercises where program_day_id = ${data.programDayId}
    `;
	return { id: (await sql`
      insert into program_exercises (
        program_day_id, exercise_id, detail, sets, rep_lo, rep_hi, rest_sec, load_tag, note, sort
      ) values (
        ${data.programDayId}, ${data.exerciseId}, ${data.detail ?? null}, ${data.sets},
        ${data.rep_lo}, ${data.rep_hi}, ${data.rest_sec}, ${data.load_tag},
        ${data.note ?? null}, ${(maxSort[0]?.m ?? -1) + 1}
      ) returning id
    `)[0].id };
});
var updateProgramExercise_createServerFn_handler = createServerRpc({
	id: "1d2a464c009ca9b8b62e8a6cd535660f8d5df3a1b1861cb9d1d28bd1c2fc21f7",
	name: "updateProgramExercise",
	filename: "src/lib/server/programs.ts"
}, (opts) => updateProgramExercise.__executeServer(opts));
var updateProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProgramExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select pe.id from program_exercises pe
      join program_days pd on pd.id = pe.program_day_id
      join programs p on p.id = pd.program_id
      where pe.id = ${data.id} and p.user_id = ${context.userId}
    `).length === 0) throw new Error("Hareket bulunamadı.");
	if (data.exerciseId !== void 0) {
		if ((await sql`
        select id from exercises
        where id = ${data.exerciseId}
          and (owner_id is null or owner_id = ${context.userId})
      `).length === 0) throw new Error("Hareket kütüphanede yok.");
		await sql`update program_exercises set exercise_id = ${data.exerciseId} where id = ${data.id}`;
	}
	if (data.sets !== void 0) await sql`update program_exercises set sets = ${data.sets} where id = ${data.id}`;
	if (data.rep_lo !== void 0) await sql`update program_exercises set rep_lo = ${data.rep_lo} where id = ${data.id}`;
	if (data.rep_hi !== void 0) await sql`update program_exercises set rep_hi = ${data.rep_hi} where id = ${data.id}`;
	if (data.rest_sec !== void 0) await sql`update program_exercises set rest_sec = ${data.rest_sec} where id = ${data.id}`;
	if (data.load_tag !== void 0) await sql`update program_exercises set load_tag = ${data.load_tag} where id = ${data.id}`;
	if (data.note !== void 0) await sql`update program_exercises set note = ${data.note} where id = ${data.id}`;
	if (data.detail !== void 0) await sql`update program_exercises set detail = ${data.detail} where id = ${data.id}`;
	return { ok: true };
});
var deleteProgramExercise_createServerFn_handler = createServerRpc({
	id: "99da0c2636d87cf261b75fbbc00e9f514f5d93b67429467266c8b2d972db8fc2",
	name: "deleteProgramExercise",
	filename: "src/lib/server/programs.ts"
}, (opts) => deleteProgramExercise.__executeServer(opts));
var deleteProgramExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteProgramExercise_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from program_exercises pe
      using program_days pd, programs p
      where pe.id = ${id}
        and pe.program_day_id = pd.id
        and pd.program_id = p.id
        and p.user_id = ${context.userId}
    `;
	return { ok: true };
});
var reorderProgramExercises_createServerFn_handler = createServerRpc({
	id: "ac897f0a9d04feec42896d48947c132ac44208b96298cf5c5eaf86b6a523ab72",
	name: "reorderProgramExercises",
	filename: "src/lib/server/programs.ts"
}, (opts) => reorderProgramExercises.__executeServer(opts));
var reorderProgramExercises = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(reorderProgramExercises_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select pd.id from program_days pd
      join programs p on p.id = pd.program_id
      where pd.id = ${data.programDayId} and p.user_id = ${context.userId}
    `).length === 0) throw new Error("Gün bulunamadı.");
	for (let i = 0; i < data.orderedIds.length; i++) await sql`
        update program_exercises set sort = ${i}
        where id = ${data.orderedIds[i]} and program_day_id = ${data.programDayId}
      `;
	return { ok: true };
});
//#endregion
export { addProgramDay_createServerFn_handler, addProgramExercise_createServerFn_handler, createProgram_createServerFn_handler, deleteProgramDay_createServerFn_handler, deleteProgramExercise_createServerFn_handler, getActiveProgram_createServerFn_handler, getProgram_createServerFn_handler, listPrograms_createServerFn_handler, reorderProgramExercises_createServerFn_handler, setWeekSchedule_createServerFn_handler, updateProgramDay_createServerFn_handler, updateProgramExercise_createServerFn_handler, updateProgram_createServerFn_handler };
