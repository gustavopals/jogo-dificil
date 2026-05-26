export const AUTO_RESPAWN_DELAY_MS = 450;
export const RESPAWN_RECOVERY_MS = 120;
export const MANUAL_RESTART_COUNTS_AS_DEATH = false;

export function isAutoRespawnDelayInReadyRange(delayMs: number): boolean {
  return delayMs >= 300 && delayMs <= 600;
}
