import { VISUAL_READABILITY_SEMANTIC_COLORS } from "../systems/visual-readability";

export const DEATH_JUICE_OVERLAY = {
  color: VISUAL_READABILITY_SEMANTIC_COLORS.energy.failure,
  peakAlpha: 0.28,
  riseDurationMs: 70,
  fallDurationMs: 90,
  depth: 120,
} as const;

export function resolveDeathOverlayPeakAlpha(
  enabled: boolean,
): number {
  return enabled ? DEATH_JUICE_OVERLAY.peakAlpha : 0;
}
