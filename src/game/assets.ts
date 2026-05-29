import {
  assertNoDuplicateCharacterAssetPreload,
  selectRuntimeImageAssets,
} from "./asset-load-policy";
import mvpLevelCompleteStingUrl from "../../assets/audio/music/mvp-level-complete-sting.wav";
import mvpLoopUrl from "../../assets/audio/music/mvp-loop.wav";
import block2DashLoopUrl from "../../assets/audio/music/block-2-dash-loop.wav";
import block3EnergyLoopUrl from "../../assets/audio/music/block-3-energy-loop.wav";
import menuLoopUrl from "../../assets/audio/music/menu-loop.wav";
import bossAttackUrl from "../../assets/audio/sfx/boss-attack.wav";
import bossDefeatUrl from "../../assets/audio/sfx/boss-defeat.wav";
import bossEntryUrl from "../../assets/audio/sfx/boss-entry.wav";
import bossHitUrl from "../../assets/audio/sfx/boss-hit.wav";
import bossWindupUrl from "../../assets/audio/sfx/boss-windup.wav";
import energyChargeFullUrl from "../../assets/audio/sfx/energy-charge-full.wav";
import energyChargeLoopUrl from "../../assets/audio/sfx/energy-charge-loop.wav";
import energyImpactHeavyUrl from "../../assets/audio/sfx/energy-impact-heavy.wav";
import energyImpactSmallUrl from "../../assets/audio/sfx/energy-impact-small.wav";
import energyShotEmptyUrl from "../../assets/audio/sfx/energy-shot-empty.wav";
import energyShotUrl from "../../assets/audio/sfx/energy-shot.wav";
import energySpecialFireUrl from "../../assets/audio/sfx/energy-special-fire.wav";
import energySpecialWindupUrl from "../../assets/audio/sfx/energy-special-windup.wav";
import levelCheckpointUrl from "../../assets/audio/sfx/level-checkpoint.wav";
import levelCompleteUrl from "../../assets/audio/sfx/level-complete.wav";
import levelFallingPlatformUrl from "../../assets/audio/sfx/level-falling-platform.wav";
import levelItemUrl from "../../assets/audio/sfx/level-item.wav";
import levelProjectileUrl from "../../assets/audio/sfx/level-projectile.wav";
import levelTrapUrl from "../../assets/audio/sfx/level-trap.wav";
import playerDeath01Url from "../../assets/audio/sfx/player-death-01.wav";
import playerDeath02Url from "../../assets/audio/sfx/player-death-02.wav";
import playerDeath03Url from "../../assets/audio/sfx/player-death-03.wav";
import playerJumpUrl from "../../assets/audio/sfx/player-jump.wav";
import playerLandUrl from "../../assets/audio/sfx/player-land.wav";
import playerPrimaryUrl from "../../assets/audio/sfx/player-primary.wav";
import playerRespawnUrl from "../../assets/audio/sfx/player-respawn.wav";
import playerSecondaryUrl from "../../assets/audio/sfx/player-secondary.wav";
import bossImpactBurstUrl from "../../assets/sprites/bosses/boss-impact-burst.png";
import bossProjectileBoulderUrl from "../../assets/sprites/bosses/boss-projectile-boulder.png";
import bossProjectileImportBottleUrl from "../../assets/sprites/bosses/boss-projectile-import-bottle.png";
import bossProjectileSmokePuffUrl from "../../assets/sprites/bosses/boss-projectile-smoke-puff.png";
import energyCrackedBlockBrokenUrl from "../../assets/sprites/energy-cracked-block-broken.png";
import energyCyanBurstBeamUrl from "../../assets/sprites/energy-cyan-burst-beam.png";
import energyCyanSparkProjectileUrl from "../../assets/sprites/energy-cyan-spark-projectile.png";
import energyImpactUrl from "../../assets/sprites/energy-impact.png";
import energyTargetActiveUrl from "../../assets/sprites/energy-target-active.png";
import itemMechanismKeyUrl from "../../assets/sprites/item-mechanism-key.png";
import itemOptionalTokenUrl from "../../assets/sprites/item-optional-token.png";
import itemRequiredChipUrl from "../../assets/sprites/item-required-chip.png";
import markerCheckpointActiveUrl from "../../assets/sprites/marker-checkpoint-active.png";
import markerCheckpointInactiveUrl from "../../assets/sprites/marker-checkpoint-inactive.png";
import markerExitUrl from "../../assets/sprites/marker-exit.png";
import trapBreakableFloorUrl from "../../assets/sprites/trap-breakable-floor.png";
import trapFallingPlatformUrl from "../../assets/sprites/trap-falling-platform.png";
import trapFalseBlockUrl from "../../assets/sprites/trap-false-block.png";
import trapProjectileUrl from "../../assets/sprites/trap-projectile.png";
import trapSpikesUrl from "../../assets/sprites/trap-spikes.png";
import bossDrImportsSheet512Url from "../../assets/spritesheets/boss-dr-imports-sheet-512.png";
import bossGigaFabioSheet512Url from "../../assets/spritesheets/boss-giga-fabio-sheet-512.png";
import bossHirolitoSheet512Url from "../../assets/spritesheets/boss-hirolito-sheet-512.png";
import playerPinoCoreSheet512Url from "../../assets/spritesheets/player-pino-core-512.png";
import playerPinoEnergySheet512Url from "../../assets/spritesheets/player-pino-energy-512.png";
import labBackgroundPanelUrl from "../../assets/tilesets/lab-background-panel.png";
import labHazardSpikesUrl from "../../assets/tilesets/lab-hazard-spikes.png";
import labPlatformUrl from "../../assets/tilesets/lab-platform.png";
import labSolidBlockUrl from "../../assets/tilesets/lab-solid-block.png";
import {
  BOSS_AUDIO_DEFINITIONS,
  ENERGY_AUDIO_DEFINITIONS,
  LEVEL_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_DEFINITIONS,
  PLAYER_AUDIO_DEFINITIONS,
} from "../data/audio";
import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
  SPRITESHEET_CELL_SIZE_PX,
  isValidSpritesheetFrameSize,
} from "../data/art";
import {
  PINO_TEXTURE_KEYS,
  type PinoTextureKey,
} from "../data/characters/pino-animations";
import {
  BOSS_SPRITESHEET_ASSETS,
  BOSS_SPRITESHEET_KEYS,
} from "../data/characters/boss-spritesheet-registry";
import {
  PINO_SPRITESHEET_ASSETS,
  PINO_SPRITESHEET_KEYS,
} from "../data/characters/pino-spritesheet-registry";

