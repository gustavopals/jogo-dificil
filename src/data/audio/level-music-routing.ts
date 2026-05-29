import type { LevelDefinition } from "../../shared";

import {
  MUSIC_AUDIO_DEFINITIONS,
  MUSIC_AUDIO_IDS,
} from "./music-audio";

export const GAMEPLAY_MUSIC_BLOCK_RANGES = [
  {
    id: "block-1-cruel-intro",
    minOrder: 1,
    maxOrder: 3,
    musicAudioId: MUSIC_AUDIO_IDS.MVP_LOOP,
    themeName: "Pulos de Azar",
    intent:
      "Loop leve e repetivel para o bloco inicial de armadilhas simples e primeiro boss.",
  },
  {
    id: "block-2-dash-memory",
    minOrder: 4,
    maxOrder: 6,
    musicAudioId: MUSIC_AUDIO_IDS.BLOCK_2_DASH_LOOP,
    themeName: "Dash Sob Suspeita",
    intent:
      "Loop um pouco mais tenso para dash, memoria curta e arena do Dr. Imports.",
  },
  {
    id: "block-3-energy-finale",
    minOrder: 7,
    maxOrder: 11,
    musicAudioId: MUSIC_AUDIO_IDS.BLOCK_3_ENERGY_LOOP,
    themeName: "Nucleo Ciano",
    intent:
      "Loop mais amplo para o kit de energia, bloco final e boss Giga Fabio.",
  },
] as const;

export type GameplayMusicBlockRange =
  (typeof GAMEPLAY_MUSIC_BLOCK_RANGES)[number];

export function getGameplayMusicBlockForOrder(
  order: number,
): GameplayMusicBlockRange {
  const block = GAMEPLAY_MUSIC_BLOCK_RANGES.find(
    (candidate) => order >= candidate.minOrder && order <= candidate.maxOrder,
  );

  if (!block) {
    return GAMEPLAY_MUSIC_BLOCK_RANGES[0];
  }

  return block;
}

export function resolveGameplayMusicAudioId(
  level: Pick<LevelDefinition, "order" | "audio">,
): (typeof MUSIC_AUDIO_IDS)[keyof typeof MUSIC_AUDIO_IDS] {
  const overrideMusicId = level.audio.musicId;

  if (overrideMusicId) {
    const override = MUSIC_AUDIO_DEFINITIONS.find(
      (audio) =>
        audio.id === overrideMusicId || audio.assetKey === overrideMusicId,
    );

    if (override) {
      return override.id;
    }
  }

  return getGameplayMusicBlockForOrder(level.order).musicAudioId;
}

export function shouldRestartGameplayMusic(
  previousOrder: number,
  nextOrder: number,
): boolean {
  return (
    getGameplayMusicBlockForOrder(previousOrder).musicAudioId !==
    getGameplayMusicBlockForOrder(nextOrder).musicAudioId
  );
}
