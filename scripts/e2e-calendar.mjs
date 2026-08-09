import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e)));

const email = `cal${Date.now()}@t.app`;
await page.request.post(BASE+"/api/auth/sign-up/email",{data:{email,password:"testpass99",name:"Cal U"},headers:{Origin:BASE,"Content-Type":"application/json"}});
await page.request.post(BASE+"/api/auth/sign-in/email",{data:{email,password:"testpass99"},headers:{Origin:BASE,"Content-Type":"application/json"}});

const ok = {};
await page.goto(BASE+"/discover",{waitUntil:"networkidle"});
await page.waitForTimeout(1000);
await page.getByRole("button",{name:/^Seç$/}).first().click();
await page.waitForTimeout(400);
await page.getByRole("button",{name:/Seç ve ekle/i}).click();
await page.waitForTimeout(3000);

await page.goto(BASE+"/workout",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
let t = await page.locator("body").innerText();
ok.continuous = /Gün gün|Day by day|Bugün|Today/i.test(t);
ok.legend = /Yapıldı|Done/i.test(t) && /Yapılmadı|Missed/i.test(t);

// go back a week
await page.getByLabel("Prev week").click();
await page.waitForTimeout(800);
// pick a day with planned content (yellow or red tone buttons)
const dayBtns = page.locator("button").filter({ hasText: /^(Pt|Sa|Ça|Pe|Cu|Ct|Pz|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i });
// click mid strip days - find one that opens workout
// simpler: find buttons with num day inside continuous strip
const strip = page.locator(".overflow-x-auto button");
const n = await strip.count();
ok.stripCount = n;
if (n > 5) {
  await strip.nth(5).click();
  await page.waitForTimeout(1200);
}
t = await page.locator("body").innerText();
// mark done if available
const doneBtn = page.getByRole("button",{name:/Yapıldı|Mark done|Bitir|Finish/i}).first();
if (await doneBtn.count()) {
  await doneBtn.click();
  await page.waitForTimeout(1000);
  ok.marked = true;
} else {
  // create workout first
  const create = page.getByRole("button",{name:/Bugünkü|Create|program/i}).first();
  if (await create.count()) {
    await create.click();
    await page.waitForTimeout(1500);
  }
  const d2 = page.getByRole("button",{name:/Yapıldı|Mark done|Bitir|Finish/i}).first();
  if (await d2.count()) {
    await d2.click();
    await page.waitForTimeout(1000);
    ok.marked = true;
  } else ok.marked = false;
}

t = await page.locator("body").innerText();
ok.completedText = /Tamamlandı|Completed|Yapıldı/i.test(t);

await page.screenshot({path:"/workspace/screenshots/continuous-cal.png", fullPage:true});
ok.errors = errors;
console.log(JSON.stringify(ok,null,2));
await browser.close();
