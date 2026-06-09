import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const CELL_SIZE = 256;
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const SHEET_SIZE = CELL_SIZE * GRID_COLUMNS;
const TOTAL_CELLS = GRID_COLUMNS * GRID_ROWS;

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "assets", "spritesheets");

/**
 * Boss sheets: 4x4 reference art → 1024 spritesheet (16 frames × 256px cells).
 * O conteúdo mantém a mesma proporção conteúdo/célula da geração anterior
 * (alvo 2x em célula 2x), então o tamanho em tela não muda — apenas a
 * fidelidade dobra. O resize usa lanczos3 para preservar o sombreamento e o
 * detalhe da arte de referência (visual mais realista que nearest).
 */
const BOSS_SHEET_CONFIGS = [
  {
    id: "hirolito",
    source: path.join(ROOT, "assets", "boss", "examples", "boss-1-examples.png"),
    output: "boss-hirolito-sheet-1024.png",
    frameTarget: { width: 144, height: 176 },
  },
  {
    id: "dr-imports",
    source: path.join(ROOT, "assets", "boss", "examples", "boss-2-examples.png"),
    output: "boss-dr-imports-sheet-1024.png",
    frameTarget: { width: 144, height: 192 },
  },
  {
    id: "giga-fabio",
    source: path.join(ROOT, "assets", "boss", "examples", "boss-3-examples.png"),
    output: "boss-giga-fabio-sheet-1024.png",
    frameTarget: { width: 176, height: 192 },
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const config of BOSS_SHEET_CONFIGS) {
    await createBossSheetFromReference(config);
    console.log(`Generated ${config.output} from ${path.basename(config.source)}`);
  }

  console.log("Boss spritesheets ready at assets/spritesheets/");
}

async function createBossSheetFromReference(config) {
  const source = sharp(config.source);
  const metadata = await source.metadata();
  const sheetWidth = metadata.width ?? 0;
  const sheetHeight = metadata.height ?? 0;

  if (sheetWidth <= 0 || sheetHeight <= 0) {
    throw new Error(`Invalid boss reference: ${config.source}`);
  }

  const refCellWidth = Math.floor(sheetWidth / GRID_COLUMNS);
  const refCellHeight = Math.floor(sheetHeight / GRID_ROWS);
  const rawSheet = await source.ensureAlpha().raw().toBuffer();
  const composites = [];

  for (let cellIndex = 0; cellIndex < TOTAL_CELLS; cellIndex += 1) {
    const col = cellIndex % GRID_COLUMNS;
    const row = Math.floor(cellIndex / GRID_COLUMNS);
    const left = col * CELL_SIZE;
    const top = row * CELL_SIZE;
    const refLeft = col * refCellWidth;
    const refTop = row * refCellHeight;

    const extracted = await extractCell(rawSheet, {
      sheetWidth,
      sheetHeight,
      left: refLeft,
      top: refTop,
      width: refCellWidth,
      height: refCellHeight,
    });
    const framed = await fitFrameToTarget(extracted, config.frameTarget);

    composites.push({
      input: await framed.png().toBuffer(),
      left,
      top,
    });
  }

  await sharp({
    create: {
      width: SHEET_SIZE,
      height: SHEET_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(OUTPUT_DIR, config.output));
}

async function extractCell(
  rawSheet,
  { sheetWidth, sheetHeight, left, top, width, height },
) {
  const output = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sourceX = left + x;
      const sourceY = top + y;

      if (
        sourceX >= sheetWidth ||
        sourceY >= sheetHeight ||
        sourceX < 0 ||
        sourceY < 0
      ) {
        continue;
      }

      const sourceIndex = (sourceY * sheetWidth + sourceX) * 4;
      const targetIndex = (y * width + x) * 4;
      const red = rawSheet[sourceIndex];
      const green = rawSheet[sourceIndex + 1];
      const blue = rawSheet[sourceIndex + 2];
      const alpha = isChromaKeyPixel(red, green, blue)
        ? 0
        : rawSheet[sourceIndex + 3];

      output[targetIndex] = red;
      output[targetIndex + 1] = green;
      output[targetIndex + 2] = blue;
      output[targetIndex + 3] = alpha;
    }
  }

  return sharp(output, {
    raw: {
      width,
      height,
      channels: 4,
    },
  });
}

function isChromaKeyPixel(red, green, blue) {
  return green >= 170 && green > red + 40 && green > blue + 40;
}

async function fitFrameToTarget(cellImage, frameTarget) {
  const trimmed = await cellImage.trim().png().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  const contentWidth = trimmedMeta.width ?? frameTarget.width;
  const contentHeight = trimmedMeta.height ?? frameTarget.height;
  const scale = Math.min(
    frameTarget.width / contentWidth,
    frameTarget.height / contentHeight,
  );
  const resizedWidth = Math.max(1, Math.round(contentWidth * scale));
  const resizedHeight = Math.max(1, Math.round(contentHeight * scale));

  const resized = await sharp(trimmed)
    .resize({
      width: resizedWidth,
      height: resizedHeight,
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  const offsetLeft = Math.floor((CELL_SIZE - resizedWidth) / 2);
  const offsetTop = CELL_SIZE - resizedHeight;

  return sharp({
    create: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([
    {
      input: resized,
      left: offsetLeft,
      top: offsetTop,
    },
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
