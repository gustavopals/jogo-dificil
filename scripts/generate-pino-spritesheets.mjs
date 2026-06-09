import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const CELL_SIZE = 256;
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const SHEET_SIZE = CELL_SIZE * GRID_COLUMNS;

/**
 * Conteúdo alvo dentro da célula. Mantém a proporção conteúdo/célula da
 * geração anterior (32x48 em célula 128 → 64x96 em célula 256), então o
 * tamanho em tela do Pino não muda; apenas a fidelidade dobra. A extração
 * agora lê direto da arte de referência (assets/hero/hero-examples.png) em
 * vez dos PNGs legados de 32x48, preservando rosto, roupa e sombreamento.
 */
const FRAME_TARGET = {
  width: 64,
  height: 96,
};

const ROOT = process.cwd();
const SOURCE_PATH = path.join(ROOT, "assets", "hero", "hero-examples.png");
const OUTPUT_DIR = path.join(ROOT, "assets", "spritesheets");

/** Mapeia cada frame do Pino para o índice de célula na referência 4x4. */
const FRAME_CELL_MAP = {
  "player-pino-idle": 0,
  "player-pino-run-01": 2,
  "player-pino-run-02": 3,
  "player-pino-run-03": 2,
  "player-pino-jump": 7,
  "player-pino-jump-peak": 3,
  "player-pino-fall": 6,
  "player-pino-dash": 12,
  "player-pino-death-01": 14,
  "player-pino-death-02": 6,
  "player-pino-respawn-01": 10,
  "player-pino-respawn-02": 0,
  "player-pino-charge-01": 8,
  "player-pino-charge-02": 8,
  "player-pino-cyan-spark-01": 9,
  "player-pino-cyan-spark-02": 4,
  "player-pino-cyan-burst-prepare-01": 10,
  "player-pino-cyan-burst-prepare-02": 1,
  "player-pino-cyan-burst-fire-01": 9,
  "player-pino-cyan-burst-fire-02": 15,
};

const CORE_FRAMES = [
  "player-pino-idle",
  "player-pino-run-01",
  "player-pino-run-02",
  "player-pino-run-03",
  "player-pino-jump",
  "player-pino-jump-peak",
  "player-pino-fall",
  "player-pino-dash",
  "player-pino-death-01",
  "player-pino-death-02",
  "player-pino-respawn-01",
  "player-pino-respawn-02",
];

const ENERGY_FRAMES = [
  "player-pino-charge-01",
  "player-pino-charge-02",
  "player-pino-cyan-spark-01",
  "player-pino-cyan-spark-02",
  "player-pino-cyan-burst-prepare-01",
  "player-pino-cyan-burst-prepare-02",
  "player-pino-cyan-burst-fire-01",
  "player-pino-cyan-burst-fire-02",
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const heroCells = await extractHeroCells();

  await createSheet(
    CORE_FRAMES,
    heroCells,
    path.join(OUTPUT_DIR, "player-pino-core-1024.png"),
  );
  await createSheet(
    ENERGY_FRAMES,
    heroCells,
    path.join(OUTPUT_DIR, "player-pino-energy-1024.png"),
  );

  console.log("Generated Pino spritesheets at assets/spritesheets/");
}

async function extractHeroCells() {
  const source = sharp(SOURCE_PATH);
  const metadata = await source.metadata();
  const sheetWidth = metadata.width ?? 0;
  const sheetHeight = metadata.height ?? 0;

  if (sheetWidth <= 0 || sheetHeight <= 0) {
    throw new Error(`Invalid hero reference: ${SOURCE_PATH}`);
  }

  const cellWidth = Math.floor(sheetWidth / GRID_COLUMNS);
  const cellHeight = Math.floor(sheetHeight / GRID_ROWS);
  const rawSheet = await source.ensureAlpha().raw().toBuffer();
  const cells = [];

  for (let cellIndex = 0; cellIndex < GRID_COLUMNS * GRID_ROWS; cellIndex += 1) {
    const col = cellIndex % GRID_COLUMNS;
    const row = Math.floor(cellIndex / GRID_COLUMNS);

    cells.push(
      await extractCell(rawSheet, {
        sheetWidth,
        sheetHeight,
        left: col * cellWidth,
        top: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
      }),
    );
  }

  return cells;
}

async function createSheet(frameNames, heroCells, outputPath) {
  const totalCells = GRID_COLUMNS * GRID_ROWS;
  if (frameNames.length > totalCells) {
    throw new Error(
      `Too many frames (${frameNames.length}) for ${totalCells} cells`,
    );
  }

  const composites = [];

  for (let i = 0; i < frameNames.length; i += 1) {
    const cellIndex = FRAME_CELL_MAP[frameNames[i]];

    if (cellIndex === undefined) {
      throw new Error(`Unknown frame name: ${frameNames[i]}`);
    }

    const framed = await fitFrameToTarget(heroCells[cellIndex]);
    const col = i % GRID_COLUMNS;
    const row = Math.floor(i / GRID_COLUMNS);

    composites.push({
      input: await framed.png().toBuffer(),
      left: col * CELL_SIZE,
      top: row * CELL_SIZE,
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
    .toFile(outputPath);
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
  })
    .png()
    .toBuffer();
}

function isChromaKeyPixel(red, green, blue) {
  return green >= 170 && green > red + 40 && green > blue + 40;
}

async function fitFrameToTarget(cellBuffer) {
  const trimmed = await sharp(cellBuffer).trim().png().toBuffer();
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
