import Phaser from "phaser";

import {
  getDecorationColors,
  getLevelDecorations,
  scaleLevelDecoration,
} from "../../data/levels/level-decorations";
import { getLevelVisualTheme } from "../../data/levels/level-visual-themes";
import type { LevelDefinition } from "../../shared";
import { PLACEHOLDER_TILESET_ASSET_KEYS } from "../../data/art";
import { TILE_SIZE_PX } from "../constants";
import { DEPTH_LAYERS } from "./visual-readability";

// Gerador pseudoaletório determinístico para fondos procedurais.
function bgRng(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

type BgBounds = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export function drawThemedLevelBackground(
  scene: Phaser.Scene,
  level: LevelDefinition,
): void {
  const { bounds } = level;

  if (level.id === "level-01") {
    drawCaveBackground(scene, bounds);
    return;
  }
  if (level.id === "level-02") {
    drawForestBackground(scene, bounds);
    return;
  }
  if (level.id === "level-03") {
    drawTempleBackground(scene, bounds);
    return;
  }

  const theme = getLevelVisualTheme(level.id);
  scene.add
    .tileSprite(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
      bounds.width,
      bounds.height,
      PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
    )
    .setOrigin(0.5)
    .setTint(theme.backgroundTint)
    .setAlpha(theme.backgroundAlpha)
    .setDepth(DEPTH_LAYERS.background);
}

// ----------------------------------------------------------------
// Fase 01 — Ruínas de caverna noturna
// ----------------------------------------------------------------
function drawCaveBackground(scene: Phaser.Scene, bounds: BgBounds): void {
  const { x, y, width: w, height: h } = bounds;
  const D = DEPTH_LAYERS.background;
  const cx = x + w / 2;

  // Céu: azul muito escuro no topo, levemente mais quente no horizonte
  scene.add.rectangle(cx, y + h / 2, w, h, 0x06091e, 1).setDepth(D);
  scene.add.rectangle(cx, y + h * 0.55, w, h * 0.5, 0x0d1530, 0.45).setDepth(D + 0.05);
  scene.add.rectangle(cx, y + h * 0.82, w, h * 0.3, 0x10203c, 0.35).setDepth(D + 0.06);

  // Estrelas (metade superior)
  const stars = scene.add.graphics().setDepth(D + 0.1);
  for (let i = 0; i < 38; i++) {
    stars.fillStyle(bgRng(i * 5 + 4) > 0.65 ? 0xc8d8f8 : 0xffffff, 0.4 + bgRng(i * 5 + 5) * 0.45);
    const sz = bgRng(i * 5 + 3) > 0.82 ? 2 : 1;
    stars.fillRect(x + bgRng(i * 5 + 1) * w, y + bgRng(i * 5 + 2) * h * 0.5, sz, sz);
  }

  // Montanhas distantes (ondas suaves)
  const farMt = scene.add.graphics().setDepth(D + 0.2);
  farMt.fillStyle(0x182338, 1);
  farMt.beginPath();
  farMt.moveTo(x, y + h);
  const segs1 = Math.ceil(w / 100);
  for (let i = 0; i <= segs1; i++) {
    farMt.lineTo(
      x + (i / segs1) * w,
      y + h * (0.44 + Math.sin(i * 0.75) * 0.12 + Math.cos(i * 1.7) * 0.04),
    );
  }
  farMt.lineTo(x + w, y + h);
  farMt.closePath();
  farMt.fillPath();

  // Penhascos próximos (mais escuros e irregulares)
  const nearCl = scene.add.graphics().setDepth(D + 0.3);
  nearCl.fillStyle(0x0c1420, 1);
  nearCl.beginPath();
  nearCl.moveTo(x, y + h);
  const segs2 = Math.ceil(w / 68);
  for (let i = 0; i <= segs2; i++) {
    nearCl.lineTo(
      x + (i / segs2) * w,
      y + h * (0.59 + Math.sin(i * 1.1) * 0.12 + Math.cos(i * 2.8) * 0.05 + bgRng(i + 100) * 0.07),
    );
  }
  nearCl.lineTo(x + w, y + h);
  nearCl.closePath();
  nearCl.fillPath();
}

// ----------------------------------------------------------------
// Fase 02 — Floresta noturna
// ----------------------------------------------------------------
function drawForestBackground(scene: Phaser.Scene, bounds: BgBounds): void {
  const { x, y, width: w, height: h } = bounds;
  const D = DEPTH_LAYERS.background;
  const cx = x + w / 2;

  // Céu escuro, quase negro com toque verde-floresta
  scene.add.rectangle(cx, y + h / 2, w, h, 0x040a06, 1).setDepth(D);
  scene.add.rectangle(cx, y + h * 0.65, w, h * 0.5, 0x060f09, 0.5).setDepth(D + 0.05);

  // Lua crescente
  const moonX = x + w * 0.78;
  const moonY = y + h * 0.14;
  const moon = scene.add.graphics().setDepth(D + 0.1);
  moon.fillStyle(0xd8e8c4, 0.85);
  moon.fillCircle(moonX, moonY, 13);
  moon.fillStyle(0x040a06, 0.94);
  moon.fillCircle(moonX + 7, moonY - 4, 11);

  // Estrelas esparsas (canopia de floresta filtra luz)
  const stars = scene.add.graphics().setDepth(D + 0.12);
  for (let i = 0; i < 20; i++) {
    stars.fillStyle(0xffffff, 0.28 + bgRng(i * 7 + 1) * 0.35);
    stars.fillRect(x + bgRng(i * 7 + 2) * w, y + bgRng(i * 7 + 3) * h * 0.35, 1, 1);
  }

  // Três camadas de pinheiros: longe → perto
  drawPineLayer(scene, x, y, w, h, D + 0.2, 0x0d2016, 26, 0.30, 0.14, 0.055);
  drawPineLayer(scene, x, y, w, h, D + 0.3, 0x081408, 18, 0.40, 0.22, 0.075);
  drawPineLayer(scene, x, y, w, h, D + 0.4, 0x030906, 13, 0.52, 0.34, 0.10);

  // Neblina rasteira
  scene.add.rectangle(cx, y + h * 0.86, w, h * 0.08, 0x1a3022, 0.20).setDepth(D + 0.45);
  scene.add.rectangle(cx, y + h * 0.91, w, h * 0.06, 0x253828, 0.14).setDepth(D + 0.46);
}

function drawPineLayer(
  scene: Phaser.Scene,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  depth: number,
  color: number,
  count: number,
  bottomFrac: number,
  heightFrac: number,
  widthFrac: number,
): void {
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(color, 1);
  const spacing = bw / count;
  for (let i = 0; i < count; i++) {
    const tx = bx + i * spacing + bgRng(i * 3 + 10) * spacing * 0.8 + spacing * 0.1;
    const ty = by + bh * bottomFrac;
    const th = bh * heightFrac * (0.7 + bgRng(i * 3 + 11) * 0.6);
    const tw = bh * widthFrac * (0.8 + bgRng(i * 3 + 12) * 0.4);
    // Corpo principal do pinheiro
    g.fillTriangle(tx, ty - th, tx - tw / 2, ty, tx + tw / 2, ty);
    // Tier superior (galhos altos)
    g.fillTriangle(tx, ty - th * 1.15, tx - tw * 0.38, ty - th * 0.52, tx + tw * 0.38, ty - th * 0.52);
  }
}

// ----------------------------------------------------------------
// Fase 03 — Templo arcano
// ----------------------------------------------------------------
function drawTempleBackground(scene: Phaser.Scene, bounds: BgBounds): void {
  const { x, y, width: w, height: h } = bounds;
  const D = DEPTH_LAYERS.background;
  const cx = x + w / 2;

  // Céu roxo-negro profundo
  scene.add.rectangle(cx, y + h / 2, w, h, 0x09051a, 1).setDepth(D);
  scene.add.rectangle(cx, y + h * 0.6, w, h * 0.4, 0x110824, 0.5).setDepth(D + 0.05);
  scene.add.rectangle(cx, y + h * 0.85, w, h * 0.3, 0x180e2e, 0.4).setDepth(D + 0.06);

  // Estrelas com leve tom roxo
  const stars = scene.add.graphics().setDepth(D + 0.1);
  for (let i = 0; i < 45; i++) {
    stars.fillStyle(bgRng(i * 4 + 1) > 0.55 ? 0xd4c0ff : 0xffffff, 0.32 + bgRng(i * 4 + 2) * 0.45);
    const sz = bgRng(i * 4 + 5) > 0.78 ? 2 : 1;
    stars.fillRect(x + bgRng(i * 4 + 3) * w, y + bgRng(i * 4 + 4) * h * 0.56, sz, sz);
  }

  // Silhueta de ruínas/montanhas no horizonte
  const distGround = scene.add.graphics().setDepth(D + 0.2);
  distGround.fillStyle(0x1c0e2e, 1);
  distGround.beginPath();
  distGround.moveTo(x, y + h);
  const segs = Math.ceil(w / 88);
  for (let i = 0; i <= segs; i++) {
    distGround.lineTo(
      x + (i / segs) * w,
      y + h * (0.52 + Math.sin(i * 0.58) * 0.07 + Math.cos(i * 1.4) * 0.03),
    );
  }
  distGround.lineTo(x + w, y + h);
  distGround.closePath();
  distGround.fillPath();

  // Colunas de pedra
  drawTempleColumns(scene, x, y, w, h, D + 0.3);

  // Brilho ambiente roxo na base
  scene.add.rectangle(cx, y + h * 0.88, w, h * 0.14, 0x5010a0, 0.07).setDepth(D + 0.4);
  scene.add.rectangle(cx, y + h * 0.93, w, h * 0.09, 0x7020c0, 0.05).setDepth(D + 0.41);
}

function drawTempleColumns(
  scene: Phaser.Scene,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  depth: number,
): void {
  const g = scene.add.graphics().setDepth(depth);
  g.fillStyle(0x140820, 1);
  const count = Math.ceil(bw / 150);
  for (let i = 0; i < count; i++) {
    const px = bx + i * 150 + bgRng(i * 5 + 20) * 110 + 20;
    const ph = bh * (0.18 + bgRng(i * 5 + 21) * 0.14);
    const pw = 12 + bgRng(i * 5 + 22) * 10;
    const py = by + bh * 0.52 - ph;
    // Fuste da coluna
    g.fillRect(px - pw / 2, py, pw, ph);
    // Capitel (topo mais largo)
    g.fillRect(px - pw * 0.85, py, pw * 1.7, 5);
    // Base
    g.fillRect(px - pw * 0.9, py + ph - 5, pw * 1.8, 5);
  }
}

export function drawLevelDecorations(
  scene: Phaser.Scene,
  level: LevelDefinition,
): void {
  const decorations = getLevelDecorations(level.id);

  decorations.forEach((definition) => {
    const decoration = scaleLevelDecoration(definition);
    const colors = getDecorationColors(definition);
    const size = TILE_SIZE_PX * (decoration.scale > 1 ? 0.75 : 0.5);

    switch (definition.kind) {
      case "bush":
        drawBush(scene, decoration.x, decoration.y, size, colors);
        break;
      case "flower":
        drawFlower(scene, decoration.x, decoration.y, size * 0.6, colors);
        break;
      case "lantern":
        drawLantern(scene, decoration.x, decoration.y, size, colors);
        break;
      case "cloud":
        drawCloud(scene, decoration.x, decoration.y, size * 2.4, colors);
        break;
      case "mushroom":
        drawMushroom(scene, decoration.x, decoration.y, size * 0.7, colors);
        break;
    }
  });
}

export function getTerrainTintForLevel(level: LevelDefinition): number {
  return getLevelVisualTheme(level.id).terrainTint;
}

export function getPlatformTintForLevel(level: LevelDefinition): number {
  return getLevelVisualTheme(level.id).platformTint;
}

function drawBush(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  colors: { readonly primary: number; readonly secondary: number },
): void {
  const depth = DEPTH_LAYERS.background + 1;

  scene.add
    .circle(x - size * 0.25, y - size * 0.35, size * 0.45, colors.primary, 0.95)
    .setDepth(depth);
  scene.add
    .circle(x + size * 0.2, y - size * 0.4, size * 0.4, colors.secondary, 0.9)
    .setDepth(depth);
  scene.add
    .circle(x, y - size * 0.5, size * 0.35, colors.secondary, 0.85)
    .setDepth(depth);
}

function drawFlower(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  colors: { readonly primary: number; readonly secondary: number },
): void {
  const depth = DEPTH_LAYERS.background + 1;
  const petals = 5;

  for (let i = 0; i < petals; i += 1) {
    const angle = (i / petals) * Math.PI * 2;
    scene.add
      .circle(
        x + Math.cos(angle) * size * 0.35,
        y - size * 0.2 + Math.sin(angle) * size * 0.35,
        size * 0.22,
        colors.primary,
        0.92,
      )
      .setDepth(depth);
  }

  scene.add.circle(x, y - size * 0.2, size * 0.16, colors.secondary).setDepth(depth);
  scene.add.rectangle(x, y, size * 0.12, size * 0.35, 0x5a9e4b).setDepth(depth);
}

function drawLantern(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  colors: { readonly primary: number; readonly secondary: number },
): void {
  const depth = DEPTH_LAYERS.background + 1;

  scene.add
    .rectangle(x, y - size * 0.55, size * 0.5, size * 0.65, colors.primary)
    .setDepth(depth);
  scene.add
    .rectangle(x, y - size * 0.55, size * 0.3, size * 0.45, colors.secondary, 0.7)
    .setDepth(depth);
  scene.add.rectangle(x, y - size * 0.15, size * 0.08, size * 0.35, 0x8a7e72).setDepth(depth);
}

function drawCloud(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  colors: { readonly primary: number; readonly secondary: number },
): void {
  const depth = DEPTH_LAYERS.background;

  scene.add.circle(x, y, size * 0.35, colors.primary, 0.35).setDepth(depth);
  scene.add.circle(x - size * 0.28, y + size * 0.05, size * 0.28, colors.primary, 0.3).setDepth(depth);
  scene.add.circle(x + size * 0.3, y + size * 0.03, size * 0.25, colors.primary, 0.28).setDepth(depth);
}

function drawMushroom(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size: number,
  colors: { readonly primary: number; readonly secondary: number },
): void {
  const depth = DEPTH_LAYERS.background + 1;

  scene.add
    .ellipse(x, y - size * 0.35, size * 0.9, size * 0.55, colors.primary)
    .setDepth(depth);
  scene.add.rectangle(x, y - size * 0.05, size * 0.22, size * 0.4, 0xf5f0e8).setDepth(depth);
  scene.add.circle(x - size * 0.15, y - size * 0.42, size * 0.08, colors.secondary, 0.9).setDepth(depth);
  scene.add.circle(x + size * 0.12, y - size * 0.48, size * 0.06, colors.secondary, 0.85).setDepth(depth);
}
