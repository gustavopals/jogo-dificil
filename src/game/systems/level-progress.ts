import type {
  CheckpointDefinition,
  CheckpointId,
  LevelDefinition,
  RectLike,
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
  };
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
