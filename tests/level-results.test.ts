import { describe, expect, it } from "vitest";

import {
  LEVEL_RESULTS_STORAGE_KEY,
  normalizeLevelCompletionAttempt,
  readLevelResultRecord,
  readLevelResultRecords,
  recordLevelCompletion,
  type LevelResultStorage,
} from "../src/game/systems/level-results";

class MemoryStorage implements LevelResultStorage {
  public readonly values = new Map<string, string>();

  public constructor(private readonly shouldThrowOnWrite = false) {}

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    if (this.shouldThrowOnWrite) {
      throw new Error("Storage unavailable.");
    }

    this.values.set(key, value);
  }
}

describe("level results", () => {
  it("normalizes attempt time and death count", () => {
    expect(
      normalizeLevelCompletionAttempt({
        levelId: "level-01",
        elapsedMs: 1234.9,
        deathCount: 2.8,
      }),
    ).toEqual({
      levelId: "level-01",
      elapsedMs: 1234,
      deathCount: 2,
    });
    expect(
      normalizeLevelCompletionAttempt({
        levelId: "level-01",
        elapsedMs: Number.NaN,
        deathCount: -4,
      }),
    ).toEqual({
      levelId: "level-01",
      elapsedMs: 0,
      deathCount: 0,
    });
  });

  it("records the first completion as both local records", () => {
    const storage = new MemoryStorage();
    const result = recordLevelCompletion(
      {
        levelId: "level-01",
        elapsedMs: 12_340,
        deathCount: 3,
      },
      storage,
    );

    expect(result).toEqual({
      levelId: "level-01",
      elapsedMs: 12_340,
      deathCount: 3,
      bestTimeMs: 12_340,
      fewestDeaths: 3,
      completions: 1,
      isNewBestTime: true,
      isNewFewestDeaths: true,
    });
    expect(readLevelResultRecord("level-01", storage)).toEqual({
      bestTimeMs: 12_340,
      fewestDeaths: 3,
      completions: 1,
    });
  });

  it("updates best time and fewest deaths independently", () => {
    const storage = new MemoryStorage();

    recordLevelCompletion(
      {
        levelId: "level-02",
        elapsedMs: 10_000,
        deathCount: 5,
      },
      storage,
    );
    const fasterResult = recordLevelCompletion(
      {
        levelId: "level-02",
        elapsedMs: 9_500,
        deathCount: 7,
      },
      storage,
    );
    const cleanerResult = recordLevelCompletion(
      {
        levelId: "level-02",
        elapsedMs: 11_000,
        deathCount: 2,
      },
      storage,
    );

    expect(fasterResult).toMatchObject({
      bestTimeMs: 9_500,
      fewestDeaths: 5,
      isNewBestTime: true,
      isNewFewestDeaths: false,
      completions: 2,
    });
    expect(cleanerResult).toMatchObject({
      bestTimeMs: 9_500,
      fewestDeaths: 2,
      isNewBestTime: false,
      isNewFewestDeaths: true,
      completions: 3,
    });
  });

  it("ignores corrupt storage and keeps gameplay result available", () => {
    const storage = new MemoryStorage();
    storage.values.set(LEVEL_RESULTS_STORAGE_KEY, "{bad json");

    expect(readLevelResultRecords(storage)).toEqual({});
    expect(
      recordLevelCompletion(
        {
          levelId: "level-03",
          elapsedMs: 5_000,
          deathCount: 0,
        },
        storage,
      ),
    ).toMatchObject({
      bestTimeMs: 5_000,
      fewestDeaths: 0,
      isNewBestTime: true,
      isNewFewestDeaths: true,
    });
  });

  it("does not block completion when storage write fails", () => {
    const result = recordLevelCompletion(
      {
        levelId: "level-01",
        elapsedMs: 8_000,
        deathCount: 1,
      },
      new MemoryStorage(true),
    );

    expect(result).toMatchObject({
      bestTimeMs: 8_000,
      fewestDeaths: 1,
      completions: 1,
    });
  });
});
