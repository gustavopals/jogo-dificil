import { describe, expect, it } from "vitest";

import {
  assertNoDuplicateCharacterAssetPreload,
  getHdSpritesheetTextureKeys,
  getRuntimeAssetLoadPolicy,
  selectRuntimeImageAssets,
  shouldPreloadImageAsset,
} from "../src/game/asset-load-policy";
import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import {
  ACTIVE_PINO_FRAME_SOURCE_MODE,
  PINO_FRAME_SOURCE_MODES,
  PINO_TEXTURE_KEYS,
} from "../src/data/characters/pino-animations";
import { IMAGE_ASSETS, RUNTIME_IMAGE_ASSETS } from "../src/game/assets";
import { LEGACY_CHARACTER_IMAGE_ASSETS } from "../src/game/legacy-character-image-assets";

const FULL_IMAGE_REGISTRY = [
  ...IMAGE_ASSETS,
  ...LEGACY_CHARACTER_IMAGE_ASSETS,
] as const;

describe("asset load policy", () => {
  it("uses HD spritesheets as the active runtime source for Pino and bosses", () => {
    expect(ACTIVE_PINO_FRAME_SOURCE_MODE).toBe(
      PINO_FRAME_SOURCE_MODES.SPRITESHEETS,
    );
    expect(getRuntimeAssetLoadPolicy()).toEqual({
      preloadLegacyPinoFrames: false,
      preloadLegacyBossSprites: false,
      preloadHdSpritesheets: true,
    });
    expect(getHdSpritesheetTextureKeys()).toHaveLength(5);
  });

  it("skips legacy Pino and boss PNGs in runtime preload while keeping gameplay art", () => {
    const runtimeKeys = new Set<string>(
      RUNTIME_IMAGE_ASSETS.map((asset) => asset.key),
    );

    Object.values(PINO_TEXTURE_KEYS).forEach((key) => {
      expect(runtimeKeys.has(key)).toBe(false);
      expect(shouldPreloadImageAsset(key)).toBe(false);
    });

    [
      GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
      GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
      GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
    ].forEach((key) => {
      expect(runtimeKeys.has(key)).toBe(false);
      expect(shouldPreloadImageAsset(key)).toBe(false);
    });

    expect(runtimeKeys.has(GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES)).toBe(true);
    expect(runtimeKeys.has(GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE)).toBe(
      true,
    );
    expect(RUNTIME_IMAGE_ASSETS.length).toBe(IMAGE_ASSETS.length);
  });

  it("keeps legacy PNGs in a separate registry outside the production bundle", () => {
    expect(LEGACY_CHARACTER_IMAGE_ASSETS).toHaveLength(23);
    expect(FULL_IMAGE_REGISTRY.length).toBeGreaterThan(IMAGE_ASSETS.length);
    expect(() =>
      assertNoDuplicateCharacterAssetPreload(FULL_IMAGE_REGISTRY),
    ).not.toThrow();
  });

  it("would preload legacy frames only when spritesheet mode is disabled", () => {
    const legacyPolicy = {
      preloadLegacyPinoFrames: true,
      preloadLegacyBossSprites: true,
      preloadHdSpritesheets: false,
    };
    const selected = selectRuntimeImageAssets(FULL_IMAGE_REGISTRY, legacyPolicy);

    expect(selected.map((asset) => asset.key)).toEqual(
      expect.arrayContaining([PINO_TEXTURE_KEYS.IDLE]),
    );
    expect(() =>
      assertNoDuplicateCharacterAssetPreload(FULL_IMAGE_REGISTRY, {
        preloadLegacyPinoFrames: true,
        preloadLegacyBossSprites: false,
        preloadHdSpritesheets: true,
      }),
    ).toThrow(/Duplicate Pino preload/);
  });
});
