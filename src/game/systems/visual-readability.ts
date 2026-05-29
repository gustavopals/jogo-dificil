import type { RectLike } from "../../shared";

import { TILE_SIZE_PX } from "../constants";

export const VISUAL_READABILITY_LIMITS = {
  // Em HD (tile 32) um hazard "pequeno" e qualquer ameaca com lado <= 1 tile.
  smallHazardMaxSizePx: TILE_SIZE_PX,
  maxWideEffectAlpha: 0.56,
} as const;

export const VISUAL_READABILITY_CONTRAST_RULES = {
  minPrimaryColorDistance: 95,
} as const;

// Escada canonica de profundidade (depth) para TODOS os elementos do mundo.
// Quanto maior o valor, mais perto da camera. Regra central de leitura:
// perigos e projeteis ficam ACIMA do jogador e dos efeitos de energia, e os
// efeitos de energia ficam ABAIXO dos hazards. Combinado ao teto de alpha
// (`clampWideEffectAlpha`), isso garante que nenhum efeito de energia esconda
// um hazard pequeno. Sistemas especificos derivam suas constantes desta tabela
// para que exista uma unica fonte de verdade (ver player-visual-effects.ts).
export const DEPTH_LAYERS = {
  background: -10,
  terrain: 0,
  trapBody: 1,
  energyTarget: 2,
  energyTargetState: 3,
  playerAura: 3,
  pickup: 4,
  playerTrail: 5,
  bossBody: 6,
  playerBurst: 6,
  player: 7,
  energyEffect: 8,
  bossHealth: 9,
  hazard: 10,
  projectile: 11,
} as const;

export type DepthLayer = keyof typeof DEPTH_LAYERS;

export const VISUAL_READABILITY_DEPTHS = {
  bossBody: DEPTH_LAYERS.bossBody,
  bossHealth: DEPTH_LAYERS.bossHealth,
  directHazard: DEPTH_LAYERS.hazard,
  trapThreat: DEPTH_LAYERS.hazard,
  trapProjectile: DEPTH_LAYERS.projectile,
} as const;

// Invariantes de leitura que os layers acima precisam respeitar. Exposto para
// permitir verificacao em testes e evitar regressao silenciosa de ordem.
export function energyEffectsStayBehindHazards(): boolean {
  return (
    DEPTH_LAYERS.energyEffect < DEPTH_LAYERS.hazard &&
    DEPTH_LAYERS.energyEffect < DEPTH_LAYERS.projectile
  );
}

export function hazardsStayAbovePlayer(): boolean {
  return (
    DEPTH_LAYERS.hazard > DEPTH_LAYERS.player &&
    DEPTH_LAYERS.projectile > DEPTH_LAYERS.player
  );
}

export const VISUAL_READABILITY_SEMANTIC_COLORS = {
  energy: {
    primary: 0x80d7c2,
    charged: 0xf4d35e,
    failure: 0xe35d6a,
    crackedBlock: 0x5d6f86,
  },
  trap: {
    primary: 0x9b5de5,
    danger: 0xe35d6a,
    triggered: 0xf4d35e,
    resolved: 0x3f4958,
    breakableFloor: 0xffb703,
  },
  boss: {
    primary: 0xe76f51,
    body: 0x242630,
    healthFilled: 0xf4d35e,
    healthEmpty: 0x3f4958,
    frame: 0x050608,
    outline: 0xf5f7fb,
  },
  ui: {
    mutedStroke: 0x5d6f86,
  },
} as const;

export type VisualReadabilitySemanticRole =
  keyof typeof VISUAL_READABILITY_SEMANTIC_COLORS;

export type VisualReadabilityPrimaryRole = "energy" | "trap" | "boss";

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

export function hasSemanticColorContrast(
  leftColor: number,
  rightColor: number,
): boolean {
  return (
    getRgbColorDistance(leftColor, rightColor) >=
    VISUAL_READABILITY_CONTRAST_RULES.minPrimaryColorDistance
  );
}

export function hasPrimaryRoleColorContrast(
  leftRole: VisualReadabilityPrimaryRole,
  rightRole: VisualReadabilityPrimaryRole,
): boolean {
  return hasSemanticColorContrast(
    VISUAL_READABILITY_SEMANTIC_COLORS[leftRole].primary,
    VISUAL_READABILITY_SEMANTIC_COLORS[rightRole].primary,
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
