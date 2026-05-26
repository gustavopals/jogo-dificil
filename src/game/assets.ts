import mvpLevelCompleteStingUrl from "../../assets/audio/music/mvp-level-complete-sting.wav";
import mvpLoopUrl from "../../assets/audio/music/mvp-loop.wav";
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
import playerPinoDeath01Url from "../../assets/sprites/player-pino-death-01.png";
import playerPinoDeath02Url from "../../assets/sprites/player-pino-death-02.png";
import playerPinoFallUrl from "../../assets/sprites/player-pino-fall.png";
import playerPinoIdleUrl from "../../assets/sprites/player-pino-idle.png";
import playerPinoJumpUrl from "../../assets/sprites/player-pino-jump.png";
import playerPinoRespawn01Url from "../../assets/sprites/player-pino-respawn-01.png";
import playerPinoRespawn02Url from "../../assets/sprites/player-pino-respawn-02.png";
import playerPinoRun01Url from "../../assets/sprites/player-pino-run-01.png";
import playerPinoRun02Url from "../../assets/sprites/player-pino-run-02.png";
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
import labBackgroundPanelUrl from "../../assets/tilesets/lab-background-panel.png";
import labHazardSpikesUrl from "../../assets/tilesets/lab-hazard-spikes.png";
import labPlatformUrl from "../../assets/tilesets/lab-platform.png";
import labSolidBlockUrl from "../../assets/tilesets/lab-solid-block.png";
import {
  LEVEL_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_DEFINITIONS,
  PLAYER_AUDIO_DEFINITIONS,
} from "../data/audio";
import {
  GAMEPLAY_SPRITE_KEYS,
  PLACEHOLDER_TILESET_ASSET_KEYS,
} from "../data/art";
import { PINO_TEXTURE_KEYS } from "../data/characters/pino-animations";

export const ASSET_KEYS = {
  PLAYER_PINO_IDLE: PINO_TEXTURE_KEYS.IDLE,
  PLAYER_PINO_RUN_01: PINO_TEXTURE_KEYS.RUN_01,
  PLAYER_PINO_RUN_02: PINO_TEXTURE_KEYS.RUN_02,
  PLAYER_PINO_JUMP: PINO_TEXTURE_KEYS.JUMP,
  PLAYER_PINO_FALL: PINO_TEXTURE_KEYS.FALL,
  PLAYER_PINO_DEATH_01: PINO_TEXTURE_KEYS.DEATH_01,
  PLAYER_PINO_DEATH_02: PINO_TEXTURE_KEYS.DEATH_02,
  PLAYER_PINO_RESPAWN_01: PINO_TEXTURE_KEYS.RESPAWN_01,
  PLAYER_PINO_RESPAWN_02: PINO_TEXTURE_KEYS.RESPAWN_02,
  TRAP_SPIKES: GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
  TRAP_FALSE_BLOCK: GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
  TRAP_FALLING_PLATFORM: GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
  TRAP_BREAKABLE_FLOOR: GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
  TRAP_PROJECTILE: GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
  ITEM_REQUIRED_CHIP: GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP,
  ITEM_MECHANISM_KEY: GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY,
  ITEM_OPTIONAL_TOKEN: GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN,
  MARKER_CHECKPOINT_INACTIVE: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE,
  MARKER_CHECKPOINT_ACTIVE: GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE,
  MARKER_EXIT: GAMEPLAY_SPRITE_KEYS.MARKER_EXIT,
  TILESET_LAB_SOLID_BLOCK: PLACEHOLDER_TILESET_ASSET_KEYS.SOLID_BLOCK,
  TILESET_LAB_PLATFORM: PLACEHOLDER_TILESET_ASSET_KEYS.PLATFORM,
  TILESET_LAB_HAZARD_SPIKES: PLACEHOLDER_TILESET_ASSET_KEYS.HAZARD_SPIKES,
  TILESET_LAB_BACKGROUND_PANEL: PLACEHOLDER_TILESET_ASSET_KEYS.BACKGROUND_PANEL,
} as const;

export const IMAGE_ASSETS = [
  {
    key: ASSET_KEYS.PLAYER_PINO_IDLE,
    url: playerPinoIdleUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_RUN_01,
    url: playerPinoRun01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_RUN_02,
    url: playerPinoRun02Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_JUMP,
    url: playerPinoJumpUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_FALL,
    url: playerPinoFallUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_DEATH_01,
    url: playerPinoDeath01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_DEATH_02,
    url: playerPinoDeath02Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_RESPAWN_01,
    url: playerPinoRespawn01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_RESPAWN_02,
    url: playerPinoRespawn02Url,
  },
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
] as const;

export const AUDIO_ASSETS = [
  {
    key: MUSIC_AUDIO_DEFINITIONS[0].assetKey,
    url: mvpLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[1].assetKey,
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
] as const;
