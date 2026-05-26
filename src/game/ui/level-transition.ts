import type { LevelDefinition } from "../../shared";

export const LEVEL_TRANSITION_DELAY_MS = 1100;

export const LEVEL_TRANSITION_COPY = {
  completedTitle: "Fase concluida",
  finalTitle: "MVP concluido",
  finalDetail: "As 3 fases iniciais foram vencidas",
  restartPrompt: "ENTER reinicia",
} as const;

export type LevelTransitionLabels = {
  readonly title: string;
  readonly detail: string;
  readonly deaths: string;
  readonly prompt: string;
  readonly isFinal: boolean;
};

export function normalizeTransitionDeathCount(deathCount: number): number {
  return Number.isFinite(deathCount) ? Math.max(0, Math.trunc(deathCount)) : 0;
}

export function formatTransitionLevel(
  level: Pick<LevelDefinition, "name" | "order">,
): string {
  return `Fase ${level.order}: ${level.name}`;
}

export function formatTransitionDeaths(deathCount: number): string {
  return `Mortes ${normalizeTransitionDeathCount(deathCount)}`;
}

export function createLevelTransitionLabels(
  completedLevel: Pick<LevelDefinition, "name" | "order">,
  nextLevel: Pick<LevelDefinition, "name" | "order"> | undefined,
  deathCount: number,
): LevelTransitionLabels {
  if (!nextLevel) {
    return {
      title: LEVEL_TRANSITION_COPY.finalTitle,
      detail: LEVEL_TRANSITION_COPY.finalDetail,
      deaths: formatTransitionDeaths(deathCount),
      prompt: LEVEL_TRANSITION_COPY.restartPrompt,
      isFinal: true,
    };
  }

  return {
    title: LEVEL_TRANSITION_COPY.completedTitle,
    detail: `${formatTransitionLevel(completedLevel)} -> ${formatTransitionLevel(nextLevel)}`,
    deaths: formatTransitionDeaths(deathCount),
    prompt: "",
    isFinal: false,
  };
}
