import { t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { a as EXERCISE_LIBRARY } from "./library-DXw4XNK8.mjs";
import { t as exercises_dataset_slim_default } from "./exercises-dataset-slim-BwReE5Eu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seed-Dy9IlGmL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DATASET = exercises_dataset_slim_default;
var STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"with",
	"for",
	"from",
	"a",
	"an",
	"of",
	"to",
	"on",
	"in",
	"sz",
	"v",
	"bar"
]);
function norm(s) {
	return s.toLowerCase().replace(/°/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
/** Map common program names → dataset search needles */
var ALIASES = {
	"Dumbbell Bench Press": ["dumbbell bench press"],
	"Incline Dumbbell Press": [
		"dumbbell incline bench press",
		"incline dumbbell press",
		"dumbbell incline press"
	],
	"Seated Dumbbell Shoulder Press": ["dumbbell seated shoulder press", "dumbbell shoulder press"],
	"Standing Dumbbell Shoulder Press": ["dumbbell standing overhead press", "dumbbell shoulder press"],
	"Arnold Press": ["dumbbell arnold press", "arnold press"],
	"Incline Dumbbell Fly": ["dumbbell incline fly", "incline dumbbell fly"],
	"Cable Fly": [
		"cable fly",
		"cable standing fly",
		"cable mid fly"
	],
	"Lateral Raise": ["dumbbell lateral raise", "cable lateral raise"],
	"Rear Delt Fly": [
		"dumbbell rear delt raise",
		"rear delt fly",
		"dumbbell reverse fly"
	],
	"Face Pull": [
		"cable rear delt row (stirrups)",
		"cable kneeling rear delt row",
		"cable rear delt row",
		"band standing rear delt row",
		"face pull"
	],
	"Triceps Pushdown": [
		"cable pushdown",
		"triceps pushdown",
		"rope pushdown",
		"cable triceps pushdown"
	],
	"Overhead Triceps Extension": [
		"dumbbell seated overhead triceps",
		"overhead triceps",
		"dumbbell standing overhead triceps"
	],
	Dips: [
		"chest dip",
		"triceps dip",
		"dip"
	],
	"Barbell Bench Press": ["barbell bench press"],
	"Standing Barbell Overhead Press": ["barbell standing military press", "barbell overhead press"],
	"Chest-Supported Row": [
		"chest supported",
		"lever seated row",
		"dumbbell incline row",
		"chest supported row"
	],
	"Machine Row": [
		"lever seated row",
		"cable seated row",
		"seated row"
	],
	"Single-Arm Machine Row": ["cable one arm seated row", "dumbbell one arm row"],
	"Barbell Row": ["barbell bent over row", "barbell reverse grip bent over row"],
	"T-Bar Row": [
		"barbell t-bar row",
		"t-bar row",
		"lever t-bar row"
	],
	"Dumbbell Row": ["dumbbell bent over row", "dumbbell one arm row"],
	"Lat Pulldown": [
		"cable lat pulldown",
		"lat pulldown",
		"cable wide grip lat",
		"wide grip lat pulldown"
	],
	"Pull-up": [
		"pull-up",
		"pull up",
		"assisted pull-up"
	],
	"Straight-Arm Pulldown": ["cable straight arm pull", "straight arm pulldown"],
	"Dumbbell Shrug": ["dumbbell shrug"],
	"Barbell Shrug": ["barbell shrug"],
	"Biceps Curl": [
		"dumbbell biceps curl",
		"barbell curl",
		"dumbbell curl"
	],
	"Hammer Curl": ["dumbbell hammer curl", "hammer curl"],
	Deadlift: ["barbell deadlift", "deadlift"],
	"Romanian Deadlift": ["barbell romanian deadlift", "dumbbell romanian deadlift"],
	"Leg Press": [
		"sled 45 leg press",
		"sled 45 leg press",
		"leg press"
	],
	"Squat Machine": [
		"lever squat",
		"hack squat",
		"sled hack squat"
	],
	Squat: [
		"barbell full squat",
		"barbell squat",
		"squat"
	],
	"Walking Lunge": ["dumbbell walking lunge", "walking lunge"],
	"Bulgarian Split Squat": ["dumbbell bulgarian split squat", "bulgarian split squat"],
	"Hip Thrust": ["barbell hip thrust", "hip thrust"],
	"Leg Extension": ["lever leg extension", "leg extension"],
	"Leg Curl": [
		"lever lying leg curl",
		"seated leg curl",
		"leg curl"
	],
	"Standing Calf Raise": ["lever standing calf raise", "standing calf raise"],
	"Seated Calf Raise": ["lever seated calf raise", "seated calf raise"],
	"Leg Press Calf Raise": ["sled calf press", "leg press calf"],
	"Farmer's Walk": [
		"farmers walk",
		"farmer walk",
		"dumbbell farmers walk"
	],
	"Suitcase Carry": ["suitcase", "farmers walk"],
	Plank: ["plank"],
	Mekik: [
		"sit-up",
		"crunch",
		"3/4 sit-up"
	],
	"Topuklara Dokunma": ["heel touch", "alternate heel touchers"],
	Makas: ["flutter kicks", "scissor"],
	"Hanging Leg Raise": ["hanging leg raise", "captains chair leg raise"],
	"Kablo Crunch": ["cable crunch", "cable kneeling crunch"],
	"Pallof Press": ["pallof", "cable anti rotation"],
	"Ağırlıklı Side Bend": ["dumbbell side bend", "side bend"]
};
/** Alias lookup by normalized key (case-insensitive). */
function aliasNeedles(name) {
	const exact = ALIASES[name];
	if (exact) return exact.map(norm);
	const n = norm(name);
	for (const [k, v] of Object.entries(ALIASES)) if (norm(k) === n) return v.map(norm);
	return [n];
}
function findDataset(name) {
	const needles = aliasNeedles(name);
	for (const n of needles) {
		const exact = DATASET.find((d) => norm(d.name) === n);
		if (exact) return exact;
	}
	for (const n of needles) {
		const hit = DATASET.find((d) => norm(d.name).includes(n) || n.includes(norm(d.name)));
		if (hit) return hit;
	}
}
/**
* Best-effort resolve to a dataset row with media.
* Uses aliases first, then exact, then token scoring.
*/
function resolveDataset(name) {
	if (!name?.trim()) return void 0;
	const aliased = findDataset(name);
	if (aliased?.gif || aliased?.image) return aliased;
	if (aliased) return aliased;
	const nq = norm(name);
	if (nq.length < 2) return void 0;
	const exact = DATASET.find((d) => norm(d.name) === nq);
	if (exact) return exact;
	const sub = DATASET.find((d) => norm(d.name).includes(nq) || nq.includes(norm(d.name)));
	if (sub && (nq.length >= 6 || norm(sub.name).split(" ").length <= 4)) return sub;
	const tokens = nq.split(" ").filter((t) => t.length > 2 && !STOP.has(t));
	if (tokens.length === 0) return void 0;
	let best;
	let bestScore = -Infinity;
	for (const d of DATASET) {
		const xn = norm(d.name);
		let score = 0;
		let matched = 0;
		for (const t of tokens) if (xn.includes(t)) {
			score += t.length >= 5 ? 3 : 2;
			matched += 1;
		}
		if (matched === 0) continue;
		if (matched === tokens.length) score += 6;
		score -= Math.max(0, xn.split(" ").length - tokens.length) * .35;
		if (xn.startsWith(tokens[0])) score += 1.5;
		if (score > bestScore) {
			bestScore = score;
			best = d;
		}
	}
	const minMatched = Math.ceil(tokens.length * .6);
	if (!best) return void 0;
	const xn = norm(best.name);
	if (tokens.filter((t) => xn.includes(t)).length < minMatched || bestScore < 4) return void 0;
	return best;
}
/** Search dataset by free text (for swap library expansion without full DB insert). */
function searchDataset(q, limit = 40) {
	const nq = norm(q);
	if (!nq || nq.length < 1) return [];
	const hits = [];
	const seen = /* @__PURE__ */ new Set();
	const top = resolveDataset(q);
	if (top) {
		hits.push(top);
		seen.add(top.id);
	}
	for (const d of DATASET) {
		if (seen.has(d.id)) continue;
		if (norm(d.name).includes(nq)) {
			hits.push(d);
			seen.add(d.id);
			if (hits.length >= limit) return hits;
		}
	}
	if (hits.length < limit) {
		const tokens = nq.split(" ").filter((t) => t.length > 2 && !STOP.has(t));
		if (tokens.length) for (const d of DATASET) {
			if (seen.has(d.id)) continue;
			const xn = norm(d.name);
			if (tokens.some((t) => xn.includes(t))) {
				hits.push(d);
				seen.add(d.id);
				if (hits.length >= limit) break;
			}
		}
	}
	return hits;
}
/** Browse dataset by muscle group (full catalog browse, not just search). */
function browseDatasetByMuscle(muscle, limit = 120, offset = 0) {
	const m = (muscle ?? "").trim();
	return (m ? DATASET.filter((d) => d.muscle === m) : DATASET).slice(offset, offset + limit);
}
var mediaColumnsReady = null;
async function hasMediaColumns(sql) {
	if (mediaColumnsReady != null) return mediaColumnsReady;
	try {
		await sql`select gif_url from exercises limit 0`;
		mediaColumnsReady = true;
	} catch {
		mediaColumnsReady = false;
	}
	return mediaColumnsReady;
}
/**
* Core library only + GIF/media enrichment from exercises-dataset.
* Full 1324 list is available via searchDataset / ensureDatasetExercise (on demand).
*/
async function ensureExerciseLibrary(sql) {
	const media = await hasMediaColumns(sql);
	const existing = await sql`
    select id, name from exercises where owner_id is null
  `;
	const have = new Map(existing.map((e) => [e.name, e.id]));
	for (const ex of EXERCISE_LIBRARY) {
		const ds = findDataset(ex.name);
		if (!have.has(ex.name)) if (media) {
			let ext = null;
			if (ds?.id) {
				if ((await sql`
            select id from exercises where external_id = ${ds.id} limit 1
          `).length === 0) ext = ds.id;
			}
			await sql`
          insert into exercises (
            owner_id, name, detail, unit, muscle_group, default_note,
            external_id, gif_url, image_url, form_cues
          ) values (
            null, ${ex.name}, ${ex.detail ?? null}, ${ex.unit ?? "kg"}, ${ex.muscle_group},
            ${ds?.note ?? null}, ${ext}, ${ds?.gif ?? null},
            ${ds?.image ?? null}, ${ds?.note ?? null}
          )
        `;
		} else await sql`
          insert into exercises (owner_id, name, detail, unit, muscle_group)
          values (null, ${ex.name}, ${ex.detail ?? null}, ${ex.unit ?? "kg"}, ${ex.muscle_group})
        `;
		else if (media && ds) {
			await sql`
        update exercises set
          gif_url = coalesce(gif_url, ${ds.gif ?? null}),
          image_url = coalesce(image_url, ${ds.image ?? null}),
          form_cues = coalesce(form_cues, ${ds.note ?? null}),
          default_note = coalesce(default_note, ${ds.note ?? null})
        where id = ${have.get(ex.name)}
      `;
			if ((await sql`
        select id from exercises where external_id = ${ds.id} limit 1
      `).length === 0) await sql`
          update exercises set external_id = ${ds.id}
          where id = ${have.get(ex.name)} and external_id is null
        `;
		}
	}
}
/** Insert a dataset exercise into DB on demand (for full catalog pick). */
async function ensureDatasetExercise(sql, externalId) {
	const ds = DATASET.find((d) => d.id === externalId);
	if (!ds) return null;
	const media = await hasMediaColumns(sql);
	if (media) {
		const existing = await sql`
      select id from exercises where external_id = ${externalId} limit 1
    `;
		if (existing[0]) return existing[0].id;
	}
	const display = ds.name.split(" ").map((w) => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");
	const byName = await sql`
    select id from exercises where lower(name) = lower(${display}) and owner_id is null limit 1
  `;
	if (byName[0]) {
		if (media) try {
			await sql`
          update exercises set
            external_id = coalesce(external_id, ${ds.id}),
            gif_url = coalesce(gif_url, ${ds.gif ?? null}),
            image_url = coalesce(image_url, ${ds.image ?? null}),
            form_cues = coalesce(form_cues, ${ds.note ?? null})
          where id = ${byName[0].id}
        `;
		} catch {}
		return byName[0].id;
	}
	if (media) try {
		return (await sql`
        insert into exercises (
          owner_id, name, detail, unit, muscle_group, default_note,
          external_id, gif_url, image_url, form_cues
        ) values (
          null, ${display}, ${ds.equipment ?? null}, 'kg', ${ds.muscle},
          ${ds.note ?? null}, ${ds.id}, ${ds.gif ?? null}, ${ds.image ?? null}, ${ds.note ?? null}
        )
        returning id
      `)[0]?.id ?? null;
	} catch {}
	return (await sql`
    insert into exercises (owner_id, name, detail, unit, muscle_group, default_note)
    values (
      null, ${display}, ${ds.equipment ?? null}, 'kg', ${ds.muscle}, ${ds.note ?? null}
    )
    returning id
  `)[0]?.id ?? null;
}
async function ensureUserSeeded(sql, userId) {
	await ensureExerciseLibrary(sql);
	await sql`
    insert into user_onboarding (user_id) values (${userId})
    on conflict (user_id) do nothing
  `;
}
//#endregion
export { ensureUserSeeded as a, ensureExerciseLibrary as i, createServerRpc as n, resolveDataset as o, ensureDatasetExercise as r, searchDataset as s, browseDatasetByMuscle as t };
