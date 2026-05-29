import { describe, expect, it } from "vitest";

import { LEVEL_01 } from "../src/data/levels";
import { isTouchingExit } from "../src/game/systems/level-progress";

const TILE_SIZE_PX = 16;

describe("level 01 content", () => {
  it("defines the start, midpoint checkpoint and finish in campaign order", () => {
    const checkpoint = LEVEL_01.checkpoints[0]!;

    expect(LEVEL_01.spawn).toEqual({
      x: TILE_SIZE_PX * 4,
      y: 222,
    });
    expect(checkpoint.position.x).toBeGreaterThan(LEVEL_01.spawn.x);
    expect(LEVEL_01.exit.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(LEVEL_01.exit.nextLevelId).toBe("level-02");
  });

  it("teaches walking and jumping with small floor gaps", () => {
    const floorIds = LEVEL_01.terrain
      .filter((terrain) => terrain.id.includes("floor"))
      .map((terrain) => terrain.id);
    const fallHazards = LEVEL_01.hazards.filter(
      (hazard) => hazard.kind === "fall",
    );

    expect(floorIds).toEqual([
      "l01-floor-1",
      "l01-floor-2a",
      "l01-floor-2b",
      "l01-floor-3",
      "l01-floor-4a",
      "l01-floor-5",
    ]);
    expect(fallHazards).toHaveLength(4);
    fallHazards.forEach((hazard) => {
      expect(hazard.area.width).toBeLessThanOrEqual(TILE_SIZE_PX * 3);
    });
  });

  it("places the first surprise before the checkpoint", () => {
    const checkpoint = LEVEL_01.checkpoints[0]!;
    const spikePop = LEVEL_01.traps.find(
      (candidate) => candidate.kind === "spike-pop",
    )!;

    // Surpresa é DEPOIS do checkpoint — jogador se sente confortável e toma susto
    expect(spikePop.trigger.area.x).toBeGreaterThan(LEVEL_01.spawn.x);
    expect(spikePop.trigger.area.x).toBeGreaterThan(checkpoint.position.x);
    expect(spikePop.resetOnRespawn).toBe(true);
  });

  it("declares minimal sound hooks for the playable level", () => {
    expect(LEVEL_01.audio.sounds.map((sound) => sound.id)).toEqual([
      "level-01-checkpoint-sfx",
      "level-01-trap-pop-sfx",
    ]);
    expect(LEVEL_01.assets.audio).toEqual([
      "sfx-level-01-checkpoint",
      "sfx-level-01-trap-pop",
    ]);
  });

  it("has an exit contact area that can complete the phase", () => {
    expect(isTouchingExit(LEVEL_01.exit.area, LEVEL_01)).toBe(true);

    const finishFloor = LEVEL_01.terrain.find(
      (terrain) => terrain.id === "l01-floor-5",
    )!;

    expect(LEVEL_01.exit.area.x).toBeGreaterThanOrEqual(finishFloor.area.x);
    expect(LEVEL_01.exit.area.x + LEVEL_01.exit.area.width).toBeLessThanOrEqual(
      finishFloor.area.x + finishFloor.area.width,
    );
  });
});
