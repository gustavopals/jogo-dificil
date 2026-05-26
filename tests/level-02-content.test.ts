import { describe, expect, it } from "vitest";

import { LEVEL_02 } from "../src/data/levels";
import { isTouchingExit } from "../src/game/systems/level-progress";
import { AUTO_RESPAWN_DELAY_MS } from "../src/game/systems/player-respawn";

const TILE_SIZE_PX = 16;
const FLOOR_Y = 222;

describe("level 02 content", () => {
  it("defines point A, midpoint checkpoint and point B in campaign order", () => {
    const checkpoint = LEVEL_02.checkpoints[0]!;

    expect(LEVEL_02.spawn).toEqual({
      x: TILE_SIZE_PX * 4,
      y: FLOOR_Y,
    });
    expect(checkpoint.position.x).toBeGreaterThan(LEVEL_02.spawn.x);
    expect(LEVEL_02.exit.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(LEVEL_02.exit.nextLevelId).toBe("level-03");
  });

  it("uses segmented terrain to create two readable timing gaps", () => {
    const terrainIds = LEVEL_02.terrain.map((terrain) => terrain.id);
    const fallHazards = LEVEL_02.hazards.filter(
      (hazard) => hazard.kind === "fall",
    );

    expect(terrainIds).toContain("level-02-floor-start");
    expect(terrainIds).toContain("level-02-floor-mid");
    expect(terrainIds).toContain("level-02-floor-end");
    expect(terrainIds).toContain("level-02-step-timing");
    expect(terrainIds).toContain("level-02-platform-exit");
    expect(fallHazards.map((hazard) => hazard.id)).toEqual([
      "level-02-fall-gap",
      "level-02-fall-exit-gap",
    ]);
    fallHazards.forEach((hazard) => {
      expect(hazard.area.width).toBeLessThanOrEqual(TILE_SIZE_PX * 5);
    });
  });

  it("introduces timing with a falling platform before auto respawn", () => {
    const timingPlatform = LEVEL_02.terrain.find(
      (terrain) => terrain.id === "level-02-step-timing",
    )!;
    const fallingPlatform = LEVEL_02.traps.find(
      (trap) => trap.id === "level-02-falling-platform",
    )!;

    expect(fallingPlatform.kind).toBe("falling-platform");
    expect(fallingPlatform.area).toEqual(timingPlatform.area);
    expect(fallingPlatform.trigger.kind).toBe("touch");
    expect(fallingPlatform.config?.fallDelayMs).toBeLessThan(
      AUTO_RESPAWN_DELAY_MS,
    );
  });

  it("requires the secondary action to open the exit door", () => {
    const door = LEVEL_02.interactiveObjects.find(
      (object) => object.id === "level-02-exit-door",
    )!;
    const lever = LEVEL_02.interactiveObjects.find(
      (object) => object.id === "level-02-lever-exit",
    )!;

    expect(door.kind).toBe("door");
    expect(door.startsActive).toBe(false);
    expect(door.resetOnRespawn).toBe(true);
    expect(lever.kind).toBe("lever");
    expect(lever.action).toBe("secondary");
    expect(lever.targetObjectId).toBe(door.id);
  });

  it("uses the key as a mechanism cue instead of bypassing the door", () => {
    const key = LEVEL_02.items.find(
      (item) => item.id === "level-02-mechanism-key",
    )!;
    const mechanism = LEVEL_02.interactiveObjects.find(
      (object) => object.id === "level-02-key-mechanism",
    )!;

    expect(key.kind).toBe("key");
    expect(key.activatesObjectId).toBe(mechanism.id);
    expect(mechanism.kind).toBe("mechanism");
    expect(mechanism.startsActive).toBe(false);
  });

  it("places a visual exit trick after the midpoint checkpoint", () => {
    const checkpoint = LEVEL_02.checkpoints[0]!;
    const projectile = LEVEL_02.traps.find(
      (trap) => trap.id === "level-02-side-projectile",
    )!;

    expect(projectile.kind).toBe("projectile");
    expect(projectile.trigger.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(projectile.area?.x).toBeLessThan(LEVEL_02.exit.area.x);
    expect(projectile.config?.velocityX).toBeLessThan(0);
  });

  it("declares minimal sound hooks for the interactive and active obstacles", () => {
    expect(LEVEL_02.audio.sounds.map((sound) => sound.id)).toEqual([
      "level-02-lever-sfx",
      "level-02-projectile-sfx",
    ]);
    expect(LEVEL_02.assets.audio).toEqual([
      "sfx-level-02-lever",
      "sfx-level-02-projectile",
    ]);
  });

  it("has an exit contact area that can complete the phase", () => {
    expect(isTouchingExit(LEVEL_02.exit.area, LEVEL_02)).toBe(true);

    const finishFloor = LEVEL_02.terrain.find(
      (terrain) => terrain.id === "level-02-floor-end",
    )!;

    expect(LEVEL_02.exit.area.x).toBeGreaterThanOrEqual(finishFloor.area.x);
    expect(LEVEL_02.exit.area.x + LEVEL_02.exit.area.width).toBeLessThanOrEqual(
      finishFloor.area.x + finishFloor.area.width,
    );
  });
});