export const ASSET_KEYS = {
  PLAYER_PINO_IDLE: PINO_TEXTURE_KEYS.IDLE,
  PLAYER_PINO_RUN_01: PINO_TEXTURE_KEYS.RUN_01,
  PLAYER_PINO_RUN_02: PINO_TEXTURE_KEYS.RUN_02,
  PLAYER_PINO_RUN_03: PINO_TEXTURE_KEYS.RUN_03,
  PLAYER_PINO_JUMP: PINO_TEXTURE_KEYS.JUMP,
  PLAYER_PINO_JUMP_PEAK: PINO_TEXTURE_KEYS.JUMP_PEAK,
  PLAYER_PINO_FALL: PINO_TEXTURE_KEYS.FALL,
  PLAYER_PINO_DASH: PINO_TEXTURE_KEYS.DASH,
  PLAYER_PINO_CHARGE_01: PINO_TEXTURE_KEYS.CHARGE_01,
  PLAYER_PINO_CHARGE_02: PINO_TEXTURE_KEYS.CHARGE_02,
  PLAYER_PINO_CYAN_SPARK_01: PINO_TEXTURE_KEYS.CYAN_SPARK_01,
  PLAYER_PINO_CYAN_SPARK_02: PINO_TEXTURE_KEYS.CYAN_SPARK_02,
  PLAYER_PINO_CYAN_BURST_PREPARE_01: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_01,
  PLAYER_PINO_CYAN_BURST_PREPARE_02: PINO_TEXTURE_KEYS.CYAN_BURST_PREPARE_02,
  PLAYER_PINO_CYAN_BURST_FIRE_01: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_01,
  PLAYER_PINO_CYAN_BURST_FIRE_02: PINO_TEXTURE_KEYS.CYAN_BURST_FIRE_02,
  PLAYER_PINO_DEATH_01: PINO_TEXTURE_KEYS.DEATH_01,
  PLAYER_PINO_DEATH_02: PINO_TEXTURE_KEYS.DEATH_02,
  PLAYER_PINO_RESPAWN_01: PINO_TEXTURE_KEYS.RESPAWN_01,
  PLAYER_PINO_RESPAWN_02: PINO_TEXTURE_KEYS.RESPAWN_02,
  PLAYER_PINO_CORE_SHEET_512: PINO_SPRITESHEET_KEYS.CORE_512,
  PLAYER_PINO_ENERGY_SHEET_512: PINO_SPRITESHEET_KEYS.ENERGY_512,
  BOSS_HIROLITO_SHEET_512: BOSS_SPRITESHEET_KEYS.HIROLITO_512,
  BOSS_DR_IMPORTS_SHEET_512: BOSS_SPRITESHEET_KEYS.DR_IMPORTS_512,
  BOSS_GIGA_FABIO_SHEET_512: BOSS_SPRITESHEET_KEYS.GIGA_FABIO_512,
  TRAP_SPIKES: GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
  TRAP_FALSE_BLOCK: GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
  TRAP_FALLING_PLATFORM: GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
  TRAP_BREAKABLE_FLOOR: GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
  TRAP_PROJECTILE: GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
  ENERGY_CYAN_SPARK_PROJECTILE:
    GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
  ENERGY_CYAN_BURST_BEAM: GAMEPLAY_SPRITE_KEYS.ENERGY_CYAN_BURST_BEAM,
  ENERGY_IMPACT: GAMEPLAY_SPRITE_KEYS.ENERGY_IMPACT,
  ENERGY_TARGET_ACTIVE: GAMEPLAY_SPRITE_KEYS.ENERGY_TARGET_ACTIVE,
  ENERGY_CRACKED_BLOCK_BROKEN: GAMEPLAY_SPRITE_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
  ITEM_REQUIRED_CHIP: GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP,
  ITEM_MECHANISM_KEY: GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY,
  ITEM_OPTIONAL_TOKEN: GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN,
  MARKER_CHECKPOINT_INACTIVE: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE,
  MARKER_CHECKPOINT_ACTIVE: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE,
  MARKER_EXIT: GAMEPLAY_SPRITE_KEYS.MARKER_EXIT,
  BOSS_HIROLITO_NARGUILITO: GAMEPLAY_SPRITE_KEYS.BOSS_HIROLITO_NARGUILITO,
  BOSS_DR_IMPORTS: GAMEPLAY_SPRITE_KEYS.BOSS_DR_IMPORTS,
  BOSS_GIGA_FABIO: GAMEPLAY_SPRITE_KEYS.BOSS_GIGA_FABIO,
  BOSS_PROJECTILE_SMOKE_PUFF: GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_SMOKE_PUFF,
  BOSS_PROJECTILE_IMPORT_BOTTLE:
    GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_IMPORT_BOTTLE,
  BOSS_PROJECTILE_BOULDER: GAMEPLAY_SPRITE_KEYS.BOSS_PROJECTILE_BOULDER,
  BOSS_IMPACT_BURST: GAMEPLAY_SPRITE_KEYS.BOSS_IMPACT_BURST,
  TILESET_LAB_SOLID_BLOCK: PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
  TILESET_LAB_PLATFORM: PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
  TILESET_LAB_HAZARD_SPIKES: PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES,
  TILESET_LAB_BACKGROUND_PANEL: PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
} as const;

