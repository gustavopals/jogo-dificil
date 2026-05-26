import { describe, expect, it } from "vitest";

import {
  getDevQaLevelIds,
  isKnownDevQaLevelId,
} from "../src/game/systems/dev-qa-tools";

describe("dev QA tools", () => {
  it("lists campaign levels that can be started directly in dev", () => {
    expect(getDevQaLevelIds()).toEqual([
      "level-01",
      "level-02",
      "level-03",
      "level-04",
      "level-05",
      "level-06",
    ]);
  });

  it("rejects unknown level ids before starting a QA session", () => {
    expect(isKnownDevQaLevelId("level-04")).toBe(true);
    expect(isKnownDevQaLevelId("missing-level")).toBe(false);
  });
});
