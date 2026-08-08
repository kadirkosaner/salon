import { chromium } from "playwright";
import { mkdir } from "fs/promises";
const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1600);
}

const email = `p5pr_${Date.now()}@test.local`;
await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("PR Hero");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill("testpass123");
if ((await pws.count()) > 1) await pws.nth(1).fill("testpass123");
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);

await go("/kesfet");
// click Seç on first featured card
const sec = page.getByRole("button", { name: /^Seç$|^Select$|^Start$|^Use$/i });
console.log("sec", await sec.count());
if (await sec.count()) {
  await sec.first().click();
} else {
  // open İncele then select
  const exam = page.getByRole("button", { name: /İncele|View|Details/i });
  if (await exam.count()) await exam.first().click();
  await page.waitForTimeout(800);
  const start = page.getByRole("button", { name: /Seç|Başlat|Start|Clone/i });
  if (await start.count()) await start.last().click();
}
await page.waitForTimeout(1000);
// StartProgramModal
const baslat = page.getByRole("button", { name: /Başlat|Start/i });
console.log("baslat", await baslat.count());
if (await baslat.count()) {
  await baslat.last().click();
  await page.waitForTimeout(2500);
}
console.log("url", page.url());

await go("/");
const home = await page.locator("body").innerText();
console.log("HOME", home.slice(0, 220).replace(/\n/g, " | "));
const m = home.match(/(\d{2})\.(\d{2})\.(\d{4})/);
const dateIso = m ? `${m[3]}-${m[2]}-${m[1]}` : null;
console.log("date", dateIso);

await go(dateIso ? `/antrenman?date=${dateIso}` : "/antrenman");
await page.waitForTimeout(2200);
await page.screenshot({ path: "/workspace/screenshots/phase5-workout.png", fullPage: true });
let body = await page.locator("body").innerText();
console.log("W", body.slice(0, 300).replace(/\n/g, " | "));

// Expand first exercise card header
const headers = page.locator("li button.flex.w-full");
console.log("headers", await headers.count());
if (await headers.count()) {
  await headers.first().click();
  await page.waitForTimeout(500);
}

// Fill first set weight/reps high
const weightInputs = page.locator('input[inputmode="decimal"]');
const repInputs = page.locator('input[inputmode="numeric"]');
console.log("w", await weightInputs.count(), "r", await repInputs.count());
if (await weightInputs.count()) {
  await weightInputs.first().fill("150");
  await page.waitForTimeout(400);
}
if (await repInputs.count()) {
  await repInputs.first().fill("3");
  await page.waitForTimeout(400);
}
const complete = page.locator('button[aria-label]');
// complete set
const setBtn = page.locator('button[aria-label*="Seti"], button[aria-label*="Complete set"], button[aria-label*="complete"]');
console.log("setbtn", await setBtn.count());
if (await setBtn.count()) {
  await setBtn.first().click();
  await page.waitForTimeout(2000);
} else {
  // green check at end of set row - last button in set-grid
  const rowBtns = page.locator(".set-grid button");
  console.log("rowbtns", await rowBtns.count());
  if (await rowBtns.count()) {
    await rowBtns.first().click();
    await page.waitForTimeout(2000);
  }
}

body = await page.locator("body").innerText();
console.log("AFTER", body.slice(0, 400).replace(/\n/g, " | "));
console.log("PR", /Yeni rekor|New PR|Kişisel rekor|Personal record|Paylaş|Share|Devam et|Continue/i.test(body));
console.log("TARGET", /Hedef|Target/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/phase5-pr.png" });
console.log("ERR", JSON.stringify(errors.slice(0, 15)));
await browser.close();
