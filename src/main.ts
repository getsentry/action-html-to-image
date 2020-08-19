import path from 'path';

import * as glob from '@actions/glob';
import * as core from '@actions/core';

import puppeteer from 'puppeteer';

import {getCss} from './getCss';
import {render} from './render';

const DEFAULT_CONFIG_CI = {
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

async function run(): Promise<void> {
  try {
    const basePath = core.getInput('base-path');
    const cssPath = core.getInput('css-path');

    const globber = await glob.create(`${basePath}/**/*.html`);
    const files = await globber.glob();

    const browser = await puppeteer.launch(DEFAULT_CONFIG_CI.launch);
    const page = await browser.newPage();
    const css = await getCss(
      path.resolve(process.env.GITHUB_WORKSPACE || '', cssPath)
    );

    for (const file of files) {
      await render({
        page,
        file,
        css,
      });
    }

    await browser.close();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
