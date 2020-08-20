const path = require('path');

const puppeteer = require('puppeteer');

const {getCss} = require('../lib/getCss');
const {render} = require('../lib/render');

const DEFAULT_CONFIG = {
  launch: {
    args: [
      '--font-render-hinting=none',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--allow-file-access-from-files',
    ],
  },
  exitOnPageError: true,
};
async function main() {
  const args = process.argv.slice(2);
  const basePath = path.dirname(args[0]);

  const browser = await puppeteer.launch(DEFAULT_CONFIG.launch);
  const page = await browser.newPage();
  const css = await getCss(args[1]);

  await render({page, file: args[0], css});
}

main();
