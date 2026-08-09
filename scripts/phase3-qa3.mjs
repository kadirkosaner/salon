import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("C:" + m.text().slice(0, 220));
});

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1800);
}

// reuse login: create fresh + clone
const email = `p3c_${Date.now()}@test.local`;
const password = "testpass123";
await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Card Maker");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);

await go("/discover");
const startBtns = page.getByRole("button", { name: /Başla|Start|Seç|Al|Kopyala/i });
if (await startBtns.count()) {
  await startBtns.first().click();
  await page.waitForTimeout(900);
  const confirm = page.getByRole("button", { name: /Başla|Onayla|Start|Kaydet|Confirm|Tamam/i });
  if (await confirm.count()) {
    await confirm.last().click();
    await page.waitForTimeout(2500);
  }
}

// Home to read next date
await go("/");
await page.waitForTimeout(1200);
const home = await page.locator("body").innerText();
console.log("HOME_NEXT", home.slice(0, 200).replace(/\n/g, " | "));
// extract date like 10.08.2026 or ISO
const m = home.match(/(\d{2})\.(\d{2})\.(\d{4})/);
let dateIso = null;
if (m) {
  dateIso = `${m[3]}-${m[2]}-${m[1]}`;
}
console.log("next_date", dateIso);

const wpath = dateIso ? `/workout?date=${dateIso}` : "/workout";
await go(wpath);
await page.waitForTimeout(2000);
await page.screenshot({ path: "/workspace/screenshots/phase3-day.png", fullPage: true });
const body = await page.locator("body").innerText();
console.log("DAY", body.slice(0, 350).replace(/\n/g, " | "));

// Click finish - Turkish Bitir / Finish
const finish = page.getByRole("button", { name: /Bitir|Finish|Tamamla/i });
console.log("finish_count", await finish.count());
if (await finish.count()) {
  await finish.first().click();
  await page.waitForTimeout(2000);
}
const after = await page.locator("body").innerText();
console.log("AFTER_FINISH", after.slice(0, 200).replace(/\n/g, " | "));
console.log("STATUS_DONE", /Tamamlandı|Completed|completed/i.test(after));

await go("/");
await page.waitForTimeout(1500);
await page.screenshot({ path: "/workspace/screenshots/phase3-feed-cards.png", fullPage: false });
const feed = await page.locator("body").innerText();
console.log("FEED", feed.slice(0, 450).replace(/\n/g, " | "));
console.log("EMPTY?", /Akışın boş|feed is empty/i.test(feed));
console.log("HAS_ACTIVITY", /Antrenman|Workout|PUSH|Yeni rekor|Personal|Bitir/i.test(feed));
console.log("ERRORS", JSON.stringify(errors.slice(0, 15)));
await browser.close();
