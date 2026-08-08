import { r as createServerFn } from "./ssr.mjs";
import { i as withTransaction, r as getSql } from "./db-CaZaDWNm.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as optionalString, g as v, t as authMiddleware } from "./validation-CwL44con.mjs";
import { ensureUserSeeded } from "./seed-CzdWnGfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-program-Dhq9i962.js
var DOW_ENTRIES = [
	{
		key: "pazartesi",
		dow: 1
	},
	{
		key: "monday",
		dow: 1
	},
	{
		key: "çarşamba",
		dow: 3
	},
	{
		key: "carsamba",
		dow: 3
	},
	{
		key: "wednesday",
		dow: 3
	},
	{
		key: "perşembe",
		dow: 4
	},
	{
		key: "persembe",
		dow: 4
	},
	{
		key: "thursday",
		dow: 4
	},
	{
		key: "cumartesi",
		dow: 6
	},
	{
		key: "saturday",
		dow: 6
	},
	{
		key: "salı",
		dow: 2
	},
	{
		key: "sali",
		dow: 2
	},
	{
		key: "tuesday",
		dow: 2
	},
	{
		key: "pazar",
		dow: 7
	},
	{
		key: "sunday",
		dow: 7
	},
	{
		key: "cuma",
		dow: 5
	},
	{
		key: "friday",
		dow: 5
	},
	{
		key: "pzt",
		dow: 1
	},
	{
		key: "mon",
		dow: 1
	},
	{
		key: "tue",
		dow: 2
	},
	{
		key: "wed",
		dow: 3
	},
	{
		key: "thu",
		dow: 4
	},
	{
		key: "fri",
		dow: 5
	},
	{
		key: "sat",
		dow: 6
	},
	{
		key: "sun",
		dow: 7
	},
	{
		key: "sal",
		dow: 2
	},
	{
		key: "çar",
		dow: 3
	},
	{
		key: "car",
		dow: 3
	},
	{
		key: "per",
		dow: 4
	},
	{
		key: "cum",
		dow: 5
	},
	{
		key: "cmt",
		dow: 6
	},
	{
		key: "paz",
		dow: 7
	}
].sort((a, b) => b.key.length - a.key.length);
var LOAD_MAP = {
	agir: "agir",
	ağır: "agir",
	heavy: "agir",
	orta_agir: "orta_agir",
	"orta-agir": "orta_agir",
	"orta agir": "orta_agir",
	"orta-ağır": "orta_agir",
	"orta ağır": "orta_agir",
	orta: "orta",
	medium: "orta",
	orta_hafif: "orta_hafif",
	"orta-hafif": "orta_hafif",
	"orta hafif": "orta_hafif",
	hafif: "hafif",
	light: "hafif"
};
function normalize(s) {
	return s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i").replace(/İ/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9\s+x×\-_/().]/gi, " ").replace(/\s+/g, " ").trim();
}
function detectDow(line) {
	const n = normalize(line);
	for (const { key, dow } of DOW_ENTRIES) {
		const nk = normalize(key);
		if (n === nk || n.startsWith(nk + " ") || n.includes(" " + nk + " ") || n.endsWith(" " + nk) || n.startsWith(nk + "-") || n.includes("-" + nk)) return dow;
	}
	const m = n.match(/\b(?:gun|day|d)\s*([1-7])\b/);
	if (m) return Number(m[1]);
	return null;
}
function parseSetsReps(s) {
	const m = s.match(/(\d+)\s*[x×X]\s*(\d+)(?:\s*[-–—/]\s*(\d+))?/);
	if (!m) return null;
	return {
		sets: clamp(Number(m[1]), 1, 20),
		rep_lo: clamp(Number(m[2]), 1, 100),
		rep_hi: clamp(Number(m[3] ?? m[2]), 1, 100)
	};
}
function isDayHeader(line) {
	const t = line.trim();
	if (!t || t.length > 80) return false;
	const hasSets = parseSetsReps(t) != null;
	if (detectDow(t) != null && !hasSets) return true;
	if (hasSets) return false;
	if (/^(push|pull|leg|bacak|core|upper|lower|full\s*body)\b/i.test(t)) return true;
	if (/^gün\s*\d/i.test(t) || /^day\s*\d/i.test(t) || /^gun\s*\d/i.test(t)) return true;
	if (t.length <= 30 && !/\d/.test(t) && /^(PUSH|PULL|BACAK|CORE|LEGS?|CHEST|BACK|SHOULDERS?)/i.test(t)) return true;
	return false;
}
function parseDayHeader(line, fallbackDow) {
	const dow = detectDow(line) ?? fallbackDow;
	const quoted = line.match(/["“]([^"”]+)["”]/);
	let name = "";
	if (quoted) name = quoted[1].trim();
	else {
		const sep = line.match(/^(?:pazartesi|salı|sali|çarşamba|carsamba|perşembe|persembe|cuma|cumartesi|pazar|monday|tuesday|wednesday|thursday|friday|saturday|sunday|pzt|sal|çar|car|per|cum|cmt|paz)\s*[-–—:·]\s*(.+)$/i);
		if (sep) name = sep[1].trim();
		else {
			name = line;
			for (const { key } of DOW_ENTRIES) {
				const re = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig");
				const nLine = normalize(name);
				const nKey = normalize(key);
				if (nLine === nKey) {
					name = "";
					break;
				}
				if (nLine.startsWith(nKey + " ")) name = name.replace(re, " ").trim();
			}
			name = name.replace(/odak\s*:.*$/i, "").replace(/focus\s*:.*$/i, "").replace(/^[\s\-–—.:·]+|[\s\-–—.:·]+$/g, "").trim();
		}
	}
	name = name.replace(/\s*[-–—]\s*odak:.*$/i, "").trim();
	name = name.replace(/^[\s\-–—.:·]+|[\s\-–—.:·]+$/g, "").trim();
	if (!name || name.length < 2) name = [
		"",
		"Gün 1",
		"Gün 2",
		"Gün 3",
		"Gün 4",
		"Gün 5",
		"Gün 6",
		"Gün 7"
	][dow] ?? "Gün";
	let focus = null;
	const focusM = line.match(/(?:odak|focus)\s*[:·]\s*(.+)$/i);
	if (focusM) focus = focusM[1].trim();
	return {
		dow,
		name: name.slice(0, 40),
		focus
	};
}
function parseExerciseLine(line) {
	let raw = line.trim();
	if (!raw || raw.length < 3) return null;
	raw = raw.replace(/^\d+[).:-]\s*/, "").replace(/^[-•*]\s*/, "").trim();
	if (!raw) return null;
	if (/^(set|tekrar|not|notes?|rest|dinlenme)\b/i.test(raw) && raw.length < 20) return null;
	if (raw.includes("|")) {
		const parts = raw.split("|").map((p) => p.trim());
		const namePart = parts[0] ?? "";
		const setsPart = parts[1] ?? "";
		const restPart = parts[2] ?? "";
		const tagPart = parts[3] ?? "";
		const notePart = parts.slice(4).join(" | ") || null;
		const { name, detail } = splitNameDetail(namePart);
		const sr = parseSetsReps(setsPart) ?? {
			sets: 3,
			rep_lo: 8,
			rep_hi: 12
		};
		const rest = parseRest(restPart) ?? 90;
		const tag = parseLoad(tagPart) ?? "orta";
		if (!name) return null;
		return {
			name,
			detail,
			sets: sr.sets,
			rep_lo: sr.rep_lo,
			rep_hi: sr.rep_hi,
			rest_sec: rest,
			load_tag: tag,
			note: notePart
		};
	}
	const setsMatch = raw.match(/(\d+)\s*[x×X]\s*(\d+)(?:\s*[-–—/]\s*(\d+))?/);
	if (!setsMatch) {
		if (isDayHeader(raw)) return null;
		if (raw.length < 3 || raw.length > 60) return null;
		if (/^\d+$/.test(raw)) return null;
		if (!/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(raw)) return null;
		if (detectDow(raw) != null && raw.split(/\s+/).length <= 2) return null;
		const { name, detail } = splitNameDetail(raw);
		return {
			name,
			detail,
			sets: 3,
			rep_lo: 8,
			rep_hi: 12,
			rest_sec: 90,
			load_tag: "orta",
			note: null
		};
	}
	const before = raw.slice(0, setsMatch.index).trim();
	const after = raw.slice((setsMatch.index ?? 0) + setsMatch[0].length).trim();
	const { name, detail } = splitNameDetail(before);
	if (!name || name.length < 2) return null;
	const sets = Number(setsMatch[1]);
	const rep_lo = Number(setsMatch[2]);
	const rep_hi = setsMatch[3] ? Number(setsMatch[3]) : rep_lo;
	const rest = parseRest(after) ?? 90;
	const tag = parseLoad(after) ?? "orta";
	let note = after.replace(/\d+\s*(s|sn|sec|secs|saniye|min|dk)?/gi, " ").replace(/\b(agir|ağır|heavy|orta[_-\s]?agir|orta[_-\s]?ağır|orta|orta[_-\s]?hafif|hafif|light|medium)\b/gi, " ").replace(/\s+/g, " ").trim();
	if (!note) note = null;
	return {
		name,
		detail,
		sets: clamp(sets, 1, 20),
		rep_lo: clamp(rep_lo, 1, 100),
		rep_hi: clamp(rep_hi, 1, 100),
		rest_sec: rest,
		load_tag: tag,
		note
	};
}
function splitNameDetail(s) {
	const m = s.match(/^(.+?)\s*[([]([^)\]]+)[)\]]\s*$/);
	if (m) return {
		name: m[1].trim(),
		detail: m[2].trim()
	};
	const m2 = s.match(/^(.+?)\s+[—–-]\s+(.+)$/);
	if (m2 && m2[2].length < 40) return {
		name: m2[1].trim(),
		detail: m2[2].trim()
	};
	return {
		name: s.trim(),
		detail: null
	};
}
function parseRest(s) {
	const m = s.match(/(\d+)\s*(?:s|sn|sec|secs|saniye)\b/i);
	if (m) {
		const n = Number(m[1]);
		if (n >= 0 && n <= 600) return n;
	}
	const m2 = s.match(/\b(60|75|90|120|150|180|240|300)\b/);
	if (m2) return Number(m2[1]);
	return null;
}
function parseLoad(s) {
	const n = normalize(s);
	const keys = Object.keys(LOAD_MAP).sort((a, b) => b.length - a.length);
	for (const k of keys) if (n.includes(normalize(k))) return LOAD_MAP[k];
	return null;
}
function clamp(n, lo, hi) {
	return Math.max(lo, Math.min(hi, n));
}
function matchExerciseName(pasted, library) {
	const target = normalize(pasted);
	if (!target) return null;
	let best = null;
	for (const ex of library) {
		const cand = normalize(ex.name);
		let score = 0;
		if (cand === target) score = 100;
		else if (cand.includes(target) || target.includes(cand)) score = 80;
		else {
			const ta = new Set(target.split(" ").filter((t) => t.length > 2));
			const tb = new Set(cand.split(" ").filter((t) => t.length > 2));
			let inter = 0;
			for (const t of ta) if (tb.has(t)) inter += 1;
			const union = ta.size + tb.size - inter || 1;
			score = Math.round(inter / union * 70);
		}
		if (!best || score > best.score) best = {
			id: ex.id,
			name: ex.name,
			score
		};
	}
	if (best && best.score >= 40) return best;
	return null;
}
function parseProgramText(text) {
	const lines = text.replace(/\r\n/g, "\n").split("\n").map((l) => l.trim()).filter((l) => l.length > 0).filter((l) => !/^[-_=*]{3,}$/.test(l)).filter((l) => !/^#{1,6}\s/.test(l));
	const warnings = [];
	const unmatched = [];
	let programName = "Kişisel Program";
	const days = [];
	let current = null;
	let nextDow = 1;
	const workLines = [...lines];
	if (workLines[0] && !isDayHeader(workLines[0]) && !parseSetsReps(workLines[0]) && workLines[0].length < 60) {
		programName = workLines[0].replace(/^program\s*:?\s*/i, "").trim() || programName;
		workLines.shift();
	}
	for (const line of workLines) {
		if (/^(program|hareketler|exercises?|notes?|notlar)\s*:?\s*$/i.test(line)) continue;
		if (isDayHeader(line)) {
			const day = parseDayHeader(line, nextDow);
			current = {
				...day,
				exercises: []
			};
			days.push(current);
			nextDow = day.dow === 7 ? 1 : day.dow + 1;
			continue;
		}
		const ex = parseExerciseLine(line);
		if (ex) {
			if (!current) {
				current = {
					dow: nextDow,
					name: `Gün ${nextDow}`,
					focus: null,
					exercises: []
				};
				days.push(current);
				nextDow = nextDow === 7 ? 1 : nextDow + 1;
			}
			current.exercises.push(ex);
		} else unmatched.push(line);
	}
	const filled = days.filter((d) => d.exercises.length > 0);
	if (filled.length === 0) warnings.push("Hiç hareket algılanamadı. Örnek format: Bench Press 4x8-10 120s");
	const used = /* @__PURE__ */ new Set();
	for (const d of filled) {
		if (used.has(d.dow)) {
			let free = 1;
			while (used.has(free) && free <= 7) free += 1;
			if (free <= 7) d.dow = free;
		}
		used.add(d.dow);
	}
	return {
		programName,
		days: filled,
		unmatched,
		warnings
	};
}
var previewProgramImport_createServerFn_handler = createServerRpc({
	id: "f62c3ba0958cf27510d34f1a7b9998449d848f0e1635234b0ab0e160e8d4f6ed",
	name: "previewProgramImport",
	filename: "src/lib/server/import-program.ts"
}, (opts) => previewProgramImport.__executeServer(opts));
var previewProgramImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(string().trim().min(1).max(5e4))).handler(previewProgramImport_createServerFn_handler, async ({ context, data: text }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const lib = await sql`
      select id, name from exercises
      where owner_id is null or owner_id = ${context.userId}
    `;
	const parsed = parseProgramText(text);
	return {
		programName: parsed.programName,
		days: parsed.days.map((d) => ({
			dow: d.dow,
			name: d.name,
			focus: d.focus,
			exercises: d.exercises.map((e) => {
				const m = matchExerciseName(e.name, lib);
				return {
					name: e.name,
					matched: m?.name ?? null,
					sets: e.sets,
					rep_lo: e.rep_lo,
					rep_hi: e.rep_hi,
					rest_sec: e.rest_sec,
					load_tag: e.load_tag
				};
			})
		})),
		unmatched: parsed.unmatched,
		warnings: parsed.warnings
	};
});
var commitProgramImport_createServerFn_handler = createServerRpc({
	id: "9a29518f49ca58d9919460754df5908d104fc228da7231db87004d6a5c531e28",
	name: "commitProgramImport",
	filename: "src/lib/server/import-program.ts"
}, (opts) => commitProgramImport.__executeServer(opts));
var commitProgramImport = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(v(object({
	text: string().trim().min(1).max(5e4),
	programName: optionalString(80),
	replaceActive: boolean().optional()
}))).handler(commitProgramImport_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureUserSeeded(sql, context.userId);
	const parsed = parseProgramText(data.text);
	if (parsed.days.length === 0) throw new Error("Program algılanamadı. Her satıra bir hareket yaz (örn. Bench Press 4x8-10 120s).");
	const lib = await sql`
      select id, name from exercises
      where owner_id is null or owner_id = ${context.userId}
    `;
	const name = (data.programName?.trim() || parsed.programName || "Kişisel Program").slice(0, 80);
	return withTransaction(async (sql) => {
		if (data.replaceActive !== false) {
			await sql`
          update workouts set program_day_id = null
          where user_id = ${context.userId}
        `;
			await sql`delete from programs where user_id = ${context.userId}`;
		}
		const programId = (await sql`
        insert into programs (user_id, name, is_active, valid_from)
        values (${context.userId}, ${name}, true, '2000-01-01'::date)
        returning id
      `)[0].id;
		let totalExercises = 0;
		for (let di = 0; di < parsed.days.length; di++) {
			const day = parsed.days[di];
			const dayId = (await sql`
          insert into program_days (program_id, dow, name, focus, sort)
          values (${programId}, ${day.dow}, ${day.name}, ${day.focus}, ${di})
          returning id
        `)[0].id;
			for (let ei = 0; ei < day.exercises.length; ei++) {
				const pe = day.exercises[ei];
				let exerciseId = matchExerciseName(pe.name, lib)?.id;
				if (!exerciseId) {
					exerciseId = (await sql`
              insert into exercises (owner_id, name, unit, muscle_group)
              values (${context.userId}, ${pe.name}, 'kg', 'diger')
              returning id
            `)[0].id;
					lib.push({
						id: exerciseId,
						name: pe.name
					});
				}
				await sql`
            insert into program_exercises (
              program_day_id, exercise_id, detail, sets, rep_lo, rep_hi,
              rest_sec, load_tag, note, sort
            ) values (
              ${dayId}, ${exerciseId}, ${pe.detail},
              ${pe.sets}, ${pe.rep_lo}, ${pe.rep_hi}, ${pe.rest_sec},
              ${pe.load_tag}, ${pe.note}, ${ei}
            )
          `;
				totalExercises += 1;
			}
		}
		return {
			id: programId,
			name,
			days: parsed.days.length,
			exercises: totalExercises
		};
	});
});
//#endregion
export { commitProgramImport_createServerFn_handler, previewProgramImport_createServerFn_handler };
