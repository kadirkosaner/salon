import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const base = "http://127.0.0.1:8080";
await mkdir("/workspace/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("CON:" + m.text().slice(0, 180));
});

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(1400);
}
async function shot(n) {
  await page.screenshot({ path: `/workspace/screenshots/${n}`, fullPage: false });
}

const email = `p3_${Date.now()}@test.local`;
const password = "testpass123";

await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Faz3 User");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill(password);
if ((await pws.count()) > 1) await pws.nth(1).fill(password);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);

if (page.url().includes("register") || page.url().includes("login")) {
  await go("/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);
}

await go("/");
await shot("phase3-feed-empty.png");
let body = await page.locator("body").innerText();
console.log("HOME", body.slice(0, 280).replace(/\n/g, " | "));
console.log("EMPTY_FEED", /Akışın boş|feed is empty|Önerilen|Suggested|Öne çıkan/i.test(body));

// claim username if shown
const keep = page.getByRole("button", { name: /Bunu kullan|Keep/i });
if (await keep.count()) {
  await keep.click();
  await page.waitForTimeout(1000);
}

// try complete a workout via antrenman
await go("/antrenman");
await shot("phase3-antrenman.png");
body = await page.locator("body").innerText();
console.log("ANTRENMAN", body.slice(0, 200).replace(/\n/g, " | "));

// Mark all set checkboxes / complete buttons if present
const completeBtns = page.locator('button[aria-label*="tamam"], button:has-text("✓"), input[type="checkbox"]');
const n = await completeBtns.count();
console.log("complete_controls", n);
// Try clicking set complete toggles
const setToggles = page.locator('button').filter({ hasText: /^$|✓|✔/ });
// look for circle buttons common in set rows
const circles = page.locator('[class*="rounded-full"]').filter({ has: page.locator("svg") });
console.log("circles", await circles.count());

// Fill weight/reps and mark complete via any checkbox-like
const checkboxes = page.locator('button[role="checkbox"], [data-state], button:has(svg.lucide-check)');
console.log("checks", await checkboxes.count());

// Simpler path: open program and publish
await go("/program");
await page.waitForTimeout(1500);
body = await page.locator("body").innerText();
console.log("PROGRAM", body.slice(0, 180).replace(/\n/g, " | "));
const pub = page.getByRole("button", { name: /Yayınla|Publish|Herkese|public|Paylaş/i });
console.log("publish_btns", await pub.count());
if (await pub.count()) {
  await pub.first().click();
  await page.waitForTimeout(800);
  // confirm if sheet
  const confirm = page.getByRole("button", { name: /Yayınla|Publish|Kaydet|Save|Onay/i });
  if (await confirm.count()) await confirm.last().click();
  await page.waitForTimeout(1200);
}

await go("/");
await shot("phase3-feed-after.png");
body = await page.locator("body").innerText();
console.log("FEED_AFTER", body.slice(0, 350).replace(/\n/g, " | "));
console.log("HAS_CARD", /Antrenman|Rekor|Program|PR|workout|Yeni rekor/i.test(body));
console.log("ERRORS", JSON.stringify(errors.slice(0, 25)));
await browser.close();
