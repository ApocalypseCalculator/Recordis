# Recordis

Recordis is a Discord userbot that records a screenshare through automating a browser client using puppeteer. 

Currently in development. It runs headlessly (in the background) and currently only supports video (no audio). 

### Prerequisites

- Node.js v16
- npm
- An up-to-date version of either Chrome, Edge, or Opera. Will not work with Firefox or Safari. 

### How to Run

Go to `config.js` and add in credentials as well as Chromium executable path. Then log in to your userbot Discord account on your computer. This will bypass the captcha requirement when logging in first time through Recordis.
```
npm install
node . --channelName=<channel name> --channelServer=<channel's server name> --saveTo=<file name to save to>
```