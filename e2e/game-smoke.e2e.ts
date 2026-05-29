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
  getWorldHitbox?: () => {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
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

type DevQaBossEntry = {
  readonly id: string;
  readonly displayName: string;
  readonly levelId: string;
  readonly levelName: string;
  readonly entryCheckpointId: string;
};

type DevQaPlayerSnapshot = {
  readonly position: DebugVector;
  readonly velocity: DebugVector;
  readonly isGrounded: boolean;
  readonly isAlive: boolean;
  readonly animationState: string;
  readonly energy: number;
  readonly energyActivity: string;
  readonly hitboxLocal: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly hitboxWorld: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
};

type DevQaScaleSnapshot = {
  readonly resolution: {
    readonly width: number;
    readonly height: number;
  };
  readonly tileSizePx: number;
  readonly worldPhysicsScale: number;
  readonly playerVisual: {
    readonly width: number;
    readonly height: number;
  };
  readonly playerHitbox: {
    readonly width: number;
    readonly height: number;
  };
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
  readonly bosses?: readonly DevQaBossEntry[];
  readonly readSnapshot?: () => DevQaSnapshot;
  readonly readScaleInfo?: () => DevQaScaleSnapshot;
  readonly readPlayerHitbox?: () => {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  } | null;
  readonly startLevel?: (levelId: string) => DevQaCommandResult;
  readonly startBoss?: (bossId: string) => DevQaCommandResult;
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
    readonly hitboxWorld?: {
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    };
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
  await expect(page).toHaveTitle("Pals Adventure 1");

  const canvas = page.locator("canvas");

  await expect(canvas).toBeVisible();
  await expect
    .poll(() => readSmokeSnapshot(page))
    .toMatchObject({
      canvas: {
        width: 960,
        height: 540,
      },
    });
  await expect
    .poll(() => readScaleInfoWithQa(page))
    .toMatchObject({
      resolution: {
        width: 960,
        height: 540,
      },
      tileSizePx: 32,
      worldPhysicsScale: 2,
      playerHitbox: {
        width: 36,
        height: 80,
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
    x: 128,
    y: 444,
  });
  expect(startSnapshot.player?.hitboxWorld).toMatchObject({
    width: 36,
    height: 80,
  });
  expect(await readPlayerHitboxWithQa(page)).toMatchObject({
    width: 36,
    height: 80,
  });

  await page.keyboard.down("Space");
  await page.waitForTimeout(120);
  await page.keyboard.up("Space");

  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.y ?? 0)
    .toBeLessThan((startSnapshot.player?.y ?? 0) - 30);
  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.isGrounded, {
      timeout: 1_500,
    })
    .toBe(true);

  await page.keyboard.down("KeyD");
  await page.waitForTimeout(450);
  await page.keyboard.up("KeyD");

  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.x ?? 0)
    .toBeGreaterThan((startSnapshot.player?.x ?? 0) + 40);

  const beforeDashSnapshot = await readSmokeSnapshot(page);

  await page.keyboard.down("KeyJ");
  await page.waitForTimeout(90);
  await page.keyboard.up("KeyJ");

  await expect
    .poll(async () => (await readSmokeSnapshot(page)).player?.x ?? 0)
    .toBeGreaterThan((beforeDashSnapshot.player?.x ?? 0) + 50);

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

test("ferramentas dev de QA abrem cada arena de boss", async ({ page }) => {
  await page.goto("/");
  await waitForQaTools(page);

  const bossEntries = await page.evaluate(
    () => (window as DebugWindow).__JOGO_DIFICIL_QA__?.bosses ?? [],
  );

  expect(bossEntries).toEqual([
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

  for (const boss of [
    {
      id: "boss-hirolito-narguilito",
      levelId: "level-03",
      checkpointId: "level-03-before-hirolito",
      entryDoorId: "level-03-hirolito-entry-door",
      exitDoorId: "level-03-hirolito-exit-door",
      weakPointId: "level-03-hirolito-crystal",
    },
    {
      id: "boss-dr-imports",
      levelId: "level-06",
      checkpointId: "level-06-before-dr-imports",
      entryDoorId: "level-06-dr-imports-entry-door",
      exitDoorId: "level-06-dr-imports-exit-door",
      weakPointId: "level-06-dr-imports-weak-point",
    },
    {
      id: "boss-giga-fabio",
      levelId: "level-10",
      checkpointId: "level-10-before-giga-fabio",
      entryDoorId: "level-10-giga-fabio-entry-door",
      exitDoorId: "level-10-giga-fabio-exit-door",
      weakPointId: "level-10-giga-fabio-weak-point",
    },
  ] as const) {
    await startBossWithQa(page, boss.id);
    await expect
      .poll(() => readRequiredQaSnapshot(page))
      .toMatchObject({
        currentLevelId: boss.levelId,
        activeCheckpoint: {
          id: boss.checkpointId,
        },
        level: {
          levelId: boss.levelId,
          checkpointId: boss.checkpointId,
          player: {
            isAlive: true,
            isGrounded: true,
          },
        },
      });

    expect(
      findInteractiveObjectSnapshot(
        await readRequiredQaSnapshot(page),
        boss.entryDoorId,
      ),
    ).toMatchObject({
      kind: "door",
      isActive: true,
    });
    expect(
      findInteractiveObjectSnapshot(
        await readRequiredQaSnapshot(page),
        boss.exitDoorId,
      ),
    ).toMatchObject({
      kind: "door",
      isActive: false,
    });
    expect(
      findEnergyTargetSnapshot(
        await readRequiredQaSnapshot(page),
        boss.weakPointId,
      ),
    ).toMatchObject({
      kind: "boss-hurtbox",
      isBroken: false,
    });

    await page.keyboard.down("KeyD");
    await expect
      .poll(
        async () =>
          findInteractiveObjectSnapshot(
            await readRequiredQaSnapshot(page),
            boss.entryDoorId,
          )?.isActive,
        {
          timeout: 2_000,
        },
      )
      .toBe(false);
    await page.keyboard.up("KeyD");
  }
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
    const worldHitbox = levelScene?.player?.getWorldHitbox?.();
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
              hitboxWorld: worldHitbox,
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
          qa.readScaleInfo &&
          qa.readPlayerHitbox &&
          qa.bosses &&
          qa.startLevel &&
          qa.startBoss &&
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

async function startBossWithQa(page: Page, bossId: string): Promise<void> {
  const result = await page.evaluate(
    (targetBossId) =>
      (window as DebugWindow).__JOGO_DIFICIL_QA__?.startBoss?.(targetBossId),
    bossId,
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

async function readScaleInfoWithQa(
  page: Page,
): Promise<DevQaScaleSnapshot | undefined> {
  return page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.readScaleInfo?.(),
  );
}

async function readPlayerHitboxWithQa(page: Page): Promise<
  | {
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    }
  | null
  | undefined
> {
  return page.evaluate(() =>
    (window as DebugWindow).__JOGO_DIFICIL_QA__?.readPlayerHitbox?.(),
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
