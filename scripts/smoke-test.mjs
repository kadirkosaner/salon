/**
 * Pure-module smoke suite (no browser / no DB).
 * Run: npm test
 */
import assert from "node:assert/strict";
import {
  parseProgramTags,
  matchesFilters,
  emptyFilters,
} from "../src/lib/program-tags.ts";
import { relativeTime } from "../src/lib/relative-time.ts";
import {
  isoDow,
  addDaysISO,
  remapDow,
  parseNum,
  roundToPlate,
  todayISO,
} from "../src/lib/utils.ts";
import { parseProgramText, matchExerciseName } from "../src/lib/program-parser.ts";
import {
  isoDate,
  positiveId,
  parseOrThrow,
  weightKg,
  shareCode,
  loadTag,
  noInput,
  v,
  workoutStatus,
  userIdStr,
  shortText,
  reps,
  rir,
} from "../src/lib/validation.ts";
import { z } from "zod";

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log("ok ", name);
  } catch (e) {
    failed += 1;
    console.error("FAIL", name, "—", e.message);
  }
}

// ── program-tags ──
test("parseProgramTags days+level", () => {
  const p = parseProgramTags("katalog,6gun,ileri,guc,barbell");
  assert.equal(p.days, 6);
  assert.equal(p.level, "ileri");
  assert.ok(p.goals.includes("guc"));
  assert.ok(p.equipment.includes("barbell"));
});

test("matchesFilters day", () => {
  const f = { ...emptyFilters(), days: 3 };
  assert.equal(matchesFilters("katalog,3gun,baslangic", 3, f), true);
  assert.equal(matchesFilters("katalog,6gun,ileri", 6, f), false);
});

test("matchesFilters level", () => {
  const f = { ...emptyFilters(), level: "ileri" };
  assert.equal(matchesFilters("katalog,6gun,ileri", 6, f), true);
  assert.equal(matchesFilters("katalog,3gun,baslangic", 3, f), false);
});

// ── relative-time ──
test("relativeTime now (tr)", () => {
  const s = relativeTime(new Date().toISOString(), "tr");
  assert.ok(s.length > 0);
});
test("relativeTime minutes (tr)", () => {
  const d = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const s = relativeTime(d, "tr");
  assert.match(s, /5/);
});
test("relativeTime minutes (en)", () => {
  const d = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const s = relativeTime(d, "en");
  assert.match(s, /5/);
});
test("relativeTime hours (tr)", () => {
  const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const s = relativeTime(d, "tr");
  assert.match(s, /3/);
});

// ── utils dates ──
test("isoDow Monday=1 Sunday=7", () => {
  assert.equal(isoDow("2026-08-10"), 1); // Mon
  assert.equal(isoDow("2026-08-09"), 7); // Sun
  assert.equal(isoDow("2026-08-12"), 3); // Wed
});

test("addDaysISO wraps months", () => {
  assert.equal(addDaysISO("2026-01-30", 2), "2026-02-01");
  assert.equal(addDaysISO("2026-08-10", -7), "2026-08-03");
});

test("addDaysISO year boundary", () => {
  assert.equal(addDaysISO("2025-12-30", 3), "2026-01-02");
});

test("todayISO format", () => {
  assert.match(todayISO(), /^\d{4}-\d{2}-\d{2}$/);
});

test("roundToPlate / parseNum", () => {
  assert.equal(roundToPlate(82.3), 82.5);
  assert.equal(roundToPlate(80), 80);
  assert.equal(parseNum("12.5"), 12.5);
  assert.equal(parseNum(""), null);
  assert.equal(parseNum("x"), null);
  assert.equal(parseNum(null), null);
  assert.equal(parseNum(42), 42);
});


// ── remapDow (clone program) ──
test("remapDow identity when anchor already on start", () => {
  // Mon program, start on Mon → unchanged
  assert.equal(remapDow(1, 1, 1), 1);
  assert.equal(remapDow(3, 1, 1), 3);
  assert.equal(remapDow(7, 1, 1), 7);
});

test("remapDow shifts so anchor lands on startDow", () => {
  // Anchor was Wed(3), start on Mon(1) → shift back 2
  // orig Wed(3) → Mon(1)
  assert.equal(remapDow(3, 3, 1), 1);
  // orig Mon(1) with anchor Wed → Sat (1 - 2 = -1 → 6)
  assert.equal(remapDow(1, 3, 1), 6);
  // orig Fri(5), anchor Wed(3), start Mon(1) → Wed(3)
  assert.equal(remapDow(5, 3, 1), 3);
});

test("remapDow wraps within 1..7", () => {
  // Anchor Sun(7), start Tue(2) → shift +2 (mod 7)
  assert.equal(remapDow(7, 7, 2), 2);
  assert.equal(remapDow(1, 7, 2), 3); // Mon → Wed
  assert.equal(remapDow(6, 7, 2), 1); // Sat → Mon
});

// ── validation ──
test("isoDate accepts valid rejects bad", () => {
  assert.equal(parseOrThrow(isoDate, "2026-08-10"), "2026-08-10");
  assert.throws(() => parseOrThrow(isoDate, "10-08-2026"));
  assert.throws(() => parseOrThrow(isoDate, "not-a-date"));
  assert.throws(() => parseOrThrow(isoDate, "2026-13-01"));
});

