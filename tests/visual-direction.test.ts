import { describe, expect, it } from "vitest";

import {
  INITIAL_VISUAL_DIRECTION,
  INITIAL_VISUAL_PALETTE,
  VISUAL_PALETTE_ROLES,
} from "../src/data/art";
import { PLAYER_SIZE, TILE_SIZE_PX } from "../src/game/constants";

describe("initial visual direction", () => {
  it("locks the MVP art style to low-res pixel art", () => {
    expect(INITIAL_VISUAL_DIRECTION.style).toBe("low-res-pixel-art");
    expect(INITIAL_VISUAL_DIRECTION.thesis).toContain("Cozy Stardew-inspired");
    expect(INITIAL_VISUAL_DIRECTION.assetRules).toContain(
      "Read every sprite at 1x before adding detail.",
    );
  });

  it("keeps art scale aligned with gameplay constants", () => {
    expect(INITIAL_VISUAL_DIRECTION.tileSizePx).toBe(TILE_SIZE_PX);
    expect(INITIAL_VISUAL_DIRECTION.playerApproxSizePx).toEqual({
      width: PLAYER_SIZE.visualWidth,
      height: PLAYER_SIZE.visualHeight,
    });
    expect(INITIAL_VISUAL_DIRECTION.playerHitboxSizePx).toEqual({
      width: PLAYER_SIZE.hitboxWidth,
      height: PLAYER_SIZE.hitboxHeight,
    });
    expect(INITIAL_VISUAL_DIRECTION.playerTileRatio).toEqual({
      width: PLAYER_SIZE.tileScale.visualWidth,
      height: PLAYER_SIZE.tileScale.visualHeight,
    });
  });

  it("defines a semantic palette for new visual assets", () => {
    expect(VISUAL_PALETTE_ROLES).toEqual([
      "void",
      "panel",
      "metal",
      "text",
      "shadow",
      "safe",
      "hero",
      "hazard",
      "exit",
      "specialTrap",
    ]);

    VISUAL_PALETTE_ROLES.forEach((role) => {
      expect(INITIAL_VISUAL_PALETTE[role].hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(INITIAL_VISUAL_PALETTE[role].usage.length).toBeGreaterThan(12);
    });
    expect(
      new Set(
        VISUAL_PALETTE_ROLES.map((role) => INITIAL_VISUAL_PALETTE[role].hex),
      ).size,
    ).toBe(VISUAL_PALETTE_ROLES.length);
  });
});
