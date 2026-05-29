import type { LevelId } from "../../shared";

/** Cores e leitura visual por fase — proporção Stardew (mundo grande, personagem ~1x1,5 tile). */
export type LevelVisualTheme = {
  readonly label: string;
  readonly backgroundTint: number;
  readonly backgroundAlpha: number;
  readonly terrainTint: number;
  readonly platformTint: number;
  readonly accentColor: number;
  readonly mood: string;
};

export const LEVEL_VISUAL_THEMES = {
  "level-01": {
    label: "Lab acolhedor",
    backgroundTint: 0xa8c4d8,
    backgroundAlpha: 0.91,
    terrainTint: 0xc4a882,
    platformTint: 0xd4a574,
    accentColor: 0xf4d35e,
    mood:
      "warning-lab acolhedor — pedras quentes, fitas amarelas suaves; gaps de 2–3 tiles justos para o salto inicial",
  },
  "level-02": {
    label: "Trilha desconfiada",
    backgroundTint: 0x85b5a5,
    backgroundAlpha: 0.91,
    terrainTint: 0xae8f62,
    platformTint: 0xc49458,
    accentColor: 0xf0a830,
    mood: "trilha segmentada com degraus de madeira, vãos estreitos e lanternas junto ao mecanismo",
  },
  "level-03": {
    label: "Laboratório da memória",
    backgroundTint: 0x8a9eb5,
    backgroundAlpha: 0.9,
    terrainTint: 0xa89888,
    platformTint: 0xc4a882,
    accentColor: 0x9b5de5,
    mood: "galeria acolhedora de pedra com vitrais roxos e lamparinas suaves",
  },
  "level-04": {
    label: "Laboratório de impulso",
    backgroundTint: 0x9ec8e8,
    backgroundAlpha: 0.91,
    terrainTint: 0x7a8898,
    platformTint: 0xc8b078,
    accentColor: 0x4cc9f0,
    mood: "pista aberta de treino com marcos ciano e vento lateral",
  },
  "level-05": {
    label: "Clareira da dúvida",
    backgroundTint: 0x9cb4a0,
    backgroundAlpha: 0.91,
    terrainTint: 0x8a7058,
    platformTint: 0xc09050,
    accentColor: 0xe76f51,
    mood:
      "clareira Stardew ao entardecer — grama quente, tábuas de celeiro e flores coral marcam truques de dash",
  },
  "level-06": {
    label: "Laboratório de memória",
    backgroundTint: 0x6888a8,
    backgroundAlpha: 0.88,
    terrainTint: 0x786878,
    platformTint: 0xc09858,
    accentColor: 0x9b5de5,
    mood: "lab de dash e memória — pedra violeta, trilhas ciano e arena do Dr. Imports",
  },
  "level-07": {
    label: "Laboratório de faísca",
    backgroundTint: 0x88b8c8,
    backgroundAlpha: 0.91,
    terrainTint: 0x708090,
    platformTint: 0x5a98b0,
    accentColor: 0x56cfe1,
    mood: "sala de treino iluminada com painéis ciano, faíscas e chão metálico legível",
  },
  "level-08": {
    label: "O alvo mente",
    backgroundTint: 0x506070,
    backgroundAlpha: 0.89,
    terrainTint: 0x646878,
    platformTint: 0x5898a8,
    accentColor: 0x56cfe1,
    mood:
      "grotão enganoso — luz ciano nos alvos, roxo no absorvedor falso, pedra fria antes do bloco rachado",
  },
  "level-09": {
    label: "Lab de combo ciano",
    backgroundTint: 0x4a7888,
    backgroundAlpha: 0.87,
    terrainTint: 0x586878,
    platformTint: 0x5098a8,
    accentColor: 0x48b0e8,
    mood: "corredor de relay com faíscas ciano e plataformas de laboratório",
  },
  "level-10": {
    label: "Nucleo de Giga Fabio",
    backgroundTint: 0x3c3848,
    backgroundAlpha: 0.87,
    terrainTint: 0x5c5868,
    platformTint: 0xb08850,
    accentColor: 0xffd166,
    mood: "giga-fabio-final-arena — pedra negra, plataformas bronze e bruma no teto",
  },
  "level-11": {
    label: "Circuito relâmpago",
    backgroundTint: 0x283848,
    backgroundAlpha: 0.82,
    terrainTint: 0x3c5060,
    platformTint: 0x5888a8,
    accentColor: 0x4cc9f0,
    mood:
      "desafio pós-campanha: tempestade elétrica, trilhos frios, faíscas douradas no dash e ciano na porta",
  },
} as const satisfies Record<LevelId, LevelVisualTheme>;

export function getLevelVisualTheme(levelId: LevelId): LevelVisualTheme {
  return LEVEL_VISUAL_THEMES[levelId as keyof typeof LEVEL_VISUAL_THEMES];
}
