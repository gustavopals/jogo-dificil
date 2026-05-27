import type {
  EnergyTargetDefinition,
  EnergyTargetKind,
  LevelDefinition,
  RectLike,
} from "../../shared";
import type {
  CyanBurstBeamCollisionTarget,
  CyanSparkProjectileCollisionTarget,
} from "../physics";
import type { EnergyTargetRuntimeState, RoomRuntimeState } from "./room-state";

export type EnergyTargetVisualFeedback = {
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly strokeColor: number;
  readonly strokeAlpha: number;
};

export type EnergyTargetFeedback = {
  readonly visual: EnergyTargetVisualFeedback;
};

const ENERGY_TARGET_COLORS = {
  "energy-switch": 0x80d7c2,
  "energy-cracked-block": 0x5d6f86,
  "energy-relay": 0x9b5de5,
  "energy-absorber": 0xe35d6a,
  "energy-core": 0xf4d35e,
  "boss-hurtbox": 0xe76f51,
} as const satisfies Record<EnergyTargetKind, number>;

export function getLevelEnergyTargets(
  level: Pick<LevelDefinition, "energyTargets">,
): readonly EnergyTargetDefinition[] {
  return level.energyTargets ?? [];
}

export function getEnergyTargetSolidAreas(
  targets: readonly EnergyTargetDefinition[],
  roomState: RoomRuntimeState,
): readonly RectLike[] {
  return targets.flatMap((target) => {
    const state = roomState.energyTargets[target.id];

    if (
      !state ||
      state.isBroken ||
      !isEnergyCrackedBlockMovementBlocker(target)
    ) {
      return [];
    }

    return [{ ...target.area }];
  });
}

export function getCyanBurstBeamCollisionTargets(
  targets: readonly EnergyTargetDefinition[],
  roomState: RoomRuntimeState,
): readonly CyanBurstBeamCollisionTarget[] {
  return targets.flatMap((target) => {
    const state = roomState.energyTargets[target.id];

    if (!state || state.isBroken || isInactiveResolvedTarget(state)) {
      return [];
    }

    if (!target.acceptedPowers.includes("cyan-burst")) {
      return [];
    }

    return [
      {
        id: target.id,
        kind: getCyanBurstTargetKind(target.kind),
        area: { ...target.area },
        ...(target.hitGroupId ? { hitGroupId: target.hitGroupId } : {}),
      },
    ];
  });
}

export function getCyanSparkCollisionTargets(
  targets: readonly EnergyTargetDefinition[],
  roomState: RoomRuntimeState,
): readonly CyanSparkProjectileCollisionTarget[] {
  return targets.flatMap((target) => {
    const state = roomState.energyTargets[target.id];

    if (
      !state ||
      state.isBroken ||
      isInactiveResolvedTarget(state) ||
      !target.acceptedPowers.includes("cyan-spark")
    ) {
      return [];
    }

    return [
      {
        id: target.id,
        kind: target.kind === "boss-hurtbox" ? "boss" : "target",
        area: { ...target.area },
      },
    ];
  });
}

export function getEnergyTargetFeedback(
  target: EnergyTargetDefinition,
  state: EnergyTargetRuntimeState,
): EnergyTargetFeedback {
  return {
    visual: {
      fillColor: ENERGY_TARGET_COLORS[target.kind],
      fillAlpha: getEnergyTargetFillAlpha(state),
      strokeColor: state.isBroken ? 0xd5dae6 : 0xf5f7fb,
      strokeAlpha: state.isBroken ? 0.18 : 0.68,
    },
  };
}

function getCyanBurstTargetKind(
  kind: EnergyTargetKind,
): CyanBurstBeamCollisionTarget["kind"] {
  if (kind === "energy-cracked-block") {
    return "cracked-block";
  }

  if (kind === "boss-hurtbox") {
    return "boss";
  }

  return "target";
}

function isInactiveResolvedTarget(state: EnergyTargetRuntimeState): boolean {
  return state.kind !== "boss-hurtbox" && state.isActive;
}

function isEnergyCrackedBlockMovementBlocker(
  target: EnergyTargetDefinition,
): boolean {
  return (
    target.kind === "energy-cracked-block" && target.blocksMovement !== false
  );
}

function getEnergyTargetFillAlpha(state: EnergyTargetRuntimeState): number {
  if (state.isBroken) {
    return 0.1;
  }

  if (state.isActive) {
    return 0.76;
  }

  const hitPointRatio =
    state.hitPoints > 0 ? state.hitPointsRemaining / state.hitPoints : 0;

  return 0.42 + hitPointRatio * 0.34;
}
