import type { LevelDefinition, RectLike } from "../../shared";

export function isBelowLevelDeathPlane(
  playerHitbox: RectLike,
  level: Pick<LevelDefinition, "bounds">,
): boolean {
  return playerHitbox.y > level.bounds.y + level.bounds.height;
}