test("positiveId / weightKg / loadTag / shareCode", () => {
  assert.equal(parseOrThrow(positiveId, 3), 3);
  assert.throws(() => parseOrThrow(positiveId, 0));
  assert.throws(() => parseOrThrow(positiveId, -1));
  assert.equal(parseOrThrow(weightKg, 100), 100);
  assert.equal(parseOrThrow(weightKg, null), null);
  assert.equal(parseOrThrow(loadTag, "agir"), "agir");
  assert.throws(() => parseOrThrow(loadTag, "heavy"));
  assert.equal(parseOrThrow(shareCode, "ab23cd"), "AB23CD");
  assert.throws(() => parseOrThrow(shareCode, "iii")); // I not allowed
  assert.throws(() => parseOrThrow(shareCode, "ABC12")); // too short
});

test("v() wrapper and noInput", () => {
  const parse = v(z.object({ n: positiveId }));
  assert.deepEqual(parse({ n: 5 }), { n: 5 });
  assert.throws(() => parse({ n: 0 }));
  assert.equal(noInput(), undefined);
  assert.equal(noInput(undefined), undefined);
  assert.equal(noInput({}), undefined);
  assert.equal(noInput(null), undefined);
});

test("workoutStatus / userIdStr / shortText / reps / rir", () => {
  assert.equal(parseOrThrow(workoutStatus, "completed"), "completed");
  assert.throws(() => parseOrThrow(workoutStatus, "done"));
  assert.equal(parseOrThrow(userIdStr, "abc"), "abc");
  assert.throws(() => parseOrThrow(userIdStr, ""));
  assert.equal(parseOrThrow(shortText(10), "  hi  "), "hi");
  assert.throws(() => parseOrThrow(shortText(3), "toolong"));
  assert.equal(parseOrThrow(reps, 8), 8);
  assert.equal(parseOrThrow(reps, null), null);
  assert.equal(parseOrThrow(rir, 2), 2);
  assert.throws(() => parseOrThrow(rir, 11));
});

// ── program-parser ──
test("parseProgramText pipe format day + exercises", () => {
  const text = `Pazartesi - PUSH A
Dumbbell Bench Press | 4x6-8 | 150s | agir
Incline Press | 3x8-10 | 120s | orta

Salı - PULL A
Chest-Supported Row | 4x6-8 | 150s | agir
`;
  const r = parseProgramText(text);
  assert.ok(r.days.length >= 2, `days=${r.days.length}`);
  const push = r.days.find((d) => /push/i.test(d.name));
  assert.ok(push, "push day");
  assert.ok(push.exercises.length >= 2, `ex=${push.exercises.length}`);
  assert.equal(push.exercises[0].sets, 4);
  assert.equal(push.exercises[0].rep_lo, 6);
  assert.equal(push.exercises[0].rep_hi, 8);
  assert.equal(push.exercises[0].rest_sec, 150);
  assert.equal(push.exercises[0].load_tag, "agir");
});

test("parseProgramText freeform sets x reps", () => {
  const r = parseProgramText(`Bench Press 4x8-10 120s
Squat 5x5 180s agir`);
  assert.ok(r.days.length >= 1);
  const ex = r.days.flatMap((d) => d.exercises);
  assert.ok(ex.length >= 2, `got ${ex.length}`);
  const bench = ex.find((e) => /bench/i.test(e.name));
  assert.ok(bench);
  assert.equal(bench.sets, 4);
  assert.equal(bench.rep_lo, 8);
  assert.equal(bench.rep_hi, 10);
});

test("parseProgramText english day headers", () => {
  const r = parseProgramText(`Monday - Upper
Bench 3x10
Wednesday - Lower
Squat 5x5`);
  assert.ok(r.days.length >= 2, `days=${r.days.length}`);
  assert.ok(r.days.some((d) => d.dow === 1 || /upper/i.test(d.name)));
});

test("parseProgramText empty / garbage is safe", () => {
  const r = parseProgramText("");
  assert.equal(r.days.length, 0);
  const r2 = parseProgramText("   \n  \n");
  assert.equal(r2.days.length, 0);
});

test("parseProgramText single-rep format 5x5", () => {
  const r = parseProgramText(`Deadlift 5x5 180s`);
  const ex = r.days.flatMap((d) => d.exercises);
  assert.ok(ex.length >= 1);
  assert.equal(ex[0].sets, 5);
  assert.equal(ex[0].rep_lo, 5);
  assert.equal(ex[0].rep_hi, 5);
});

test("noInput accepts empty", () => {
  assert.equal(noInput(), undefined);
  assert.equal(noInput(undefined), undefined);
  assert.equal(noInput({}), undefined);
});

test("matchExerciseName fuzzy", () => {
  const lib = [
    { id: 1, name: "Barbell Bench Press" },
    { id: 2, name: "Incline Dumbbell Press" },
    { id: 3, name: "Squat" },
  ];
  const hit = matchExerciseName("bench press", lib);
  assert.ok(hit);
  assert.equal(hit.id, 1);
});

test("matchExerciseName exact preferred", () => {
  const lib = [
    { id: 1, name: "Bench" },
    { id: 2, name: "Barbell Bench Press" },
  ];
  const hit = matchExerciseName("Bench", lib);
  assert.ok(hit);
  assert.equal(hit.id, 1);
});

test("matchExerciseName no match returns null/undefined", () => {
  const lib = [{ id: 1, name: "Squat" }];
  const hit = matchExerciseName("totally unknown xyz", lib);
  assert.ok(hit == null);
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nall smoke tests passed`);
