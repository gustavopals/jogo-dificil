import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { PINO_TEXTURE_KEYS } from "../src/data/characters/pino-animations";
import { IMAGE_ASSETS, RUNTIME_IMAGE_ASSETS } from "../src/game/assets";
import {
  LEGACY_BOSS_BODY_TEXTURE_KEYS,
  LEGACY_CHARACTER_IMAGE_ASSETS,
  LEGACY_PINO_TEXTURE_KEYS,
} from "../src/game/legacy-character-image-assets";

describe("legacy asset cleanup", () => {
  it("excludes archived Pino and boss body PNGs from the production image registry", () => {
    const runtimeKeys = new Set<string>(
      RUNTIME_IMAGE_ASSETS.map((asset) => asset.key),
    );
    const bundleKeys = new Set<string>(IMAGE_ASSETS.map((asset) => asset.key));

    LEGACY_PINO_TEXTURE_KEYS.forEach((key) => {
      expect(runtimeKeys.has(key)).toBe(false);
      expect(bundleKeys.has(key)).toBe(false);
    });

    LEGACY_BOSS_BODY_TEXTURE_KEYS.forEach((key) => {
      expect(runtimeKeys.has(key)).toBe(false);
      expect(bundleKeys.has(key)).toBe(false);
    });
  });

  it("archives legacy character PNGs in a dedicated module with stable keys", () => {
    expect(LEGACY_CHARACTER_IMAGE_ASSETS.map((asset) => asset.key)).toEqual(
      expect.arrayContaining([
        ...Object.values(PINO_TEXTURE_KEYS),
        ...LEGACY_BOSS_BODY_TEXTURE_KEYS,
      ]),
    );
    expect(LEGACY_CHARACTER_IMAGE_ASSETS.every((asset) => asset.url.length > 0)).toBe(
      true,
    );
  });

  it("keeps runtime gameplay sprites and boss projectiles in the production registry", () => {
    const runtimeKeys = new Set<string>(
      RUNTIME_IMAGE_ASSETS.map((asset) => asset.key),
    );

    expect(runtimeKeys.has(GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES)).toBe(true);
    expect(runtimeKeys.has(GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_SMOKE_PUFF)).toBe(
      true,
    );
    expect(runtimeKeys.has(GAMEPLAY_SPRITE_KEYS.BOSS_IMPACT_BURST)).toBe(true);
  });
});
