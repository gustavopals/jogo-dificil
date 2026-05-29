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

export function drawThemedLevelBackground(
  scene: Phaser.Scene,
  level: LevelDefinition,
): void {
  const theme = getLevelVisualTheme(level.id);
  const { bounds } = level;

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
