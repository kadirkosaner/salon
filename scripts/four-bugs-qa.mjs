/**
 * QA for the four bugfixes. Auth as admin, measure + screenshot.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.APP_URL || "http://127.0.0.1:8080";
mkdirSync("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

function decodeServerFn(url) {
  try {
    const payload = url.split("/_serverFn/")[1]?.split("?")[0] ?? "";
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

let listNotif = 0;
page.on("request", (req) => {
  const u = req.url();
  if (!u.includes("/_serverFn/")) return;
  const m = decodeServerFn(u);
  if (m?.export?.includes("listNotifications")) listNotif += 1;
});

async function login() {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: 30000 });
  await page.fill("input[type=email]", "admin@salon.app");
  await page.fill("input[type=password]", "admin1234");
  await page.click('button[type=submit]');
  await page.waitForTimeout(2000);
}

const report = {};

await login();

// 1) notifications loop
listNotif = 0;
await page.goto(`${BASE}/bildirimler`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(5000);
report.listNotifications5s = listNotif;
await page.screenshot({ path: "/workspace/screenshots/qa-bildirimler.png", fullPage: true });

// settings calm
listNotif = 0;
await page.goto(`${BASE}/ayarlar`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
report.listNotificationsOnAyarlar = listNotif;
await page.screenshot({ path: "/workspace/screenshots/qa-ayarlar.png", fullPage: true });

// 2) antrenman single CTA when no program
// Abandon program if active so we can see empty state
await page.goto(`${BASE}/program`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
// Try leave program via more menu if present
const more = page.locator('button:has-text("More"), button:has-text("Diğer"), [aria-label*="More"]').first();
if (await more.count()) {
  await more.click().catch(() => {});
  await page.waitForTimeout(300);
  const leave = page.locator('button:has-text("Leave"), button:has-text("terk"), button:has-text("Terk")').first();
  if (await leave.count()) {
    page.once("dialog", (d) => d.accept());
    await leave.click().catch(() => {});
    await page.waitForTimeout(1000);
  }
}

await page.goto(`${BASE}/antrenman`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const primaryBtns = await page.locator('a,button').evaluateAll((els) => {
  return els
    .filter((el) => {
      const cls = el.className?.toString?.() || "";
      const txt = (el.textContent || "").trim();
      // yellow primary look
      return (
        /bg-yellow|text-bg/.test(cls) &&
        /program|Discover|Keşfet|Create|Oluştur|Get|al/i.test(txt)
      );
    })
    .map((el) => (el.textContent || "").replace(/\s+/g, " ").trim());
});
report.antrenmanPrimaryCtas = primaryBtns;
const bodyTxt = await page.locator("body").innerText();
report.hasNoProgram = /No program|Program seçilmedi|program/i.test(bodyTxt);
report.hasCreateFromProgram = /Create from today's program|Bugünkü programdan/i.test(bodyTxt);
await page.screenshot({ path: "/workspace/screenshots/qa-antrenman.png", fullPage: true });

// 3) discover filters wrap (no overflow rail for filters)
await page.goto(`${BASE}/kesfet`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const filterOverflow = await page.evaluate(() => {
  const rails = [...document.querySelectorAll(".scroll-rail")];
  // filter chips should NOT be in scroll-rail anymore
  const filterLabels = [...document.querySelectorAll("span")].filter((s) =>
    /DAYS|LEVEL|GOAL|EQUIPMENT|Gün|Seviye|Hedef|Ekipman/i.test(s.textContent || ""),
  );
  return {
    scrollRails: rails.length,
    filterLabelCount: filterLabels.length,
    // check if any parent of DAYS is a scroll-rail
    daysInRail: filterLabels.some((el) => el.closest(".scroll-rail")),
  };
});
report.filters = filterOverflow;
await page.screenshot({ path: "/workspace/screenshots/qa-kesfet-filters.png", fullPage: true });

// desktop carousel scrollbar
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${BASE}/kesfet`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const railScroll = await page.evaluate(() => {
  const rail = document.querySelector(".scroll-rail");
  if (!rail) return { hasRail: false };
  const before = rail.scrollLeft;
  rail.scrollLeft = 120;
  const after = rail.scrollLeft;
  rail.scrollLeft = before;
  const style = getComputedStyle(rail);
  return {
    hasRail: true,
    programmaticScroll: after > 0,
    scrollbarWidth: style.scrollbarWidth,
  };
});
report.carouselDesktop = railScroll;
await page.screenshot({ path: "/workspace/screenshots/qa-kesfet-desktop.png", fullPage: true });

// 4) share code search
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/kesfet`, { waitUntil: "networkidle" });
const search = page.locator('input[placeholder*="Search"], input[placeholder*="ara"], input[placeholder*="code"]').first();
await search.fill("FULL6X");
await page.waitForTimeout(800);
const afterSearch = await page.locator("body").innerText();
report.shareCodeGroupVisible = /Share code|Paylaşım kodu/i.test(afterSearch);
report.full6xVisible = /FULL6X|Full/i.test(afterSearch);
// open inspect if present
const inspect = page.locator('button:has-text("View"), button:has-text("İncele"), button:has-text("Görüntüle")').first();
if (await inspect.count()) {
  await inspect.click();
  await page.waitForTimeout(700);
  const sheet = await page.locator("body").innerText();
  report.detailSheetOpen = /Select|Seç|Start|Başlat|day|gün/i.test(sheet);
  report.didNotAutoAdd = !/is now active|aktif program/i.test(sheet);
  await page.screenshot({ path: "/workspace/screenshots/qa-code-detail.png", fullPage: true });
} else {
  report.detailSheetOpen = false;
  await page.screenshot({ path: "/workspace/screenshots/qa-code-search.png", fullPage: true });
}

// invalid code
await search.fill("ZZZZZZ");
await page.waitForTimeout(800);
const invalid = await page.locator("body").innerText();
report.invalidCodeEmpty = /No program with this code|Bu kodla program bulunamadı/i.test(invalid);
await page.screenshot({ path: "/workspace/screenshots/qa-code-invalid.png", fullPage: true });

// separate code field should be gone
report.separateCodeFieldGone = !(await page.locator('input[placeholder*="Share code"], input[placeholder*="Paylaşım kodu"], input[placeholder*="Kod"]').count());

report.pass =
  report.listNotifications5s <= 3 &&
  report.listNotificationsOnAyarlar === 0 &&
  !report.hasCreateFromProgram &&
  report.filters.daysInRail === false &&
  report.shareCodeGroupVisible &&
  report.invalidCodeEmpty &&
  report.separateCodeFieldGone;

console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(report.pass ? 0 : 1);
