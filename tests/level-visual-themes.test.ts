import { describe, expect, it } from "vitest";

import {
  getLevelDecorations,
  scaleLevelDecoration,
} from "../src/data/levels/level-decorations";
import {
  getLevelVisualTheme,
  LEVEL_VISUAL_THEMES,
} from "../src/data/levels/level-visual-themes";
import { TILE_SIZE_PX } from "../src/game/constants";
import { PLAYER_SIZE } from "../src/game/constants";

const CAMPAIGN_LEVEL_IDS = [
  "level-01",
  "level-02",
  "level-03",
  "level-04",
  "level-05",
  "level-06",
  "level-07",
  "level-08",
  "level-09",
  "level-10",
  "level-11",
] as const;

describe("level visual themes (Stardew-inspired proportions)", () => {
  it("defines a cozy theme for every campaign level", () => {
    expect(Object.keys(LEVEL_VISUAL_THEMES).sort()).toEqual(
      [...CAMPAIGN_LEVEL_IDS].sort(),
    );
  });

  it("keeps player-to-tile ratio aligned with Stardew (~1 tile wide)", () => {
    expect(PLAYER_SIZE.visualWidth / TILE_SIZE_PX).toBeCloseTo(1, 5);
    expect(PLAYER_SIZE.visualHeight / TILE_SIZE_PX).toBeCloseTo(1.5, 5);
  });

  it("exposes readable background and terrain tints per level", () => {
    CAMPAIGN_LEVEL_IDS.forEach((levelId) => {
      const theme = getLevelVisualTheme(levelId);

      expect(theme.label.length).toBeGreaterThan(4);
      expect(theme.backgroundAlpha).toBeGreaterThan(0.8);
      expect(theme.backgroundAlpha).toBeLessThanOrEqual(1);
      expect(theme.mood.length).toBeGreaterThan(12);
    });
  });

  it("scales legacy decorations to HD coordinates", () => {
    const [first] = getLevelDecorations("level-01");

    expect(first).toBeDefined();
    expect(scaleLevelDecoration(first!)).toMatchObject({
      x: first!.x * 2,
      y: first!.y * 2,
      scale: 2,
    });
  });
});
