import { BOSS_AUDIO_IDS } from "../../data/audio/boss-audio";
import { MUSIC_AUDIO_IDS } from "../../data/audio/music-audio";

export const MUSIC_DUCK_VOLUME_MULTIPLIER = 0.55;

export const MUSIC_DUCK_DURATION_MS = 800;

export const MUSIC_DUCK_TRIGGER_AUDIO_IDS = new Set<string>([
  MUSIC_AUDIO_IDS.LEVEL_COMPLETE_STING,
  BOSS_AUDIO_IDS.ENTRY,
]);

export type MusicDuckConfig = {
  readonly volumeMultiplier: number;
  readonly durationMs: number;
};

export const DEFAULT_MUSIC_DUCK_CONFIG = {
  volumeMultiplier: MUSIC_DUCK_VOLUME_MULTIPLIER,
  durationMs: MUSIC_DUCK_DURATION_MS,
} as const satisfies MusicDuckConfig;

export function shouldDuckMusicForAudioId(audioId: string): boolean {
  return MUSIC_DUCK_TRIGGER_AUDIO_IDS.has(audioId);
}

export function applyMusicDuckMultiplier(
  baseVolume: number,
  duckMultiplier: number,
): number {
  if (!Number.isFinite(baseVolume) || baseVolume <= 0) {
    return 0;
  }

  const safeMultiplier = clampDuckMultiplier(duckMultiplier);

  return baseVolume * safeMultiplier;
}

export function clampDuckMultiplier(multiplier: number): number {
  if (!Number.isFinite(multiplier)) {
    return 1;
  }

  return Math.max(0, Math.min(1, multiplier));
}

export function resolveMusicDuckMultiplier(
  nowMs: number,
  duckUntilMs: number | null,
  duckVolumeMultiplier: number,
): number {
  if (duckUntilMs === null || nowMs >= duckUntilMs) {
    return 1;
  }

  return clampDuckMultiplier(duckVolumeMultiplier);
}
