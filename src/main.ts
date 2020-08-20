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
    await browser.newPage();
    await browser.newPage();
    const css = await getCss(
      path.resolve(process.env.GITHUB_WORKSPACE || '', cssPath)
    );

    const pages = await browser.pages();

    for (let i = 0; i < files.length; i += 3) {
      const promises = [
        render({
          page: pages[i % 3],
          file: files[i],
          css,
        }),
        i + 1 < files.length &&
          render({
            page: pages[(i + 1) % 3],
            file: files[i + 1],
            css,
          }),
        i + 2 < files.length &&
          render({
            page: pages[(i + 2) % 3],
            file: files[i + 2],
            css,
          }),
      ].filter(Boolean) as Promise<any>[];
      await Promise.all(promises);
    }

    // for (const file of files) {
    // await render({
    // page,
    // file,
    // css,
    // });
    // }

    await browser.close();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
