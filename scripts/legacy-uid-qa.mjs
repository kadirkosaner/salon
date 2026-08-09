import { chromium } from "playwright";
const base = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

async function go(p) {
  await page.goto(base + p, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
}

// login with known account
await go("/login");
await page.locator('input[type="email"]').fill("leg2_1786232093430@test.local");
await page.locator('input[type="password"]').fill("testpass123");
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3000);

const session = await page.evaluate(async () => {
  const r = await fetch("/api/auth/get-session", { credentials: "include" });
  return r.json();
});
const userId = session?.user?.id || session?.session?.userId;
console.log("userId", userId);

await go(`/u/${userId}`);
await page.waitForTimeout(3000);
console.log("url", page.url());
const body = await page.locator("body").innerText();
console.log("body", body.slice(0, 250).replace(/\n/g, " | "));
console.log("rewrote_to_username", /\/u\/legacy_two/.test(page.url()));
console.log("shows_profile", /@legacy_two/i.test(body));
console.log("not_error", !/not found|bulunamadı|Something went wrong/i.test(body));
await page.screenshot({ path: "/workspace/screenshots/legacy-uid.png" });
await browser.close();
