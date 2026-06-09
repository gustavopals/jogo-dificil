import { GAMEPLAY_SPRITE_KEYS } from "../data/art";
import {
  ACTIVE_PINO_FRAME_SOURCE_MODE,
  PINO_FRAME_SOURCE_MODES,
  PINO_TEXTURE_KEYS,
} from "../data/characters/pino-animations";
import {
  BOSS_SPRITESHEET_ASSETS,
  BOSS_SPRITESHEET_KEYS,
} from "../data/characters/boss-spritesheet-registry";
import {
  PINO_SPRITESHEET_ASSETS,
  PINO_SPRITESHEET_KEYS,
} from "../data/characters/pino-spritesheet-registry";

export type RuntimeImageAsset = {
  readonly key: string;
  readonly url: string;
};

const PINO_LEGACY_TEXTURE_KEYS = new Set<string>(
  Object.values(PINO_TEXTURE_KEYS),
);

const BOSS_LEGACY_TEXTURE_KEYS = new Set<string>([
  GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
  GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
  GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
]);

const HD_SPRITESHEET_TEXTURE_KEYS = new Set<string>([
  PINO_SPRITESHEET_KEYS.CORE_1024,
  PINO_SPRITESHEET_KEYS.ENERGY_1024,
  BOSS_SPRITESHEET_KEYS.HIROLITO_1024,
  BOSS_SPRITESHEET_KEYS.DR_IMPORTS_1024,
  BOSS_SPRITESHEET_KEYS.GIGA_FABIO_1024,
]);

export function getHdSpritesheetTextureKeys(): readonly string[] {
  return [...HD_SPRITESHEET_TEXTURE_KEYS];
}

export type RuntimeAssetLoadPolicy = {
  readonly preloadLegacyPinoFrames: boolean;
  readonly preloadLegacyBossSprites: boolean;
  readonly preloadHdSpritesheets: boolean;
};

export function getRuntimeAssetLoadPolicy(): RuntimeAssetLoadPolicy {
  const preloadHdSpritesheets =
    PINO_SPRITESHEET_ASSETS.every((asset) => asset.enabled) &&
    BOSS_SPRITESHEET_ASSETS.every((asset) => asset.enabled);

  const preloadLegacyPinoFrames =
    ACTIVE_PINO_FRAME_SOURCE_MODE === PINO_FRAME_SOURCE_MODES.LEGACY_IMAGES ||
    !PINO_SPRITESHEET_ASSETS.every((asset) => asset.enabled);

  const preloadLegacyBossSprites = !BOSS_SPRITESHEET_ASSETS.every(
    (asset) => asset.enabled,
  );

  return {
    preloadLegacyPinoFrames,
    preloadLegacyBossSprites,
    preloadHdSpritesheets,
  };
}

export function shouldPreloadImageAsset(
  assetKey: string,
  policy: RuntimeAssetLoadPolicy = getRuntimeAssetLoadPolicy(),
): boolean {
  if (PINO_LEGACY_TEXTURE_KEYS.has(assetKey)) {
    return policy.preloadLegacyPinoFrames;
  }

  if (BOSS_LEGACY_TEXTURE_KEYS.has(assetKey)) {
    return policy.preloadLegacyBossSprites;
  }

  return true;
}

export function selectRuntimeImageAssets<TAsset extends RuntimeImageAsset>(
  assets: readonly TAsset[],
  policy: RuntimeAssetLoadPolicy = getRuntimeAssetLoadPolicy(),
): readonly TAsset[] {
  return assets.filter((asset) => shouldPreloadImageAsset(asset.key, policy));
}

export function assertNoDuplicateCharacterAssetPreload(
  assets: readonly RuntimeImageAsset[],
  policy: RuntimeAssetLoadPolicy = getRuntimeAssetLoadPolicy(),
): void {
  const runtimeKeys = new Set(
    selectRuntimeImageAssets(assets, policy).map((asset) => asset.key),
  );

  if (policy.preloadHdSpritesheets && policy.preloadLegacyPinoFrames) {
    const overlaps = [...PINO_LEGACY_TEXTURE_KEYS].filter((key) =>
      runtimeKeys.has(key),
    );

    if (overlaps.length > 0) {
      throw new Error(
        `Duplicate Pino preload: legacy PNGs and HD sheets cannot both load (${overlaps.join(", ")}).`,
      );
    }
  }

  if (policy.preloadHdSpritesheets && policy.preloadLegacyBossSprites) {
    const overlaps = [...BOSS_LEGACY_TEXTURE_KEYS].filter((key) =>
      runtimeKeys.has(key),
    );

    if (overlaps.length > 0) {
      throw new Error(
        `Duplicate boss preload: legacy PNGs and HD sheets cannot both load (${overlaps.join(", ")}).`,
      );
    }
  }
}
