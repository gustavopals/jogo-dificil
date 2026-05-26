import { describe, expect, it } from "vitest";

import { LEVEL_03 } from "../src/data/levels";
import { isTouchingExit } from "../src/game/systems/level-progress";

const TILE_SIZE_PX = 16;
const FLOOR_Y = 222;

describe("level 03 content", () => {
  it("defines point A, pre-cruel checkpoint and final point B in order", () => {
    const checkpoint = LEVEL_03.checkpoints[0]!;

    expect(LEVEL_03.spawn).toEqual({
      x: TILE_SIZE_PX * 4,
      y: FLOOR_Y,
    });
    expect(checkpoint.id).toBe("level-03-before-cruel");
    expect(checkpoint.position.x).toBeGreaterThan(LEVEL_03.spawn.x);
    expect(LEVEL_03.exit.area.x).toBeGreaterThan(checkpoint.position.x);
    expect("nextLevelId" in LEVEL_03.exit).toBe(false);
  });

  it("creates a short precise jump sequence before the checkpoint", () => {
    const precisionPlatforms = [
      "level-03-platform-precision-01",
      "level-03-platform-precision-02",
      "level-03-platform-precision-03",
    ].map((id) => LEVEL_03.terrain.find((terrain) => terrain.id === id)!);
    const checkpoint = LEVEL_03.checkpoints[0]!;

    expect(precisionPlatforms.map((platform) => platform.area.width)).toEqual([
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 3,
      TILE_SIZE_PX * 3,
    ]);
    precisionPlatforms.forEach((platform, index) => {
      expect(platform.area.x).toBeGreaterThan(LEVEL_03.spawn.x);
      expect(platform.area.x).toBeLessThan(checkpoint.position.x);

      if (index > 0) {
        expect(platform.area.x).toBeGreaterThan(
          precisionPlatforms[index - 1]!.area.x,
        );
      }
    });
  });

  it("uses a breakable platform as the risky optional reward route", () => {
    const breakablePlatform = LEVEL_03.traps.find(
      (trap) => trap.id === "level-03-breakable-platform",
    )!;
    const matchingTerrain = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-platform-precision-02",
    )!;
    const token = LEVEL_03.items.find(
      (item) => item.id === "level-03-risk-token",
    )!;

    expect(breakablePlatform.kind).toBe("breakable-floor");
    expect(breakablePlatform.area).toEqual(matchingTerrain.area);
    expect(breakablePlatform.resetOnRespawn).toBe(true);
    expect(token.kind).toBe("optional");
    expect(token.persistsAfterDeath).toBe(true);
    expect(token.hitbox.x).toBeGreaterThanOrEqual(matchingTerrain.area.x);
    expect(token.hitbox.x + token.hitbox.width).toBeLessThanOrEqual(
      matchingTerrain.area.x + matchingTerrain.area.width,
    );
    expect(token.hitbox.y + token.hitbox.height).toBeLessThan(
      matchingTerrain.area.y,
    );
  });

  it("places the checkpoint before the cruel exit memory test", () => {
    const checkpoint = LEVEL_03.checkpoints[0]!;
    const falseFloor = LEVEL_03.traps.find(
      (trap) => trap.id === "level-03-false-floor",
    )!;
    const exitPlatform = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-exit-platform",
    )!;

    expect(falseFloor.kind).toBe("false-block");
    expect(falseFloor.resetOnRespawn).toBe(true);
    expect(falseFloor.area?.x).toBeGreaterThan(checkpoint.position.x);
    expect(falseFloor.trigger.area.x).toBeLessThan(LEVEL_03.exit.area.x);
    expect(falseFloor.area?.y).toBe(exitPlatform.area.y);
    expect(falseFloor.area?.x).toBeGreaterThan(exitPlatform.area.x);
    expect(falseFloor.area!.x + falseFloor.area!.width).toBeLessThan(
      exitPlatform.area.x + exitPlatform.area.width,
    );
  });

  it("keeps fall hazards under both punishment sections", () => {
    expect(
      LEVEL_03.hazards
        .filter((hazard) => hazard.kind === "fall")
        .map((hazard) => hazard.id),
    ).toEqual(["level-03-fall-sequence", "level-03-fall-cruel-exit"]);
  });

  it("declares minimal sound hooks for reward and exit trick feedback", () => {
    expect(LEVEL_03.audio.sounds.map((sound) => sound.id)).toEqual([
      "level-03-token-sfx",
      "level-03-false-floor-sfx",
    ]);
    expect(LEVEL_03.assets.audio).toEqual([
      "sfx-level-03-token",
      "sfx-level-03-false-floor",
    ]);
  });

  it("has an exit contact area that can complete the phase", () => {
    expect(isTouchingExit(LEVEL_03.exit.area, LEVEL_03)).toBe(true);

    const exitPlatform = LEVEL_03.terrain.find(
      (terrain) => terrain.id === "level-03-exit-platform",
    )!;

    expect(LEVEL_03.exit.area.x).toBeGreaterThanOrEqual(exitPlatform.area.x);
    expect(LEVEL_03.exit.area.x + LEVEL_03.exit.area.width).toBeLessThanOrEqual(
      exitPlatform.area.x + exitPlatform.area.width,
    );
    expect(LEVEL_03.exit.area.y + LEVEL_03.exit.area.height).toBe(
      exitPlatform.area.y,
    );
  });
});