export type ImageAssetDefinition = {
  readonly key: (typeof ASSET_KEYS)[keyof typeof ASSET_KEYS] | PinoTextureKey;
  readonly url: string;
};

const RUNTIME_GAMEPLAY_IMAGE_ASSETS = [
  {
    key: ASSET_KEYS.TRAP_SPIKES,
    url: trapSpikesUrl,
  },
  {
    key: ASSET_KEYS.TRAP_FALSE_BLOCK,
    url: trapFalseBlockUrl,
  },
  {
    key: ASSET_KEYS.TRAP_FALLING_PLATFORM,
    url: trapFallingPlatformUrl,
  },
  {
    key: ASSET_KEYS.TRAP_BREAKABLE_FLOOR,
    url: trapBreakableFloorUrl,
  },
  {
    key: ASSET_KEYS.TRAP_PROJECTILE,
    url: trapProjectileUrl,
  },
  {
    key: ASSET_KEYS.ENERGY_CYAN_SPARK_PROJECTILE,
    url: energyCyanSparkProjectileUrl,
  },
  {
    key: ASSET_KEYS.ENERGY_CYAN_BURST_BEAM,
    url: energyCyanBurstBeamUrl,
  },
  {
    key: ASSET_KEYS.ENERGY_IMPACT,
    url: energyImpactUrl,
  },
  {
    key: ASSET_KEYS.ENERGY_TARGET_ACTIVE,
    url: energyTargetActiveUrl,
  },
  {
    key: ASSET_KEYS.ENERGY_CRACKED_BLOCK_BROKEN,
    url: energyCrackedBlockBrokenUrl,
  },
  {
    key: ASSET_KEYS.ITEM_REQUIRED_CHIP,
    url: itemRequiredChipUrl,
  },
  {
    key: ASSET_KEYS.ITEM_MECHANISM_KEY,
    url: itemMechanismKeyUrl,
  },
  {
    key: ASSET_KEYS.ITEM_OPTIONAL_TOKEN,
    url: itemOptionalTokenUrl,
  },
  {
    key: ASSET_KEYS.MARKER_CHECKPOINT_INACTIVE,
    url: markerCheckpointInactiveUrl,
  },
  {
    key: ASSET_KEYS.MARKER_CHECKPOINT_ACTIVE,
    url: markerCheckpointActiveUrl,
  },
  {
    key: ASSET_KEYS.MARKER_EXIT,
    url: markerExitUrl,
  },
  {
    key: ASSET_KEYS.BOSS_PROJECTILE_SMOKE_PUFF,
    url: bossProjectileSmokePuffUrl,
  },
  {
    key: ASSET_KEYS.BOSS_PROJECTILE_IMPORT_BOTTLE,
    url: bossProjectileImportBottleUrl,
  },
  {
    key: ASSET_KEYS.BOSS_PROJECTILE_BOULDER,
    url: bossProjectileBoulderUrl,
  },
  {
    key: ASSET_KEYS.BOSS_IMPACT_BURST,
    url: bossImpactBurstUrl,
  },
  {
    key: ASSET_KEYS.TILESET_LAB_SOLID_BLOCK,
    url: labSolidBlockUrl,
  },
  {
    key: ASSET_KEYS.TILESET_LAB_PLATFORM,
    url: labPlatformUrl,
  },
  {
    key: ASSET_KEYS.TILESET_LAB_HAZARD_SPIKES,
    url: labHazardSpikesUrl,
  },
  {
    key: ASSET_KEYS.TILESET_LAB_BACKGROUND_PANEL,
    url: labBackgroundPanelUrl,
  },
] as const satisfies readonly ImageAssetDefinition[];

