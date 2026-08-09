import { chromium } from "playwright";
const base = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const email = `leg2_${Date.now()}@test.local`;

async function go(p) {
  await page.goto(base + p, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1400);
}

await go("/register");
const nameField = page.locator('input:not([type="email"]):not([type="password"])').first();
if (await nameField.count()) await nameField.fill("Legacy Two");
await page.locator('input[type="email"]').fill(email);
const pws = page.locator('input[type="password"]');
await pws.nth(0).fill("testpass123");
if ((await pws.count()) > 1) await pws.nth(1).fill("testpass123");
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);
console.log("after_reg", page.url());

// Wait for app
await go("/");
await page.waitForTimeout(2000);

// Capture network for profile hub
const ids = [];
page.on("response", async (res) => {
  try {
    const u = res.url();
    if (u.includes("getMyProfileHub") || u.includes("Profile") || u.includes("social")) {
      const j = await res.json().catch(() => null);
      if (j) ids.push({ u: u.slice(-40), j });
    }
  } catch {}
});

await go("/profil");
await page.waitForTimeout(2500);
// dismiss claim
for (const name of [/Bu kullanıcı adını tut/i, /Keep/i, /Onayla/i, /Tamam/i, /Kaydet/i]) {
  const b = page.getByRole("button", { name });
  if (await b.count()) {
    await b.first().click();
    await page.waitForTimeout(800);
    break;
  }
}
const body = await page.locator("body").innerText();
console.log("profil", body.slice(0, 300).replace(/\n/g, " | "));
const uname = (body.match(/@([a-z0-9_]{3,})/i) || [])[1];
console.log("username", uname);
console.log("hub_responses", JSON.stringify(ids).slice(0, 500));

// Get id from page storage / cookies
const storage = await page.evaluate(() => {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      out[k] = localStorage.getItem(k)?.slice(0, 80);
    }
  } catch {}
  return out;
});
console.log("storage_keys", Object.keys(storage));

// Call getMyProfileHub via tanstack server fn if possible - use page context
// Fallback: open kesfet follow and inspect link hrefs
await go("/kesfet");
await page.waitForTimeout(1500);
// Follow someone then check their link - for self use profile settings
await go("/ayarlar");
await page.waitForTimeout(1500);
const abody = await page.locator("body").innerText();
console.log("settings", abody.slice(0, 200).replace(/\n/g, " | "));
const uname2 = (abody.match(/@([a-z0-9_]{3,})/i) || [])[1];
console.log("uname2", uname2);

// Create second user and visit first by username; for userId we inject via server
// Use evaluate to call the server function if exposed
const result = await page.evaluate(async () => {
  // Try common session endpoints
  for (const path of [
    "/api/auth/get-session",
    "/api/auth/session",
    "/api/auth/get-session?",
  ]) {
    try {
      const r = await fetch(path, { credentials: "include" });
      const t = await r.text();
      if (t && t.length < 2000) return { path, t: t.slice(0, 500) };
    } catch (e) {
      return { path, err: String(e) };
    }
  }
  return null;
});
console.log("session", result);

// If we have username, we can still verify username path works
if (uname2 || uname) {
  const u = uname2 || uname;
  await go(`/u/${u}`);
  await page.waitForTimeout(2000);
  console.log("by_uname", page.url(), (await page.locator("body").innerText()).slice(0, 150).replace(/\n/g," | "));
}

// Force test id lookup: admin user is known
await go("/u/admin-nonexistent-id-12345");
await page.waitForTimeout(1500);
console.log("missing_url", page.url());
console.log("missing_body", (await page.locator("body").innerText()).slice(0, 200).replace(/\n/g," | "));

await browser.close();
