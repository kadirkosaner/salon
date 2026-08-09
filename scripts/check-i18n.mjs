/**
 * i18n CI gate: key parity across all shipped locales, dead keys, TR leftovers.
 * Run: node scripts/check-i18n.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

/** Must match LOCALES in src/lib/i18n/messages.ts (complete MessageTable only). */
const LOCALE_FILES = [
  { id: "en", path: "src/lib/i18n/locales/en.ts" },
  { id: "tr", path: "src/lib/i18n/locales/tr.ts" },
  { id: "de", path: "src/lib/i18n/locales/de.ts" },
  { id: "es", path: "src/lib/i18n/locales/es.ts" },
  { id: "id", path: "src/lib/i18n/locales/id.ts" },
  { id: "pt-BR", path: "src/lib/i18n/locales/pt-BR.ts" },
  { id: "ja", path: "src/lib/i18n/locales/ja.ts" },
  { id: "ko", path: "src/lib/i18n/locales/ko.ts" },
  { id: "vi", path: "src/lib/i18n/locales/vi.ts" },
  { id: "zh-CN", path: "src/lib/i18n/locales/zh-CN.ts" },
  { id: "zh-TW", path: "src/lib/i18n/locales/zh-TW.ts" },
  { id: "ar", path: "src/lib/i18n/locales/ar.ts" },
];

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

let failed = 0;
function fail(msg) {
  failed += 1;
  console.error("FAIL", msg);
}

const tables = {};
for (const { id, path } of LOCALE_FILES) {
  if (!existsSync(path)) {
    fail(`missing locale file: ${path}`);
    continue;
  }
  const src = readFileSync(path, "utf8");
  tables[id] = { keys: parseKeys(src), map: parseMap(src) };
}

const enKeys = tables.en?.keys ?? new Set();
const enMap = tables.en?.map ?? {};

// 1) parity: every non-en locale must match en keys exactly
for (const { id } of LOCALE_FILES) {
  if (id === "en" || !tables[id]) continue;
  const keys = tables[id].keys;
  for (const k of enKeys) {
    if (!keys.has(k)) fail(`${id} missing key: ${k}`);
  }
  for (const k of keys) {
    if (!enKeys.has(k)) fail(`${id} extra key not in en: ${k}`);
  }
}

// 2) soft: brand keys may equal en
const ALLOW_EQ = new Set([
  "app.name",
  "common.kg",
  "common.lb",
  "auth.or",
  "measure.weight",
  "muscle.core",
  "feed.title",
  "pr.cardSubtitle",
  "profile.avatar",
  "profile.bio",
  "settings.themeObsidian",
  "settings.themeCarbon",
  "settings.accentVolt",
  "settings.accentNeon",
  "settings.unitsImperial",
  "settings.unitsMetric",
  "program.templatePpl",
  "program.templateUpperLower",
  "program.tplPpl",
  "discover.nResults",
  "auth.usernamePlaceholder",
  "auth.emailPlaceholder",
  "program.tagsPh",
  "program.dayN",
]);

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
  console.warn(
    "WARN unused keys:",
    dead.slice(0, 20).join(", "),
    dead.length > 20 ? `…(+${dead.length - 20})` : "",
  );
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
  function walkUi(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const st = statSync(p);
      if (st.isDirectory()) walkUi(p);
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
  walkUi(dir);
  return count;
}
scanUi("src/routes", "fail");
const compWarns = scanUi("src/components", "warn");

// 5) warn when a locale still equals English for most keys (likely unfinished)
for (const { id } of LOCALE_FILES) {
  if (id === "en" || !tables[id]) continue;
  let same = 0;
  let total = 0;
  for (const k of enKeys) {
    if (ALLOW_EQ.has(k)) continue;
    total += 1;
    if (tables[id].map[k] === enMap[k]) same += 1;
  }
  const pct = total ? same / total : 0;
  if (pct > 0.35) {
    console.warn(
      `WARN ${id}: ${same}/${total} keys still equal English (${(pct * 100).toFixed(0)}%) — review translations`,
    );
  }
}

if (failed) {
  console.error(`\ncheck-i18n: ${failed} failure(s)`);
  process.exit(1);
}
if (compWarns) console.warn(`WARN component Turkish leftovers: ${compWarns}`);
const ids = LOCALE_FILES.map((l) => l.id).join("/");
console.log(`check-i18n: ok (${enKeys.size} keys, ${ids} parity, routes clean)`);
