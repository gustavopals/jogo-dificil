import { describe, expect, it } from "vitest";

import { GAMEPLAY_SPRITE_KEYS } from "../src/data/art";
import { LEVEL_01, LEVEL_02, LEVEL_03 } from "../src/data/levels";
import {
  collectLevelItem,
  findTouchedAvailableItems,
  getItemFeedback,
  getItemTextureKey,
} from "../src/game/systems/level-items";
import {
  createInitialRoomState,
  resetRoomStateForRespawn,
} from "../src/game/systems/room-state";

describe("level items", () => {
  it("finds and collects available optional items with visual feedback", () => {
    const item = LEVEL_03.items.find(
      (candidate) => candidate.kind === "optional",
    )!;
    const state = createInitialRoomState(LEVEL_03);

    expect(
      findTouchedAvailableItems(item.hitbox, LEVEL_03.items, state),
    ).toEqual([
      {
        item,
        state: state.items[item.id],
      },
    ]);

    const collectedState = collectLevelItem(state, item);

    expect(collectedState.items[item.id]).toMatchObject({
      isCollected: true,
      isAvailable: false,
    });
    expect(
      findTouchedAvailableItems(item.hitbox, LEVEL_03.items, collectedState),
    ).toEqual([]);
    expect(
      getItemFeedback(item, collectedState.items[item.id]!).visual.fillAlpha,
    ).toBeLessThan(
      getItemFeedback(item, state.items[item.id]!).visual.fillAlpha,
    );
  });

  it("activates a mechanism target when collecting a key item", () => {
    const key = LEVEL_02.items.find((candidate) => candidate.kind === "key")!;
    const state = collectLevelItem(createInitialRoomState(LEVEL_02), key);
    const recollectedState = collectLevelItem(state, key);

    expect(state.items[key.id]).toMatchObject({
      isCollected: true,
      isAvailable: false,
    });
    expect(state.interactiveObjects["level-02-key-mechanism"]).toMatchObject({
      isActive: true,
    });
    expect(state.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: false,
    });
    expect(recollectedState).toBe(state);
  });

  it("preserves optional persistent items and restores required items on respawn", () => {
    const optionalItem = LEVEL_03.items.find(
      (candidate) => candidate.kind === "optional",
    )!;
    const requiredItem = LEVEL_01.items.find(
      (candidate) => candidate.kind === "required",
    )!;

    const resetOptionalState = resetRoomStateForRespawn(
      collectLevelItem(createInitialRoomState(LEVEL_03), optionalItem),
      LEVEL_03,
    );
    const resetRequiredState = resetRoomStateForRespawn(
      collectLevelItem(createInitialRoomState(LEVEL_01), requiredItem),
      LEVEL_01,
    );

    expect(resetOptionalState.items[optionalItem.id]).toMatchObject({
      isCollected: true,
      isAvailable: false,
    });
    expect(resetRequiredState.items[requiredItem.id]).toMatchObject({
      isCollected: false,
      isAvailable: true,
    });
  });

  it("maps current item kinds to readable sprite art", () => {
    const requiredItem = LEVEL_01.items.find(
      (candidate) => candidate.kind === "required",
    )!;
    const keyItem = LEVEL_02.items.find(
      (candidate) => candidate.kind === "key",
    )!;
    const optionalItem = LEVEL_03.items.find(
      (candidate) => candidate.kind === "optional",
    )!;

    expect(getItemTextureKey(requiredItem)).toBe(
      GAMEPLAY_SPRITE_KEYS.ITEM_REQUIRED_CHIP,
    );
    expect(getItemTextureKey(keyItem)).toBe(
      GAMEPLAY_SPRITE_KEYS.ITEM_MECHANISM_KEY,
    );
    expect(getItemTextureKey(optionalItem)).toBe(
      GAMEPLAY_SPRITE_KEYS.ITEM_OPTIONAL_TOKEN,
    );
  });
});
