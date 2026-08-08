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
  await page.waitForTimeout(1500);
}

const email = `p4_${Date.now()}@test.local`;
const password = "testpass123";
await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Kesfet User");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3500);

await go("/kesfet");
await page.waitForTimeout(2000);
await page.screenshot({ path: "/workspace/screenshots/phase4-shelves.png", fullPage: false });
let body = await page.locator("body").innerText();
console.log("SHELVES", body.slice(0, 500).replace(/\n/g, " | "));
console.log("HAS_FEATURED", /Öne çıkan|Featured|FULL SPLIT|Full Body/i.test(body));
console.log("HAS_FILTERS", /Gün|Days|Başlangıç|Beginner|Hipertrofi|Hypertrophy/i.test(body));
console.log("NO_TABS", !/Programlar.*Sporcular|Programs.*Athletes/i.test(body.split("\n").slice(0, 8).join(" ")));

// Type live search
const input = page.locator('input[placeholder*="ara"], input[placeholder*="Search"]').first();
await input.fill("squat");
await page.waitForTimeout(900);
await page.screenshot({ path: "/workspace/screenshots/phase4-search.png", fullPage: false });
body = await page.locator("body").innerText();
console.log("SEARCH", body.slice(0, 400).replace(/\n/g, " | "));
console.log("HAS_EXERCISES", /Hareket|Exercise|Squat/i.test(body));

// Filter
await input.fill("");
await page.waitForTimeout(600);
const chip = page.getByRole("button", { name: /3 gün|3 days/i });
if (await chip.count()) {
  await chip.first().click();
  await page.waitForTimeout(500);
}
await page.screenshot({ path: "/workspace/screenshots/phase4-filter.png", fullPage: false });
body = await page.locator("body").innerText();
console.log("FILTER", body.slice(0, 350).replace(/\n/g, " | "));
console.log("ERRORS", JSON.stringify(errors.slice(0, 15)));
await browser.close();
