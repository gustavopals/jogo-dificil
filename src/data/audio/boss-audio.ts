import type { AudioDefinition } from "../../shared";

export const BOSS_AUDIO_IDS = {
  ENTRY: "boss-entry-sfx",
  WINDUP: "boss-windup-sfx",
  ATTACK: "boss-attack-sfx",
  HIT: "boss-hit-sfx",
  DEFEAT: "boss-defeat-sfx",
} as const;

export const BOSS_AUDIO_DEFINITIONS = [
  {
    id: BOSS_AUDIO_IDS.ENTRY,
    category: "sfx",
    assetKey: "sfx-boss-entry",
    path: "assets/audio/sfx/boss-entry.wav",
    volume: 0.46,
    loop: false,
  },
  {
    id: BOSS_AUDIO_IDS.WINDUP,
    category: "sfx",
    assetKey: "sfx-boss-windup",
    path: "assets/audio/sfx/boss-windup.wav",
    volume: 0.42,
    loop: false,
  },
  {
    id: BOSS_AUDIO_IDS.ATTACK,
    category: "sfx",
    assetKey: "sfx-boss-attack",
    path: "assets/audio/sfx/boss-attack.wav",
    volume: 0.52,
    loop: false,
  },
  {
    id: BOSS_AUDIO_IDS.HIT,
    category: "sfx",
    assetKey: "sfx-boss-hit",
    path: "assets/audio/sfx/boss-hit.wav",
    volume: 0.48,
    loop: false,
  },
  {
    id: BOSS_AUDIO_IDS.DEFEAT,
    category: "sfx",
    assetKey: "sfx-boss-defeat",
    path: "assets/audio/sfx/boss-defeat.wav",
    volume: 0.56,
    loop: false,
  },
] as const satisfies readonly AudioDefinition[];
