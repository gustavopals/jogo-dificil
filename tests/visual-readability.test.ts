import { describe, expect, it } from "vitest";

import { PLAYER_EFFECT_DEPTHS } from "../src/game/systems/player-visual-effects";
import {
  DEPTH_LAYERS,
  VISUAL_READABILITY_CONTRAST_RULES,
  VISUAL_READABILITY_DEPTHS,
  VISUAL_READABILITY_LIMITS,
  VISUAL_READABILITY_SEMANTIC_COLORS,
  clampWideEffectAlpha,
  energyEffectsStayBehindHazards,
  getRgbColorDistance,
  hasPrimaryRoleColorContrast,
  hasSemanticColorContrast,
  hazardsStayAbovePlayer,
  isSmallHazardArea,
} from "../src/game/systems/visual-readability";
import { TILE_SIZE_PX } from "../src/game/constants";

describe("visual readability", () => {
  it("keeps direct hazards and trap projectiles above player energy effects", () => {
    expect(VISUAL_READABILITY_DEPTHS.directHazard).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.trapThreat).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.trapProjectile).toBeGreaterThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.bossBody).toBeLessThan(
      PLAYER_EFFECT_DEPTHS.energyShot,
    );
    expect(VISUAL_READABILITY_DEPTHS.bossHealth).toBeLessThan(
      VISUAL_READABILITY_DEPTHS.directHazard,
    );
    expect(VISUAL_READABILITY_DEPTHS.bossHealth).toBeLessThan(
      VISUAL_READABILITY_DEPTHS.trapProjectile,
    );
  });

  it("keeps boss, Pino energy and trap primary colors distinct", () => {
    expect(hasPrimaryRoleColorContrast("energy", "trap")).toBe(true);
    expect(hasPrimaryRoleColorContrast("energy", "boss")).toBe(true);
    expect(hasPrimaryRoleColorContrast("trap", "boss")).toBe(true);

    expect(
      getRgbColorDistance(
        VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
        VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
      ),
    ).toBeGreaterThanOrEqual(
      VISUAL_READABILITY_CONTRAST_RULES.minPrimaryColorDistance,
    );
  });

  it("identifies small hazard areas and clamps wide effect alpha", () => {
    expect(VISUAL_READABILITY_LIMITS.smallHazardMaxSizePx).toBe(TILE_SIZE_PX);
    expect(isSmallHazardArea({ width: 16, height: 8 })).toBe(true);
    expect(isSmallHazardArea({ width: 32, height: 24 })).toBe(true);
    expect(isSmallHazardArea({ width: 48, height: 40 })).toBe(false);
    expect(clampWideEffectAlpha(0.68)).toBe(
      VISUAL_READABILITY_LIMITS.maxWideEffectAlpha,
    );
    expect(clampWideEffectAlpha(-1)).toBe(0);
  });

  it("keeps canonical depth layers ordered for HD readability", () => {
    expect(energyEffectsStayBehindHazards()).toBe(true);
    expect(hazardsStayAbovePlayer()).toBe(true);
    expect(DEPTH_LAYERS.energyEffect).toBeLessThan(DEPTH_LAYERS.hazard);
    expect(DEPTH_LAYERS.player).toBeLessThan(DEPTH_LAYERS.hazard);
    expect(DEPTH_LAYERS.bossBody).toBeLessThan(DEPTH_LAYERS.player);
  });

  it("keeps secondary gameplay colors distinct after HD polish", () => {
    const { energy, trap, boss } = VISUAL_READABILITY_SEMANTIC_COLORS;

    expect(hasSemanticColorContrast(energy.crackedBlock, energy.primary)).toBe(
      true,
    );
    expect(hasSemanticColorContrast(trap.breakableFloor, trap.primary)).toBe(
      true,
    );
    expect(hasSemanticColorContrast(trap.breakableFloor, boss.primary)).toBe(
      true,
    );
    expect(hasSemanticColorContrast(energy.primary, boss.primary)).toBe(true);
    expect(hasSemanticColorContrast(boss.healthFilled, energy.primary)).toBe(
      true,
    );
  });
});
