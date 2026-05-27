import type {
  EnergyTargetDefinition,
  EnergyTargetId,
  EnergyTargetKind,
  HazardId,
  InteractiveObjectId,
  InteractiveObjectKind,
  ItemId,
  ItemKind,
  LevelDefinition,
  RectLike,
  TrapId,
  TrapKind,
  Vector2Like,
} from "../../shared";

export type ProjectileSourceId = TrapId | HazardId | InteractiveObjectId;

export type TrapRuntimeState = {
  readonly id: TrapId;
  readonly kind: TrapKind;
  readonly isTriggered: boolean;
  readonly isResolved: boolean;
  readonly resetOnRespawn: boolean;
};

export type ProjectileRuntimeState = {
  readonly id: string;
  readonly sourceId: ProjectileSourceId;
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
};

export type MovingPlatformRuntimeState = {
  readonly id: TrapId;
  readonly area: RectLike;
  readonly isFalling: boolean;
  readonly isDisabled: boolean;
  readonly resetOnRespawn: boolean;
};

export type ItemRuntimeState = {
  readonly id: ItemId;
  readonly kind: ItemKind;
  readonly isCollected: boolean;
  readonly isAvailable: boolean;
  readonly persistsAfterDeath: boolean;
};

export type InteractiveObjectRuntimeState = {
  readonly id: InteractiveObjectId;
  readonly kind: InteractiveObjectKind;
  readonly isActive: boolean;
  readonly resetOnRespawn: boolean;
};

export type EnergyTargetRuntimeState = {
  readonly id: EnergyTargetId;
  readonly kind: EnergyTargetKind;
  readonly hitPoints: number;
  readonly hitPointsRemaining: number;
  readonly activationRemainingMs: number;
  readonly relayWindowRemainingMs: number;
  readonly absorbedEnergyHits: number;
  readonly isActive: boolean;
  readonly isBroken: boolean;
  readonly resetOnRespawn: boolean;
};

export type RoomRuntimeState = {
  readonly traps: Readonly<Record<TrapId, TrapRuntimeState>>;
  readonly projectiles: readonly ProjectileRuntimeState[];
  readonly movingPlatforms: Readonly<
    Record<TrapId, MovingPlatformRuntimeState>
  >;
  readonly items: Readonly<Record<ItemId, ItemRuntimeState>>;
  readonly interactiveObjects: Readonly<
    Record<InteractiveObjectId, InteractiveObjectRuntimeState>
  >;
  readonly energyTargets: Readonly<
    Record<EnergyTargetId, EnergyTargetRuntimeState>
  >;
};

export function createInitialRoomState(
  level: LevelDefinition,
): RoomRuntimeState {
  return {
    traps: Object.fromEntries(
      level.traps.map((trap) => [trap.id, createInitialTrapState(trap)]),
    ),
    projectiles: [],
    movingPlatforms: Object.fromEntries(
      level.traps.flatMap((trap) => {
        if (trap.kind !== "falling-platform" || !trap.area) {
          return [];
        }

        return [
          [
            trap.id,
            createInitialMovingPlatformState({
              id: trap.id,
              area: trap.area,
              resetOnRespawn: trap.resetOnRespawn,
            }),
          ],
        ];
      }),
    ),
    items: Object.fromEntries(
      level.items.map((item) => [item.id, createInitialItemState(item)]),
    ),
    interactiveObjects: Object.fromEntries(
      level.interactiveObjects.map((interactiveObject) => [
        interactiveObject.id,
        createInitialInteractiveObjectState(interactiveObject),
      ]),
    ),
    energyTargets: Object.fromEntries(
      (level.energyTargets ?? []).map((energyTarget) => [
        energyTarget.id,
        createInitialEnergyTargetState(energyTarget),
      ]),
    ),
  };
}

export function resetRoomStateForRespawn(
  state: RoomRuntimeState,
  level: LevelDefinition,
): RoomRuntimeState {
  const initialState = createInitialRoomState(level);

  return {
    traps: resetTrapStates(state, initialState),
    projectiles: [],
    movingPlatforms: resetMovingPlatformStates(state, initialState),
    items: resetItemStates(state, initialState),
    interactiveObjects: resetInteractiveObjectStates(state, initialState),
    energyTargets: resetEnergyTargetStates(state, initialState),
  };
}

export function markTrapTriggered(
  state: RoomRuntimeState,
  trapId: TrapId,
): RoomRuntimeState {
  const trapState = state.traps[trapId];

  if (!trapState) {
    return state;
  }

  return {
    ...state,
    traps: {
      ...state.traps,
      [trapId]: {
        ...trapState,
        isTriggered: true,
      },
    },
  };
}

