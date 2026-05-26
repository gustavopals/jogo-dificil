import type { DeathCause } from "./game-events";
import type { HazardDefinition, RectLike } from "../../shared";

export type TouchedHazard = {
  readonly hazard: HazardDefinition;
  readonly cause: DeathCause;
};

const HAZARD_PLACEHOLDER_COLORS = {
  spikes: 0xe76f51,
  fall: 0x8b2635,
  projectile: 0xf4d35e,
  crusher: 0x9b5de5,
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

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
