import type { AudioDefinition } from "../../shared";

export const MUSIC_AUDIO_IDS = {
  MENU_LOOP: "menu-main-loop-music",
  MVP_LOOP: "mvp-main-loop-music",
  BLOCK_2_DASH_LOOP: "block-2-dash-loop-music",
  BLOCK_3_ENERGY_LOOP: "block-3-energy-loop-music",
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

export const BLOCK_2_DASH_MUSIC_THEME = {
  id: "dash-sob-suspeita",
  name: "Dash Sob Suspeita",
  tempoBpm: 108,
  meter: "4/4",
  intent:
    "Loop mais tenso para o bloco de dash e memoria curta, com pulso mais seco que o MVP inicial.",
  loopAudioId: MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
} as const;

export const BLOCK_3_ENERGY_MUSIC_THEME = {
  id: "nucleo-ciano",
  name: "Nucleo Ciano",
  tempoBpm: 88,
  meter: "4/4",
  intent:
    "Loop mais amplo para energia ciano, puzzles e arena final, mantendo leitura sem competir com SFX.",
  loopAudioId: MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
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
    id: MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    category: "music",
    assetKey: "music-block-2-dash-loop",
    path: "assets/audio/music/block-2-dash-loop.wav",
    volume: 0.4,
    loop: true,
  },
  {
    id: MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    category: "music",
    assetKey: "music-block-3-energy-loop",
    path: "assets/audio/music/block-3-energy-loop.wav",
    volume: 0.38,
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
