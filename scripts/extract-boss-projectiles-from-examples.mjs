import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const OUTPUT_DIR = path.join(process.cwd(), "assets", "sprites", "bosses");

/** Extracts 32x32 gameplay sprites from boss reference sheets. */
const PROJECTILE_EXTRACTS = [
  {
    output: "boss-projectile-smoke-puff.png",
    source: path.join(
      process.cwd(),
      "assets",
      "boss",
      "examples",
      "boss-1-examples.png",
    ),
  /** Frame 8: hose fires a large crystal shard on the left side of the cell. */
    cellIndex: 8,
    size: 32,
    cropScale: 0.42,
    cropAnchor: "left",
  },
  {
    output: "boss-projectile-import-bottle.png",
    source: path.join(
      process.cwd(),
      "assets",
      "boss",
      "examples",
      "boss-2-examples.png",
    ),
    // Flying import vial: row 3 col 1 in the reference sheet (0-based cell 8).
    cellIndex: 8,
    size: 32,
    cropScale: 0.72,
    cropAnchor: "center",
  },
  {
    output: "boss-projectile-boulder.png",
    source: path.join(
      process.cwd(),
      "assets",
      "boss",
      "examples",
      "boss-3-examples.png",
    ),
    // Ground slam (cell 10): flying rubble on the lower-right of the pose.
    cellIndex: 10,
    size: 24,
    cropScale: 0.32,
    focus: "lower-right",
  },
  {
    output: "boss-impact-burst.png",
    source: path.join(
      process.cwd(),
      "assets",
      "boss",
      "examples",
      "boss-3-examples.png",
    ),
    // Same slam frame: tan dust burst centered on the impact line.
    cellIndex: 10,
    size: 24,
    cropScale: 0.7,
    focus: "lower-center",
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const config of PROJECTILE_EXTRACTS) {
    await extractProjectile(config);
    console.log(`Wrote ${config.output}`);
  }
}

async function extractProjectile(config) {
  const grid = 4;
  const source = sharp(config.source);
  const metadata = await source.metadata();
  const sheetWidth = metadata.width ?? 0;
  const sheetHeight = metadata.height ?? 0;
  const cellWidth = Math.floor(sheetWidth / grid);
  const cellHeight = Math.floor(sheetHeight / grid);
  const col = config.cellIndex % grid;
  const row = Math.floor(config.cellIndex / grid);
  const rawSheet = await source.ensureAlpha().raw().toBuffer();

  const cell = await extractCell(rawSheet, {
    sheetWidth,
    sheetHeight,
    left: col * cellWidth,
    top: row * cellHeight,
    width: cellWidth,
    height: cellHeight,
  });

  const cropScale = config.cropScale ?? 0.35;
  const trimmed = await cell.trim().png().toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  const trimmedWidth = trimmedMeta.width ?? config.size;
  const trimmedHeight = trimmedMeta.height ?? config.size;
  const cropWidth = Math.max(1, Math.round(trimmedWidth * cropScale));
  const cropHeight = Math.max(1, Math.round(trimmedHeight * cropScale));
  const { cropLeft, cropTop } = config.focus
    ? resolveCropOrigin(config.focus, {
        contentWidth: trimmedWidth,
        contentHeight: trimmedHeight,
        cropWidth,
        cropHeight,
      })
    : resolveCropAnchor(config.cropAnchor ?? "center", {
        contentWidth: trimmedWidth,
        contentHeight: trimmedHeight,
        cropWidth,
        cropHeight,
      });

  await sharp(trimmed)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: Math.min(cropWidth, trimmedMeta.width ?? cropWidth),
      height: Math.min(cropHeight, trimmedMeta.height ?? cropHeight),
    })
    .resize({
      width: config.size,
      height: config.size,
      kernel: sharp.kernel.nearest,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
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
    raw: { width, height, channels: 4 },
  });
}

function isChromaKeyPixel(red, green, blue) {
  return green >= 170 && green > red + 40 && green > blue + 40;
}

function resolveCropAnchor(anchor, { contentWidth, contentHeight, cropWidth, cropHeight }) {
  const maxLeft = Math.max(0, contentWidth - cropWidth);
  const maxTop = Math.max(0, contentHeight - cropHeight);

  switch (anchor) {
    case "left":
      return { cropLeft: 0, cropTop: Math.floor(maxTop / 2) };
    case "right":
      return { cropLeft: maxLeft, cropTop: Math.floor(maxTop / 2) };
    case "top":
      return { cropLeft: Math.floor(maxLeft / 2), cropTop: 0 };
    case "bottom":
      return { cropLeft: Math.floor(maxLeft / 2), cropTop: maxTop };
    default:
      return {
        cropLeft: Math.floor(maxLeft / 2),
        cropTop: Math.floor(maxTop / 2),
      };
  }
}

function resolveCropOrigin(focus, { contentWidth, contentHeight, cropWidth, cropHeight }) {
  const maxLeft = Math.max(0, contentWidth - cropWidth);
  const maxTop = Math.max(0, contentHeight - cropHeight);

  switch (focus) {
    case "lower-right":
      return {
        cropLeft: maxLeft,
        cropTop: maxTop,
      };
    case "lower-center":
      return {
        cropLeft: Math.floor(maxLeft / 2),
        cropTop: maxTop,
      };
    case "center":
      return {
        cropLeft: Math.floor(maxLeft / 2),
        cropTop: Math.floor(maxTop / 2),
      };
    default:
      return {
        cropLeft: Math.floor(maxLeft / 2),
        cropTop: maxTop,
      };
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
