import { describe, expect, it } from "vitest";

import {
  defineLevel,
  LEVEL_02,
  LEVEL_03,
  type LevelDefinition,
} from "../src/data/levels";
import {
  collectRoomItem,
  createInitialRoomState,
  markTrapTriggered,
  resetRoomStateForRespawn,
  setInteractiveObjectActive,
  setMovingPlatformFalling,
  spawnRoomProjectile,
} from "../src/game/systems/room-state";

const LEVEL_WITH_REQUIRED_ITEM = defineLevel({
  ...LEVEL_03,
  items: [
    ...LEVEL_03.items,
    {
      id: "test-required-key",
      kind: "required",
      position: {
        x: 80,
        y: 176,
      },
      hitbox: {
        x: 72,
        y: 168,
        width: 16,
        height: 16,
      },
      persistsAfterDeath: false,
      assetId: "sprite-required-key",
    },
  ],
  assets: {
    ...LEVEL_03.assets,
    sprites: [...LEVEL_03.assets.sprites, "sprite-required-key"],
  },
} satisfies LevelDefinition);

describe("room state", () => {
  it("resets traps, projectiles, falling platforms and interactive objects", () => {
    const initialState = createInitialRoomState(LEVEL_02);
    const changedState = setInteractiveObjectActive(
      spawnRoomProjectile(
        setMovingPlatformFalling(
          markTrapTriggered(initialState, "level-02-falling-platform"),
          "level-02-falling-platform",
        ),
        {
          id: "test-projectile",
          sourceId: "level-02-falling-platform",
          position: {
            x: 120,
            y: 160,
          },
          velocity: {
            x: 80,
            y: 0,
          },
        },
      ),
      "level-02-lever-exit",
      true,
    );

    const resetState = resetRoomStateForRespawn(changedState, LEVEL_02);

    expect(resetState.traps["level-02-falling-platform"]).toMatchObject({
      isTriggered: false,
      isResolved: false,
    });
    expect(resetState.projectiles).toEqual([]);
    expect(
      resetState.movingPlatforms["level-02-falling-platform"],
    ).toMatchObject({
      area: LEVEL_02.traps[0]!.area,
      isFalling: false,
      isDisabled: false,
    });
    expect(resetState.interactiveObjects["level-02-lever-exit"]).toMatchObject({
      isActive: false,
    });
  });

  it("restores required items and preserves collected optional items that persist", () => {
    const initialState = createInitialRoomState(LEVEL_WITH_REQUIRED_ITEM);
    const changedState = collectRoomItem(
      collectRoomItem(initialState, "level-03-risk-token"),
      "test-required-key",
    );

    const resetState = resetRoomStateForRespawn(
      changedState,
      LEVEL_WITH_REQUIRED_ITEM,
    );

    expect(resetState.items["level-03-risk-token"]).toMatchObject({
      isCollected: true,
      isAvailable: false,
    });
    expect(resetState.items["test-required-key"]).toMatchObject({
      isCollected: false,
      isAvailable: true,
    });
  });
});
