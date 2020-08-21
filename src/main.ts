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

const MAX_PAGES = 5;

async function run(): Promise<void> {
  try {
    const basePath = core.getInput('base-path');
    const cssPath = core.getInput('css-path');

    const globber = await glob.create(`${basePath}/**/*.html`);
    const files = await globber.glob();

    const browser = await puppeteer.launch(DEFAULT_CONFIG_CI.launch);

    await Promise.all(
      [...Array(MAX_PAGES - 1)].map(async () => browser.newPage())
    );

    const css = await getCss(
      path.resolve(process.env.GITHUB_WORKSPACE || '', cssPath)
    );

    const pages = await browser.pages();

    for (let i = 0; i < files.length; i += MAX_PAGES) {
      await Promise.all(
        [...Array(MAX_PAGES)]
          .map(
            (_, j) =>
              i + j < files.length &&
              render({
                page: pages[(i + j) % MAX_PAGES],
                file: files[i + j],
                css,
              })
          )
          .filter(Boolean) as Promise<any>[]
      );
    }

    await browser.close();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
