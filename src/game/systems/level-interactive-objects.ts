import type {
  InteractiveObjectAction,
  InteractiveObjectDefinition,
  RectLike,
} from "../../shared";
import {
  setInteractiveObjectActive,
  type InteractiveObjectRuntimeState,
  type RoomRuntimeState,
} from "./room-state";

export type TriggeredInteractiveObject = {
  readonly object: InteractiveObjectDefinition;
  readonly state: InteractiveObjectRuntimeState;
};

export type InteractiveObjectVisualFeedback = {
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly strokeColor: number;
  readonly strokeAlpha: number;
};

export type InteractiveObjectFeedback = {
  readonly visual: InteractiveObjectVisualFeedback;
};

const DEFAULT_INTERACTION_ACTION: InteractiveObjectAction = "secondary";

const INTERACTIVE_OBJECT_COLORS = {
  door: 0xe76f51,
  button: 0xf4d35e,
  lever: 0x80d7c2,
  mechanism: 0x9b5de5,
} as const satisfies Record<InteractiveObjectDefinition["kind"], number>;

export function findTriggeredInteractiveObjects(
  playerHitbox: RectLike,
  objects: readonly InteractiveObjectDefinition[],
  roomState: RoomRuntimeState,
  action: InteractiveObjectAction,
): readonly TriggeredInteractiveObject[] {
  return objects.flatMap((object) => {
    const state = roomState.interactiveObjects[object.id];

    if (
      !state ||
      state.isActive ||
      object.kind === "door" ||
      getObjectAction(object) !== action ||
      !rectsOverlap(playerHitbox, object.area)
    ) {
      return [];
    }

    return [
      {
        object,
        state,
      },
    ];
  });
}

export function activateInteractiveObject(
  state: RoomRuntimeState,
  object: InteractiveObjectDefinition,
): RoomRuntimeState {
  const activeState = setInteractiveObjectActive(state, object.id, true);

  if (!object.targetObjectId) {
    return activeState;
  }

  return setInteractiveObjectActive(activeState, object.targetObjectId, true);
}

export function getInteractiveObjectSolidAreas(
  objects: readonly InteractiveObjectDefinition[],
  roomState: RoomRuntimeState,
): readonly RectLike[] {
  return objects.flatMap((object) => {
    const state = roomState.interactiveObjects[object.id];

    if (object.kind !== "door" || state?.isActive) {
      return [];
    }

    return [object.area];
  });
}

export function getInteractiveObjectFeedback(
  object: InteractiveObjectDefinition,
  state: InteractiveObjectRuntimeState,
): InteractiveObjectFeedback {
  return {
    visual: {
      fillColor: INTERACTIVE_OBJECT_COLORS[object.kind],
      fillAlpha: getObjectFillAlpha(object, state),
      strokeColor: state.isActive ? 0xd5dae6 : 0x050608,
      strokeAlpha: state.isActive ? 0.35 : 0.9,
    },
  };
}

function getObjectAction(
  object: InteractiveObjectDefinition,
): InteractiveObjectAction {
  return object.action ?? DEFAULT_INTERACTION_ACTION;
}

function getObjectFillAlpha(
  object: InteractiveObjectDefinition,
  state: InteractiveObjectRuntimeState,
): number {
  if (object.kind === "door") {
    return state.isActive ? 0.16 : 0.84;
  }

  return state.isActive ? 0.72 : 0.38;
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
