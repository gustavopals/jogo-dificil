import { expect, type Page, test } from "@playwright/test";

type DebugVector = {
  readonly x: number;
  readonly y: number;
};

type DebugPhysicsState = {
  readonly position: DebugVector;
  readonly velocity: DebugVector;
  readonly isGrounded: boolean;
};

type DebugVisualState = {
  readonly animationState: string;
  readonly isAlive: boolean;
};

type DebugPlayer = {
  getPhysicsState?: () => DebugPhysicsState;
  getVisualState?: () => DebugVisualState;
};

type DebugScene = {
  readonly scene?: {
    readonly key?: string;
  };
  readonly player?: DebugPlayer;
};

type DevQaCommandResult = {
  readonly ok: boolean;
  readonly error?: string;
  readonly snapshot?: DevQaSnapshot;
};

type DevQaPlayerSnapshot = {
  readonly position: DebugVector;
  readonly velocity: DebugVector;
  readonly isGrounded: boolean;
  readonly isAlive: boolean;
  readonly animationState: string;
  readonly energy: number;
  readonly energyActivity: string;
};

type DevQaInteractiveObjectSnapshot = {
  readonly id: string;
  readonly kind: string;
  readonly isActive: boolean;
  readonly resetOnRespawn: boolean;
};

type DevQaEnergyTargetSnapshot = {
  readonly id: string;
  readonly kind: string;
  readonly hitPoints: number;
  readonly hitPointsRemaining: number;
  readonly activationRemainingMs: number;
  readonly relayWindowRemainingMs: number;
  readonly absorbedEnergyHits: number;
  readonly isActive: boolean;
  readonly isBroken: boolean;
  readonly resetOnRespawn: boolean;
};

type DevQaEnergyStateSnapshot = {
  readonly energy: number;
  readonly activity: string;
  readonly sparkCooldownRemainingMs: number;
  readonly burstCooldownRemainingMs: number;
  readonly burstPreparationRemainingMs: number;
  readonly burstDurationRemainingMs: number;
  readonly canUseCyanSpark: boolean;
  readonly canPrepareCyanBurst: boolean;
};

type DevQaSnapshot = {
  readonly currentLevelId: string;
  readonly deathCount: number;
  readonly activeCheckpoint: {
    readonly id: string;
    readonly levelId: string;
    readonly x: number;
    readonly y: number;
  };
  readonly activeScenes: readonly string[];
  readonly level: {
    readonly levelId: string;
    readonly checkpointId: string;
    readonly traps: readonly {
      readonly id: string;
      readonly kind: string;
      readonly isTriggered: boolean;
      readonly isResolved: boolean;
    }[];
    readonly player: DevQaPlayerSnapshot | null;
    readonly interactiveObjects: readonly DevQaInteractiveObjectSnapshot[];
    readonly energyTargets: readonly DevQaEnergyTargetSnapshot[];
  } | null;
};

type DevQaApi = {
  readonly readSnapshot?: () => DevQaSnapshot;
  readonly startLevel?: (levelId: string) => DevQaCommandResult;
  readonly goToCheckpoint?: (checkpointId?: string) => DevQaCommandResult;
  readonly completeLevel?: () => DevQaCommandResult;
  readonly fillEnergy?: () => DevQaCommandResult;
  readonly clearEnergyCooldowns?: () => DevQaCommandResult;
  readonly readEnergyState?: () => DevQaEnergyStateSnapshot | null;
};

type DebugGame = {
  readonly canvas?: HTMLCanvasElement;
  readonly scene?: {
    getScene?: (key: string) => DebugScene;
    getScenes?: (activeOnly?: boolean) => readonly DebugScene[];
  };
};

type DebugWindow = Window & {
  readonly __JOGO_DIFICIL_GAME__?: DebugGame;
  readonly __JOGO_DIFICIL_QA__?: DevQaApi;
};

type SmokeSnapshot = {
  readonly activeScenes: readonly string[];
  readonly canvas?: {
    readonly displayHeight: number;
    readonly displayWidth: number;
    readonly height: number;
    readonly width: number;
  };
  readonly player?: {
    readonly animationState: string;
    readonly isAlive: boolean;
    readonly isGrounded: boolean;
    readonly x: number;
    readonly y: number;
  };
};

