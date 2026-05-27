import type {
  CheckpointDefinition,
  CheckpointId,
  LevelDefinition,
  RectLike,
} from "../../shared";
import {
  DEFAULT_PLAYER_INITIAL_ENERGY,
  PLAYER_ENERGY_MAX,
  PLAYER_ENERGY_MIN,
} from "../../shared";
import type { ActiveCheckpoint } from "./game-state";

export function createLevelStartCheckpoint(
  level: LevelDefinition,
): ActiveCheckpoint {
  return {
    id: `${level.id}-start`,
    levelId: level.id,
    x: level.spawn.x,
    y: level.spawn.y,
    initialEnergy: resolveLevelInitialEnergy(level),
  };
}

export function createActiveCheckpointFromDefinition(
  level: LevelDefinition,
  checkpoint: CheckpointDefinition,
): ActiveCheckpoint {
  return {
    id: checkpoint.id,
    levelId: level.id,
    x: checkpoint.position.x,
    y: checkpoint.position.y,
    initialEnergy: resolveCheckpointInitialEnergy(level, checkpoint),
  };
}

export function resolveLevelInitialEnergy(level: LevelDefinition): number {
  return normalizeInitialEnergy(
    level.initialEnergy ?? DEFAULT_PLAYER_INITIAL_ENERGY,
  );
}

export function resolveCheckpointInitialEnergy(
  level: LevelDefinition,
  checkpoint: CheckpointDefinition,
): number {
  return normalizeInitialEnergy(
    checkpoint.initialEnergy ?? resolveLevelInitialEnergy(level),
  );
}

export function findTouchedCheckpoint(
  playerHitbox: RectLike,
  checkpoints: readonly CheckpointDefinition[],
  activeCheckpointId: CheckpointId,
): CheckpointDefinition | undefined {
  return checkpoints.find(
    (checkpoint) =>
      checkpoint.id !== activeCheckpointId &&
      rectsOverlap(playerHitbox, checkpoint.area),
  );
}

export function isTouchingExit(
  playerHitbox: RectLike,
  level: LevelDefinition,
): boolean {
  return rectsOverlap(playerHitbox, level.exit.area);
}

export function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function normalizeInitialEnergy(initialEnergy: number): number {
  if (!Number.isFinite(initialEnergy)) {
    return DEFAULT_PLAYER_INITIAL_ENERGY;
  }

  return Math.min(
    PLAYER_ENERGY_MAX,
    Math.max(PLAYER_ENERGY_MIN, initialEnergy),
  );
}