export function markTrapResolved(
  state: RoomRuntimeState,
  trapId: TrapId,
): RoomRuntimeState {
  const trapState = state.traps[trapId];

  if (!trapState) {
    return state;
  }

  return {
    ...state,
    traps: {
      ...state.traps,
      [trapId]: {
        ...trapState,
        isResolved: true,
      },
    },
  };
}

export function setMovingPlatformFalling(
  state: RoomRuntimeState,
  platformId: TrapId,
): RoomRuntimeState {
  const platformState = state.movingPlatforms[platformId];

  if (!platformState) {
    return state;
  }

  return {
    ...state,
    movingPlatforms: {
      ...state.movingPlatforms,
      [platformId]: {
        ...platformState,
        isFalling: true,
        isDisabled: true,
      },
    },
  };
}

export function spawnRoomProjectile(
  state: RoomRuntimeState,
  projectile: ProjectileRuntimeState,
): RoomRuntimeState {
  return {
    ...state,
    projectiles: [...state.projectiles, projectile],
  };
}

export function collectRoomItem(
  state: RoomRuntimeState,
  itemId: ItemId,
): RoomRuntimeState {
  const itemState = state.items[itemId];

  if (!itemState) {
    return state;
  }

  return {
    ...state,
    items: {
      ...state.items,
      [itemId]: {
        ...itemState,
        isCollected: true,
        isAvailable: false,
      },
    },
  };
}

export function setInteractiveObjectActive(
  state: RoomRuntimeState,
  objectId: InteractiveObjectId,
  isActive: boolean,
): RoomRuntimeState {
  const objectState = state.interactiveObjects[objectId];

  if (!objectState) {
    return state;
  }

  return {
    ...state,
    interactiveObjects: {
      ...state.interactiveObjects,
      [objectId]: {
        ...objectState,
        isActive,
      },
    },
  };
}

export function activateEnergySwitch(
  state: RoomRuntimeState,
  energyTarget: EnergyTargetDefinition,
): RoomRuntimeState {
  if (energyTarget.kind !== "energy-switch") {
    return state;
  }

  const targetState = state.energyTargets[energyTarget.id];

  if (!targetState || targetState.isBroken) {
    return state;
  }

  const activeState = {
    ...state,
    energyTargets: {
      ...state.energyTargets,
      [energyTarget.id]: {
        ...targetState,
        hitPointsRemaining: 0,
        isActive: true,
      },
    },
  };

  if (!energyTarget.activatesObjectId) {
    return activeState;
  }

  return setInteractiveObjectActive(
    activeState,
    energyTarget.activatesObjectId,
    true,
  );
}

export function activateEnergyRelay(
  state: RoomRuntimeState,
  energyTarget: EnergyTargetDefinition,
): RoomRuntimeState {
  if (energyTarget.kind !== "energy-relay") {
    return state;
  }

  const targetState = state.energyTargets[energyTarget.id];

  if (!targetState || targetState.isActive || targetState.isBroken) {
    return state;
  }

  const hitPointsRemaining = Math.max(0, targetState.hitPointsRemaining - 1);
  const isActive = hitPointsRemaining <= 0;
  const activeState = {
    ...state,
    energyTargets: {
      ...state.energyTargets,
      [energyTarget.id]: {
        ...targetState,
        hitPointsRemaining,
        relayWindowRemainingMs: isActive
          ? 0
          : (energyTarget.relayWindowMs ?? 0),
        isActive,
      },
    },
  };

  if (!isActive || !energyTarget.activatesObjectId) {
    return activeState;
  }

  return setInteractiveObjectActive(
    activeState,
    energyTarget.activatesObjectId,
    true,
  );
}

export function absorbEnergyTarget(
  state: RoomRuntimeState,
  energyTarget: EnergyTargetDefinition,
): RoomRuntimeState {
  if (
    energyTarget.kind !== "energy-absorber" ||
    energyTarget.absorbsEnergy !== true
  ) {
    return state;
  }

  const targetState = state.energyTargets[energyTarget.id];

  if (!targetState || targetState.isBroken) {
    return state;
  }

  return {
    ...state,
    energyTargets: {
      ...state.energyTargets,
      [energyTarget.id]: {
        ...targetState,
        absorbedEnergyHits: targetState.absorbedEnergyHits + 1,
      },
    },
  };
}

