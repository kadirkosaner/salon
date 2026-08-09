import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

const email = `past${Date.now()}@t.app`;
await page.request.post(BASE+"/api/auth/sign-up/email",{data:{email,password:"testpass99",name:"Past U"},headers:{Origin:BASE,"Content-Type":"application/json"}});
await page.request.post(BASE+"/api/auth/sign-in/email",{data:{email,password:"testpass99"},headers:{Origin:BASE,"Content-Type":"application/json"}});

const ok = {};
await page.goto(BASE+"/discover",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
await page.getByRole("button",{name:/^Seç$/}).first().click();
await page.waitForTimeout(400);
await page.getByRole("button",{name:/Seç ve ekle/i}).click();
await page.waitForTimeout(4000);

await page.goto(BASE+"/workout",{waitUntil:"networkidle"});
await page.waitForTimeout(2000);
// go past week
await page.getByLabel("Prev week").click();
await page.waitForTimeout(800);
// click a day in strip that is past
const strip = page.locator(".overflow-x-auto button");
const n = await strip.count();
// pick day ~index 10 which should be past relative to selection after shift
if (n > 8) await strip.nth(8).click();
await page.waitForTimeout(1500);
let t = await page.locator("body").innerText();
ok.pageHasContent = t.length > 100;

// try create if empty
const create = page.getByRole("button",{name:/Bugünkü|Create|program|oluştur|seç/i});
if (await create.count()) {
  await create.first().click();
  await page.waitForTimeout(2000);
}
// pick program day
const dayPick = page.locator("button").filter({hasText:/PUSH|PULL|BACAK|CORE|FULL|Upper|Lower/i});
if (await dayPick.count()) {
  await dayPick.first().click();
  await page.waitForTimeout(2000);
}
t = await page.locator("body").innerText();
ok.hasWorkout = /Bench|Press|Row|Squat|Curl|Raise|Leg|Pull|Deadlift|Mekik|Plank/i.test(t);
ok.canMark = /Yapıldı|Mark done|Bitir|Finish/i.test(t);

// program edit swap
await page.goto(BASE+"/program",{waitUntil:"networkidle"});
await page.waitForTimeout(2000);
const edit = page.getByRole("button",{name:/Düzenle|Edit/i}).first();
ok.hasEdit = (await edit.count()) > 0;
if (ok.hasEdit) {
  await edit.click();
  await page.waitForTimeout(1200);
  t = await page.locator("body").innerText();
  ok.swapUi = /Hareketi değiştir|Benzer|değiştir|kütüphane/i.test(t);
  const changeBtn = page.getByRole("button",{name:/Hareketi değiştir/i});
  if (await changeBtn.count()) {
    await changeBtn.click();
    await page.waitForTimeout(600);
    t = await page.locator("body").innerText();
    ok.libSearch = /Kütüphaneden|Ara:/i.test(t);
  }
}

// preview gif - open preview
await page.goto(BASE+"/workout",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
const prev = page.getByRole("button",{name:/önizleme|Önizle/i}).first();
if (await prev.count()) {
  await prev.click();
  await page.waitForTimeout(2500);
  t = await page.locator("body").innerText();
  ok.preview = /Form|yönerge|Animasyon|dataset|Gym/i.test(t);
}

ok.errors = errors.slice(0,5);
console.log(JSON.stringify(ok,null,2));
await browser.close();
