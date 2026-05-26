import type { AudioDefinition } from "../../shared";

export const LEVEL_AUDIO_IDS = {
  CHECKPOINT: "level-checkpoint-sfx",
  COMPLETE: "level-complete-sfx",
  ITEM_COLLECT: "level-item-sfx",
  TRAP_ACTIVATE: "level-trap-sfx",
  FALLING_PLATFORM: "level-falling-platform-sfx",
  PROJECTILE: "level-projectile-sfx",
} as const;

export const LEVEL_AUDIO_DEFINITIONS = [
  {
    id: LEVEL_AUDIO_IDS.CHECKPOINT,
    category: "sfx",
    assetKey: "sfx-level-checkpoint",
    path: "assets/audio/sfx/level-checkpoint.wav",
    volume: 0.5,
    loop: false,
  },
  {
    id: LEVEL_AUDIO_IDS.COMPLETE,
    category: "sfx",
    assetKey: "sfx-level-complete",
    path: "assets/audio/sfx/level-complete.wav",
    volume: 0.58,
    loop: false,
  },
  {
    id: LEVEL_AUDIO_IDS.ITEM_COLLECT,
    category: "sfx",
    assetKey: "sfx-level-item",
    path: "assets/audio/sfx/level-item.wav",
    volume: 0.45,
    loop: false,
  },
  {
    id: LEVEL_AUDIO_IDS.TRAP_ACTIVATE,
    category: "sfx",
    assetKey: "sfx-level-trap",
    path: "assets/audio/sfx/level-trap.wav",
    volume: 0.55,
    loop: false,
  },
  {
    id: LEVEL_AUDIO_IDS.FALLING_PLATFORM,
    category: "sfx",
    assetKey: "sfx-level-falling-platform",
    path: "assets/audio/sfx/level-falling-platform.wav",
    volume: 0.5,
    loop: false,
  },
  {
    id: LEVEL_AUDIO_IDS.PROJECTILE,
    category: "sfx",
    assetKey: "sfx-level-projectile",
    path: "assets/audio/sfx/level-projectile.wav",
    volume: 0.5,
    loop: false,
  },
] as const satisfies readonly AudioDefinition[];
