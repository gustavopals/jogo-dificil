import {
  getLevelDefinition,
  LEVEL_DEFINITIONS,
  migrateLegacyLevelDefinition,
  type LevelDefinition,
} from "../../src/data/levels";
import type { LevelId } from "../../src/shared";
import {
  GAME_RESOLUTION,
  PLAYER_SIZE,
  TILE_SIZE_PX,
  WORLD_PHYSICS_SCALE,
} from "../../src/game/constants";

export {
  GAME_RESOLUTION,
  LEVEL_DEFINITIONS,
  PLAYER_SIZE,
  TILE_SIZE_PX,
  WORLD_PHYSICS_SCALE,
};

export const HD_FLOOR_Y = GAME_RESOLUTION.height - TILE_SIZE_PX * 3;

export function getHdCampaignLevel(levelId: LevelId): LevelDefinition {
  const level = getLevelDefinition(levelId);

  if (!level) {
    throw new Error(`Campaign level "${levelId}" was not found.`);
  }

  return level;
}

export function getLegacyCampaignLevel(
  legacyLevel: LevelDefinition,
): LevelDefinition {
  return migrateLegacyLevelDefinition(legacyLevel);
}
