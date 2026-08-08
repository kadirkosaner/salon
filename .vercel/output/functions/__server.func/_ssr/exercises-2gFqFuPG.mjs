import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-DDxD9vPu.mjs";
import { n as resolveExerciseMedia } from "./exercise-media-resolve-7rnO_XA4.mjs";
import { r as getSql } from "./db-CFyZej8J.mjs";
import { i as ensureExerciseLibrary, n as createServerRpc, o as resolveDataset, r as ensureDatasetExercise, s as searchDataset, t as browseDatasetByMuscle } from "./seed-Dy9IlGmL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercises-2gFqFuPG.js
function titleCase(name) {
	return name.split(" ").map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
}
function mapDatasetRow(d) {
	return {
		id: -1,
		owner_id: null,
		name: titleCase(d.name),
		detail: d.equipment ?? null,
		unit: "kg",
		muscle_group: d.muscle,
		default_note: d.note ?? null,
		gif_url: d.gif ?? null,
		image_url: d.image ?? null,
		form_cues: d.note ?? null,
		external_id: d.id
	};
}
var listExercises_createServerFn_handler = createServerRpc({
	id: "afd9eb4b0241257f6bb5a71448b2a6e8d646cc52cbb317e94f625819f21299f9",
	name: "listExercises",
	filename: "src/lib/server/exercises.ts"
}, (opts) => listExercises.__executeServer(opts));
var listExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listExercises_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureExerciseLibrary(sql);
	try {
		return await sql`
        select id, owner_id, name, detail, unit, muscle_group, default_note,
               gif_url, image_url, form_cues, external_id
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
      `;
	} catch {
		return await sql`
        select id, owner_id, name, detail, unit, muscle_group, default_note
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
      `;
	}
});
var searchExerciseCatalog_createServerFn_handler = createServerRpc({
	id: "49c0636baaf4c59822a0bb0ebe0e0e84c255f416d06dc080f5f05871112453ce",
	name: "searchExerciseCatalog",
	filename: "src/lib/server/exercises.ts"
}, (opts) => searchExerciseCatalog.__executeServer(opts));
var searchExerciseCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => typeof d === "string" ? { q: d } : d).handler(searchExerciseCatalog_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureExerciseLibrary(sql);
	const term = (data.q ?? "").trim().toLowerCase();
	const muscle = data.muscleGroup?.trim() || null;
	const limit = Math.min(Math.max(data.limit ?? 100, 20), 200);
	let local = [];
	try {
		if (term && muscle) local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and lower(name) like ${"%" + term + "%"}
            and muscle_group = ${muscle}
          order by name
          limit ${limit}
        `;
		else if (term) local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and lower(name) like ${"%" + term + "%"}
          order by name
          limit ${limit}
        `;
		else if (muscle) local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit ${limit}
        `;
		else local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where owner_id is null or owner_id = ${context.userId}
          order by name
          limit ${Math.min(limit, 80)}
        `;
	} catch {
		local = await sql`
        select id, owner_id, name, detail, unit, muscle_group, default_note
        from exercises
        where owner_id is null or owner_id = ${context.userId}
        order by name
        limit 80
      `;
	}
	let fromDs = [];
	if (term.length >= 1) fromDs = searchDataset(term, limit).filter((d) => !muscle || d.muscle === muscle).map(mapDatasetRow);
	else fromDs = browseDatasetByMuscle(muscle, limit, 0).map(mapDatasetRow);
	const seen = new Set(local.map((r) => r.name.toLowerCase()));
	const merged = [...local];
	for (const d of fromDs) {
		if (seen.has(d.name.toLowerCase())) continue;
		seen.add(d.name.toLowerCase());
		merged.push(d);
	}
	return merged.slice(0, limit);
});
var adoptDatasetExercise_createServerFn_handler = createServerRpc({
	id: "d40ffa3c9cdaff90f8fff0323912a677c99a2c48b39a936b2863aea0e549db7a",
	name: "adoptDatasetExercise",
	filename: "src/lib/server/exercises.ts"
}, (opts) => adoptDatasetExercise.__executeServer(opts));
var adoptDatasetExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(adoptDatasetExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureExerciseLibrary(sql);
	if (data.exerciseId && data.exerciseId > 0) {
		const own = await sql`
        select id from exercises
        where id = ${data.exerciseId}
          and (owner_id is null or owner_id = ${context.userId})
      `;
		if (own[0]) return { id: own[0].id };
	}
	if (!data.externalId) throw new Error("Hareket belirtilmedi.");
	const id = await ensureDatasetExercise(sql, data.externalId);
	if (!id) throw new Error("Dataset hareketi eklenemedi.");
	return { id };
});
var getExercisePreview_createServerFn_handler = createServerRpc({
	id: "1a7786f874a3551aa8b4967f9b8f7da0acdaf8ce7081cbc3ad6bc5e28ce09ed8",
	name: "getExercisePreview",
	filename: "src/lib/server/exercises.ts"
}, (opts) => getExercisePreview.__executeServer(opts));
var getExercisePreview = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(getExercisePreview_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (data.exerciseId && data.exerciseId > 0) try {
		const rows = await sql`
          select name, gif_url, image_url, form_cues, default_note, muscle_group
          from exercises
          where id = ${data.exerciseId}
            and (owner_id is null or owner_id = ${context.userId})
        `;
		if (rows[0]) return {
			name: rows[0].name,
			gif_url: rows[0].gif_url,
			image_url: rows[0].image_url,
			form_cues: rows[0].form_cues ?? rows[0].default_note,
			muscle_group: rows[0].muscle_group
		};
	} catch {}
	if (data.name) {
		const hits = searchDataset(data.name, 1);
		if (hits[0]) {
			const d = hits[0];
			return {
				name: titleCase(d.name),
				gif_url: d.gif ?? null,
				image_url: d.image ?? null,
				form_cues: d.note ?? null,
				muscle_group: d.muscle
			};
		}
	}
	return null;
});
var getExerciseMedia_createServerFn_handler = createServerRpc({
	id: "2a36a9c41ce43e9ee92030ce0fbc7d52d4d084dd0aa7ebde03702e4780f21aee",
	name: "getExerciseMedia",
	filename: "src/lib/server/exercises.ts"
}, (opts) => getExerciseMedia.__executeServer(opts));
var getExerciseMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((name) => name).handler(getExerciseMedia_createServerFn_handler, async ({ context, data: name }) => {
	const sql = await getSql();
	await ensureExerciseLibrary(sql);
	try {
		const r = (await sql`
        select gif_url, image_url, form_cues, default_note, muscle_group, external_id
        from exercises
        where lower(name) = lower(${name})
          and (owner_id is null or owner_id = ${context.userId})
        limit 1
      `)[0];
		if (r?.gif_url || r?.image_url) return {
			gif_url: r.gif_url,
			image_url: r.image_url,
			form_cues: r.form_cues ?? r.default_note,
			default_note: r.default_note,
			muscle_group: r.muscle_group
		};
	} catch {}
	const local = resolveExerciseMedia(name);
	if (local.gif_url || local.image_url) {
		if (local.dataset_id) try {
			await ensureDatasetExercise(sql, local.dataset_id);
		} catch {}
		return {
			gif_url: local.gif_url,
			image_url: local.image_url,
			form_cues: local.form_cues,
			default_note: local.form_cues,
			muscle_group: local.muscle_group ?? void 0
		};
	}
	const d = resolveDataset(name);
	if (d) {
		try {
			await ensureDatasetExercise(sql, d.id);
		} catch {}
		return {
			gif_url: d.gif ?? null,
			image_url: d.image ?? null,
			form_cues: d.note ?? null,
			default_note: d.note ?? null,
			muscle_group: d.muscle
		};
	}
	return {
		gif_url: null,
		image_url: null,
		form_cues: null,
		default_note: null,
		muscle_group: void 0
	};
});
var similarExercises_createServerFn_handler = createServerRpc({
	id: "9e5f71464f06d65f04e609cc76804a0bd79ac52f3a4ffdeb214f6a65d638305c",
	name: "similarExercises",
	filename: "src/lib/server/exercises.ts"
}, (opts) => similarExercises.__executeServer(opts));
var similarExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(similarExercises_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureExerciseLibrary(sql);
	let muscle = null;
	let name = null;
	if (data.exerciseId > 0) try {
		const row = await sql`
          select muscle_group, name from exercises where id = ${data.exerciseId}
        `;
		muscle = row[0]?.muscle_group ?? null;
		name = row[0]?.name ?? null;
	} catch {}
	let local = [];
	if (muscle) try {
		local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note,
                 gif_url, image_url, form_cues, external_id
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit 24
        `;
	} catch {
		local = await sql`
          select id, owner_id, name, detail, unit, muscle_group, default_note
          from exercises
          where (owner_id is null or owner_id = ${context.userId})
            and muscle_group = ${muscle}
          order by name
          limit 24
        `;
	}
	const exclude = new Set(data.excludeIds ?? []);
	exclude.add(data.exerciseId);
	const filtered = local.filter((r) => !exclude.has(r.id));
	const pad = browseDatasetByMuscle(muscle, 24).filter((d) => !name || normName(d.name) !== normName(name)).map(mapDatasetRow);
	const seen = new Set(filtered.map((r) => r.name.toLowerCase()));
	const merged = [...filtered];
	for (const d of pad) {
		if (seen.has(d.name.toLowerCase())) continue;
		seen.add(d.name.toLowerCase());
		merged.push(d);
	}
	return merged.slice(0, 24);
});
function normName(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
var createExercise_createServerFn_handler = createServerRpc({
	id: "dc275b09650b9414d526fd6f324f03568cdbe778fcadee66808955cd53c7596b",
	name: "createExercise",
	filename: "src/lib/server/exercises.ts"
}, (opts) => createExercise.__executeServer(opts));
var createExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createExercise_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const name = data.name.trim();
	if (name.length < 2) throw new Error("Hareket adı çok kısa.");
	return { id: (await sql`
      insert into exercises (owner_id, name, detail, unit, muscle_group, default_note)
      values (
        ${context.userId},
        ${name},
        ${data.detail ?? null},
        ${data.unit ?? "kg"},
        ${data.muscle_group ?? "diger"},
        ${data.default_note ?? null}
      )
      returning id
    `)[0].id };
});
//#endregion
export { adoptDatasetExercise_createServerFn_handler, createExercise_createServerFn_handler, getExerciseMedia_createServerFn_handler, getExercisePreview_createServerFn_handler, listExercises_createServerFn_handler, searchExerciseCatalog_createServerFn_handler, similarExercises_createServerFn_handler };
