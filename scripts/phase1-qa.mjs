import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

async function shot(name) {
  await page.screenshot({ path: `/workspace/screenshots/${name}`, fullPage: false });
}

const email = `phase1_${Date.now()}@test.local`;
const password = "testpass123";
await page.goto(base + "/register", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(800);

const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Faz1 QA");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3000);

if (page.url().includes("login") || page.url().includes("register")) {
  await page.goto(base + "/login", { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
}

await shot("phase1-dash.png");
const body = await page.locator("body").innerText();
console.log("AFTER_AUTH", page.url(), "len", body.length, "snippet", body.slice(0, 120).replace(/\n/g, " | "));

for (const [path, name] of [
  ["/workout", "phase1-antrenman.png"],
  ["/program", "phase1-program.png"],
  ["/discover", "phase1-kesfet.png"],
  ["/profile", "phase1-profil.png"],
  ["/settings", "phase1-ayarlar.png"],
  ["/measurements", "phase1-olculer.png"],
]) {
  await page.goto(base + path, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(900);
  await shot(name);
  const t = await page.locator("body").innerText();
  console.log(path, "len", t.length, "sample", t.slice(0, 90).replace(/\n/g, " | "));
}

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await shot("phase1-desktop.png");

console.log("ERRORS", JSON.stringify(errors.slice(0, 25), null, 0));
await browser.close();