export const IMAGE_ASSETS = [
  ...RUNTIME_GAMEPLAY_IMAGE_ASSETS,
] as const satisfies readonly ImageAssetDefinition[];

export const RUNTIME_IMAGE_ASSETS = selectRuntimeImageAssets(
  RUNTIME_GAMEPLAY_IMAGE_ASSETS,
);

assertNoDuplicateCharacterAssetPreload(RUNTIME_GAMEPLAY_IMAGE_ASSETS);

export type SpritesheetAssetLoadDefinition = {
  readonly key: (typeof ASSET_KEYS)[keyof typeof ASSET_KEYS];
  readonly url: string;
  readonly frameWidth: number;
  readonly frameHeight: number;
  readonly enabled: boolean;
};

export const SPRITESHEET_ASSETS: readonly SpritesheetAssetLoadDefinition[] =
  [...PINO_SPRITESHEET_ASSETS, ...BOSS_SPRITESHEET_ASSETS].map((sheet) => ({
    key: sheet.key,
    url: resolveSpritesheetUrl(sheet.key),
    frameWidth: sheet.frameWidth,
    frameHeight: sheet.frameHeight,
    enabled:
      sheet.enabled &&
      isValidSpritesheetFrameSize(sheet.frameWidth, sheet.frameHeight) &&
      sheet.frameWidth === SPRITESHEET_CELL_SIZE_PX &&
      sheet.frameHeight === SPRITESHEET_CELL_SIZE_PX,
  }));

