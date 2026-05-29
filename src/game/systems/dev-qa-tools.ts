import type Phaser from "phaser";

import { getLevelDefinition, LEVEL_DEFINITIONS } from "../../data/levels";
import type {
  BossDefinition,
  BossId,
  CheckpointDefinition,
  CheckpointId,
  LevelDefinition,
  LevelId,
  RectLike,
  Vector2Like,
} from "../../shared";
import { SCENE_KEYS } from "../scenes/scene-keys";
import { getDevQaScaleSnapshot, type DevQaScaleSnapshot } from "./dev-qa-scale";
export type { DevQaScaleSnapshot } from "./dev-qa-scale";
export { getDevQaScaleSnapshot } from "./dev-qa-scale";
import { GAME_EVENTS, onGameEvent, type PlayerDiedEvent } from "./game-events";
import { gameStateStore, type GameStateSnapshot } from "./game-state";
import {
  createActiveCheckpointFromDefinition,
  resolveLevelInitialEnergy,
} from "./level-progress";
import type {
  EnergyTargetRuntimeState,
  InteractiveObjectRuntimeState,
  ItemRuntimeState,
  ProjectileRuntimeState,
  TrapRuntimeState,
} from "./room-state";

export const DEV_QA_GLOBAL_KEY = "__JOGO_DIFICIL_QA__";

export type DevQaDeathSnapshot = Pick<
  PlayerDiedEvent,
  "levelId" | "checkpointId" | "deathCount" | "cause" | "position"
> & {
  readonly sourceId?: string;
};

export type DevQaPlayerSnapshot = {
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly isGrounded: boolean;
  readonly isAlive: boolean;
  readonly animationState: string;
  readonly energy: number;
  readonly energyActivity: string;
  readonly hitboxLocal: RectLike;
  readonly hitboxWorld: RectLike;
};

export type DevQaEnergyStateSnapshot = {
  readonly energy: number;
  readonly activity: string;
  readonly sparkCooldownRemainingMs: number;
  readonly burstCooldownRemainingMs: number;
  readonly burstPreparationRemainingMs: number;
  readonly burstDurationRemainingMs: number;
  readonly canUseCyanSpark: boolean;
  readonly canPrepareCyanBurst: boolean;
};

export type DevQaBossEntry = {
  readonly id: BossId;
  readonly displayName: string;
  readonly levelId: LevelId;
  readonly levelName: string;
  readonly entryCheckpointId: CheckpointId;
};

export type DevQaLevelSnapshot = {
  readonly levelId: LevelId;
  readonly levelName: string;
  readonly checkpointId: CheckpointId;
  readonly deathCount: number;
  readonly hasCompletedLevel: boolean;
  readonly lastDeath: DevQaDeathSnapshot | null;
  readonly player: DevQaPlayerSnapshot | null;
  readonly traps: readonly TrapRuntimeState[];
  readonly projectiles: readonly ProjectileRuntimeState[];
  readonly items: readonly ItemRuntimeState[];
  readonly interactiveObjects: readonly InteractiveObjectRuntimeState[];
  readonly energyTargets: readonly EnergyTargetRuntimeState[];
};

export type DevQaSnapshot = Pick<
  GameStateSnapshot,
  | "status"
  | "currentLevelId"
  | "playerLifeState"
  | "deathCount"
  | "activeCheckpoint"
  | "isPaused"
  | "isMuted"
> & {
  readonly isDev: true;
  readonly activeScenes: readonly string[];
  readonly lastDeath: DevQaDeathSnapshot | null;
  readonly level: DevQaLevelSnapshot | null;
};

export type DevQaCommandResult =
  | {
      readonly ok: true;
      readonly snapshot: DevQaSnapshot;
    }
  | {
      readonly ok: false;
      readonly error: string;
      readonly snapshot: DevQaSnapshot;
    };

export type DevQaApi = {
  readonly levels: readonly LevelId[];
  readonly bosses: readonly DevQaBossEntry[];
  readonly readSnapshot: () => DevQaSnapshot;
  readonly readScaleInfo: () => DevQaScaleSnapshot;
  readonly readPlayerHitbox: () => RectLike | null;
  readonly startLevel: (levelId: LevelId) => DevQaCommandResult;
  readonly startBoss: (bossId: BossId) => DevQaCommandResult;
  readonly goToCheckpoint: (checkpointId?: CheckpointId) => DevQaCommandResult;
  readonly completeLevel: () => DevQaCommandResult;
  readonly fillEnergy: () => DevQaCommandResult;
  readonly clearEnergyCooldowns: () => DevQaCommandResult;
  readonly readEnergyState: () => DevQaEnergyStateSnapshot | null;
};

type DevQaWindow = Window & {
  [DEV_QA_GLOBAL_KEY]?: DevQaApi;
};

