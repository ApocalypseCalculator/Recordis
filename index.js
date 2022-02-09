const puppeteer = require('puppeteer-core');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const config = require('./config');

if (argv.channelName && argv.channelServer && argv.saveTo) {
    (async () => {
        const browser = await puppeteer.launch({
            executablePath: config.chromePath,
            args: [],
            headless: true,
            devtools: true,
            ignoreDefaultArgs: ['--disable-extensions']
        })

        const page = await browser.newPage();

        await (await page).setViewport({ width: 1920, height: 1080 });
        await (await page).setUserAgent(`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36`);

        await (await page).goto("https://discord.com/login", { waitUntil: 'load' });
        await (await page).type("input[name='email']", config.login.email);
        await (await page).type("input[name='password']", config.login.password);
        await (await page).click("button[type='submit']");
        await (await page).waitForNavigation();
        //await (await page).goto("https://discord.com/app", { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 5000)); //sleep for 5 seconds, hopefully this allows the page to load
        await (await page).keyboard.down('Control');
        await (await page).keyboard.press('K');
        await (await page).keyboard.up('Control');
        await (await page).type("input[aria-label='Quick switcher']", `!${argv.channelName} ${argv.channelServer.split(/\s+/)[0]}`); //replace this with voice chat name
        await (await page).keyboard.press('Enter');
        await new Promise(r => setTimeout(r, 2000)); //sleep for 2 seconds, hopefully this allows the page to load
        await (await page).click("div[class='size12-oc4dx4 subtext-2HDqJ7 channel-3prF2u']"); //voice channel link at bottom
        await new Promise(r => setTimeout(r, 2000)); //sleep for 2 seconds, hopefully this allows the page to load
        await (await page).click("button[class='button-f2h6uQ lookFilled-yCfaCM cta-3-AFNF sizeMin-DfpWCE grow-2sR_-F']"); //watch stream button
        await new Promise(r => setTimeout(r, 2000)); //sleep for 2s
        await (await page).click("button[aria-label='Hide Members']");
        await new Promise(r => setTimeout(r, 1000)); //sleep for 1 seconds
        await (await page).click("button[aria-label='Full Screen']");
        await new Promise(r => setTimeout(r, 1000)); //sleep for 1 seconds
        await (await page).mouse.move(-1, -1); //move mouse outside of window

        const recorder = new PuppeteerScreenRecorder(page);
        await recorder.start(argv.saveTo);

        let intervalCheck = setInterval(async function () {
            let n = await (await page).evaluate(() => {
                let vidcheck = document.getElementsByClassName("previewWrapper--xCwTW video-35SHWt").length;
                return vidcheck;
            });
            if (n == 0) {
                await recorder.stop();
                console.log('RECORDING FINISHED');
                await (await page.close());
                clearInterval(intervalCheck);
                process.exit(0);
            }
        }, 1000);

    })();
}
else {
    console.log('Please specify channel name and server name');
}

//TESTING DISCORD SCREENSHARE !!!!!!!!!!!!!