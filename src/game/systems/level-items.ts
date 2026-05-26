import type { ItemDefinition, RectLike } from "../../shared";
import {
  collectRoomItem,
  setInteractiveObjectActive,
  type ItemRuntimeState,
  type RoomRuntimeState,
} from "./room-state";

export type TouchedItem = {
  readonly item: ItemDefinition;
  readonly state: ItemRuntimeState;
};

export type ItemVisualFeedback = {
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly strokeColor: number;
  readonly strokeAlpha: number;
};

export type ItemFeedback = {
  readonly visual: ItemVisualFeedback;
};

const ITEM_PLACEHOLDER_COLORS = {
  required: 0xf4d35e,
  optional: 0x80d7c2,
  collectible: 0x9b5de5,
  key: 0xe76f51,
} as const satisfies Record<ItemDefinition["kind"], number>;

export function findTouchedAvailableItems(
  playerHitbox: RectLike,
  items: readonly ItemDefinition[],
  roomState: RoomRuntimeState,
): readonly TouchedItem[] {
  return items.flatMap((item) => {
    const state = roomState.items[item.id];

    if (
      !state ||
      state.isCollected ||
      !state.isAvailable ||
      !rectsOverlap(playerHitbox, item.hitbox)
    ) {
      return [];
    }

    return [
      {
        item,
        state,
      },
    ];
  });
}

export function collectLevelItem(
  state: RoomRuntimeState,
  item: ItemDefinition,
): RoomRuntimeState {
  const itemState = state.items[item.id];

  if (!itemState || itemState.isCollected || !itemState.isAvailable) {
    return state;
  }

  const collectedState = collectRoomItem(state, item.id);

  if (!item.activatesObjectId) {
    return collectedState;
  }

  return setInteractiveObjectActive(
    collectedState,
    item.activatesObjectId,
    true,
  );
}

export function getItemFeedback(
  item: ItemDefinition,
  state: ItemRuntimeState,
): ItemFeedback {
  const isCollected = state.isCollected || !state.isAvailable;

  return {
    visual: {
      fillColor: ITEM_PLACEHOLDER_COLORS[item.kind],
      fillAlpha: isCollected ? 0.14 : 0.82,
      strokeColor: isCollected ? 0xd5dae6 : 0x050608,
      strokeAlpha: isCollected ? 0.22 : 0.85,
    },
  };
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
