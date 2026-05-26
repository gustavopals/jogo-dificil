import { GAME_RESOLUTION } from "../constants";

export const DEATH_COUNTER_HUD_LAYOUT = {
  x: 6,
  y: 5,
  width: 88,
  height: 18,
  paddingX: 6,
  paddingY: 4,
  maxCriticalHeight: 32,
  maxScreenAreaRatio: 0.02,
} as const;

export const DEATH_COUNTER_TEXT_STYLE = {
  color: "#f5f7fb",
  fontFamily: "monospace",
  fontSize: "10px",
} as const;

export function formatDeathCounter(deathCount: number): string {
  const normalizedDeathCount = Number.isFinite(deathCount)
    ? Math.max(0, Math.trunc(deathCount))
    : 0;

  return `Mortes ${normalizedDeathCount}`;
}

export function isDeathCounterOutsideCriticalArea(): boolean {
  const counterBottom =
    DEATH_COUNTER_HUD_LAYOUT.y + DEATH_COUNTER_HUD_LAYOUT.height;
  const counterArea =
    DEATH_COUNTER_HUD_LAYOUT.width * DEATH_COUNTER_HUD_LAYOUT.height;
  const screenArea = GAME_RESOLUTION.width * GAME_RESOLUTION.height;

  return (
    DEATH_COUNTER_HUD_LAYOUT.x >= 0 &&
    DEATH_COUNTER_HUD_LAYOUT.y >= 0 &&
    counterBottom <= DEATH_COUNTER_HUD_LAYOUT.maxCriticalHeight &&
    counterArea / screenArea <= DEATH_COUNTER_HUD_LAYOUT.maxScreenAreaRatio
  );
}
