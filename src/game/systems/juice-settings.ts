export const JUICE_ENABLED = true;
export const SCREEN_SHAKE_ENABLED = true;

export function isJuiceEnabled(): boolean {
  return JUICE_ENABLED;
}

export function isScreenShakeEnabled(): boolean {
  return JUICE_ENABLED && SCREEN_SHAKE_ENABLED;
}
