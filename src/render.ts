import {PerformanceObserver, performance} from 'perf_hooks';
import path from 'path';

import {Page} from 'puppeteer';

type Params = {
  page: Page;
  file: string;
  css: string;
};

export async function render({page, file, css}: Params): Promise<void> {
  const obs = new PerformanceObserver(items => {
    items
      .getEntries()
      .forEach(entry => console.log(`${entry.name} -> ${entry.duration}`));
    performance.clearMarks();
    performance.clearMeasures();
  });
  obs.observe({entryTypes: ['measure']});
  performance.mark('start');
  const basePath = path.dirname(file);
  const slug = path.basename(file, '.html');
  const imagePath = path.resolve(basePath, `${slug}.png`);
  performance.mark('goto-start');
  await page.goto(`file://${file}`, {waitUntil: 'networkidle0'});
  // @ts-ignore
  performance.measure('goto', 'goto-start');

  if (css) {
    await page.addStyleTag({
      content: css,
    });
  }

  const el = await page.$('#__vs_canvas');

  performance.mark('screenshot-start');
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
  // @ts-ignore
  performance.measure('screenshot', 'screenshot-start');

  console.log(`finished ${slug}`);
  // @ts-ignore
  performance.measure('total', file);
}