export function activateEnergyCore(
  state: RoomRuntimeState,
  energyTarget: EnergyTargetDefinition,
  damage: number,
): RoomRuntimeState {
  if (energyTarget.kind !== "energy-core") {
    return state;
  }

  const targetState = state.energyTargets[energyTarget.id];
  const appliedDamage = Math.max(0, Math.floor(damage));

  if (
    !targetState ||
    appliedDamage <= 0 ||
    targetState.isActive ||
    targetState.isBroken ||
    targetState.hitPointsRemaining <= 0
  ) {
    return state;
  }

  const hitPointsRemaining = Math.max(
    0,
    targetState.hitPointsRemaining - appliedDamage,
  );
  const isActive = hitPointsRemaining <= 0;
  const activeState = {
    ...state,
    energyTargets: {
      ...state.energyTargets,
      [energyTarget.id]: {
        ...targetState,
        hitPointsRemaining,
        activationRemainingMs: isActive
          ? (energyTarget.activationDurationMs ?? 0)
          : targetState.activationRemainingMs,
        isActive,
      },
    },
  };

  if (!isActive || !energyTarget.activatesObjectId) {
    return activeState;
  }

  return setInteractiveObjectActive(
    activeState,
    energyTarget.activatesObjectId,
    true,
  );
}

export function updateRoomEnergyTargets(
  state: RoomRuntimeState,
  level: Pick<LevelDefinition, "energyTargets">,
  deltaMs: number,
): RoomRuntimeState {
  const energyTargets = level.energyTargets ?? [];

  if (energyTargets.length === 0) {
    return state;
  }

  let didChange = false;
  const nextEnergyTargets = { ...state.energyTargets };
  let nextInteractiveObjects = state.interactiveObjects;

  energyTargets.forEach((energyTarget) => {
    if (energyTarget.kind === "energy-relay") {
      const targetState = state.energyTargets[energyTarget.id];

      if (
        !targetState ||
        targetState.isActive ||
        targetState.isBroken ||
        targetState.relayWindowRemainingMs <= 0
      ) {
        return;
      }

      const relayWindowRemainingMs = Math.max(
        0,
        targetState.relayWindowRemainingMs - Math.max(0, deltaMs),
      );

      if (relayWindowRemainingMs > 0) {
        didChange = true;
        nextEnergyTargets[energyTarget.id] = {
          ...targetState,
          relayWindowRemainingMs,
        };

        return;
      }

      didChange = true;
      nextEnergyTargets[energyTarget.id] = {
        ...targetState,
        hitPointsRemaining: targetState.hitPoints,
        relayWindowRemainingMs: 0,
      };

      return;
    }

    if (energyTarget.kind !== "energy-core") {
      return;
    }

    const targetState = state.energyTargets[energyTarget.id];

    if (
      !targetState ||
      !targetState.isActive ||
      targetState.isBroken ||
      targetState.activationRemainingMs <= 0
    ) {
      return;
    }

    const activationRemainingMs = Math.max(
      0,
      targetState.activationRemainingMs - Math.max(0, deltaMs),
    );

    if (activationRemainingMs > 0) {
      didChange = true;
      nextEnergyTargets[energyTarget.id] = {
        ...targetState,
        activationRemainingMs,
      };

      return;
    }

    didChange = true;
    nextEnergyTargets[energyTarget.id] = {
      ...targetState,
      hitPointsRemaining: targetState.hitPoints,
      activationRemainingMs: 0,
      isActive: false,
    };

    if (energyTarget.activatesObjectId) {
      nextInteractiveObjects = setInteractiveObjectInRecordActive(
        nextInteractiveObjects,
        energyTarget.activatesObjectId,
        false,
      );
    }
  });

  if (!didChange) {
    return state;
  }

  return {
    ...state,
    energyTargets: nextEnergyTargets,
    interactiveObjects: nextInteractiveObjects,
  };
}

export function damageEnergyTarget(
  state: RoomRuntimeState,
  targetId: EnergyTargetId,
  damage: number,
): RoomRuntimeState {
  const targetState = state.energyTargets[targetId];
  const appliedDamage = Math.max(0, Math.floor(damage));

  if (
    !targetState ||
    appliedDamage <= 0 ||
    targetState.kind === "energy-absorber" ||
    targetState.kind === "energy-core" ||
    targetState.isBroken ||
    targetState.hitPointsRemaining <= 0
  ) {
    return state;
  }

  const hitPointsRemaining = Math.max(
    0,
    targetState.hitPointsRemaining - appliedDamage,
  );
  const isDepleted = hitPointsRemaining <= 0;
  const isBreakableBlock = targetState.kind === "energy-cracked-block";
  const isBossHurtbox = targetState.kind === "boss-hurtbox";

  return {
    ...state,
    energyTargets: {
      ...state.energyTargets,
      [targetId]: {
        ...targetState,
        hitPointsRemaining,
        isActive:
          targetState.isActive ||
          (isDepleted && !isBossHurtbox && !isBreakableBlock),
        isBroken:
          targetState.isBroken ||
          (isDepleted && (isBreakableBlock || isBossHurtbox)),
      },
    },
  };
}

