import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const CELL_SIZE = 128;
const GRID_COLUMNS = 4;
const GRID_ROWS = 4;
const SHEET_SIZE = CELL_SIZE * GRID_COLUMNS;

const FRAME_TARGET = {
  width: 32,
  height: 48,
};

const ROOT = process.cwd();
const SPRITE_DIR = path.join(ROOT, "assets", "legacy", "pino");
const OUTPUT_DIR = path.join(ROOT, "assets", "spritesheets");

const CORE_FRAMES = [
  "player-pino-idle.png",
  "player-pino-run-01.png",
  "player-pino-run-02.png",
  "player-pino-run-03.png",
  "player-pino-jump.png",
  "player-pino-jump-peak.png",
  "player-pino-fall.png",
  "player-pino-dash.png",
  "player-pino-death-01.png",
  "player-pino-death-02.png",
  "player-pino-respawn-01.png",
  "player-pino-respawn-02.png",
];

const ENERGY_FRAMES = [
  "player-pino-charge-01.png",
  "player-pino-charge-02.png",
  "player-pino-cyan-spark-01.png",
  "player-pino-cyan-spark-02.png",
  "player-pino-cyan-burst-prepare-01.png",
  "player-pino-cyan-burst-prepare-02.png",
  "player-pino-cyan-burst-fire-01.png",
  "player-pino-cyan-burst-fire-02.png",
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  await createSheet(CORE_FRAMES, path.join(OUTPUT_DIR, "player-pino-core-512.png"));
  await createSheet(
    ENERGY_FRAMES,
    path.join(OUTPUT_DIR, "player-pino-energy-512.png"),
  );

  console.log("Generated Pino spritesheets at assets/spritesheets/");
}

async function createSheet(frameFiles, outputPath) {
  const totalCells = GRID_COLUMNS * GRID_ROWS;
  if (frameFiles.length > totalCells) {
    throw new Error(`Too many frames (${frameFiles.length}) for ${totalCells} cells`);
  }

  const composites = [];
  const blankCell = await sharp({
    create: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();

  for (let i = 0; i < totalCells; i += 1) {
    const col = i % GRID_COLUMNS;
    const row = Math.floor(i / GRID_COLUMNS);
    const left = col * CELL_SIZE;
    const top = row * CELL_SIZE;

    if (i < frameFiles.length) {
      const inputPath = path.join(SPRITE_DIR, frameFiles[i]);
      const resized = await sharp(inputPath)
        .resize({
          width: FRAME_TARGET.width,
          height: FRAME_TARGET.height,
          fit: "fill",
          kernel: "nearest",
        })
        .png()
        .toBuffer();

      const cell = await sharp({
        create: {
          width: CELL_SIZE,
          height: CELL_SIZE,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: resized,
            left: Math.floor((CELL_SIZE - FRAME_TARGET.width) / 2),
            top: CELL_SIZE - FRAME_TARGET.height,
          },
        ])
        .png()
        .toBuffer();

      composites.push({
        input: cell,
        left,
        top,
      });
    } else {
      composites.push({
        input: blankCell,
        left,
        top,
      });
    }
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
