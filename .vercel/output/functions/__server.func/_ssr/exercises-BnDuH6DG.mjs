import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-CaZaDWNm.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as optionalString, c as positiveId, g as v, m as shortText, t as authMiddleware } from "./validation-CwL44con.mjs";
import { browseDatasetByMuscle, ensureDatasetExercise, ensureExerciseLibrary, resolveDataset, searchDataset, t as exercises_dataset_slim_default } from "./seed-CzdWnGfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercises-BnDuH6DG.js
/**
* Pure client+server media resolver for exercises-dataset (1324 rows).
* Prefer explicit IDs for catalog names so GIFs never miss.
*/
var DATASET = exercises_dataset_slim_default;
var BY_ID = new Map(DATASET.map((d) => [d.id, d]));
function norm(s) {
	return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[''`´]/g, "").replace(/°/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
/** Catalog / program display name → preferred dataset id(s) */
var NAME_TO_IDS = {
	mekik: [
		"0001",
		"3202",
		"1758"
	],
	crunch: [
		"0175",
		"0873",
		"0212"
	],
	"sit up": ["0001", "0456"],
	"sit-up": ["0001"],
	"topuklara dokunma": ["0006"],
	makas: ["0459"],
	plank: [
		"2135",
		"0464",
		"3239",
		"3544"
	],
	"face pull": [
		"0203",
		"0202",
		"0233",
		"3697"
	],
	"farmers walk": ["2133"],
	"farmer walk": ["2133"],
	"farmer s walk": ["2133"],
	"suitcase carry": ["2133"],
	"dumbbell bench press": ["0289"],
	"incline dumbbell press": ["0314"],
	"seated dumbbell shoulder press": ["0405"],
	"lateral raise": ["0334"],
	"triceps pushdown": ["0201", "0241"],
	"chest supported row": ["1350", "0292"],
	"chest-supported row": ["1350"],
	"machine row": ["1350"],
	"single-arm machine row": ["0292"],
	"lat pulldown": [
		"2330",
		"0198",
		"0673"
	],
	"dumbbell shrug": ["0406"],
	"biceps curl": ["0294", "0165"],
	"leg press": ["0739", "0611"],
	"walking lunge": ["1460"],
	"leg extension": ["0585", "0586"],
	"leg curl": ["0586", "0582"],
	"standing calf raise": [
		"0605",
		"0417",
		"1373"
	],
	"seated calf raise": ["0594", "1379"],
	deadlift: ["0032"],
	"romanian deadlift": ["0085"],
	"barbell shrug": ["0095"],
	"rear delt fly": ["2292", "0075"],
	"arnold press": ["0287"],
	"incline dumbbell fly": ["0319", "0171"],
	"overhead triceps extension": [
		"0092",
		"0194",
		"0109"
	],
	"hammer curl": ["0312"],
	"standing barbell overhead press": [
		"1457",
		"1456",
		"0091"
	],
	"squat machine": ["0741", "0738"],
	"barbell bench press": ["0025"],
	"barbell row": ["0027"],
	"dumbbell row": ["0292"],
	dips: ["0251", "1450"],
	pullup: ["0651"],
	"pull-up": ["0651"],
	"pull up": ["0651"]
};
/** Loose alias needles when IDs missing */
var ALIASES = {
	mekik: [
		"3/4 sit-up",
		"half sit-up",
		"sit-up",
		"crunch"
	],
	"topuklara dokunma": ["alternate heel touchers"],
	makas: ["flutter kicks"],
	plank: [
		"front plank with twist",
		"kneeling plank",
		"plank"
	],
	"face pull": [
		"cable rear delt row (with rope)",
		"cable standing rear delt row",
		"cable rear delt row (stirrups)"
	],
	"farmers walk": ["farmers walk"],
	"farmer s walk": ["farmers walk"],
	"suitcase carry": ["farmers walk"]
};
function pack(d) {
	return {
		gif_url: d.gif ?? null,
		image_url: d.image ?? null,
		form_cues: d.note ?? null,
		muscle_group: d.muscle,
		dataset_id: d.id,
		dataset_name: d.name
	};
}
function byNeedle(needle) {
	const n = norm(needle);
	if (!n) return void 0;
	const exact = DATASET.find((d) => norm(d.name) === n);
	if (exact) return exact;
	return DATASET.find((d) => norm(d.name).includes(n) || n.includes(norm(d.name)));
}
function cleanName(raw) {
	return raw.replace(/\b\d+\s*(dk|sn|s|m|kg|rep|set)\b/gi, "").replace(/\s+/g, " ").trim();
}
function resolveExerciseMedia(rawName) {
	const empty = {
		gif_url: null,
		image_url: null,
		form_cues: null,
		muscle_group: null,
		dataset_id: null,
		dataset_name: null
	};
	if (!rawName?.trim()) return empty;
	const cleaned = cleanName(rawName);
	const key = norm(cleaned);
	const ids = NAME_TO_IDS[key] ?? NAME_TO_IDS[norm(rawName)];
	if (ids) for (const id of ids) {
		const d = BY_ID.get(id);
		if (d && (d.gif || d.image)) return pack(d);
	}
	const needles = ALIASES[key] ?? ALIASES[norm(rawName)];
	if (needles) for (const n of needles) {
		const hit = byNeedle(n);
		if (hit && (hit.gif || hit.image)) return pack(hit);
	}
	let hit = byNeedle(cleaned) ?? byNeedle(rawName);
	if (hit && (hit.gif || hit.image)) return pack(hit);
	const tokens = key.split(" ").filter((t) => t.length > 2);
	if (tokens.length) {
		let best;
		let bestScore = -1;
		for (const d of DATASET) {
			const xn = norm(d.name);
			let score = 0;
			let m = 0;
			for (const t of tokens) if (xn.includes(t)) {
				m++;
				score += t.length >= 5 ? 3 : 2;
			}
			if (m === 0) continue;
			if (m === tokens.length) score += 5;
			score -= Math.max(0, xn.split(" ").length - tokens.length) * .3;
			if (score > bestScore) {
				bestScore = score;
				best = d;
			}
		}
		const need = Math.ceil(tokens.length * .6);
		if (best && bestScore >= 4) {
			if (tokens.filter((t) => norm(best.name).includes(t)).length >= need) return pack(best);
		}
	}
	return empty;
}
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
var searchExerciseCatalog = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => {
	if (typeof d === "string") return { q: d.slice(0, 120) };
	return v(object({
		q: string().trim().max(120).optional(),
		muscleGroup: string().trim().max(40).optional(),
		limit: number().int().min(1).max(200).optional()
	}))(d);
}).handler(searchExerciseCatalog_createServerFn_handler, async ({ context, data }) => {
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
var adoptDatasetExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	externalId: string().trim().max(32).optional(),
	exerciseId: positiveId.optional()
}))).handler(adoptDatasetExercise_createServerFn_handler, async ({ context, data }) => {
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
var getExercisePreview = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	exerciseId: positiveId.optional(),
	name: string().trim().max(120).optional()
}))).handler(getExercisePreview_createServerFn_handler, async ({ context, data }) => {
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
var getExerciseMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(shortText(120))).handler(getExerciseMedia_createServerFn_handler, async ({ context, data: name }) => {
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
var similarExercises = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(v(object({
	exerciseId: number().int().nonnegative(),
	excludeIds: array(positiveId).max(50).optional(),
	externalId: string().trim().max(32).optional()
}))).handler(similarExercises_createServerFn_handler, async ({ context, data }) => {
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
var createExercise = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	name: shortText(120),
	detail: optionalString(200),
	unit: string().trim().max(20).optional(),
	muscle_group: string().trim().max(40).optional(),
	default_note: optionalString(500)
}))).handler(createExercise_createServerFn_handler, async ({ context, data }) => {
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
