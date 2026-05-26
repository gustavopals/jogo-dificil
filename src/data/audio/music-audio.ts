import type { AudioDefinition } from "../../shared";

export const MUSIC_AUDIO_IDS = {
  MVP_LOOP: "mvp-main-loop-music",
  LEVEL_COMPLETE_STING: "mvp-level-complete-sting-music",
} as const;

export const MVP_MUSIC_THEME = {
  id: "passos-tortos",
  name: "Passos Tortos",
  tempoBpm: 92,
  meter: "4/4",
  intent:
    "Loop discreto de pulso curto e acordes menores, feito para tensao leve sem cansar em repeticao.",
  loopAudioId: MUSIC_AUDIO_IDS.MVP_LOOP,
} as const;

export const MUSIC_AUDIO_DEFINITIONS = [
  {
    id: MUSIC_AUDIO_IDS.MVP_LOOP,
    category: "music",
    assetKey: "music-mvp-loop",
    path: "assets/audio/music/mvp-loop.wav",
    volume: 0.28,
    loop: true,
  },
  {
    id: MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
    category: "music",
    assetKey: "music-mvp-level-complete-sting",
    path: "assets/audio/music/mvp-level-complete-sting.wav",
    volume: 0.5,
    loop: false,
  },
] as const satisfies readonly AudioDefinition[];
