const puppeteer = require('puppeteer-core');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const useragents = require('user-agents');
const config = require('./config');

(async () => {
const browser = await puppeteer.launch({
    executablePath: config.chromePath,
    args: [],
    headless: true,
    devtools: true,
    ignoreDefaultArgs: ['--disable-extensions']
})

const page = await browser.newPage();

await (await page).setUserAgent(useragents.toString());

await (await page).goto("https://discord.com/login", { waitUntil: 'load' });
const recorder = new PuppeteerScreenRecorder(page);
await recorder.start('test.mp4');
await (await page).type("input[name='email']", config.login.email);
await (await page).type("input[name='password']", config.login.password);
await (await page).click("button[type='submit']");
await (await page).waitForNavigation();
await recorder.stop();

})();