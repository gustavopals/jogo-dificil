import { describe, expect, it } from "vitest";

import { LEVEL_02 } from "../src/data/levels";
import {
  activateInteractiveObject,
  findTriggeredInteractiveObjects,
  getInteractiveObjectFeedback,
  getInteractiveObjectSolidAreas,
} from "../src/game/systems/level-interactive-objects";
import {
  createInitialRoomState,
  resetRoomStateForRespawn,
} from "../src/game/systems/room-state";

describe("level interactive objects", () => {
  it("uses inactive doors as solids and removes them when opened", () => {
    const door = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "door",
    )!;
    const lever = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "lever",
    )!;
    const state = createInitialRoomState(LEVEL_02);

    expect(
      getInteractiveObjectSolidAreas(LEVEL_02.interactiveObjects, state),
    ).toEqual([door.area]);

    const activeState = activateInteractiveObject(state, lever);

    expect(activeState.interactiveObjects[lever.id]).toMatchObject({
      isActive: true,
    });
    expect(activeState.interactiveObjects[door.id]).toMatchObject({
      isActive: true,
    });
    expect(
      getInteractiveObjectSolidAreas(LEVEL_02.interactiveObjects, activeState),
    ).toEqual([]);
  });

  it("finds non-door objects triggered by the configured action", () => {
    const lever = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "lever",
    )!;
    const state = createInitialRoomState(LEVEL_02);

    expect(
      findTriggeredInteractiveObjects(
        lever.area,
        LEVEL_02.interactiveObjects,
        state,
        "secondary",
      ),
    ).toEqual([
      {
        object: lever,
        state: state.interactiveObjects[lever.id],
      },
    ]);
    expect(
      findTriggeredInteractiveObjects(
        lever.area,
        LEVEL_02.interactiveObjects,
        state,
        "primary",
      ),
    ).toEqual([]);
  });

  it("resets active interactive objects that are resettable", () => {
    const lever = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "lever",
    )!;
    const activeState = activateInteractiveObject(
      createInitialRoomState(LEVEL_02),
      lever,
    );

    const resetState = resetRoomStateForRespawn(activeState, LEVEL_02);

    expect(resetState.interactiveObjects[lever.id]).toMatchObject({
      isActive: false,
    });
    expect(resetState.interactiveObjects["level-02-exit-door"]).toMatchObject({
      isActive: false,
    });
  });

  it("updates visual feedback when objects become active", () => {
    const door = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "door",
    )!;
    const lever = LEVEL_02.interactiveObjects.find(
      (candidate) => candidate.kind === "lever",
    )!;
    const state = createInitialRoomState(LEVEL_02);
    const activeState = activateInteractiveObject(state, lever);

    expect(
      getInteractiveObjectFeedback(
        door,
        activeState.interactiveObjects[door.id]!,
      ).visual.fillAlpha,
    ).toBeLessThan(
      getInteractiveObjectFeedback(door, state.interactiveObjects[door.id]!)
        .visual.fillAlpha,
    );
  });
});