test("abre, inicia partida, renderiza jogador e responde a movimento", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  await expect(page).toHaveTitle("Jogo Difícil");

  const canvas = page.locator("canvas");

  await expect(canvas).toBeVisible();
  await expect
    .poll(() => readSmokeSnapshot(page))
    .toMatchObject({
      canvas: {
        width: 480,
        height: 270,
      },
    });
  await waitForQaTools(page);
  await expect
    .poll(async () => (await readSmokeSnapshot(page)).activeScenes)
    .toContain("menu");

  await startLevelWithQa(page, "level-01");
  await expect
    .poll(async () => (await readSmokeSnapshot(page)).activeScenes)
    .toContain("level");

  const startSnapshot = await readSmokeSnapshot(page);

  expect(startSnapshot.player).toMatchObject({
    isAlive: true,
    isGrounded: true,
    x: 64,
    y: 222,
  });

  await page.keyboard.down("KeyD");
  await page.waitForTimeout(450);
  await page.keyboard.up("KeyD");

  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.x ?? 0)
    .toBeGreaterThan((startSnapshot.player?.x ?? 0) + 20);

  const beforeDashSnapshot = await readSmokeSnapshot(page);

  await page.keyboard.down("KeyJ");
  await page.waitForTimeout(90);
  await page.keyboard.up("KeyJ");

  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.x ?? 0)
    .toBeGreaterThan((beforeDashSnapshot.player?.x ?? 0) + 25);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("ferramentas dev de QA iniciam fase, pulam checkpoint e simulam conclusao", async ({
  page,
}) => {
  await page.goto("/");
  await waitForQaTools(page);
  await expect
    .poll(async () => (await readSmokeSnapshot(page)).activeScenes)
    .toContain("menu");

  await startLevelWithQa(page, "level-04");

  await expect
    .poll(() => readQaSnapshot(page))
    .toMatchObject({
      currentLevelId: "level-04",
      activeCheckpoint: {
        id: "level-04-start",
      },
      level: {
        levelId: "level-04",
        checkpointId: "level-04-start",
        traps: [],
      },
    });

  const checkpointResult = await page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.goToCheckpoint?.(),
  );

  expect(checkpointResult).toMatchObject({
    ok: true,
  });
  await expect
    .poll(() => readQaSnapshot(page))
    .toMatchObject({
      activeCheckpoint: {
        id: "level-04-after-first-dash",
      },
      level: {
        checkpointId: "level-04-after-first-dash",
      },
    });

  const completeResult = await page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.completeLevel?.(),
  );

  expect(completeResult).toMatchObject({
    ok: true,
  });
  await expect
    .poll(async () => (await readSmokeSnapshot(page)).activeScenes)
    .toContain("level-transition");
});

