import itemMechanismKeyUrl from "../assets/sprites/item-mechanism-key.png";
import itemOptionalTokenUrl from "../assets/sprites/item-optional-token.png";
import itemRequiredChipUrl from "../assets/sprites/item-required-chip.png";
import markerCheckpointActiveUrl from "../assets/sprites/marker-checkpoint-active.png";
import markerCheckpointInactiveUrl from "../assets/sprites/marker-checkpoint-inactive.png";
import markerExitUrl from "../assets/sprites/marker-exit.png";
import trapBreakableFloorUrl from "../assets/sprites/trap-breakable-floor.png";
import trapFallingPlatformUrl from "../assets/sprites/trap-falling-platform.png";
import trapFalseBlockUrl from "../assets/sprites/trap-false-block.png";
import trapProjectileUrl from "../assets/sprites/trap-projectile.png";
import trapSpikesUrl from "../assets/sprites/trap-spikes.png";
import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_ASSETS, GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { IMAGE_ASSETS } from "../src/game/assets";

const GAMEPLAY_SPRITE_URLS = {
  [GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES]: trapSpikesUrl,
  [GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK]: trapFalseBlockUrl,
  [GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM]: trapFallingPlatformUrl,
  [GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR]: trapBreakableFloorUrl,
  [GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE]: trapProjectileUrl,
  [GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP]: itemRequiredChipUrl,
  [GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY]: itemMechanismKeyUrl,
  [GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN]: itemOptionalTokenUrl,
  [GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE]:
    markerCheckpointInactiveUrl,
  [GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE]: markerCheckpointActiveUrl,
  [GAMEPLAY_SPRITE_KEYS.MARKER_EXIT]: markerExitUrl,
} as const;

describe("gameplay sprites", () => {
  it("defines sprite assets for traps, items, checkpoints and exit", () => {
    expect(GAMEPLAY_SPRITE_ASSETS.map((asset) => asset.key)).toEqual([
      GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
      GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
      GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
      GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
      GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
      GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP,
      GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY,
      GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN,
      GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE,
      GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE,
      GAMEPLAY_SPRITE_KEYS.MARKER_EXIT,
    ]);
  });

  it("registers original project sprite files", () => {
    GAMEPLAY_SPRITE_ASSETS.forEach((asset) => {
      expect(asset.path).toMatch(/^assets\/sprites\/[a-z0-9-]+\.png$/);
      expect(asset.origin).toBe("Gerado no projeto com magick");
      expect(asset.license).toBe("Original do projeto");
      expect(asset.description.length).toBeGreaterThan(24);
      expect(GAMEPLAY_SPRITE_URLS[asset.key].length).toBeGreaterThan(0);
    });
  });

  it("keeps sprites on the pixel-art grid and preloads every key", () => {
    const imageAssetKeys = IMAGE_ASSETS.map((asset) => asset.key);

    GAMEPLAY_SPRITE_ASSETS.forEach((asset) => {
      expect(asset.sizePx.width % 8).toBe(0);
      expect(asset.sizePx.height % 8).toBe(0);
      expect(imageAssetKeys).toContain(asset.key);
    });
  });
});
