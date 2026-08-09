import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("C:" + m.text().slice(0, 200));
});

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1400);
}

const email = `p5_${Date.now()}@test.local`;
const password = "testpass123";
await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Cila User");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3500);

// Login forgot link
await go("/login");
// may redirect if still logged in - sign out via ayarlar
await go("/settings");
await page.waitForTimeout(1500);
let body = await page.locator("body").innerText();
console.log("SETTINGS", body.slice(0, 500).replace(/\n/g, " | "));
console.log("HAS_HAPTIC", /Titreşim|Haptic/i.test(body));
console.log("HAS_UNITS", /Birim|Units|Metrik|Metric/i.test(body));
console.log("HAS_EXPORT", /dışa aktar|Export/i.test(body));
console.log("HAS_DELETE", /Hesabı sil|Delete account/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/phase5-settings.png" });

// clone program and PR flow
await go("/discover");
const startBtns = page.getByRole("button", { name: /Başla|Start|Seç|Al|Kopyala/i });
if (await startBtns.count()) {
  await startBtns.first().click();
  await page.waitForTimeout(800);
  const confirm = page.getByRole("button", { name: /Başla|Onayla|Start|Kaydet|Confirm|Tamam/i });
  if (await confirm.count()) {
    await confirm.last().click();
    await page.waitForTimeout(2000);
  }
}

await go("/");
const home = await page.locator("body").innerText();
const m = home.match(/(\d{2})\.(\d{2})\.(\d{4})/);
const dateIso = m ? `${m[3]}-${m[2]}-${m[1]}` : null;
console.log("next", dateIso);

await go(dateIso ? `/workout?date=${dateIso}` : "/workout");
await page.waitForTimeout(2000);
// open first exercise if collapsed
const exHeaders = page.locator("li button").filter({ hasText: /kg|set|×|rep/i });
// click first expandable exercise
const cards = page.locator("li.rounded-xl button").first();
if (await cards.count()) {
  await cards.click().catch(() => {});
  await page.waitForTimeout(400);
}

// fill weights high for PR
const nums = page.locator('input[inputmode="decimal"], input[type="number"]');
const nc = await nums.count();
console.log("inputs", nc);
for (let i = 0; i < Math.min(nc, 4); i++) {
  // alternate weight/reps - first of pair is weight
  const isWeight = i % 2 === 0;
  await nums.nth(i).fill(isWeight ? "120" : "5");
  await page.waitForTimeout(200);
}
// complete set buttons
const setDone = page.locator('button[aria-label*="tamam"], button[aria-label*="Complete"], button[aria-label*="Seti"]');
console.log("set_done", await setDone.count());
for (let i = 0; i < Math.min(await setDone.count(), 2); i++) {
  await setDone.nth(i).click();
  await page.waitForTimeout(800);
}
// if no aria, click check buttons in set grid
if ((await setDone.count()) === 0) {
  const checks = page.locator("button").filter({ has: page.locator("svg") });
  // try last few in card
}

await page.waitForTimeout(1500);
body = await page.locator("body").innerText();
console.log("PR_UI", /Yeni rekor|New PR|Kişisel rekor|Personal record/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/phase5-pr.png", fullPage: false });

// legend
console.log("LEGEND", /Tamamlandı|Completed|Kaçırıldı|Missed|Planlı|Planned|Boş gün|Empty/i.test(body));
console.log("TARGET_REPS", /Hedef|Target/i.test(body));

// logout and check forgot
const logout = page.getByRole("button", { name: /Çıkış|Log out|Sign out/i });
await go("/settings");
await page.waitForTimeout(800);
const lo = page.getByRole("button", { name: /Çıkış|Log out|Sign out|logout/i });
if (await lo.count()) {
  await lo.first().click();
  await page.waitForTimeout(1500);
}
await go("/login");
await page.waitForTimeout(800);
const forgot = page.getByRole("button", { name: /Şifremi unuttum|Forgot/i });
console.log("FORGOT", await forgot.count() > 0);
if (await forgot.count()) {
  await forgot.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/workspace/screenshots/phase5-forgot.png" });
}

// desktop shell
const desk = await browser.newPage({ viewport: { width: 1280, height: 800 } });
// re-login quick
await desk.goto(base + "/login", { waitUntil: "domcontentloaded" });
await desk.waitForTimeout(1000);
// may already have session wiped
try {
  await desk.locator('input[type="email"]').fill(email);
  await desk.locator('input[type="password"]').fill(password);
  await desk.locator('button[type="submit"]').click();
  await desk.waitForTimeout(2500);
} catch { /* ignore */ }
await desk.goto(base + "/", { waitUntil: "domcontentloaded" });
await desk.waitForTimeout(1500);
await desk.screenshot({ path: "/workspace/screenshots/phase5-desktop.png" });
await desk.close();

console.log("ERRORS", JSON.stringify(errors.slice(0, 20)));
await browser.close();
