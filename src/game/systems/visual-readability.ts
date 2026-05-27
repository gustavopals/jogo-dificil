import type { RectLike } from "../../shared";

export const VISUAL_READABILITY_LIMITS = {
  smallHazardMaxSizePx: 16,
  maxWideEffectAlpha: 0.56,
} as const;

export const VISUAL_READABILITY_CONTRAST_RULES = {
  minPrimaryColorDistance: 95,
} as const;

export const VISUAL_READABILITY_DEPTHS = {
  bossBody: 6,
  bossHealth: 9,
  directHazard: 10,
  trapThreat: 10,
  trapProjectile: 11,
} as const;

export const VISUAL_READABILITY_SEMANTIC_COLORS = {
  energy: {
    primary: 0x80d7c2,
    charged: 0xf4d35e,
    failure: 0xe35d6a,
  },
  trap: {
    primary: 0x9b5de5,
    danger: 0xe35d6a,
    triggered: 0xf4d35e,
    resolved: 0x3f4958,
  },
  boss: {
    primary: 0xe76f51,
    body: 0x242630,
    healthFilled: 0xf4d35e,
    healthEmpty: 0x3f4958,
    frame: 0x050608,
    outline: 0xf5f7fb,
  },
} as const;

export type VisualReadabilitySemanticRole =
  keyof typeof VISUAL_READABILITY_SEMANTIC_COLORS;

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

export function getRgbColorDistance(left: number, right: number): number {
  const leftRgb = toRgb(left);
  const rightRgb = toRgb(right);

  return Math.hypot(
    leftRgb.r - rightRgb.r,
    leftRgb.g - rightRgb.g,
    leftRgb.b - rightRgb.b,
  );
}

export function hasPrimaryRoleColorContrast(
  leftRole: VisualReadabilitySemanticRole,
  rightRole: VisualReadabilitySemanticRole,
): boolean {
  return (
    getRgbColorDistance(
      VISUAL_READABILITY_SEMANTIC_COLORS[leftRole].primary,
      VISUAL_READABILITY_SEMANTIC_COLORS[rightRole].primary,
    ) >= VISUAL_READABILITY_CONTRAST_RULES.minPrimaryColorDistance
  );
}

function toRgb(color: number): {
  readonly r: number;
  readonly g: number;
  readonly b: number;
} {
  return {
    r: (color >> 16) & 0xff,
    g: (color >> 8) & 0xff,
    b: color & 0xff,
  };
}
