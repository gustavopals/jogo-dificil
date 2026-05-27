import type { AudioDefinition } from "../../shared";

export const ENERGY_AUDIO_IDS = {
  CHARGE_LOOP: "energy-charge-loop-sfx",
  CHARGE_FULL: "energy-charge-full-sfx",
  SHOT: "energy-shot-sfx",
  SHOT_EMPTY: "energy-shot-empty-sfx",
  SPECIAL_WINDUP: "energy-special-windup-sfx",
  SPECIAL_FIRE: "energy-special-fire-sfx",
  IMPACT_SMALL: "energy-impact-small-sfx",
  IMPACT_HEAVY: "energy-impact-heavy-sfx",
} as const;

export const ENERGY_AUDIO_DEFINITIONS = [
  {
    id: ENERGY_AUDIO_IDS.CHARGE_LOOP,
    category: "sfx",
    assetKey: "sfx-energy-charge-loop",
    path: "assets/audio/sfx/energy-charge-loop.wav",
    volume: 0.28,
    loop: true,
  },
  {
    id: ENERGY_AUDIO_IDS.CHARGE_FULL,
    category: "sfx",
    assetKey: "sfx-energy-charge-full",
    path: "assets/audio/sfx/energy-charge-full.wav",
    volume: 0.46,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.SHOT,
    category: "sfx",
    assetKey: "sfx-energy-shot",
    path: "assets/audio/sfx/energy-shot.wav",
    volume: 0.38,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.SHOT_EMPTY,
    category: "sfx",
    assetKey: "sfx-energy-shot-empty",
    path: "assets/audio/sfx/energy-shot-empty.wav",
    volume: 0.42,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.SPECIAL_WINDUP,
    category: "sfx",
    assetKey: "sfx-energy-special-windup",
    path: "assets/audio/sfx/energy-special-windup.wav",
    volume: 0.36,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.SPECIAL_FIRE,
    category: "sfx",
    assetKey: "sfx-energy-special-fire",
    path: "assets/audio/sfx/energy-special-fire.wav",
    volume: 0.5,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.IMPACT_SMALL,
    category: "sfx",
    assetKey: "sfx-energy-impact-small",
    path: "assets/audio/sfx/energy-impact-small.wav",
    volume: 0.36,
    loop: false,
  },
  {
    id: ENERGY_AUDIO_IDS.IMPACT_HEAVY,
    category: "sfx",
    assetKey: "sfx-energy-impact-heavy",
    path: "assets/audio/sfx/energy-impact-heavy.wav",
    volume: 0.48,
    loop: false,
  },
] as const satisfies readonly AudioDefinition[];
