import type { LevelId } from "../../shared";

export const LEVEL_RESULTS_STORAGE_KEY = "jogo-dificil-level-results-v1";

export type LevelResultStorage = Pick<Storage, "getItem" | "setItem">;

export type LevelCompletionAttempt = {
  readonly levelId: LevelId;
  readonly elapsedMs: number;
  readonly deathCount: number;
};

export type LevelResultRecord = {
  readonly bestTimeMs: number;
  readonly fewestDeaths: number;
  readonly completions: number;
};

export type LevelCompletionResult = LevelCompletionAttempt &
  LevelResultRecord & {
    readonly isNewBestTime: boolean;
    readonly isNewFewestDeaths: boolean;
  };

export type LevelResultRecords = Readonly<Record<LevelId, LevelResultRecord>>;

export function normalizeLevelCompletionAttempt(
  attempt: LevelCompletionAttempt,
): LevelCompletionAttempt {
  return {
    levelId: attempt.levelId,
    elapsedMs: normalizeNonNegativeInteger(attempt.elapsedMs),
    deathCount: normalizeNonNegativeInteger(attempt.deathCount),
  };
}

export function readLevelResultRecords(
  storage = getBrowserLevelResultStorage(),
): LevelResultRecords {
  if (!storage) {
    return {};
  }

  try {
    return parseLevelResultRecords(storage.getItem(LEVEL_RESULTS_STORAGE_KEY));
  } catch {
    return {};
  }
}

export function readLevelResultRecord(
  levelId: LevelId,
  storage = getBrowserLevelResultStorage(),
): LevelResultRecord | undefined {
  return readLevelResultRecords(storage)[levelId];
}

export function recordLevelCompletion(
  attempt: LevelCompletionAttempt,
  storage = getBrowserLevelResultStorage(),
): LevelCompletionResult {
  const normalizedAttempt = normalizeLevelCompletionAttempt(attempt);
  const records = readLevelResultRecords(storage);
  const currentRecord = records[normalizedAttempt.levelId];
  const result = createLevelCompletionResult(normalizedAttempt, currentRecord);

  if (!storage) {
    return result;
  }

  try {
    storage.setItem(
      LEVEL_RESULTS_STORAGE_KEY,
      JSON.stringify({
        ...records,
        [normalizedAttempt.levelId]: {
          bestTimeMs: result.bestTimeMs,
          fewestDeaths: result.fewestDeaths,
          completions: result.completions,
        },
      }),
    );
  } catch {
    // localStorage can be disabled or full; gameplay must keep moving.
  }

  return result;
}

function createLevelCompletionResult(
  attempt: LevelCompletionAttempt,
  currentRecord: LevelResultRecord | undefined,
): LevelCompletionResult {
  const isFirstCompletion = currentRecord === undefined;
  const isNewBestTime =
    isFirstCompletion || attempt.elapsedMs < currentRecord.bestTimeMs;
  const isNewFewestDeaths =
    isFirstCompletion || attempt.deathCount < currentRecord.fewestDeaths;

  return {
    ...attempt,
    bestTimeMs: isNewBestTime ? attempt.elapsedMs : currentRecord.bestTimeMs,
    fewestDeaths: isNewFewestDeaths
      ? attempt.deathCount
      : currentRecord.fewestDeaths,
    completions: (currentRecord?.completions ?? 0) + 1,
    isNewBestTime,
    isNewFewestDeaths,
  };
}

function parseLevelResultRecords(raw: string | null): LevelResultRecords {
  if (!raw) {
    return {};
  }

  const parsed: unknown = JSON.parse(raw);

  if (typeof parsed !== "object" || parsed === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(parsed).flatMap(([levelId, value]) => {
      const record = normalizeLevelResultRecord(value);

      return record ? [[levelId, record]] : [];
    }),
  );
}

function normalizeLevelResultRecord(
  value: unknown,
): LevelResultRecord | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const candidate = value as Partial<LevelResultRecord>;

  if (
    typeof candidate.bestTimeMs !== "number" ||
    typeof candidate.fewestDeaths !== "number" ||
    typeof candidate.completions !== "number"
  ) {
    return undefined;
  }

  return {
    bestTimeMs: normalizeNonNegativeInteger(candidate.bestTimeMs),
    fewestDeaths: normalizeNonNegativeInteger(candidate.fewestDeaths),
    completions: Math.max(
      1,
      normalizeNonNegativeInteger(candidate.completions),
    ),
  };
}

function normalizeNonNegativeInteger(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function getBrowserLevelResultStorage(): LevelResultStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}
