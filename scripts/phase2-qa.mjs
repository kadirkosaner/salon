import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push("PAGE: " + String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("CON: " + m.text());
});

async function shot(name) {
  await page.screenshot({ path: `/workspace/screenshots/${name}`, fullPage: false });
}
async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(1200);
}

const email = `p2b_${Date.now()}@test.local`;
const password = "testpass123";

await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Faz2 Beta");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3500);

if (page.url().includes("login") || page.url().includes("register")) {
  await go("/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
}

await go("/profile");
await shot("phase2-claim.png");
let body = await page.locator("body").innerText();
console.log("CLAIM?", /kullanıcı adını|choose your username|claim/i.test(body), body.slice(0, 180).replace(/\n/g," | "));

const keep = page.getByRole("button", { name: /Bunu kullan|Keep/i });
const save = page.getByRole("button", { name: /^Kaydet$|^Save$/i });
if (await keep.count()) {
  await keep.click();
  await page.waitForTimeout(1500);
} else if (await save.count()) {
  await save.first().click();
  await page.waitForTimeout(1500);
}
await shot("phase2-profil.png");
body = await page.locator("body").innerText();
console.log("PROFIL", body.slice(0, 220).replace(/\n/g," | "));

await go("/settings");
await shot("phase2-ayarlar.png");
const edit = page.getByText(/Profil düzenle|Edit profile/i).first();
if (await edit.count()) {
  await edit.click();
  await page.waitForTimeout(600);
  await shot("phase2-edit-profile.png");
  const ta = page.locator("textarea");
  if (await ta.count()) await ta.fill("Phase 2 bio test");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(1200);
}

await go("/discover");
const people = page.getByRole("button", { name: /Sporcular|Athletes/i }).first();
if (await people.count()) await people.click();
await page.waitForTimeout(500);
await shot("phase2-kesfet-people.png");

await go("/profile");
await shot("phase2-profil-final.png");
const final = await page.locator("body").innerText();
console.log("FINAL", final.slice(0, 280).replace(/\n/g," | "));
console.log("HAS_AT", /@faz2|@sporcu|@/.test(final));
console.log("HAS_BIO", /Phase 2 bio/i.test(final));
console.log("HAS_HEAT", /6 ay|6 month|LAST 6/i.test(final));
console.log("ERRORS", JSON.stringify(errors.slice(0, 20)));
await browser.close();
