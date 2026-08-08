/**
 * Lightweight unit-ish smoke tests (no browser).
 * Run: node scripts/smoke-test.mjs
 */
import assert from "node:assert/strict";
import { parseProgramTags, matchesFilters, emptyFilters } from "../src/lib/program-tags.ts";
import { relativeTime } from "../src/lib/relative-time.ts";

let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log("ok ", name);
  } catch (e) {
    failed += 1;
    console.error("FAIL", name, e.message);
  }
}

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

test("relativeTime now", () => {
  const iso = new Date().toISOString();
  assert.equal(relativeTime(iso), "şimdi");
});

test("relativeTime minutes", () => {
  const d = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  assert.equal(relativeTime(d), "5dk");
});

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log("\nall smoke tests passed");