test("energia ciano carrega, dispara centelha, solta rajada e ativa alvo", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  await waitForQaTools(page);

  await startLevelWithQa(page, "level-07");
  await expect
    .poll(() => readEnergyStateWithQa(page))
    .toMatchObject({
      energy: 20,
      activity: "idle",
      canUseCyanSpark: true,
      canPrepareCyanBurst: false,
    });
  await expect
    .poll(
      async () => (await readRequiredQaSnapshot(page)).level?.player?.energy,
    )
    .toBe(20);

  await tapKey(page, "KeyK");

  await expect
    .poll(
      async () =>
        findEnergyTargetSnapshot(
          await readRequiredQaSnapshot(page),
          "level-07-first-spark-switch",
        )?.isActive,
    )
    .toBe(true);
  await expect
    .poll(
      async () =>
        findInteractiveObjectSnapshot(
          await readRequiredQaSnapshot(page),
          "level-07-training-door",
        )?.isActive,
    )
    .toBe(true);
  await expect
    .poll(
      async () => (await readRequiredQaSnapshot(page)).level?.player?.energy,
    )
    .toBe(10);

  const fillEnergyResult = await page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.fillEnergy?.(),
  );

  expect(fillEnergyResult).toMatchObject({
    ok: true,
  });
  await expect
    .poll(() => readEnergyStateWithQa(page))
    .toMatchObject({
      energy: 100,
      activity: "idle",
      canPrepareCyanBurst: true,
    });

  await page.keyboard.down("KeyK");
  await expect
    .poll(async () => (await readEnergyStateWithQa(page))?.activity, {
      timeout: 1_500,
    })
    .toBe("burst-preparing");

  const clearCooldownsResult = await page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.clearEnergyCooldowns?.(),
  );

  expect(clearCooldownsResult).toMatchObject({
    ok: true,
  });
  await page.keyboard.up("KeyK");
  await expect
    .poll(() => readEnergyStateWithQa(page))
    .toMatchObject({
      energy: 100,
      activity: "idle",
      sparkCooldownRemainingMs: 0,
      burstCooldownRemainingMs: 0,
      burstPreparationRemainingMs: 0,
      burstDurationRemainingMs: 0,
      canPrepareCyanBurst: true,
    });

  await startLevelWithQa(page, "level-08");
  const checkpointResult = await page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.goToCheckpoint?.(
      "level-08-before-cracked-block",
    ),
  );

  expect(checkpointResult).toMatchObject({
    ok: true,
  });
  await expect
    .poll(() => readRequiredQaSnapshot(page))
    .toMatchObject({
      currentLevelId: "level-08",
      activeCheckpoint: {
        id: "level-08-before-cracked-block",
      },
    });

  await page.keyboard.down("KeyL");
  await expect
    .poll(
      async () => (await readRequiredQaSnapshot(page)).level?.player?.energy,
      {
        timeout: 3_000,
      },
    )
    .toBe(100);
  await page.keyboard.up("KeyL");
  await expect
    .poll(
      async () =>
        (await readRequiredQaSnapshot(page)).level?.player?.energyActivity,
    )
    .toBe("idle");

  expect(
    findEnergyTargetSnapshot(
      await readRequiredQaSnapshot(page),
      "level-08-cracked-block",
    ),
  ).toMatchObject({
    isBroken: false,
    hitPointsRemaining: 2,
  });

  await page.keyboard.down("KeyK");
  await expect
    .poll(
      async () =>
        (await readRequiredQaSnapshot(page)).level?.player?.energyActivity,
      {
        timeout: 1_500,
      },
    )
    .toBe("burst-preparing");
  await page.waitForTimeout(700);
  await page.keyboard.up("KeyK");

  await expect
    .poll(
      async () =>
        findEnergyTargetSnapshot(
          await readRequiredQaSnapshot(page),
          "level-08-cracked-block",
        )?.isBroken,
    )
    .toBe(true);
  await expect
    .poll(
      async () => (await readRequiredQaSnapshot(page)).level?.player?.energy,
    )
    .toBe(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

async function readSmokeSnapshot(page: Page): Promise<SmokeSnapshot> {
  return page.evaluate(() => {
    const game = (window as DebugWindow).__JOGO_DIFICIL_GAME__;
    const activeScenes =
      game?.scene
        ?.getScenes?.(true)
        .map((scene) => scene.scene?.key ?? "")
        .filter((key) => key.length > 0) ?? [];
    const levelScene = game?.scene?.getScene?.("level");
    const physicsState = levelScene?.player?.getPhysicsState?.();
    const visualState = levelScene?.player?.getVisualState?.();
    const canvasRect = game?.canvas?.getBoundingClientRect();

    return {
      activeScenes,
      canvas:
        game?.canvas && canvasRect
          ? {
              width: game.canvas.width,
              height: game.canvas.height,
              displayWidth: canvasRect.width,
              displayHeight: canvasRect.height,
            }
          : undefined,
      player:
        physicsState && visualState
          ? {
              x: physicsState.position.x,
              y: physicsState.position.y,
              isGrounded: physicsState.isGrounded,
              isAlive: visualState.isAlive,
              animationState: visualState.animationState,
            }
          : undefined,
    };
  });
}

async function waitForQaTools(page: Page): Promise<void> {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const qa = (window as DebugWindow).__JOGO_DIFICIL_QA__;

        return Boolean(
          qa?.readSnapshot &&
          qa.startLevel &&
          qa.goToCheckpoint &&
          qa.completeLevel &&
          qa.fillEnergy &&
          qa.clearEnergyCooldowns &&
          qa.readEnergyState,
        );
      }),
    )
    .toBe(true);
}

async function startLevelWithQa(page: Page, levelId: string): Promise<void> {
  const result = await page.evaluate(
    (targetLevelId) =>
      (window as DebugWindow).__JOGO_DIFICIL_QA__?.startLevel?.(targetLevelId),
    levelId,
  );

  expect(result).toMatchObject({
    ok: true,
  });
}

async function readQaSnapshot(page: Page): Promise<DevQaSnapshot | undefined> {
  return page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.readSnapshot?.(),
  );
}

async function readRequiredQaSnapshot(page: Page): Promise<DevQaSnapshot> {
  const snapshot = await readQaSnapshot(page);

  expect(snapshot).toBeDefined();

  return snapshot!;
}

async function readEnergyStateWithQa(
  page: Page,
): Promise<DevQaEnergyStateSnapshot | null | undefined> {
  return page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.readEnergyState?.(),
  );
}

async function tapKey(page: Page, key: string): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(80);
  await page.keyboard.up(key);
}

function findInteractiveObjectSnapshot(
  snapshot: DevQaSnapshot,
  objectId: string,
): DevQaInteractiveObjectSnapshot | undefined {
  return snapshot.level?.interactiveObjects.find(
    (object) => object.id === objectId,
  );
}

function findEnergyTargetSnapshot(
  snapshot: DevQaSnapshot,
  targetId: string,
): DevQaEnergyTargetSnapshot | undefined {
  return snapshot.level?.energyTargets.find((target) => target.id === targetId);
}
