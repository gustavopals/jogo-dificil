import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const CELL_SIZE = 128;
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const SHEET_SIZE = CELL_SIZE * GRID_COLUMNS;
const TOTAL_CELLS = GRID_COLUMNS * GRID_ROWS;

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "assets", "sprites", "bosses");
const OUTPUT_DIR = path.join(ROOT, "assets", "spritesheets");

const BOSSES = [
  {
    input: "hirolito-narguilito.png",
    output: "boss-hirolito-sheet-512.png",
    target: { width: 96, height: 112 },
  },
  {
    input: "dr-imports.png",
    output: "boss-dr-imports-sheet-512.png",
    target: { width: 96, height: 128 },
  },
  {
    input: "giga-fabio.png",
    output: "boss-giga-fabio-sheet-512.png",
    target: { width: 120, height: 128 },
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const boss of BOSSES) {
    await createBossSheet(boss);
  }

  console.log("Generated boss spritesheets at assets/spritesheets/");
}

async function createBossSheet(config) {
  const inputPath = path.join(SOURCE_DIR, config.input);
  const base = await sharp(inputPath)
    .resize({
      width: config.target.width,
      height: config.target.height,
      fit: "fill",
      kernel: "nearest",
    })
    .png()
    .toBuffer();

  const variants = await Promise.all([
    createVariant(base, { brightness: 1.0, saturate: 1.0 }),
    createVariant(base, { brightness: 1.2, saturate: 1.1 }),
    createVariant(base, { brightness: 0.88, saturate: 1.25 }),
    createVariant(base, { brightness: 1.08, saturate: 0.9 }),
    createVariant(base, { brightness: 0.7, saturate: 0.25 }),
  ]);

  const composites = [];
  const blankCell = await createTransparentCell();

  for (let i = 0; i < TOTAL_CELLS; i += 1) {
    const col = i % GRID_COLUMNS;
    const row = Math.floor(i / GRID_COLUMNS);
    const left = col * CELL_SIZE;
    const top = row * CELL_SIZE;

    composites.push({
      input: i < variants.length ? variants[i] : blankCell,
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

async function createVariant(
  image,
  adjustments,
) {
  const metadata = await sharp(image).metadata();
  const width = metadata.width ?? CELL_SIZE;
  const height = metadata.height ?? CELL_SIZE;

  const centered = await sharp(await createTransparentCell())
    .composite([
      {
        input: image,
        left: Math.floor((CELL_SIZE - width) / 2),
        top: CELL_SIZE - height,
      },
    ])
    .modulate({
      brightness: adjustments.brightness,
      saturation: adjustments.saturate,
    })
    .png()
    .toBuffer();

  return centered;
}

async function createTransparentCell() {
  return sharp({
    create: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
