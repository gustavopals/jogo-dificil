import type { AudioDefinition } from "../../shared";

export const MUSIC_AUDIO_IDS = {
  MENU_LOOP: "menu-main-loop-music",
  MVP_LOOP: "mvp-main-loop-music",
  LEVEL_COMPLETE_STING: "mvp-level-complete-sting-music",
} as const;

export const MENU_MUSIC_THEME = {
  id: "entrada-pulante",
  name: "Entrada Pulante",
  tempoBpm: 120,
  meter: "4/4",
  intent:
    "Loop curto e leve para a tela inicial, com arpejo brincalhao e menos pressao que a musica de gameplay.",
  loopAudioId: MUSIC_AUDIO_IDS.MENU_LOOP,
} as const;

export const MVP_MUSIC_THEME = {
  id: "pulos-de-azar",
  name: "Pulos de Azar",
  tempoBpm: 96,
  meter: "4/4",
  intent:
    "Loop curto, divertido e leve, com pulso chiptune simples para sustentar tentativas repetidas sem cansar.",
  loopAudioId: MUSIC_AUDIO_IDS.MVP_LOOP,
} as const;

export const MUSIC_AUDIO_DEFINITIONS = [
  {
    id: MUSIC_AUDIO_IDS.MENU_LOOP,
    category: "music",
    assetKey: "music-menu-loop",
    path: "assets/audio/music/menu-loop.wav",
    volume: 0.5,
    loop: true,
  },
  {
    id: MUSIC_AUDIO_IDS.MVP_LOOP,
    category: "music",
    assetKey: "music-mvp-loop",
    path: "assets/audio/music/mvp-loop.wav",
    volume: 0.4,
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
