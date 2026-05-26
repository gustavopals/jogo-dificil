import type { DeathCause } from "./game-events";
import type { HazardDefinition, RectLike } from "../../shared";
import { GAMEPLAY_SPRITE_KEYS, type GameplaySpriteKey } from "../../data/art";

export type TouchedHazard = {
  readonly hazard: HazardDefinition;
  readonly cause: DeathCause;
};

const HAZARD_PLACEHOLDER_COLORS = {
  spikes: 0xe35d6a,
  fall: 0xe35d6a,
  projectile: 0x9b5de5,
  crusher: 0xe76f51,
} as const satisfies Record<HazardDefinition["kind"], number>;

export function findTouchedDeadlyHazard(
  playerHitbox: RectLike,
  hazards: readonly HazardDefinition[],
): TouchedHazard | undefined {
  const hazard = hazards.find(
    (candidate) =>
      candidate.isInstantDeath && rectsOverlap(playerHitbox, candidate.area),
  );

  if (!hazard) {
    return undefined;
  }

  return {
    hazard,
    cause: getDeathCauseForHazard(hazard),
  };
}

export function getDeathCauseForHazard(
  hazard: Pick<HazardDefinition, "kind">,
): DeathCause {
  return hazard.kind === "fall" ? "fall" : "hazard";
}

export function getHazardPlaceholderColor(
  hazard: Pick<HazardDefinition, "kind">,
): number {
  return HAZARD_PLACEHOLDER_COLORS[hazard.kind];
}

export function getHazardPlaceholderTextureKey(): GameplaySpriteKey {
  return GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES;
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
