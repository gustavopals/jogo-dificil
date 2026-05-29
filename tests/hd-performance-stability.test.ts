import { describe, expect, it } from "vitest";

import { LEVEL_02 } from "../src/data/levels";
import {
  createCyanSparkProjectile,
  updateCyanSparkProjectiles,
  type CyanSparkProjectileState,
} from "../src/game/physics/energy-projectiles";
import {
  activateMvpTrap,
  updateTrapProjectiles,
} from "../src/game/systems/mvp-traps";
import {
  createInitialRoomState,
  resetRoomStateForRespawn,
  type RoomRuntimeState,
} from "../src/game/systems/room-state";

describe("HD performance and stability contracts", () => {
  it("keeps projectile simulation stable with HD-scaled velocities", () => {
    const projectileTrap = LEVEL_02.traps.find(
      (trap) => trap.kind === "projectile",
    )!;

    expect(Math.abs(projectileTrap.config?.velocityX ?? 0)).toBeGreaterThan(0);

    let state: RoomRuntimeState = createInitialRoomState(LEVEL_02);

    for (let attempt = 0; attempt < 40; attempt += 1) {
      state = activateMvpTrap(state, projectileTrap);
      state = updateTrapProjectiles(state, LEVEL_02, 250);
      state = resetRoomStateForRespawn(state, LEVEL_02);

      expect(state.projectiles).toEqual([]);
      expect(state.traps[projectileTrap.id]).toMatchObject({
        isTriggered: false,
        isResolved: false,
      });
    }
  });

  it("handles many simultaneous cyan spark projectiles without unbounded growth", () => {
    const origin = { x: LEVEL_02.spawn.x, y: LEVEL_02.spawn.y };
    let projectiles: readonly CyanSparkProjectileState[] = Array.from(
      { length: 12 },
      (_, index) =>
        createCyanSparkProjectile({
          id: `qa-spark-${index}`,
          origin,
          facing: index % 2 === 0 ? "right" : "left",
        }),
    );

    for (let tick = 0; tick < 30; tick += 1) {
      const result = updateCyanSparkProjectiles({
        projectiles,
        deltaMs: 16,
      });

      projectiles = result.projectiles;
    }

    expect(projectiles.length).toBeLessThanOrEqual(12);
  });
});
