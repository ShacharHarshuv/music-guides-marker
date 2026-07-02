import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

function findScorePdfs(rootDir: string) {
  const scores: { filePath: string; fileName: string }[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const entryPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".pdf") &&
        entry.name.toLowerCase().includes("score") &&
        !entry.name.toLowerCase().includes("combined")
      ) {
        scores.push({ filePath: entryPath, fileName: entry.name });
      }
    }
  }

  walk(rootDir);
  return scores;
}

export async function makeCombineScoreFromDirectory(path: string) {
  const scores = findScorePdfs(path);
  if (!scores.length) {
    throw new Error(
      `No score found. Make sure a pdf file that includes "score" is in the folder or a subfolder.`
    );
  } else {
    console.log(
      `Found ${scores.length} score(s). (${scores.map((score) => relative(path, score.filePath)).join(", ")})`
    );
  }

  const script = readdirSync(path)
    .filter((file) => file.endsWith(".pdf"))
    .find(
      (file) =>
        file.toLowerCase().includes("script") &&
        !file.toLowerCase().includes("combined")
    );

  if (!script) {
    throw new Error(
      `No script found. Make sure a pdf file that includes "script" is in the folder.`
    );
  } else {
    console.log(`Found script: "${script}"`);
  }

  const scriptPath = join(path, script);

  await Promise.all(
    scores.map(async ({ filePath, fileName }) => {
      const [scoreLabel, showName] = fileName.split(".")[0].split(" - ");
      console.log("showName", showName, "scoreLabel", scoreLabel);

      const [scriptLabel] = script.split(".")[0].split(" - ");
      console.log("scriptLabel");

      await makeCombinedScore(
        filePath,
        scriptPath,
        join(
          dirname(filePath),
          `Combined ${scriptLabel} & ${scoreLabel} - ${showName}.pdf`
        )
      );
    })
  );
}

export async function makeCombinedScore(
  scoreFilePath: string,
  scriptFilePath: string,
  outputFilePath: string
) {
  const scoreBuffer = readFileSync(scoreFilePath);
  const scoreDoc = await PDFDocument.load(scoreBuffer);
  const scoreTextItems = await extractTextItems(scoreBuffer);
  const flowPageIndexes = scoreTextItems
    .filter((item) => /\[Rev./.test(item.text))
    .map((item) => item.page);
  flowPageIndexes.push(scoreDoc.getPageCount());

  const scriptBuffer = readFileSync(scriptFilePath);
  const scriptDoc = await PDFDocument.load(scriptBuffer);

  const scriptTextItems = await extractTextItems(scriptBuffer);
  const songHeaders = scriptTextItems.filter((item) => /#\d/.test(item.text));
  const songEnds = scriptTextItems.filter((item) =>
    /End of Song/.test(item.text)
  );

  if (songHeaders.length !== songEnds.length) {
    throw new Error(
      `The number of song headers (${songHeaders.length}) and song ends (${songEnds.length}) do not match\n` +
        `Song headers: ${songHeaders.map((item) => item.text).join(", ")}\n` +
        `Song ends pages: ${songEnds.map((item) => item.page).join(", ")}`
    );
  }

  let offset = 0;
  for (let i = 0; i < songHeaders.length; i++) {
    const songHeader = songHeaders[i];
    const songEnd = songEnds[i];
    const pagesIndicesToRemove = range(songHeader.page + 1, songEnd.page); // range is inclusive for start and exclusive for end

    const startPageIndex = songHeader.page + offset;
    const endPageIndex = songEnd.page + offset;
    const samePage = songHeader.page === songEnd.page;

    let continuationPage: PDFPage | undefined;

    if (samePage) {
      [continuationPage] = await scriptDoc.copyPages(scriptDoc, [
        startPageIndex,
      ]);

      const startPage = scriptDoc.getPage(startPageIndex);
      whiteoutStartPage(startPage, songHeader);
    } else {
      whiteoutStartPage(scriptDoc.getPage(startPageIndex), songHeader);
      whiteoutEndPage(scriptDoc.getPage(endPageIndex), songEnd);
    }

    for (const pageIndex of [...pagesIndicesToRemove].sort((a, b) => b - a)) {
      scriptDoc.removePage(pageIndex + offset);
    }

    const insertIndex = songHeader.page;
    const pagesIndicesToCopy = range(
      flowPageIndexes[i],
      flowPageIndexes[i + 1]
    );
    const insertPages = await scriptDoc.copyPages(scoreDoc, pagesIndicesToCopy);

    insertPages.forEach((page, i) => {
      scriptDoc.insertPage(insertIndex + i + offset + 1, page);
    });

    if (continuationPage) {
      whiteoutEndPage(continuationPage, songEnd);
      scriptDoc.insertPage(
        insertIndex + offset + 1 + pagesIndicesToCopy.length,
        continuationPage
      );
    }

    offset += pagesIndicesToCopy.length;
    offset -= pagesIndicesToRemove.length;
    if (continuationPage) {
      offset += 1;
    }
  }

  writeFileSync(outputFilePath, await scriptDoc.save());

  console.log("Done.");
}

function whiteoutStartPage(page: PDFPage, songHeader: { y: number; height: number }) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight() - songHeader.y - songHeader.height + 25,
    color: rgb(1, 1, 1),
  });
}

function whiteoutEndPage(page: PDFPage, songEnd: { y: number; height: number }) {
  page.drawRectangle({
    x: 0,
    y: page.getHeight() - songEnd.y - 10,
    width: page.getWidth(),
    height: songEnd.y + songEnd.height - 60,
    color: rgb(1, 1, 1),
  });
}

function range(start: number, end: number): number[] {
  if (start >= end) {
    return [];
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
}

async function extractTextItems(buffer: Buffer) {
  const pdfDocument = await pdfjsLib.getDocument({
    data: Uint8Array.from(buffer),
  }).promise;

  const textContentWithCoords: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
  }[] = [];

  for (let pageIndex = 0; pageIndex < pdfDocument.numPages; pageIndex++) {
    const page = await pdfDocument.getPage(pageIndex + 1);
    const textContent = await page.getTextContent();

    textContent.items.forEach((item) => {
      if ("str" in item && "transform" in item) {
        const tx = pdfjsLib.Util.transform(
          page.getViewport({ scale: 1 }).transform,
          item.transform
        );
        const x = tx[4];
        const y = tx[5];
        const width = item.width;
        const height = item.height;

        textContentWithCoords.push({
          text: item.str,
          x,
          y,
          width,
          height,
          page: pageIndex,
        });
      }
    });
  }

  return textContentWithCoords;
}
