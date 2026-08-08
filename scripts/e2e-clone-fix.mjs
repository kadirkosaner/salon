import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

const email = `clone${Date.now()}@t.app`;
await page.request.post(BASE+"/api/auth/sign-up/email",{data:{email,password:"testpass99",name:"Clone U"},headers:{Origin:BASE,"Content-Type":"application/json"}});
await page.request.post(BASE+"/api/auth/sign-in/email",{data:{email,password:"testpass99"},headers:{Origin:BASE,"Content-Type":"application/json"}});

const ok = {};
await page.goto(BASE+"/kesfet",{waitUntil:"networkidle"});
await page.waitForTimeout(1200);

// Click Seç - should open in-app confirm not window.confirm
await page.getByRole("button",{name:/^Seç$/}).first().click();
await page.waitForTimeout(500);
let t = await page.locator("body").innerText();
ok.confirmModal = /Programı seç|Seç ve ekle|Geçmiş tamamlanan/i.test(t);

await page.getByRole("button",{name:/Seç ve ekle/i}).click();
await page.waitForTimeout(3000);
// should land on program
ok.onProgram = page.url().includes("/program");
t = await page.locator("body").innerText();
ok.hasProgram = /FULL SPLIT|Full Body|Upper|PUSH|PULL/i.test(t);

// antrenman should have planned days
await page.goto(BASE+"/antrenman",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
t = await page.locator("body").innerText();
ok.calendarFilled = /PUSH|PULL|BACAK|CORE|FULL|Upper|Lower/i.test(t) || /Planlandı|planned|hareket/i.test(t);

// copy code button
await page.goto(BASE+"/kesfet",{waitUntil:"networkidle"});
await page.waitForTimeout(1000);
const codeBtn = page.getByRole("button",{name:/Kodu kopyala/i}).first();
ok.codeBtn = (await codeBtn.count()) > 0;
if (ok.codeBtn) {
  await codeBtn.click();
  await page.waitForTimeout(400);
  t = await page.locator("body").innerText();
  ok.copyToast = /kopyaland|Kod|FULL/i.test(t);
}

// clear future
await page.goto(BASE+"/antrenman",{waitUntil:"networkidle"});
await page.waitForTimeout(800);
page.once("dialog", d => d.accept());
const eraser = page.getByLabel(/Gelecek seansları temizle/i);
if (await eraser.count()) {
  await eraser.click();
  await page.waitForTimeout(1000);
  ok.clearRan = true;
} else ok.clearRan = false;

ok.errors = errors;
console.log(JSON.stringify(ok,null,2));
await browser.close();