function setInteractiveObjectInRecordActive(
  interactiveObjects: RoomRuntimeState["interactiveObjects"],
  objectId: InteractiveObjectId,
  isActive: boolean,
): RoomRuntimeState["interactiveObjects"] {
  const objectState = interactiveObjects[objectId];

  if (!objectState || objectState.isActive === isActive) {
    return interactiveObjects;
  }

  return {
    ...interactiveObjects,
    [objectId]: {
      ...objectState,
      isActive,
    },
  };
}

function createInitialTrapState(
  trap: LevelDefinition["traps"][number],
): TrapRuntimeState {
  return {
    id: trap.id,
    kind: trap.kind,
    isTriggered: false,
    isResolved: false,
    resetOnRespawn: trap.resetOnRespawn,
  };
}

function createInitialMovingPlatformState(input: {
  readonly id: TrapId;
  readonly area: RectLike;
  readonly resetOnRespawn: boolean;
}): MovingPlatformRuntimeState {
  return {
    id: input.id,
    area: input.area,
    isFalling: false,
    isDisabled: false,
    resetOnRespawn: input.resetOnRespawn,
  };
}

function createInitialItemState(
  item: LevelDefinition["items"][number],
): ItemRuntimeState {
  return {
    id: item.id,
    kind: item.kind,
    isCollected: false,
    isAvailable: true,
    persistsAfterDeath: item.persistsAfterDeath,
  };
}

function createInitialInteractiveObjectState(
  interactiveObject: LevelDefinition["interactiveObjects"][number],
): InteractiveObjectRuntimeState {
  return {
    id: interactiveObject.id,
    kind: interactiveObject.kind,
    isActive: interactiveObject.startsActive,
    resetOnRespawn: interactiveObject.resetOnRespawn,
  };
}

function createInitialEnergyTargetState(
  energyTarget: EnergyTargetDefinition,
): EnergyTargetRuntimeState {
  const hitPoints = Math.max(1, Math.floor(energyTarget.hitPoints));
  const isBroken = energyTarget.startsBroken ?? false;

  return {
    id: energyTarget.id,
    kind: energyTarget.kind,
    hitPoints,
    hitPointsRemaining: isBroken ? 0 : hitPoints,
    activationRemainingMs: 0,
    relayWindowRemainingMs: 0,
    absorbedEnergyHits: 0,
    isActive: energyTarget.startsActive ?? false,
    isBroken,
    resetOnRespawn: energyTarget.resetOnRespawn,
  };
}

function resetTrapStates(
  state: RoomRuntimeState,
  initialState: RoomRuntimeState,
): RoomRuntimeState["traps"] {
  return Object.fromEntries(
    Object.entries(initialState.traps).map(([trapId, initialTrapState]) => {
      const currentTrapState = state.traps[trapId];

      return [
        trapId,
        currentTrapState?.resetOnRespawn === false
          ? currentTrapState
          : initialTrapState,
      ];
    }),
  );
}

function resetMovingPlatformStates(
  state: RoomRuntimeState,
  initialState: RoomRuntimeState,
): RoomRuntimeState["movingPlatforms"] {
  return Object.fromEntries(
    Object.entries(initialState.movingPlatforms).map(
      ([platformId, initialPlatformState]) => {
        const currentPlatformState = state.movingPlatforms[platformId];

        return [
          platformId,
          currentPlatformState?.resetOnRespawn === false
            ? currentPlatformState
            : initialPlatformState,
        ];
      },
    ),
  );
}

function resetItemStates(
  state: RoomRuntimeState,
  initialState: RoomRuntimeState,
): RoomRuntimeState["items"] {
  return Object.fromEntries(
    Object.entries(initialState.items).map(([itemId, initialItemState]) => {
      const currentItemState = state.items[itemId];

      if (
        currentItemState?.persistsAfterDeath &&
        currentItemState.isCollected
      ) {
        return [itemId, currentItemState];
      }

      return [itemId, initialItemState];
    }),
  );
}

function resetInteractiveObjectStates(
  state: RoomRuntimeState,
  initialState: RoomRuntimeState,
): RoomRuntimeState["interactiveObjects"] {
  return Object.fromEntries(
    Object.entries(initialState.interactiveObjects).map(
      ([objectId, initialObjectState]) => {
        const currentObjectState = state.interactiveObjects[objectId];

        return [
          objectId,
          currentObjectState?.resetOnRespawn === false
            ? currentObjectState
            : initialObjectState,
        ];
      },
    ),
  );
}

function resetEnergyTargetStates(
  state: RoomRuntimeState,
  initialState: RoomRuntimeState,
): RoomRuntimeState["energyTargets"] {
  return Object.fromEntries(
    Object.entries(initialState.energyTargets).map(
      ([targetId, initialTargetState]) => {
        const currentTargetState = state.energyTargets[targetId];

        return [
          targetId,
          currentTargetState?.resetOnRespawn === false
            ? currentTargetState
            : initialTargetState,
        ];
      },
    ),
  );
}
