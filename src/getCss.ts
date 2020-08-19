import {promises as fs} from 'fs';

export async function getCss(file?: string): Promise<string> {
  if (!file) {
    return '';
  }

  const cssFromFile = await fs.readFile(file, 'utf8');
  return `${cssFromFile.replace(/[\r\n]+/g, '')}
  #__vs_canvas {
    position: relative;
  }`;
}
