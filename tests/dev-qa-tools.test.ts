import type Phaser from "phaser";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAllGameEventListeners } from "../src/game/systems/game-events";
import { gameStateStore } from "../src/game/systems/game-state";
import {
  DEV_QA_GLOBAL_KEY,
  getDevQaLevelIds,
  installDevQaTools,
  isKnownDevQaLevelId,
  type DevQaEnergyStateSnapshot,
} from "../src/game/systems/dev-qa-tools";

beforeEach(() => {
  gameStateStore.resetRun();
});

afterEach(() => {
  clearAllGameEventListeners();
});

describe("dev QA tools", () => {
  it("lists campaign levels that can be started directly in dev", () => {
    expect(getDevQaLevelIds()).toEqual([
      "level-01",
      "level-02",
      "level-03",
      "level-04",
      "level-05",
      "level-06",
      "level-07",
      "level-08",
      "level-09",
    ]);
  });

  it("rejects unknown level ids before starting a QA session", () => {
    expect(isKnownDevQaLevelId("level-04")).toBe(true);
    expect(isKnownDevQaLevelId("missing-level")).toBe(false);
  });

  it("exposes energy hooks for playtest and smoke tests", () => {
    const energyState = {
      energy: 100,
      activity: "idle",
      sparkCooldownRemainingMs: 0,
      burstCooldownRemainingMs: 0,
      burstPreparationRemainingMs: 0,
      burstDurationRemainingMs: 0,
      canUseCyanSpark: true,
      canPrepareCyanBurst: true,
    } satisfies DevQaEnergyStateSnapshot;
    const levelScene = {
      scene: {
        key: "level",
      },
      getDevQaLevelSnapshot: vi.fn(() => null),
      fillDevQaEnergy: vi.fn(() => true),
      clearDevQaEnergyCooldowns: vi.fn(() => true),
      readDevQaEnergyState: vi.fn(() => energyState),
    };
    const game = createFakeGame(levelScene);
    const targetWindow = {} as Window & Record<string, unknown>;

    gameStateStore.startLevel("level-07", { x: 64, y: 128 }, 20);
    const api = installDevQaTools(game, targetWindow);

    expect(targetWindow[DEV_QA_GLOBAL_KEY]).toBe(api);
    expect(api.readEnergyState()).toEqual(energyState);
    expect(api.fillEnergy()).toMatchObject({ ok: true });
    expect(levelScene.fillDevQaEnergy).toHaveBeenCalledTimes(1);
    expect(api.clearEnergyCooldowns()).toMatchObject({ ok: true });
    expect(levelScene.clearDevQaEnergyCooldowns).toHaveBeenCalledTimes(1);
  });
});

function createFakeGame(levelScene: unknown): Phaser.Game {
  return {
    scene: {
      getScene: vi.fn((sceneKey: string) =>
        sceneKey === "level" ? levelScene : undefined,
      ),
      getScenes: vi.fn(() => [levelScene]),
    },
  } as unknown as Phaser.Game;
}