type DevQaScene = Phaser.Scene & {
  readonly getDevQaLevelSnapshot?: (
    lastDeath: DevQaDeathSnapshot | null,
  ) => DevQaLevelSnapshot | null;
  readonly goToDevQaCheckpoint?: (checkpointId?: CheckpointId) => boolean;
  readonly completeDevQaLevel?: () => boolean;
  readonly fillDevQaEnergy?: () => boolean;
  readonly clearDevQaEnergyCooldowns?: () => boolean;
  readonly readDevQaEnergyState?: () => DevQaEnergyStateSnapshot | null;
  readonly readDevQaPlayerHitbox?: () => RectLike | null;
};

export function getDevQaLevelIds(): readonly LevelId[] {
  return LEVEL_DEFINITIONS.map((level) => level.id);
}

export function getDevQaBossEntries(): readonly DevQaBossEntry[] {
  return getDevQaLevelDefinitions().flatMap((level) =>
    (level.bosses ?? []).map((boss) => createDevQaBossEntry(level, boss)),
  );
}

export function isKnownDevQaLevelId(levelId: LevelId): boolean {
  return getLevelDefinition(levelId) !== undefined;
}

export function installDevQaTools(
  game: Phaser.Game,
  targetWindow: Window = window,
): DevQaApi {
  let lastDeath: DevQaDeathSnapshot | null = null;

  onGameEvent(GAME_EVENTS.PLAYER_DIED, (event) => {
    lastDeath = createDeathSnapshot(event);
  });

  const readSnapshot = (): DevQaSnapshot =>
    createDevQaSnapshot(game, lastDeath);

  const api: DevQaApi = {
    levels: getDevQaLevelIds(),
    bosses: getDevQaBossEntries(),
    readSnapshot,
    readScaleInfo: getDevQaScaleSnapshot,
    readPlayerHitbox: () => {
      const levelScene = getDevQaLevelScene(game);

      return levelScene?.readDevQaPlayerHitbox?.() ?? null;
    },
    startLevel: (levelId) => {
      if (!isKnownDevQaLevelId(levelId)) {
        return createCommandFailure(
          `Level "${levelId}" nao existe nos dados atuais.`,
          readSnapshot(),
        );
      }

      const level = getLevelDefinition(levelId)!;

      startDevQaLevel(game, level);

      return createCommandSuccess(readSnapshot());
    },
    startBoss: (bossId) => {
      const bossTarget = findDevQaBossTarget(bossId);

      if (!bossTarget) {
        return createCommandFailure(
          `Boss "${bossId}" nao existe nos dados atuais.`,
          readSnapshot(),
        );
      }

      startDevQaLevel(game, bossTarget.level, bossTarget.checkpoint);

      return createCommandSuccess(readSnapshot());
    },
    goToCheckpoint: (checkpointId) => {
      const levelScene = getDevQaLevelScene(game);

      if (!levelScene?.goToDevQaCheckpoint) {
        return createCommandFailure(
          "LevelScene nao esta ativa para mover checkpoint.",
          readSnapshot(),
        );
      }

      const didMove = levelScene.goToDevQaCheckpoint(checkpointId);

      if (!didMove) {
        return createCommandFailure(
          checkpointId
            ? `Checkpoint "${checkpointId}" nao existe na fase atual.`
            : "A fase atual nao possui checkpoint de QA.",
          readSnapshot(),
        );
      }

      return createCommandSuccess(readSnapshot());
    },
    completeLevel: () => {
      const levelScene = getDevQaLevelScene(game);

      if (!levelScene?.completeDevQaLevel) {
        return createCommandFailure(
          "LevelScene nao esta ativa para simular conclusao.",
          readSnapshot(),
        );
      }

      const didComplete = levelScene.completeDevQaLevel();

      if (!didComplete) {
        return createCommandFailure(
          "A fase atual nao pode ser concluida por QA neste estado.",
          readSnapshot(),
        );
      }

      return createCommandSuccess(readSnapshot());
    },
    fillEnergy: () => {
      const levelScene = getDevQaLevelScene(game);

      if (!levelScene?.fillDevQaEnergy) {
        return createCommandFailure(
          "LevelScene nao esta ativa para preencher energia.",
          readSnapshot(),
        );
      }

      const didFill = levelScene.fillDevQaEnergy();

      if (!didFill) {
        return createCommandFailure(
          "A energia nao pode ser preenchida por QA neste estado.",
          readSnapshot(),
        );
      }

      return createCommandSuccess(readSnapshot());
    },
    clearEnergyCooldowns: () => {
      const levelScene = getDevQaLevelScene(game);

      if (!levelScene?.clearDevQaEnergyCooldowns) {
        return createCommandFailure(
          "LevelScene nao esta ativa para zerar cooldowns de energia.",
          readSnapshot(),
        );
      }

      const didClear = levelScene.clearDevQaEnergyCooldowns();

      if (!didClear) {
        return createCommandFailure(
          "Cooldowns de energia nao podem ser zerados por QA neste estado.",
          readSnapshot(),
        );
      }

      return createCommandSuccess(readSnapshot());
    },
    readEnergyState: () => {
      const levelScene = getDevQaLevelScene(game);

      return levelScene?.readDevQaEnergyState?.() ?? null;
    },
  };

  (targetWindow as DevQaWindow)[DEV_QA_GLOBAL_KEY] = api;

  return api;
}

