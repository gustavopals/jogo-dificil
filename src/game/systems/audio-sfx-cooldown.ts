import { BOSS_AUDIO_IDS } from "../../data/audio/boss-audio";
import { PLAYER_AUDIO_IDS } from "../../data/audio/player-audio";

export const DEFAULT_SFX_COOLDOWN_MS = 0;

export const SFX_COOLDOWN_MS_BY_AUDIO_ID: Readonly<Record<string, number>> = {
  [PLAYER_AUDIO_IDS.DEATH_01]: 140,
  [PLAYER_AUDIO_IDS.DEATH_02]: 140,
  [PLAYER_AUDIO_IDS.DEATH_03]: 140,
  [BOSS_AUDIO_IDS.HIT]: 120,
  [PLAYER_AUDIO_IDS.JUMP]: 70,
};

export function getSfxCooldownMs(audioId: string): number {
  return SFX_COOLDOWN_MS_BY_AUDIO_ID[audioId] ?? DEFAULT_SFX_COOLDOWN_MS;
}

export function shouldAllowSfxPlayback(
  audioId: string,
  nowMs: number,
  lastPlayedAtById: ReadonlyMap<string, number>,
): boolean {
  const cooldownMs = getSfxCooldownMs(audioId);

  if (cooldownMs <= 0) {
    return true;
  }

  const lastPlayedAt = lastPlayedAtById.get(audioId);

  if (lastPlayedAt === undefined) {
    return true;
  }

  return nowMs - lastPlayedAt >= cooldownMs;
}

export function recordSfxPlayback(
  audioId: string,
  nowMs: number,
  lastPlayedAtById: Map<string, number>,
): void {
  if (getSfxCooldownMs(audioId) <= 0) {
    return;
  }

  lastPlayedAtById.set(audioId, nowMs);
}
