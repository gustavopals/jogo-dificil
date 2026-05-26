import type {
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
