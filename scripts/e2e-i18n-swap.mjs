import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

const email = `i18n${Date.now()}@t.app`;
await page.request.post(BASE+"/api/auth/sign-up/email",{data:{email,password:"testpass99",name:"I18n User"},headers:{Origin:BASE,"Content-Type":"application/json"}});
await page.request.post(BASE+"/api/auth/sign-in/email",{data:{email,password:"testpass99"},headers:{Origin:BASE,"Content-Type":"application/json"}});

const ok = {};

// Language switch
await page.goto(BASE+"/ayarlar",{waitUntil:"networkidle"});
await page.waitForTimeout(1000);
await page.getByRole("button",{name:"English"}).click();
await page.waitForTimeout(500);
let t = await page.locator("body").innerText();
ok.enSettings = /Language|Settings|Account|Sign out/i.test(t);
ok.enNav = await page.locator("nav").innerText().then(x=>/Home|Workout|Search|Program|Profile/i.test(x));

await page.getByRole("button",{name:"Türkçe"}).click();
await page.waitForTimeout(400);
t = await page.locator("nav").innerText();
ok.trNav = /Panel|Antrenman|Ara|Program|Profil/.test(t);

// Pick program + create workout + swap
page.once("dialog", d => d.accept());
await page.goto(BASE+"/kesfet",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
await page.getByRole("button",{name:/^Seç$/}).first().click();
await page.waitForTimeout(2000);

await page.goto(BASE+"/antrenman",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
const dayBtn = page.locator("button").filter({hasText:/PUSH|PULL|BACAK|CORE|FULL|Upper/i}).first();
if (await dayBtn.count()) await dayBtn.click();
else await page.getByRole("button",{name:/Bugünkü|Create from/i}).click();
await page.waitForTimeout(2000);

t = await page.locator("body").innerText();
ok.hasExercises = /Bench|Press|Row|Squat|Curl|Raise|Leg|Pull/i.test(t);
ok.hasSwap = /Değiştir|Swap/i.test(t);
ok.hasAdd = /Hareket ekle|Add exercise/i.test(t);
ok.hasSaveProgram = /Programı bu seansa|Update program/i.test(t);

// open swap
const swapBtn = page.getByRole("button",{name:/Değiştir|Swap/i}).first();
if (await swapBtn.count()) {
  await swapBtn.click();
  await page.waitForTimeout(1200);
  t = await page.locator("body").innerText();
  ok.swapModal = /Benzer hareket|Similar/i.test(t);
  const opt = page.locator("button").filter({hasText:/Press|Row|Curl|Raise|Fly|Pulldown|Extension|Pushdown/i}).nth(1);
  if (await opt.count()) {
    await opt.click();
    await page.waitForTimeout(1500);
    ok.swapped = true;
  } else {
    ok.swapped = false;
    await page.keyboard.press("Escape");
  }
}

await page.screenshot({path:"/workspace/screenshots/i18n-swap.png", fullPage:true});
ok.errors = errors;
console.log(JSON.stringify(ok,null,2));
await browser.close();
