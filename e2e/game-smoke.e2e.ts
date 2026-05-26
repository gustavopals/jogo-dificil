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

type DebugGame = {
  readonly canvas?: HTMLCanvasElement;
  readonly scene?: {
    getScene?: (key: string) => DebugScene;
    getScenes?: (activeOnly?: boolean) => readonly DebugScene[];
  };
};

type DebugWindow = Window & {
  readonly __JOGO_DIFICIL_GAME__?: DebugGame;
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

  await page.keyboard.press("Enter");
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
