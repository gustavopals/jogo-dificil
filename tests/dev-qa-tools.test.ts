import type Phaser from "phaser";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAllGameEventListeners } from "../src/game/systems/game-events";
import { gameStateStore } from "../src/game/systems/game-state";
import {
  DEV_QA_GLOBAL_KEY,
  getDevQaBossEntries,
  getDevQaLevelIds,
  getDevQaScaleSnapshot,
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
      "level-10",
      "level-11",
    ]);
  });

  it("rejects unknown level ids before starting a QA session", () => {
    expect(isKnownDevQaLevelId("level-04")).toBe(true);
    expect(isKnownDevQaLevelId("missing-level")).toBe(false);
  });

  it("lists bosses that can be started directly in dev", () => {
    expect(getDevQaBossEntries()).toEqual([
      {
        id: "boss-hirolito-narguilito",
        displayName: "Hirolito Narguilito",
        levelId: "level-03",
        levelName: "Quase Seguro",
        entryCheckpointId: "level-03-before-hirolito",
      },
      {
        id: "boss-dr-imports",
        displayName: "Dr. Imports",
        levelId: "level-06",
        levelName: "Memoria Em Movimento",
        entryCheckpointId: "level-06-before-dr-imports",
      },
      {
        id: "boss-giga-fabio",
        displayName: "Giga Fabio",
        levelId: "level-10",
        levelName: "O Ultimo Nucleo",
        entryCheckpointId: "level-10-before-giga-fabio",
      },
    ]);
  });

  it("starts a boss directly at its entry checkpoint", () => {
    const levelScene = {
      scene: {
        key: "level",
      },
      getDevQaLevelSnapshot: vi.fn(() => null),
      readDevQaPlayerHitbox: vi.fn(() => ({
        x: 110,
        y: 364,
        width: 20,
        height: 36,
      })),
    };
    const game = createFakeGame(levelScene);
    const targetWindow = {} as Window & Record<string, unknown>;
    const api = installDevQaTools(game, targetWindow);

    expect(api.bosses.map((boss) => boss.id)).toEqual([
      "boss-hirolito-narguilito",
      "boss-dr-imports",
      "boss-giga-fabio",
    ]);

    const result = api.startBoss("boss-dr-imports");

    expect(result).toMatchObject({ ok: true });
    expect(gameStateStore.getSnapshot()).toMatchObject({
      currentLevelId: "level-06",
      activeCheckpoint: {
        id: "level-06-before-dr-imports",
        levelId: "level-06",
        x: 1984,
        y: 444,
        initialEnergy: 80,
      },
    });
    expect(game.scene.start).toHaveBeenCalledWith("level");
  });

  it("rejects unknown boss ids before changing QA state", () => {
    const game = createFakeGame(null);
    const targetWindow = {} as Window & Record<string, unknown>;
    const api = installDevQaTools(game, targetWindow);

    gameStateStore.startLevel("level-02", { x: 80, y: 222 }, 30);

    expect(api.startBoss("missing-boss")).toMatchObject({
      ok: false,
      error: 'Boss "missing-boss" nao existe nos dados atuais.',
    });
    expect(gameStateStore.getSnapshot()).toMatchObject({
      currentLevelId: "level-02",
      activeCheckpoint: {
        id: "level-02-start",
      },
    });
    expect(game.scene.start).not.toHaveBeenCalled();
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

  it("exposes HD scale info and player hitbox hooks for QA", () => {
    const levelScene = {
      scene: {
        key: "level",
      },
      getDevQaLevelSnapshot: vi.fn(() => null),
      readDevQaPlayerHitbox: vi.fn(() => ({
        x: 110,
        y: 364,
        width: 20,
        height: 36,
      })),
    };
    const game = createFakeGame(levelScene);
    const targetWindow = {} as Window & Record<string, unknown>;
    const api = installDevQaTools(game, targetWindow);

    expect(getDevQaScaleSnapshot()).toMatchObject({
      resolution: {
        width: 960,
        height: 540,
      },
      tileSizePx: 32,
      worldPhysicsScale: 2,
      playerHitbox: {
        width: 20,
        height: 36,
      },
    });
    expect(api.readScaleInfo()).toEqual(getDevQaScaleSnapshot());
    expect(api.readPlayerHitbox()).toEqual({
      x: 110,
      y: 364,
      width: 20,
      height: 36,
    });
    expect(levelScene.readDevQaPlayerHitbox).toHaveBeenCalledTimes(1);
  });
});

function createFakeGame(levelScene: unknown): Phaser.Game {
  return {
    scene: {
      getScene: vi.fn((sceneKey: string) =>
        sceneKey === "level" ? levelScene : undefined,
      ),
      getScenes: vi.fn(() => (levelScene ? [levelScene] : [])),
      start: vi.fn(),
      stop: vi.fn(),
    },
  } as unknown as Phaser.Game;
}
