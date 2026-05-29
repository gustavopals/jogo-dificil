import type { LevelDefinition } from "../../shared";
import { GAME_RESOLUTION } from "../constants";
import {
  scaleLegacyFontPx,
  scaleLegacyX,
  scaleLegacyY,
} from "../scale";
import type {
  GameStateSnapshot,
  PlayerEnergyHudState,
} from "../systems/game-state";
import { VISUAL_READABILITY_SEMANTIC_COLORS } from "../systems/visual-readability";

export const HUD_LAYOUT = {
  x: scaleLegacyX(6),
  y: scaleLegacyY(4),
  width: GAME_RESOLUTION.width - scaleLegacyX(12),
  height: scaleLegacyY(16),
  paddingX: scaleLegacyX(7),
  paddingY: scaleLegacyY(4),
  maxCriticalHeight: scaleLegacyY(22),
  maxScreenAreaRatio: 0.07,
  deathsX: scaleLegacyX(12),
  energyMeterX: scaleLegacyX(110),
  energyMeterY: scaleLegacyY(11),
  energySegmentWidth: scaleLegacyX(8),
  energySegmentHeight: scaleLegacyY(6),
  energySegmentGap: scaleLegacyX(2),
  energySegmentCount: 5,
  levelX: GAME_RESOLUTION.width / 2,
  musicButtonX: GAME_RESOLUTION.width - scaleLegacyX(69),
  musicButtonY: scaleLegacyY(8),
  musicButtonWidth: scaleLegacyX(26),
  musicButtonHeight: scaleLegacyY(12),
  musicButtonTextX: GAME_RESOLUTION.width - scaleLegacyX(56),
  musicButtonTextY: scaleLegacyY(14),
  muteX: GAME_RESOLUTION.width - scaleLegacyX(13),
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
  fontSize: scaleLegacyFontPx(10),
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

export const HUD_ENERGY_METER_STYLE = {
  emptyFillColor: 0x10161a,
  emptyFillAlpha: 0.82,
  emptyStrokeColor: VISUAL_READABILITY_SEMANTIC_COLORS.ui.mutedStroke,
  emptyStrokeAlpha: 0.58,
  fillColor: VISUAL_READABILITY_SEMANTIC_COLORS.energy.primary,
  chargingFillColor: 0xa7f3d0,
  fullFillColor: 0xf5f7fb,
  fullFeedbackColor: 0xf5f7fb,
  insufficientFeedbackColor: VISUAL_READABILITY_SEMANTIC_COLORS.energy.failure,
  fillAlpha: 0.92,
} as const;

export type HudLabels = {
  readonly deaths: string;
  readonly level: string;
  readonly music: string;
  readonly mute: string;
};

export type HudEnergyMeterView = {
  readonly fillRatio: number;
  readonly fillColor: number;
  readonly fillAlpha: number;
  readonly segmentFillRatios: readonly number[];
};

export type HudEnergyMeterState = Pick<
  PlayerEnergyHudState,
  "current" | "max" | "isCharging" | "isFull"
>;

export function formatDeathCounter(deathCount: number): string {
  const normalizedDeathCount = Number.isFinite(deathCount)
    ? Math.max(0, Math.trunc(deathCount))
    : 0;

  return `Mortes ${normalizedDeathCount}`;
}

export function formatHudLevel(
  level: Pick<LevelDefinition, "name" | "order">,
): string {
  const base = `Fase ${level.order}: ${level.name}`;

  return base.length <= 40 ? base : `${base.slice(0, 37)}...`;
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

export function getHudEnergyMeterView(
  energy: HudEnergyMeterState,
  segmentCount = HUD_LAYOUT.energySegmentCount,
): HudEnergyMeterView {
  const fillRatio = normalizeEnergyRatio(energy.current, energy.max);
  const normalizedSegmentCount = Math.max(0, Math.trunc(segmentCount));
  const segmentFillRatios = Array.from(
    { length: normalizedSegmentCount },
    (_unused, index) => clampRatio(fillRatio * normalizedSegmentCount - index),
  );

  return {
    fillRatio,
    fillColor: energy.isFull
      ? HUD_ENERGY_METER_STYLE.fullFillColor
      : energy.isCharging
        ? HUD_ENERGY_METER_STYLE.chargingFillColor
        : HUD_ENERGY_METER_STYLE.fillColor,
    fillAlpha: HUD_ENERGY_METER_STYLE.fillAlpha,
    segmentFillRatios,
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

function normalizeEnergyRatio(current: number, max: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) {
    return 0;
  }

  return clampRatio(current / max);
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}
