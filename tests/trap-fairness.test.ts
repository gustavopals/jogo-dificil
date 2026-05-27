import { describe, expect, it } from "vitest";

import { LEVEL_DEFINITIONS, type LevelDefinition } from "../src/data/levels";
import { AUTO_RESPAWN_DELAY_MS } from "../src/game/systems/player-respawn";

const BLOCKING_TRAP_KINDS = new Set([
  "false-block",
  "breakable-floor",
  "falling-platform",
]);
const TRAP_CONFIG_DELAY_KEYS = ["delayMs", "fallDelayMs"] as const;
const REVIEWED_LEVELS = LEVEL_DEFINITIONS as readonly LevelDefinition[];

describe("trap fairness", () => {
  it("keeps MVP traps resettable and readable by declared areas", () => {
    const traps = REVIEWED_LEVELS.flatMap((level) =>
      level.traps.map((trap) => ({
        levelId: level.id,
        trap,
      })),
    );

    expect(traps.length).toBeGreaterThan(0);

    traps.forEach(({ levelId, trap }) => {
      expect(trap.resetOnRespawn, `${levelId}:${trap.id}`).toBe(true);
      expect(trap.trigger.area.width, `${levelId}:${trap.id}`).toBeGreaterThan(
        0,
      );
      expect(trap.trigger.area.height, `${levelId}:${trap.id}`).toBeGreaterThan(
        0,
      );
      expect(trap.area, `${levelId}:${trap.id}`).toBeDefined();
    });
  });

  it("keeps configured trap delays shorter than the automatic respawn", () => {
    REVIEWED_LEVELS.forEach((level) => {
      level.traps.forEach((trap) => {
        TRAP_CONFIG_DELAY_KEYS.forEach((key) => {
          const value = trap.config?.[key];

          if (value === undefined) {
            return;
          }

          expect(typeof value, `${level.id}:${trap.id}:${key}`).toBe("number");
          expect(value, `${level.id}:${trap.id}:${key}`).toBeLessThan(
            AUTO_RESPAWN_DELAY_MS,
          );
        });
      });
    });
  });

  it("keeps blocking or floor-removing traps resettable to avoid softlocks", () => {
    REVIEWED_LEVELS.forEach((level) => {
      level.traps
        .filter((trap) => BLOCKING_TRAP_KINDS.has(trap.kind))
        .forEach((trap) => {
          expect(trap.resetOnRespawn, `${level.id}:${trap.id}`).toBe(true);
        });
    });
  });

  it("keeps closed doors resettable and reachable by at least one opener", () => {
    REVIEWED_LEVELS.forEach((level) => {
      level.interactiveObjects
        .filter((object) => object.kind === "door" && !object.startsActive)
        .forEach((door) => {
          const itemOpeners = level.items.filter(
            (item) => item.activatesObjectId === door.id,
          );
          const objectOpeners = level.interactiveObjects.filter(
            (object) => object.targetObjectId === door.id,
          );
          const energyOpeners = (level.energyTargets ?? []).filter(
            (target) => target.activatesObjectId === door.id,
          );

          expect(door.resetOnRespawn, `${level.id}:${door.id}`).toBe(true);
          expect(
            itemOpeners.length + objectOpeners.length + energyOpeners.length,
            `${level.id}:${door.id}`,
          ).toBeGreaterThan(0);
        });
    });
  });
});
