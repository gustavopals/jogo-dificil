import type { LevelDefinition, LevelId } from "../../shared";

import { LEVEL_DEFINITIONS } from "./registry";

export const CAMPAIGN_LEVEL_COUNT = 10 as const;

export const CHALLENGE_LEVEL_IDS = ["level-11"] as const satisfies readonly LevelId[];

export type ChallengeLevelId = (typeof CHALLENGE_LEVEL_IDS)[number];

export function isChallengeLevel(
  levelId: LevelId,
): levelId is ChallengeLevelId {
  return CHALLENGE_LEVEL_IDS.includes(levelId as ChallengeLevelId);
}

export function getCampaignLevelDefinitions(): readonly LevelDefinition[] {
  return LEVEL_DEFINITIONS.filter(
    (level) => level.contentKind !== "challenge",
  );
}

export function getChallengeLevelDefinitions(): readonly LevelDefinition[] {
  return LEVEL_DEFINITIONS.filter((level) => level.contentKind === "challenge");
}

export function getFirstChallengeLevelId(): ChallengeLevelId {
  return CHALLENGE_LEVEL_IDS[0];
}
