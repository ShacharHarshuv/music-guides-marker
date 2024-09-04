import { readdirSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import {
  readFileSync,
  writeFileSync,
} from 'node:fs';
import * as pdfjsLib from 'pdfjs-dist';

export async function makeCombinedScore(path: string) {
  const files = readdirSync(path).filter((file) =>
    file.endsWith(".pdf"),
  );
  const score = files.find((file) => file.toLowerCase().includes("score"));
  if (!score) {
    throw new Error(`No score found. Make sure a pdf file that includes "score" is in the folder.`);
  }
  const scoreBuffer = readFileSync(`${path}/${score}`);
  const scoreDoc = await PDFDocument.load(scoreBuffer);
  const scoreTextItems = await extractTextItems(scoreBuffer);
  const flowPageIndexes = scoreTextItems.filter(item => /\[Rev./.test(item.text)).map(item => item.page);
  flowPageIndexes.push(scoreDoc.getPageCount());

  const [scoreLabel, showName] = score.split('.')[0].split(' - ');

  const script = files.find((file) => file.toLowerCase().includes("script"));
  if (!script) {
    throw new Error(`No script found. Make sure a pdf file that includes "script" is in the folder.`);
  }

  const [scriptLabel] = script.split('.')[0].split(' - ');

  const scriptBuffer = readFileSync(`${path}/${script}`);
  const scriptDoc = await PDFDocument.load(scriptBuffer);

  const scriptTextItems = await extractTextItems(scriptBuffer);
  const songHeaders = scriptTextItems.filter(item => /#\d/.test(item.text));

  let offset = 0;
  for (let i = 0; i < songHeaders.length; i++) {
    const songHeader = songHeaders[i];

    const insertIndex = songHeader.page;
    const pagesToCopyIndices = range(flowPageIndexes[i], flowPageIndexes[i + 1]);
    const insertPages = await scriptDoc.copyPages(scoreDoc, pagesToCopyIndices);
    insertPages.forEach((page, i) => {
      scriptDoc.insertPage(insertIndex + i + + offset + 1, page);
    });
    offset += pagesToCopyIndices.length;
  }

  writeFileSync(`${path}/Combined ${scriptLabel} & ${scoreLabel} - ${showName}.pdf`, await scriptDoc.save());

  console.log('Done.')
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

async function extractTextItems(buffer: Buffer) {
  const pdfDocument = await pdfjsLib.getDocument({ data: Uint8Array.from(buffer) }).promise;

  const textContentWithCoords: {
    text: string;
    x: string;
    y: string;
    width: number;
    height: number;
    page: number;
  }[] = [];

  for (let pageIndex = 0; pageIndex < pdfDocument.numPages; pageIndex++) {
    const page = await pdfDocument.getPage(pageIndex + 1);
    const textContent = await page.getTextContent();

    textContent.items.forEach((item) => {
      if ('str' in item && 'transform' in item) {
        const tx = pdfjsLib.Util.transform(page.getViewport({ scale: 1 }).transform, item.transform);
        const x = tx[4];
        const y = tx[5];
        const width = item.width;
        const height = item.height;

        textContentWithCoords.push({ text: item.str, x, y, width, height, page: pageIndex });
      }
    });
  }

  return textContentWithCoords;
}
