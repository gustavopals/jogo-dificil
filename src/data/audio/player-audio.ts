import type { AudioDefinition } from "../../shared";

export const PLAYER_AUDIO_IDS = {
  JUMP: "player-jump-sfx",
  LAND: "player-land-sfx",
  DEATH_01: "player-death-01-sfx",
  DEATH_02: "player-death-02-sfx",
  DEATH_03: "player-death-03-sfx",
  RESPAWN: "player-respawn-sfx",
  PRIMARY_ACTION: "player-primary-action-sfx",
  SECONDARY_ACTION: "player-secondary-action-sfx",
} as const;

export const PLAYER_DEATH_AUDIO_IDS = [
  PLAYER_AUDIO_IDS.DEATH_01,
  PLAYER_AUDIO_IDS.DEATH_02,
  PLAYER_AUDIO_IDS.DEATH_03,
] as const;

export const PLAYER_AUDIO_DEFINITIONS = [
  {
    id: PLAYER_AUDIO_IDS.JUMP,
    category: "sfx",
    assetKey: "sfx-player-jump",
    path: "assets/audio/sfx/player-jump.wav",
    volume: 0.52,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.LAND,
    category: "sfx",
    assetKey: "sfx-player-land",
    path: "assets/audio/sfx/player-land.wav",
    volume: 0.28,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.DEATH_01,
    category: "sfx",
    assetKey: "sfx-player-death-01",
    path: "assets/audio/sfx/player-death-01.wav",
    volume: 0.62,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.DEATH_02,
    category: "sfx",
    assetKey: "sfx-player-death-02",
    path: "assets/audio/sfx/player-death-02.wav",
    volume: 0.6,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.DEATH_03,
    category: "sfx",
    assetKey: "sfx-player-death-03",
    path: "assets/audio/sfx/player-death-03.wav",
    volume: 0.64,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.RESPAWN,
    category: "sfx",
    assetKey: "sfx-player-respawn",
    path: "assets/audio/sfx/player-respawn.wav",
    volume: 0.46,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.PRIMARY_ACTION,
    category: "sfx",
    assetKey: "sfx-player-primary-action",
    path: "assets/audio/sfx/player-primary.wav",
    volume: 0.42,
    loop: false,
  },
  {
    id: PLAYER_AUDIO_IDS.SECONDARY_ACTION,
    category: "sfx",
    assetKey: "sfx-player-secondary-action",
    path: "assets/audio/sfx/player-secondary.wav",
    volume: 0.44,
    loop: false,
  },
] as const satisfies readonly AudioDefinition[];

export function getPlayerDeathAudioId(deathCount: number): string {
  const safeDeathCount = Math.max(1, Math.floor(deathCount));
  const index = (safeDeathCount - 1) % PLAYER_DEATH_AUDIO_IDS.length;

  return PLAYER_DEATH_AUDIO_IDS[index]!;
}
