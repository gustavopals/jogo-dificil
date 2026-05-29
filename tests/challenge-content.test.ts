import { describe, expect, it } from "vitest";

import {
  CAMPAIGN_LEVEL_COUNT,
  CHALLENGE_LEVEL_IDS,
  getCampaignLevelDefinitions,
  getChallengeLevelDefinitions,
  isChallengeLevel,
  LEVEL_11,
  validateLevels,
} from "../src/data/levels";

describe("challenge content", () => {
  it("defines campaign and challenge segments separately", () => {
    expect(CAMPAIGN_LEVEL_COUNT).toBe(10);
    expect(CHALLENGE_LEVEL_IDS).toEqual(["level-11"]);
    expect(isChallengeLevel("level-11")).toBe(true);
    expect(isChallengeLevel("level-10")).toBe(false);
    expect(getCampaignLevelDefinitions()).toHaveLength(10);
    expect(getChallengeLevelDefinitions().map((level) => level.id)).toEqual([
      "level-11",
    ]);
  });

  it("keeps the challenge level valid in the registry", () => {
    expect(validateLevels([LEVEL_11])).toEqual({
      isValid: true,
      issues: [],
    });
  });
});
