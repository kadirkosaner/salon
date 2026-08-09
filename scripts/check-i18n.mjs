/**
 * i18n CI gate: key parity, no untranslated TR in en UI surfaces (scan), dead keys.
 * Run: node scripts/check-i18n.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

// Load compiled TS via tsx-less approach: parse locale files as text
const enSrc = readFileSync("src/lib/i18n/locales/en.ts", "utf8");
const trSrc = readFileSync("src/lib/i18n/locales/tr.ts", "utf8");

function parseKeys(src) {
  const m = [...src.matchAll(/"([^"]+)":\s*"/g)].map((x) => x[1]);
  return new Set(m);
}
function parseMap(src) {
  const out = {};
  for (const m of src.matchAll(/"([^"]+)":\s*"((?:\\.|[^"\\])*)"/g)) {
    out[m[1]] = m[2].replace(/\\"/g, '"');
  }
  return out;
}

const enKeys = parseKeys(enSrc);
const trKeys = parseKeys(trSrc);
const enMap = parseMap(enSrc);
const trMap = parseMap(trSrc);

let failed = 0;
function fail(msg) {
  failed += 1;
  console.error("FAIL", msg);
}

// 1) parity
for (const k of enKeys) {
  if (!trKeys.has(k)) fail(`tr missing key: ${k}`);
}
for (const k of trKeys) {
  if (!enKeys.has(k)) fail(`en missing key: ${k}`);
}

// 2) tr should not equal en for most keys (allowlist)
const ALLOW_EQ = new Set([
  "app.name",
  "common.kg",
  "common.lb",
  "auth.or",
  "measure.weight", // "Weight" vs may differ
]);
// soft check: only warn if tr === en for user-facing Turkish expected
// Skip strict equal check for now since many keys may legitimately match (Salon, Core, kg)

// 3) dead keys — keys never referenced as t("key") in src
const used = new Set();
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".vercel") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|mjs)$/.test(name)) {
      const txt = readFileSync(p, "utf8");
      for (const m of txt.matchAll(/t\(\s*["']([^"']+)["']/g)) {
        used.add(m[1]);
      }
      for (const m of txt.matchAll(/["']([a-z]+\.[a-zA-Z0-9_.]+)["']/g)) {
        if (enKeys.has(m[1])) used.add(m[1]);
      }
    }
  }
}
walk("src");
const dead = [...enKeys].filter((k) => !used.has(k));
if (dead.length) {
  console.warn("WARN unused keys:", dead.slice(0, 20).join(", "), dead.length > 20 ? `…(+${dead.length - 20})` : "");
}

// 4) Turkish chars outside t() in routes (hard) + components (warn)
const TR_RE = /[ğüşıöçĞÜŞİÖÇ]/;
const SKIP = [
  "src/lib/i18n/",
  "src/data/library.ts",
  "src/lib/program-parser",
  "src/lib/server/seed",
  "src/lib/server/catalog",
];
function shouldSkip(p) {
  return SKIP.some((s) => p.includes(s));
}
function scanUi(dir, mode) {
  let count = 0;
  function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.tsx$/.test(name)) {
        if (shouldSkip(p)) continue;
        const lines = readFileSync(p, "utf8").split("\n");
        lines.forEach((line, i) => {
          if (!TR_RE.test(line)) return;
          const trimmed = line.trim();
          if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
          let stripped = line.replace(/t\(\s*["'][^"']*["'][^)]*\)/g, "");
          stripped = stripped.replace(/\{t\([^}]+\}/g, "");
          if (TR_RE.test(stripped)) {
            count += 1;
            const msg = `${p}:${i + 1} Turkish char outside t(): ${trimmed.slice(0, 100)}`;
            if (mode === "fail") fail(msg);
            else console.warn("WARN", msg);
          }
        });
      }
    }
  }
  walk(dir);
  return count;
}
const routeFails = scanUi("src/routes", "fail");
const compWarns = scanUi("src/components", "warn");

if (failed) {
  console.error(`\ncheck-i18n: ${failed} failure(s)`);
  process.exit(1);
}
if (compWarns) console.warn(`WARN component Turkish leftovers: ${compWarns}`);
console.log(`check-i18n: ok (${enKeys.size} keys, en/tr parity, routes clean)`);
