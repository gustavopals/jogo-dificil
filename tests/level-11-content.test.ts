import { describe, expect, it } from "vitest";

import {
  LEVEL_10,
  LEVEL_11,
  migrateLegacyLevelDefinition,
  validateLevel,
} from "../src/data/levels";
import { getLevelDecorations } from "../src/data/levels/level-decorations";
import { getLevelVisualTheme } from "../src/data/levels/level-visual-themes";
import {
  GAME_RESOLUTION,
  getHdCampaignLevel,
  TILE_SIZE_PX,
} from "./helpers/hd-campaign";

describe("level 11 challenge content", () => {
  it("is registered as the post-campaign challenge segment", () => {
    expect(LEVEL_11).toMatchObject({
      id: "level-11",
      order: 11,
      contentKind: "challenge",
      theme: "post-campaign-challenge",
      difficulty: 11,
    });
    expect(LEVEL_10.exit.nextLevelId).toBe("level-11");
    expect("nextLevelId" in LEVEL_11.exit).toBe(false);
  });

  it("combines dash, spike-pop and energy gate in one short HD route", () => {
    expect(LEVEL_11.traps.map((trap) => trap.kind)).toEqual(["spike-pop"]);
    expect(LEVEL_11.energyTargets?.map((target) => target.kind)).toEqual([
      "energy-switch",
    ]);
    expect(LEVEL_11.interactiveObjects.map((object) => object.id)).toEqual([
      "level-11-gate-door",
    ]);
    expect(LEVEL_11.energyTargets?.[0]?.activatesObjectId).toBe(
      "level-11-gate-door",
    );
    expect(LEVEL_11.hazards.filter((hazard) => hazard.kind === "fall")).toHaveLength(
      2,
    );
    expect(LEVEL_11.initialEnergy).toBe(35);
  });

  it("migrates to the official HD baseline without validation issues", () => {
    const migrated = getHdCampaignLevel("level-11");

    expect(migrated.bounds).toEqual({
      x: 0,
      y: 0,
      width: GAME_RESOLUTION.width * 2,
      height: GAME_RESOLUTION.height,
    });
    expect(migrated.bounds.width % TILE_SIZE_PX).toBe(0);
    expect(validateLevel(migrateLegacyLevelDefinition(LEVEL_11))).toEqual({
      isValid: true,
      issues: [],
    });
  });

  it("uses post-campaign challenge scenery along the wide route", () => {
    const decorations = getLevelDecorations("level-11");
    const theme = getLevelVisualTheme("level-11");

    expect(decorations.length).toBeGreaterThanOrEqual(16);
    expect(decorations.map((item) => item.kind)).toEqual(
      expect.arrayContaining(["lantern", "cloud", "flower"]),
    );
    expect(theme.accentColor).toBe(0x4cc9f0);
    expect(theme.mood).toContain("pós-campanha");
  });

  it("keeps the first meaningful challenge close to spawn and checkpoint", () => {
    const dashPit = LEVEL_11.hazards.find(
      (hazard) => hazard.id === "level-11-dash-pit",
    )!;
    const checkpoint = LEVEL_11.checkpoints[0]!;
    const spikePop = LEVEL_11.traps[0]!;

    expect(dashPit.area.x - LEVEL_11.spawn.x).toBeLessThanOrEqual(16 * 14);
    expect(spikePop.trigger.area.x - checkpoint.position.x).toBeLessThanOrEqual(
      16 * 12,
    );
  });
});