function resolveSpritesheetUrl(
  key: (typeof ASSET_KEYS)[keyof typeof ASSET_KEYS],
): string {
  switch (key) {
    case PINO_SPRITESHEET_KEYS.CORE_512:
      return playerPinoCoreSheet512Url;
    case PINO_SPRITESHEET_KEYS.ENERGY_512:
      return playerPinoEnergySheet512Url;
    case BOSS_SPRITESHEET_KEYS.HIROLITO_512:
      return bossHirolitoSheet512Url;
    case BOSS_SPRITESHEET_KEYS.DR_IMPORTS_512:
      return bossDrImportsSheet512Url;
    case BOSS_SPRITESHEET_KEYS.GIGA_FABIO_512:
      return bossGigaFabioSheet512Url;
    default:
      return playerPinoCoreSheet512Url;
  }
}

export const AUDIO_ASSETS = [
  {
    key: MUSIC_AUDIO_DEFINITIONS[0].assetKey,
    url: menuLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[1].assetKey,
    url: mvpLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[2].assetKey,
    url: block2DashLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[3].assetKey,
    url: block3EnergyLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[4].assetKey,
    url: mvpLevelCompleteStingUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[0].assetKey,
    url: playerJumpUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[1].assetKey,
    url: playerLandUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[2].assetKey,
    url: playerDeath01Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[3].assetKey,
    url: playerDeath02Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[4].assetKey,
    url: playerDeath03Url,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[5].assetKey,
    url: playerRespawnUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[6].assetKey,
    url: playerPrimaryUrl,
  },
  {
    key: PLAYER_AUDIO_DEFINITIONS[7].assetKey,
    url: playerSecondaryUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[0].assetKey,
    url: levelCheckpointUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[1].assetKey,
    url: levelCompleteUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[2].assetKey,
    url: levelItemUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[3].assetKey,
    url: levelTrapUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[4].assetKey,
    url: levelFallingPlatformUrl,
  },
  {
    key: LEVEL_AUDIO_DEFINITIONS[5].assetKey,
    url: levelProjectileUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[0].assetKey,
    url: energyChargeLoopUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[1].assetKey,
    url: energyChargeFullUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[2].assetKey,
    url: energyShotUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[3].assetKey,
    url: energyShotEmptyUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[4].assetKey,
    url: energySpecialWindupUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[5].assetKey,
    url: energySpecialFireUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[6].assetKey,
    url: energyImpactSmallUrl,
  },
  {
    key: ENERGY_AUDIO_DEFINITIONS[7].assetKey,
    url: energyImpactHeavyUrl,
  },
  {
    key: BOSS_AUDIO_DEFINITIONS[0].assetKey,
    url: bossEntryUrl,
  },
  {
    key: BOSS_AUDIO_DEFINITIONS[1].assetKey,
    url: bossWindupUrl,
  },
  {
    key: BOSS_AUDIO_DEFINITIONS[2].assetKey,
    url: bossAttackUrl,
  },
  {
    key: BOSS_AUDIO_DEFINITIONS[3].assetKey,
    url: bossHitUrl,
  },
  {
    key: BOSS_AUDIO_DEFINITIONS[4].assetKey,
    url: bossDefeatUrl,
  },
] as const;
