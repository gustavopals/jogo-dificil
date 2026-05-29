import { GAME_RESOLUTION } from "../constants";
import { scaleLegacyY } from "../scale";

export const PAUSE_OVERLAY_COPY = {
  title: "Pausado",
  resumeCommand: "ESC volta",
  muteCommand: "M audio",
} as const;

export const PAUSE_OVERLAY_LAYOUT = {
  width: GAME_RESOLUTION.width,
  height: GAME_RESOLUTION.height,
  centerX: GAME_RESOLUTION.width / 2,
  centerY: GAME_RESOLUTION.height / 2,
  cardWidth: scaleLegacyY(186),
  cardHeight: scaleLegacyY(72),
  titleY: GAME_RESOLUTION.height / 2 - scaleLegacyY(14),
  commandY: GAME_RESOLUTION.height / 2 + scaleLegacyY(6),
  muteY: GAME_RESOLUTION.height / 2 + scaleLegacyY(20),
} as const;

export const PAUSE_OVERLAY_STYLE = {
  fillColor: 0x050608,
  fillAlpha: 0.78,
  titleColor: "#f5f7fb",
  commandColor: "#80d7c2",
  mutedColor: "#f5f7fb",
} as const;

export function formatPauseMuteStatus(isMuted: boolean): string {
  return isMuted ? "Som: mudo" : "Som: ligado";
}
