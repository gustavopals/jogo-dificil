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
  } | null;
};

type DevQaApi = {
  readonly readSnapshot?: () => DevQaSnapshot;
  readonly startLevel?: (levelId: string) => DevQaCommandResult;
  readonly goToCheckpoint?: (checkpointId?: string) => DevQaCommandResult;
  readonly completeLevel?: () => DevQaCommandResult;
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
          qa.completeLevel,
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
