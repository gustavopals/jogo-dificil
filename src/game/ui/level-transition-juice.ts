export const LEVEL_TRANSITION_JUICE = {
  fadeInDurationMs: 280,
  fadeOutDurationMs: 180,
  fadeOutLeadMs: 260,
  titleScaleFrom: 0.94,
  titleFadeDurationMs: 240,
  titleScaleDurationMs: 320,
} as const;

export function resolveLevelTransitionFadeOutStartMs(
  transitionDelayMs: number,
): number {
  return Math.max(0, transitionDelayMs - LEVEL_TRANSITION_JUICE.fadeOutLeadMs);
}
