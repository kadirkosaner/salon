import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 220)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("C:" + m.text().slice(0, 200));
});

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1600);
}
async function shot(n) {
  await page.screenshot({ path: `/workspace/screenshots/${n}`, fullPage: false });
}

const email = `p3b_${Date.now()}@test.local`;
const password = "testpass123";

await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Feed Hero");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);

// Discover clone
await go("/kesfet");
await page.waitForTimeout(1000);
// click start/clone on first program
const startBtns = page.getByRole("button", { name: /Başla|Start|Seç|Al|Kopyala|Clone|Use/i });
console.log("start_btns", await startBtns.count());
if (await startBtns.count()) {
  await startBtns.first().click();
  await page.waitForTimeout(800);
  // modal: confirm date / start
  const confirm = page.getByRole("button", { name: /Başla|Onayla|Start|Kaydet|Confirm|Tamam/i });
  if (await confirm.count()) {
    await confirm.last().click();
    await page.waitForTimeout(2000);
  }
}
await shot("phase3-cloned.png");
console.log("URL_after_clone", page.url());

// Workout page
await go("/antrenman");
await page.waitForTimeout(2000);
await shot("phase3-workout-loaded.png");
let body = await page.locator("body").innerText();
console.log("W", body.slice(0, 250).replace(/\n/g, " | "));

// Complete session button
const done = page.getByRole("button", { name: /Tamamla|Complete|Bitir|Mark complete|Seansı tamamla/i });
console.log("done_btn", await done.count());
if (await done.count()) {
  await done.first().click();
  await page.waitForTimeout(1500);
}

// toggle all set completes - look for check circles
const setChecks = page.locator('button').filter({ hasText: /Set|kg/ });
// click buttons that look like incomplete set markers
const allBtns = page.locator("button");
const count = await allBtns.count();
let clicked = 0;
for (let i = 0; i < Math.min(count, 80); i++) {
  const b = allBtns.nth(i);
  const label = (await b.getAttribute("aria-label")) || "";
  const cls = (await b.getAttribute("class")) || "";
  if (/complete|tamam|check|set/i.test(label) || /rounded-full.*border/.test(cls)) {
    try {
      await b.click({ timeout: 500 });
      clicked++;
    } catch {}
  }
}
console.log("clicked_set_like", clicked);

// fill first number inputs
const nums = page.locator('input[inputmode="decimal"], input[type="number"], input.num');
const nc = await nums.count();
console.log("num_inputs", nc);
for (let i = 0; i < Math.min(nc, 6); i++) {
  await nums.nth(i).fill(i % 2 === 0 ? "60" : "8");
}
// click complete again
if (await done.count()) {
  await done.first().click();
  await page.waitForTimeout(1500);
}

// Force complete via status if there's a menu
const force = page.getByRole("button", { name: /Tamamlandı|Completed|Seansı bitir/i });
if (await force.count()) {
  await force.first().click();
  await page.waitForTimeout(1000);
}

await shot("phase3-workout-done.png");
body = await page.locator("body").innerText();
console.log("W2", body.slice(0, 200).replace(/\n/g, " | "));

await go("/");
await page.waitForTimeout(1500);
await shot("phase3-feed-cards.png");
body = await page.locator("body").innerText();
console.log("FEED", body.slice(0, 400).replace(/\n/g, " | "));
console.log("HAS_WORKOUT_CARD", /Antrenman|workout|day_name|FULL|Push|Pull|Legs|Üst|Alt|Göğüs|Seans/i.test(body) && !/Your feed is empty|Akışın boş/i.test(body));
console.log("ERRORS", JSON.stringify(errors.slice(0, 20)));
await browser.close();
