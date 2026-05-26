import type { LevelDefinition, LevelId } from "../../shared";
import { LEVEL_01 } from "./level-01";
import { LEVEL_02 } from "./level-02";
import { LEVEL_03 } from "./level-03";

export const LEVEL_DEFINITIONS = [
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
] as const satisfies readonly LevelDefinition[];

export function getLevelDefinition(
  levelId: LevelId,
): LevelDefinition | undefined {
  return LEVEL_DEFINITIONS.find((level) => level.id === levelId);
}

export function getRequiredLevelDefinition(levelId: LevelId): LevelDefinition {
  const level = getLevelDefinition(levelId);

  if (!level) {
    throw new Error(`Level definition "${levelId}" was not found.`);
  }

  return level;
}
