import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const GRID_COLUMNS = 4;
const GRID_ROWS = 4;

const FRAME_TARGET = {
  width: 32,
  height: 48,
};

const ROOT = process.cwd();
const SOURCE_PATH = path.join(ROOT, "assets", "hero", "hero-examples.png");
const OUTPUT_DIR = path.join(ROOT, "assets", "legacy", "pino");

/** Maps output filename to 0-based cell index in the 4x4 hero reference sheet. */
const FRAME_CELL_MAP = {
  "player-pino-idle.png": 0,
  "player-pino-run-01.png": 2,
  "player-pino-run-02.png": 3,
  "player-pino-run-03.png": 2,
  "player-pino-jump.png": 7,
  "player-pino-jump-peak.png": 3,
  "player-pino-fall.png": 6,
  "player-pino-dash.png": 12,
  "player-pino-death-01.png": 14,
  "player-pino-death-02.png": 6,
  "player-pino-respawn-01.png": 10,
  "player-pino-respawn-02.png": 0,
  "player-pino-charge-01.png": 8,
  "player-pino-charge-02.png": 8,
  "player-pino-cyan-spark-01.png": 9,
  "player-pino-cyan-spark-02.png": 4,
  "player-pino-cyan-burst-prepare-01.png": 10,
  "player-pino-cyan-burst-prepare-02.png": 1,
  "player-pino-cyan-burst-fire-01.png": 9,
  "player-pino-cyan-burst-fire-02.png": 15,
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const source = sharp(SOURCE_PATH);
  const metadata = await source.metadata();
  const sheetWidth = metadata.width ?? 0;
  const sheetHeight = metadata.height ?? 0;

  if (sheetWidth <= 0 || sheetHeight <= 0) {
    throw new Error(`Invalid source image dimensions: ${SOURCE_PATH}`);
  }

  const cellWidth = Math.floor(sheetWidth / GRID_COLUMNS);
  const cellHeight = Math.floor(sheetHeight / GRID_ROWS);
  const rawSheet = await source.ensureAlpha().raw().toBuffer();

  for (const [fileName, cellIndex] of Object.entries(FRAME_CELL_MAP)) {
    const col = cellIndex % GRID_COLUMNS;
    const row = Math.floor(cellIndex / GRID_COLUMNS);
    const left = col * cellWidth;
    const top = row * cellHeight;
    const cell = await extractCell(rawSheet, {
      sheetWidth,
      sheetHeight,
      left,
      top,
      width: cellWidth,
      height: cellHeight,
    });
    const framed = await fitFrameToTarget(cell);
    await framed.toFile(path.join(OUTPUT_DIR, fileName));
  }

  console.log(
    `Extracted ${Object.keys(FRAME_CELL_MAP).length} Pino frames to assets/legacy/pino/`,
  );
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
  }).png();
}

function isChromaKeyPixel(red, green, blue) {
  return green >= 170 && green > red + 40 && green > blue + 40;
}

async function fitFrameToTarget(cellImage) {
  const trimmed = await cellImage.trim().png().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  const contentWidth = trimmedMeta.width ?? FRAME_TARGET.width;
  const contentHeight = trimmedMeta.height ?? FRAME_TARGET.height;
  const scale = Math.min(
    FRAME_TARGET.width / contentWidth,
    FRAME_TARGET.height / contentHeight,
  );
  const resizedWidth = Math.max(1, Math.round(contentWidth * scale));
  const resizedHeight = Math.max(1, Math.round(contentHeight * scale));

  const resized = await sharp(trimmed)
    .resize({
      width: resizedWidth,
      height: resizedHeight,
      kernel: sharp.kernel.nearest,
    })
    .png()
    .toBuffer();

  const offsetLeft = Math.floor((FRAME_TARGET.width - resizedWidth) / 2);
  const offsetTop = FRAME_TARGET.height - resizedHeight;

  return sharp({
    create: {
      width: FRAME_TARGET.width,
      height: FRAME_TARGET.height,
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
