import { describe, expect, it } from "vitest";

import {
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
  LEVEL_04,
  LEVEL_05,
  LEVEL_06,
  LEVEL_07,
  LEVEL_08,
  LEVEL_09,
  LEVEL_10,
  LEVEL_11,
  migrateLegacyLevelDefinition,
} from "../src/data/levels";
import { PLAYER_SIZE } from "../src/game/constants";
import { isTouchingExit } from "../src/game/systems/level-progress";
import {
  GAME_RESOLUTION,
  getHdCampaignLevel,
  HD_FLOOR_Y,
  LEVEL_DEFINITIONS,
  TILE_SIZE_PX,
  WORLD_PHYSICS_SCALE,
} from "./helpers/hd-campaign";

const LEGACY_LEVELS = [
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
  LEVEL_04,
  LEVEL_05,
  LEVEL_06,
  LEVEL_07,
  LEVEL_08,
  LEVEL_09,
  LEVEL_10,
  LEVEL_11,
] as const;

describe("HD campaign content", () => {
  it("exposes the official runtime scale for QA and tests", () => {
    expect(GAME_RESOLUTION).toEqual({
      width: 960,
      height: 540,
    });
    expect(TILE_SIZE_PX).toBe(32);
    expect(WORLD_PHYSICS_SCALE).toBe(2);
    expect(HD_FLOOR_Y).toBe(444);
    expect(PLAYER_SIZE.hitboxWidth).toBeLessThan(PLAYER_SIZE.visualWidth);
    expect(PLAYER_SIZE.hitboxHeight).toBeLessThan(PLAYER_SIZE.visualHeight);
  });

  it("keeps every campaign level within the HD baseline and tile grid", () => {
    LEVEL_DEFINITIONS.forEach((level) => {
      expect(level.bounds.height, level.id).toBe(GAME_RESOLUTION.height);
      expect(level.bounds.width % TILE_SIZE_PX, level.id).toBe(0);
      expect(level.spawn.x, level.id).toBeGreaterThanOrEqual(0);
      expect(level.spawn.y, level.id).toBeLessThanOrEqual(level.bounds.height);
      expect(level.exit.area.width, level.id).toBeGreaterThan(0);
      expect(level.exit.area.height, level.id).toBeGreaterThan(0);
    });
  });

  it("preserves spawn, exit and checkpoint progression after the 2x migration", () => {
    LEGACY_LEVELS.forEach((legacyLevel) => {
      const migrated = getHdCampaignLevel(legacyLevel.id);

      expect(migrated.spawn).toEqual({
        x: legacyLevel.spawn.x * 2,
        y: legacyLevel.spawn.y * 2,
      });
      expect(migrated.exit.area).toEqual({
        x: legacyLevel.exit.area.x * 2,
        y: legacyLevel.exit.area.y * 2,
        width: legacyLevel.exit.area.width * 2,
        height: legacyLevel.exit.area.height * 2,
      });

      migrated.checkpoints.forEach((checkpoint, index) => {
        const legacyCheckpoint = legacyLevel.checkpoints[index]!;

        expect(checkpoint.position).toEqual({
          x: legacyCheckpoint.position.x * 2,
          y: legacyCheckpoint.position.y * 2,
        });
        expect(checkpoint.area).toEqual({
          x: legacyCheckpoint.area.x * 2,
          y: legacyCheckpoint.area.y * 2,
          width: legacyCheckpoint.area.width * 2,
          height: legacyCheckpoint.area.height * 2,
        });
      });
    });
  });

  it("keeps each level completable with checkpoints before the exit", () => {
    LEVEL_DEFINITIONS.forEach((level) => {
      const lastCheckpoint = level.checkpoints.at(-1)!;

      expect(level.checkpoints.length, level.id).toBeGreaterThan(0);
      expect(lastCheckpoint.position.x, level.id).toBeLessThan(
        level.exit.area.x,
      );
      expect(isTouchingExit(level.exit.area, level), level.id).toBe(true);
    });
  });

  it("keeps boss arenas and weak points inside migrated bounds", () => {
    LEVEL_DEFINITIONS.forEach((level) => {
      (level.bosses ?? []).forEach((boss) => {
        expect(boss.arena.x, `${level.id}:${boss.id}`).toBeGreaterThanOrEqual(
          0,
        );
        expect(
          boss.arena.x + boss.arena.width,
          `${level.id}:${boss.id}`,
        ).toBeLessThanOrEqual(level.bounds.width);
        expect(boss.arena.y, `${level.id}:${boss.id}`).toBeGreaterThanOrEqual(
          0,
        );
        expect(
          boss.arena.y + boss.arena.height,
          `${level.id}:${boss.id}`,
        ).toBeLessThanOrEqual(level.bounds.height);
        expect(boss.weakPoint.width, `${level.id}:${boss.id}`).toBeGreaterThan(
          0,
        );
        expect(
          boss.weakPoint.height,
          `${level.id}:${boss.id}`,
        ).toBeGreaterThan(0);
      });
    });
  });

  it("does not scale trap timing config when migrating coordinates", () => {
    const migratedLevel05 = migrateLegacyLevelDefinition(LEVEL_05);
    const fallingPlatform = migratedLevel05.traps.find(
      (trap) => trap.id === "level-05-falling-platform-doubt",
    )!;

    expect(fallingPlatform.config?.fallDelayMs).toBe(300);
    expect(fallingPlatform.area?.width).toBe(LEVEL_05.traps[0]!.area!.width * 2);
  });

  it("scales boss projectile velocity but keeps attack timing windows", () => {
    const migratedLevel06 = getHdCampaignLevel("level-06");
    const boss = migratedLevel06.bosses!.find(
      (candidate) => candidate.id === "boss-dr-imports",
    )!;
    const bottle = boss.attacks.find((attack) => attack.kind === "import-bottle")!;

    expect(bottle.windupMs).toBe(500);
    expect(bottle.projectile?.velocity.x).toBe(-224);
    expect(boss.movement.speedPxPerSecond).toBe(72);
  });
});
