import type { RectLike } from "../../shared";

export const VISUAL_READABILITY_LIMITS = {
  smallHazardMaxSizePx: 16,
  maxWideEffectAlpha: 0.56,
} as const;

export const VISUAL_READABILITY_DEPTHS = {
  directHazard: 10,
  trapThreat: 10,
  trapProjectile: 11,
} as const;

export function isSmallHazardArea(
  area: Pick<RectLike, "width" | "height">,
): boolean {
  return (
    area.width <= VISUAL_READABILITY_LIMITS.smallHazardMaxSizePx ||
    area.height <= VISUAL_READABILITY_LIMITS.smallHazardMaxSizePx
  );
}

export function clampWideEffectAlpha(alpha: number): number {
  return Math.min(
    Math.max(0, alpha),
    VISUAL_READABILITY_LIMITS.maxWideEffectAlpha,
  );
}
