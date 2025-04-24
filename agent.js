// agent.js
require("dotenv").config();
const { chromium } = require("playwright-extra");
const stealth      = require("puppeteer-extra-plugin-stealth")();   //  right plugin
chromium.use(stealth);


module.exports = async function runJob(payload) {
  console.log(" Starting job with payload:", payload);

  // 1. Launch persistent browser profile
  // ---------- launch options ----------
const launchOptions = {
    headless: false,
    args: [
      `--disable-extensions-except=${__dirname}/extension`,
      `--load-extension=${__dirname}/extension`,
    ],
  };
  
  //  Add proxy only if it exists in .env
  if (process.env.PROXY && process.env.PROXY.trim() !== '') {
    launchOptions.proxy = { server: process.env.PROXY };
  }
  
  const browser = await chromium.launchPersistentContext(
    './profile-data',
    launchOptions
  );
  

  // 2. New page & target URL (replace with real)
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });

  // 3. Bypass Cloudflare if needed
  // const cap = require('capsolver')(process.env.CAPSOLVER_KEY);
// const token = await cap.turnstile({ sitekey: '…', url: page.url() });
// await page.evaluate(`document.querySelector('[name="cf-turnstile-response"]').value="${token}"`);

  await bypassCloudflare(page);

  // 4. Trigger your extension
  await triggerExtension(page);
  

 console.log(" Job finished, closing browser40 sec …");
  await page.waitForTimeout(400000);
  await browser.close();
};

// ---- helper functions ------------------

async function bypassCloudflare(page) {
  const challengeFrame = await page.$('iframe[src*="challenge"]');
  if (!challengeFrame) {
    console.log("🔓  No captcha seen, moving on.");
    return;
  }
 /* =========================================================
     TODO (after client provides CAPSOLVER_KEY + sitekey)
     const cap = require('capsolver')(process.env.CAPSOLVER_KEY);
     const token = await cap.turnstile({
       sitekey: 'SITE_KEY_FROM_TARGET',
       url: page.url()
     });
     await page.evaluate(token => {
       document.querySelector('[name="cf-turnstile-response"]').value = token;
     }, token);
     ========================================================= */

  console.log("🔐  Captcha detected → manual solve for PoC.");
  await page.pause();      // opens PW inspector, you solve manually
}

async function triggerExtension(page) {
    console.log("🚀  Sending message to extension …");
    await page.evaluate(() => {
      window.postMessage(
        { type: "RUN_AGENT", data: { hello: "from playwright" } },
        "*"
      );
    });
  }
  