function createDevQaBossEntry(
  level: LevelDefinition,
  boss: BossDefinition,
): DevQaBossEntry {
  return {
    id: boss.id,
    displayName: boss.displayName,
    levelId: level.id,
    levelName: level.name,
    entryCheckpointId: boss.entryCheckpointId,
  };
}

function findDevQaBossTarget(bossId: BossId):
  | {
      readonly level: LevelDefinition;
      readonly boss: BossDefinition;
      readonly checkpoint: CheckpointDefinition;
    }
  | undefined {
  for (const level of getDevQaLevelDefinitions()) {
    const boss = level.bosses?.find((candidate) => candidate.id === bossId);

    if (!boss) {
      continue;
    }

    const checkpoint = level.checkpoints.find(
      (candidate) => candidate.id === boss.entryCheckpointId,
    );

    if (!checkpoint) {
      return undefined;
    }

    return {
      level,
      boss,
      checkpoint,
    };
  }

  return undefined;
}

function getDevQaLevelDefinitions(): readonly LevelDefinition[] {
  return LEVEL_DEFINITIONS as readonly LevelDefinition[];
}

function startDevQaLevel(
  game: Phaser.Game,
  level: LevelDefinition,
  checkpoint?: CheckpointDefinition,
): void {
  const activeCheckpoint = checkpoint
    ? createActiveCheckpointFromDefinition(level, checkpoint)
    : undefined;

  gameStateStore.startLevel(
    level.id,
    activeCheckpoint ?? level.spawn,
    activeCheckpoint?.initialEnergy ?? resolveLevelInitialEnergy(level),
  );

  if (activeCheckpoint) {
    gameStateStore.setActiveCheckpoint(activeCheckpoint);
  }

  stopSceneIfKnown(game, SCENE_KEYS.PAUSE);
  stopSceneIfKnown(game, SCENE_KEYS.LEVEL_TRANSITION);
  stopSceneIfKnown(game, SCENE_KEYS.MENU);
  stopSceneIfKnown(game, SCENE_KEYS.HUD);
  game.scene.start(SCENE_KEYS.LEVEL);
}

function createDevQaSnapshot(
  game: Phaser.Game,
  lastDeath: DevQaDeathSnapshot | null,
): DevQaSnapshot {
  const state = gameStateStore.getSnapshot();
  const levelScene = getDevQaLevelScene(game);

  return {
    isDev: true,
    status: state.status,
    currentLevelId: state.currentLevelId,
    playerLifeState: state.playerLifeState,
    deathCount: state.deathCount,
    activeCheckpoint: state.activeCheckpoint,
    isPaused: state.isPaused,
    isMuted: state.isMuted,
    activeScenes: getActiveSceneKeys(game),
    lastDeath,
    level: levelScene?.getDevQaLevelSnapshot?.(lastDeath) ?? null,
  };
}

function createDeathSnapshot(event: PlayerDiedEvent): DevQaDeathSnapshot {
  return {
    levelId: event.levelId,
    checkpointId: event.checkpointId,
    deathCount: event.deathCount,
    cause: event.cause,
    ...(event.sourceId ? { sourceId: event.sourceId } : {}),
    position: {
      x: event.position.x,
      y: event.position.y,
    },
  };
}

function createCommandSuccess(
  snapshot: DevQaSnapshot,
): Extract<DevQaCommandResult, { readonly ok: true }> {
  return {
    ok: true,
    snapshot,
  };
}

function createCommandFailure(
  error: string,
  snapshot: DevQaSnapshot,
): Extract<DevQaCommandResult, { readonly ok: false }> {
  return {
    ok: false,
    error,
    snapshot,
  };
}

function getDevQaLevelScene(game: Phaser.Game): DevQaScene | undefined {
  const scene = game.scene.getScene(SCENE_KEYS.LEVEL) as
    | DevQaScene
    | null
    | undefined;

  return scene ?? undefined;
}

function getActiveSceneKeys(game: Phaser.Game): readonly string[] {
  return game.scene
    .getScenes(true)
    .map((scene) => scene.scene.key)
    .filter((key) => key.length > 0);
}

function stopSceneIfKnown(game: Phaser.Game, sceneKey: string): void {
  if (game.scene.getScene(sceneKey)) {
    game.scene.stop(sceneKey);
  }
}
