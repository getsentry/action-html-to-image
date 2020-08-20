import path from 'path';

import {Page} from 'puppeteer';

type Params = {
  page: Page;
  file: string;
  css: string;
};

export async function render({page, file, css}: Params): Promise<void> {
  const basePath = path.dirname(file);
  const slug = path.basename(file, '.html');
  const imagePath = path.resolve(basePath, `${slug}.png`);
  await page.goto(`file://${file}`, {waitUntil: 'networkidle0'});

  if (css) {
    await page.addStyleTag({
      content: css,
    });
  }

  const el = await page.$('#__vs_canvas');

  try {
    await (el ? el : page).screenshot({
      path: imagePath,
    });
  } catch (err) {
    console.error(new Error(`${slug}: ${err}`));
    if (err.message === 'Node has 0 height.') {
      console.warn('...snapshotting full page instead');
      await page.screenshot({
        path: imagePath,
      });
    }
  }

  console.log(`finished ${slug}`);
}
