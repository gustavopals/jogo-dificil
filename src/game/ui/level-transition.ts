import type { LevelDefinition } from "../../shared";
import { CAMPAIGN_LEVEL_COUNT } from "../../data/levels/challenge-content";
import type { LevelCompletionResult } from "../systems/level-results";

export const LEVEL_TRANSITION_DELAY_MS = 3200;

export const LEVEL_TRANSITION_COPY = {
  completedTitle: "Fase concluida",
  finalTitle: "Campanha concluida",
  finalDetail: "As 10 fases da campanha foram vencidas",
  challengeUnlockedTitle: "Desafio liberado",
  challengeUnlockedDetail:
    "Campanha vencida. Um circuito bonus HD aguarda adiante.",
  challengeFinalTitle: "Desafio concluido",
  challengeFinalDetail:
    "O segmento pos-campanha foi vencido. Campanha e desafio completos.",
  restartPrompt: "ENTER reinicia",
} as const;

export type LevelTransitionLabels = {
  readonly title: string;
  readonly detail: string;
  readonly result: string;
  readonly deaths: string;
  readonly prompt: string;
  readonly isFinal: boolean;
};

export function normalizeTransitionDeathCount(deathCount: number): number {
  return Number.isFinite(deathCount) ? Math.max(0, Math.trunc(deathCount)) : 0;
}

export function formatTransitionLevel(
  level: Pick<LevelDefinition, "name" | "order" | "contentKind">,
): string {
  if (level.contentKind === "challenge") {
    return `Desafio: ${level.name}`;
  }

  return `Fase ${level.order}: ${level.name}`;
}

export function formatTransitionDeaths(deathCount: number): string {
  return `Mortes ${normalizeTransitionDeathCount(deathCount)}`;
}

export function formatTransitionResult(
  result: Pick<
    LevelCompletionResult,
    | "elapsedMs"
    | "deathCount"
    | "bestTimeMs"
    | "fewestDeaths"
    | "isNewBestTime"
    | "isNewFewestDeaths"
  > | null,
): string {
  if (!result) {
    return "";
  }

  const recordLabel =
    result.isNewBestTime || result.isNewFewestDeaths
      ? "novo recorde"
      : `melhor ${formatTransitionTime(result.bestTimeMs)}/${normalizeTransitionDeathCount(result.fewestDeaths)}`;

  return `Resultado ${formatTransitionTime(result.elapsedMs)} | ${formatTransitionPhaseDeaths(result.deathCount)} | ${recordLabel}`;
}

export function createLevelTransitionLabels(
  completedLevel: Pick<LevelDefinition, "name" | "order" | "contentKind">,
  nextLevel: Pick<LevelDefinition, "name" | "order" | "contentKind"> | undefined,
  deathCount: number,
  result: LevelCompletionResult | null = null,
): LevelTransitionLabels {
  if (!nextLevel) {
    const isChallengeCompletion = completedLevel.contentKind === "challenge";

    return {
      title: isChallengeCompletion
        ? LEVEL_TRANSITION_COPY.challengeFinalTitle
        : LEVEL_TRANSITION_COPY.finalTitle,
      detail: isChallengeCompletion
        ? LEVEL_TRANSITION_COPY.challengeFinalDetail
        : LEVEL_TRANSITION_COPY.finalDetail,
      result: formatTransitionResult(result),
      deaths: formatTransitionDeaths(deathCount),
      prompt: LEVEL_TRANSITION_COPY.restartPrompt,
      isFinal: true,
    };
  }

  if (
    completedLevel.order === CAMPAIGN_LEVEL_COUNT &&
    nextLevel.contentKind === "challenge"
  ) {
    return {
      title: LEVEL_TRANSITION_COPY.challengeUnlockedTitle,
      detail: `${formatTransitionLevel(completedLevel)} -> ${formatTransitionLevel(nextLevel)}`,
      result: formatTransitionResult(result),
      deaths: formatTransitionDeaths(deathCount),
      prompt: "",
      isFinal: false,
    };
  }

  return {
    title: LEVEL_TRANSITION_COPY.completedTitle,
    detail: `${formatTransitionLevel(completedLevel)} -> ${formatTransitionLevel(nextLevel)}`,
    result: formatTransitionResult(result),
    deaths: formatTransitionDeaths(deathCount),
    prompt: "",
    isFinal: false,
  };
}

function formatTransitionTime(ms: number): string {
  const normalizedMs = Number.isFinite(ms) ? Math.max(0, Math.trunc(ms)) : 0;

  return `${(normalizedMs / 1000).toFixed(1)}s`;
}

function formatTransitionPhaseDeaths(deathCount: number): string {
  const normalizedDeathCount = normalizeTransitionDeathCount(deathCount);

  return normalizedDeathCount === 1
    ? "1 morte"
    : `${normalizedDeathCount} mortes`;
}
