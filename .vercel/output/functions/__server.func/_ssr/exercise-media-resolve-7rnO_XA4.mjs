import { t as exercises_dataset_slim_default } from "./exercises-dataset-slim-BwReE5Eu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercise-media-resolve-7rnO_XA4.js
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
/** Same-origin proxy (iframe-safe) + raw fallback helper. */
function mediaSrc(url, preferProxy = true) {
	if (!url) return null;
	if (!preferProxy) return url;
	try {
		const u = new URL(url);
		if (u.hostname.includes("jsdelivr") || u.hostname.includes("github")) return `/api/ex-media?u=${encodeURIComponent(url)}`;
	} catch {}
	return url;
}
//#endregion
export { resolveExerciseMedia as n, mediaSrc as t };
