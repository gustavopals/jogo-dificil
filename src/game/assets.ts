import mvpLevelCompleteStingUrl from "../../assets/audio/music/mvp-level-complete-sting.wav";
import mvpLoopUrl from "../../assets/audio/music/mvp-loop.wav";
import menuLoopUrl from "../../assets/audio/music/menu-loop.wav";
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
import playerPinoDeath01Url from "../../assets/sprites/player-pino-death-01.png";
import playerPinoDeath02Url from "../../assets/sprites/player-pino-death-02.png";
import playerPinoCharge01Url from "../../assets/sprites/player-pino-charge-01.png";
import playerPinoCharge02Url from "../../assets/sprites/player-pino-charge-02.png";
import playerPinoCyanBurstFire01Url from "../../assets/sprites/player-pino-cyan-burst-fire-01.png";
import playerPinoCyanBurstFire02Url from "../../assets/sprites/player-pino-cyan-burst-fire-02.png";
import playerPinoCyanBurstPrepare01Url from "../../assets/sprites/player-pino-cyan-burst-prepare-01.png";
import playerPinoCyanBurstPrepare02Url from "../../assets/sprites/player-pino-cyan-burst-prepare-02.png";
import playerPinoCyanSpark01Url from "../../assets/sprites/player-pino-cyan-spark-01.png";
import playerPinoCyanSpark02Url from "../../assets/sprites/player-pino-cyan-spark-02.png";
import playerPinoDashUrl from "../../assets/sprites/player-pino-dash.png";
import playerPinoFallUrl from "../../assets/sprites/player-pino-fall.png";
import playerPinoIdleUrl from "../../assets/sprites/player-pino-idle.png";
import playerPinoJumpUrl from "../../assets/sprites/player-pino-jump.png";
import playerPinoJumpPeakUrl from "../../assets/sprites/player-pino-jump-peak.png";
import playerPinoRespawn01Url from "../../assets/sprites/player-pino-respawn-01.png";
import playerPinoRespawn02Url from "../../assets/sprites/player-pino-respawn-02.png";
import playerPinoRun01Url from "../../assets/sprites/player-pino-run-01.png";
import playerPinoRun02Url from "../../assets/sprites/player-pino-run-02.png";
import playerPinoRun03Url from "../../assets/sprites/player-pino-run-03.png";
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
import labBackgroundPanelUrl from "../../assets/tilesets/lab-background-panel.png";
import labHazardSpikesUrl from "../../assets/tilesets/lab-hazard-spikes.png";
import labPlatformUrl from "../../assets/tilesets/lab-platform.png";
import labSolidBlockUrl from "../../assets/tilesets/lab-solid-block.png";
import {
  ENERGY_AUDIO_DEFINITIONS,
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
    key: ASSET_KEYS.PLAYER_PINO_RUN_03,
    url: playerPinoRun03Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_JUMP,
    url: playerPinoJumpUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_JUMP_PEAK,
    url: playerPinoJumpPeakUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_FALL,
    url: playerPinoFallUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_DASH,
    url: playerPinoDashUrl,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CHARGE_01,
    url: playerPinoCharge01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CHARGE_02,
    url: playerPinoCharge02Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_SPARK_01,
    url: playerPinoCyanSpark01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_SPARK_02,
    url: playerPinoCyanSpark02Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_BURST_PREPARE_01,
    url: playerPinoCyanBurstPrepare01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_BURST_PREPARE_02,
    url: playerPinoCyanBurstPrepare02Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_BURST_FIRE_01,
    url: playerPinoCyanBurstFire01Url,
  },
  {
    key: ASSET_KEYS.PLAYER_PINO_CYAN_BURST_FIRE_02,
    url: playerPinoCyanBurstFire02Url,
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
    url: menuLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[1].assetKey,
    url: mvpLoopUrl,
  },
  {
    key: MUSIC_AUDIO_DEFINITIONS[2].assetKey,
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
] as const;
