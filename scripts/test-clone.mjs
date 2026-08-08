import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
const consoles = [];
page.on("pageerror", e => errors.push(String(e)));
page.on("console", m => { if (m.type()==="error") consoles.push(m.text()); });

// login admin
await page.request.post(BASE+"/api/auth/sign-in/email",{
  data:{email:"admin@salon.app",password:"Admin1234!"},
  headers:{Origin:BASE,"Content-Type":"application/json"},
});

page.on("dialog", async d => { console.log("DIALOG:", d.message()); await d.accept(); });

await page.goto(BASE+"/kesfet",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
console.log("body snippet", (await page.locator("body").innerText()).slice(0,400));

const sec = page.getByRole("button",{name:/^Seç$/});
console.log("Seç count", await sec.count());
await sec.first().click();
await page.waitForTimeout(2500);
console.log("after click toast/body", (await page.locator("body").innerText()).slice(0,600));

await page.goto(BASE+"/program",{waitUntil:"networkidle"});
await page.waitForTimeout(1500);
const pt = await page.locator("body").innerText();
console.log("PROGRAM PAGE:", pt.slice(0,800));
console.log("errors", errors);
console.log("consoles", consoles.slice(0,10));
await browser.close();
