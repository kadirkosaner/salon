#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8080";
const shot = (name) => `/workspace/screenshots/onb2-${name}.png`;
mkdirSync("/workspace/screenshots", { recursive: true });

const uid = Date.now().toString(36);
const email = `ob2_${uid}@test.local`;
const password = "TestPass123!";
const username = `ob2${uid}`.slice(0, 18);
const name = "Flow Test";

const logs = [];
const errors = [];
const pageErrors = [];
const log = (m) => { console.log(m); logs.push(m); };

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: "tr-TR",
});
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(String(err?.message || err)));

async function shotNamed(n) {
  await page.screenshot({ path: shot(n), fullPage: false });
  log(`shot ${n}`);
}

try {
  log(`register ${email}`);
  await page.goto(`${BASE}/register`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);

  // Fill form in order: name, username, email, password, birth, height
  const allInputs = page.locator("input:visible");
  const nIn = await allInputs.count();
  // name
  await allInputs.nth(0).fill(name);
  // username
  await allInputs.nth(1).fill(username);
  // email
  await page.locator('input[type="email"]').fill(email);
  // password
  await page.locator('input[type="password"]').fill(password);
  // birth
  await page.locator('input[type="date"]').fill("1995-06-15");
  // height
  await page.locator('input[type="number"]').fill("175");
  // sex
  await page.getByRole("button", { name: /erkek/i }).click();
  await shotNamed("01-filled");
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3500);
  log(`url after reg: ${page.url()}`);
  await shotNamed("02-hosgeldin");
  let body = await page.locator("body").innerText();
  log(`welcome: ${body.slice(0, 300).replace(/\n/g, " | ")}`);
  log(`pageErrors early: ${pageErrors.filter(e => e.includes("Maximum")).length}`);

  // Start
  await page.getByRole("button", { name: /başla|get started/i }).click();
  await page.waitForTimeout(500);
  await shotNamed("03-weight");

  // Invalid weight
  const w = page.locator('input[type="number"]').first();
  await w.fill("5");
  await page.getByRole("button", { name: /devam|continue/i }).click();
  await page.waitForTimeout(400);
  body = await page.locator("body").innerText();
  log(`invalid: ${body.includes("20") || body.includes("400") || body.includes("aralık")}`);
  await shotNamed("04-invalid");

  // Valid weight
  await w.fill("78");
  await page.getByRole("button", { name: /devam|continue/i }).click();
  await page.waitForTimeout(1500);
  body = await page.locator("body").innerText();
  log(`after weight: ${body.slice(0, 250).replace(/\n/g, " | ")}`);
  await shotNamed("05-appearance");
  if (!/görünüm|look|tema|theme|obsidian|carbon/i.test(body)) {
    throw new Error("Expected appearance step after weight, got: " + body.slice(0, 200));
  }

  // Carbon theme
  await page.getByRole("button", { name: /carbon/i }).click();
  await page.waitForTimeout(300);
  const themeAttr = await page.locator("html").getAttribute("data-theme");
  log(`theme after carbon: ${themeAttr}`);
  await shotNamed("06-carbon");
  await page.getByRole("button", { name: /devam|continue/i }).click();
  await page.waitForTimeout(1500);
  body = await page.locator("body").innerText();
  log(`program: ${body.slice(0, 300).replace(/\n/g, " | ")}`);
  await shotNamed("07-program");

  // Day chips change suggestions
  const names3 = body;
  await page.getByRole("button", { name: /^5$/ }).click();
  await page.waitForTimeout(1200);
  body = await page.locator("body").innerText();
  log(`program 5d: ${body.slice(0, 300).replace(/\n/g, " | ")}`);
  await shotNamed("08-program-5");

  // Skip program with warning
  await page.getByRole("button", { name: /program seçmeden|without a program/i }).click();
  await page.waitForTimeout(400);
  await shotNamed("09-skip-warn");
  // confirm
  const confirm = page.getByRole("button", { name: /program seçmeden|continue without/i });
  if (await confirm.count()) await confirm.last().click();
  await page.waitForTimeout(500);
  body = await page.locator("body").innerText();
  log(`ready: ${body.slice(0, 250).replace(/\n/g, " | ")}`);
  await shotNamed("10-ready");

  await page.getByRole("button", { name: /keşfet|discover|git|open/i }).click();
  await page.waitForTimeout(2500);
  log(`final url: ${page.url()}`);
  await shotNamed("11-after-done");

  // Revisit hosgeldin — should bounce home
  await page.goto(`${BASE}/welcome`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  log(`revisit hosgeldin → ${page.url()}`);
  await shotNamed("12-revisit");

  // Nav should exist on app pages
  const nav = await page.locator("nav.fixed, nav").count();
  log(`nav count after done: ${nav}`);

  const maxDepth = pageErrors.filter((e) => e.includes("Maximum update depth")).length;
  log(`maxDepth errors: ${maxDepth}`);
  log(`other pageErrors: ${JSON.stringify(pageErrors.filter(e => !e.includes("Maximum") && !e.includes("Transition")).slice(0, 5))}`);

  if (maxDepth > 0) throw new Error("Max update depth still present");
  if (!page.url().includes("hosgeldin") === false && page.url().includes("hosgeldin")) {
    // still on hosgeldin is fail if onboarded
  }
  if (page.url().includes("hosgeldin")) {
    throw new Error("Still on hosgeldin after complete — gate/complete failed");
  }

  console.log(JSON.stringify({ ok: true, logs, errors: errors.slice(0, 10), maxDepth }, null, 2));
} catch (e) {
  await shotNamed("error");
  console.error(JSON.stringify({ ok: false, error: String(e), logs, pageErrors: pageErrors.slice(0, 8), errors: errors.slice(0, 8) }, null, 2));
  process.exit(1);
} finally {
  await browser.close();
}
