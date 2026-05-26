import type { LevelDefinition } from "../../shared";
import { GAME_RESOLUTION } from "../constants";
import type { GameStateSnapshot } from "../systems/game-state";

export const HUD_LAYOUT = {
  x: 6,
  y: 5,
  width: GAME_RESOLUTION.width - 12,
  height: 18,
  paddingX: 7,
  paddingY: 4,
  maxCriticalHeight: 28,
  maxScreenAreaRatio: 0.07,
  deathsX: 13,
  levelX: GAME_RESOLUTION.width / 2,
  musicButtonX: GAME_RESOLUTION.width - 69,
  musicButtonY: 8,
  musicButtonWidth: 26,
  musicButtonHeight: 12,
  musicButtonTextX: GAME_RESOLUTION.width - 56,
  musicButtonTextY: 14,
  muteX: GAME_RESOLUTION.width - 13,
} as const;

export const HUD_PANEL_STYLE = {
  fillColor: 0x050608,
  fillAlpha: 0.64,
  strokeColor: 0x80d7c2,
  strokeAlpha: 0.34,
} as const;

export const HUD_TEXT_STYLE = {
  color: "#f5f7fb",
  fontFamily: "monospace",
  fontSize: "10px",
} as const;

export const HUD_ACCENT_TEXT_STYLE = {
  ...HUD_TEXT_STYLE,
  color: "#80d7c2",
} as const;

export const HUD_MUSIC_BUTTON_STYLE = {
  fillColor: 0x80d7c2,
  fillAlpha: 0.86,
  mutedFillColor: 0x262b31,
  mutedFillAlpha: 0.84,
  strokeColor: 0xf5f7fb,
  strokeAlpha: 0.42,
  textColor: "#050608",
  mutedTextColor: "#f5f7fb",
} as const;

export type HudLabels = {
  readonly deaths: string;
  readonly level: string;
  readonly music: string;
  readonly mute: string;
};

export function formatDeathCounter(deathCount: number): string {
  const normalizedDeathCount = Number.isFinite(deathCount)
    ? Math.max(0, Math.trunc(deathCount))
    : 0;

  return `Mortes ${normalizedDeathCount}`;
}

export function formatHudLevel(
  level: Pick<LevelDefinition, "name" | "order">,
): string {
  return `Fase ${level.order}: ${level.name}`;
}

export function formatMuteStatus(isMuted: boolean): string {
  return isMuted ? "MUDO" : "";
}

export function formatMusicMuteStatus(isMusicMuted: boolean): string {
  return isMusicMuted ? "OFF" : "♪";
}

export function formatHudLabels(
  state: Pick<GameStateSnapshot, "deathCount" | "isMuted" | "isMusicMuted">,
  level: Pick<LevelDefinition, "name" | "order">,
): HudLabels {
  return {
    deaths: formatDeathCounter(state.deathCount),
    level: formatHudLevel(level),
    music: formatMusicMuteStatus(state.isMusicMuted),
    mute: formatMuteStatus(state.isMuted),
  };
}

export function isHudOutsideCriticalGameplayArea(): boolean {
  const hudBottom = HUD_LAYOUT.y + HUD_LAYOUT.height;
  const hudArea = HUD_LAYOUT.width * HUD_LAYOUT.height;
  const screenArea = GAME_RESOLUTION.width * GAME_RESOLUTION.height;

  return (
    HUD_LAYOUT.x >= 0 &&
    HUD_LAYOUT.y >= 0 &&
    hudBottom <= HUD_LAYOUT.maxCriticalHeight &&
    hudArea / screenArea <= HUD_LAYOUT.maxScreenAreaRatio
  );
}
