import { describe, expect, it } from "vitest";

import { LEVEL_01, LEVEL_02, LEVEL_03 } from "../src/data/levels";
import {
  activateMvpTrap,
  findTouchedTrapThreat,
  getProjectileHitbox,
  removeDisabledTrapSolids,
  updateTrapProjectiles,
} from "../src/game/systems/mvp-traps";
import { createInitialRoomState } from "../src/game/systems/room-state";

describe("MVP traps", () => {
  it("activates spike-pop traps as deadly trap threats", () => {
    const trap = LEVEL_01.traps.find(
      (candidate) => candidate.kind === "spike-pop",
    )!;
    const state = activateMvpTrap(createInitialRoomState(LEVEL_01), trap);

    expect(state.traps[trap.id]).toMatchObject({
      isTriggered: true,
      isResolved: true,
    });
    expect(findTouchedTrapThreat(trap.area!, LEVEL_01.traps, state)).toEqual({
      trapId: trap.id,
      cause: "trap",
    });
  });

  it("disables collision for false blocks, breakable floors and falling platforms", () => {
    const falseBlock = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "false-block",
    )!;
    const breakableFloor = LEVEL_03.traps.find(
      (candidate) => candidate.kind === "breakable-floor",
    )!;
    const fallingPlatform = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "falling-platform",
    )!;
    const fullSolid = {
      x: falseBlock.area!.x - 16,
      y: falseBlock.area!.y,
      width: falseBlock.area!.width + 32,
      height: falseBlock.area!.height,
    };

    const falseBlockState = activateMvpTrap(
      createInitialRoomState(LEVEL_03),
      falseBlock,
    );
    const breakableState = activateMvpTrap(
      createInitialRoomState(LEVEL_03),
      breakableFloor,
    );
    const fallingState = activateMvpTrap(
      createInitialRoomState(LEVEL_02),
      fallingPlatform,
    );

    expect(
      removeDisabledTrapSolids([fullSolid], [falseBlock], falseBlockState),
    ).toEqual([
      {
        x: fullSolid.x,
        y: fullSolid.y,
        width: 16,
        height: fullSolid.height,
      },
      {
        x: falseBlock.area!.x + falseBlock.area!.width,
        y: fullSolid.y,
        width: 16,
        height: fullSolid.height,
      },
    ]);
    expect(
      removeDisabledTrapSolids(
        [breakableFloor.area!],
        [breakableFloor],
        breakableState,
      ),
    ).toEqual([]);
    expect(fallingState.movingPlatforms[fallingPlatform.id]).toMatchObject({
      isFalling: true,
      isDisabled: true,
    });
  });

  it("spawns and moves projectile traps that can kill the player", () => {
    const projectileTrap = LEVEL_02.traps.find(
      (candidate) => candidate.kind === "projectile",
    )!;
    const state = activateMvpTrap(
      createInitialRoomState(LEVEL_02),
      projectileTrap,
    );
    const projectile = state.projectiles[0]!;

    expect(projectile).toMatchObject({
      id: "level-02-side-projectile-projectile",
      sourceId: projectileTrap.id,
      velocity: {
        x: -150,
        y: 0,
      },
    });
    expect(
      findTouchedTrapThreat(
        getProjectileHitbox(projectile),
        LEVEL_02.traps,
        state,
      ),
    ).toEqual({
      trapId: projectileTrap.id,
      cause: "trap",
    });

    const movedState = updateTrapProjectiles(state, LEVEL_02, 100);

    expect(movedState.projectiles[0]!.position.x).toBe(
      projectile.position.x - 15,
    );
  });
});
