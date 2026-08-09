/**
 * Regression: /notifications must not spam listNotifications.
 *   node scripts/notif-loop-qa.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.APP_URL || "http://127.0.0.1:8080";
const WAIT_MS = 5000;
const MAX_LIST = 3;
const MAX_TOTAL = 6;

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

function decodeServerFn(url) {
  try {
    const payload = url.split("/_serverFn/")[1]?.split("?")[0] ?? "";
    if (!payload) return null;
    // base64url
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isNotifExport(url, exportName) {
  if (!url.includes("/_serverFn/")) return false;
  const meta = decodeServerFn(url);
  if (!meta?.file?.includes("notifications")) return false;
  if (exportName) return String(meta.export || "").includes(exportName);
  return true;
}

let listCalls = 0;
let anyNotif = 0;
page.on("request", (req) => {
  const u = req.url();
  if (isNotifExport(u, "listNotifications")) listCalls += 1;
  if (isNotifExport(u)) anyNotif += 1;
});

await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 30000 });
await page.fill("input[type=email]", "admin@salon.app");
await page.fill("input[type=password]", "admin1234");
await page.click('button[type=submit]');
await page
  .waitForURL((u) => !u.pathname.includes("/login"), { timeout: 15000 })
  .catch(() => {});
await page.waitForTimeout(1000);

listCalls = 0;
anyNotif = 0;
await page.goto(`${BASE}/notifications`, {
  waitUntil: "domcontentloaded",
  timeout: 30000,
});
await page.waitForTimeout(WAIT_MS);
const bildirimlerList = listCalls;
const bildirimlerAny = anyNotif;

listCalls = 0;
anyNotif = 0;
await page.goto(`${BASE}/settings`, {
  waitUntil: "domcontentloaded",
  timeout: 30000,
});
await page.waitForTimeout(3000);
const ayarlarList = listCalls;
const ayarlarAny = anyNotif;

const pass =
  bildirimlerList <= MAX_LIST &&
  bildirimlerAny <= MAX_TOTAL &&
  ayarlarList === 0;

console.log(
  JSON.stringify(
    {
      bildirimlerList5s: bildirimlerList,
      bildirimlerAnyNotif5s: bildirimlerAny,
      ayarlarList3s: ayarlarList,
      ayarlarAnyNotif3s: ayarlarAny,
      maxList: MAX_LIST,
      pass,
    },
    null,
    2,
  ),
);

await browser.close();
process.exit(pass ? 0 : 1);
