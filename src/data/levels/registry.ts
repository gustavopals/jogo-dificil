import type { LevelDefinition, LevelId } from "../../shared";
import { LEVEL_01 } from "./level-01";
import { LEVEL_02 } from "./level-02";
import { LEVEL_03 } from "./level-03";
import { LEVEL_04 } from "./level-04";
import { LEVEL_05 } from "./level-05";
import { LEVEL_06 } from "./level-06";
import { LEVEL_07 } from "./level-07";
import { LEVEL_08 } from "./level-08";
import { LEVEL_09 } from "./level-09";

export const LEVEL_DEFINITIONS = [
  LEVEL_01,
  LEVEL_02,
  LEVEL_03,
  LEVEL_04,
  LEVEL_05,
  LEVEL_06,
  LEVEL_07,
  LEVEL_08,
  LEVEL_09,
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
