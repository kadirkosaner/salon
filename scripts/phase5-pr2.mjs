import { chromium } from "playwright";
const base = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => console.log("PE", String(e).slice(0, 200)));

async function go(path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
}

const email = `p5x_${Date.now()}@test.local`;
await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("PR Two");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill("testpass123");
if ((await pws.count()) > 1) await pws.nth(1).fill("testpass123");
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3500);

await go("/discover");
await page.getByRole("button", { name: /^Seç$/i }).first().click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: /Başlat|Start/i }).last().click();
await page.waitForTimeout(2500);

await go("/workout?date=2026-08-10");
await page.waitForTimeout(2000);

// Scroll to PUSH content
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(400);

// Click text of first exercise - look for common names
const names = ["Bench", "Press", "Squat", "Row", "Deadlift", "Push", "Incline", "Overhead"];
for (const n of names) {
  const el = page.getByText(n, { exact: false }).first();
  if (await el.count()) {
    console.log("click name", n);
    await el.click();
    await page.waitForTimeout(500);
    break;
  }
}

// dump buttons with text
const allText = await page.locator("body").innerText();
console.log("snippet", allText.slice(allText.indexOf("PUSH"), allText.indexOf("PUSH") + 400).replace(/\n/g, " | "));

// Try force open by clicking li
const lis = page.locator("ul li");
console.log("lis", await lis.count());
if (await lis.count()) {
  await lis.first().click();
  await page.waitForTimeout(600);
}

let wi = page.locator('input[inputmode="decimal"]');
console.log("weights after click", await wi.count());
if ((await wi.count()) === 0) {
  // try expanding via chevron area - all buttons in list
  const btns = page.locator("main button, [class*='space-y'] button");
  const c = await btns.count();
  console.log("all buttons", c);
  for (let i = 0; i < Math.min(c, 40); i++) {
    const txt = (await btns.nth(i).innerText().catch(() => "")).slice(0, 40);
    if (/bench|press|squat|row|dead|curl|raise|pulldown|fly|dip/i.test(txt)) {
      console.log("btn", i, txt);
      await btns.nth(i).click();
      await page.waitForTimeout(400);
      wi = page.locator('input[inputmode="decimal"]');
      if (await wi.count()) break;
    }
  }
}
console.log("weights", await wi.count());
if (await wi.count()) {
  await wi.first().fill("180");
  await page.waitForTimeout(500);
  const ri = page.locator('input[inputmode="numeric"]');
  if (await ri.count()) await ri.first().fill("2");
  await page.waitForTimeout(500);
  const setBtn = page.locator('button[aria-label*="Seti"], button[aria-label*="Complete"]');
  console.log("set", await setBtn.count());
  if (await setBtn.count()) await setBtn.first().click();
  else {
    // click check in open card
    const checks = page.locator("li button").filter({ has: page.locator("svg.lucide-check, svg") });
    // more reliable: last button in set-grid area
    const gridBtns = page.locator(".set-grid > button, div.set-grid button");
    console.log("grid", await gridBtns.count());
    if (await gridBtns.count()) await gridBtns.first().click();
  }
  await page.waitForTimeout(2500);
}
const body = await page.locator("body").innerText();
console.log("PR", /Yeni rekor|New PR|Personal record|Kişisel rekor/i.test(body));
console.log("body has dialog", await page.locator('[role="dialog"]').count());
await page.screenshot({ path: "/workspace/screenshots/phase5-pr.png" });
console.log(body.slice(0, 500).replace(/\n/g, " | "));
await browser.close();
