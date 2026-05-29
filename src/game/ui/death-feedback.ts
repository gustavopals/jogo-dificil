import type { DeathCause, PlayerDiedEvent } from "../systems/game-events";
import { GAME_RESOLUTION } from "../constants";
import { scaleLegacyY } from "../scale";
import { HUD_LAYOUT, HUD_TEXT_STYLE } from "./hud";

export const DEATH_FEEDBACK_DURATION_MS = 850;

export const DEATH_FEEDBACK_LAYOUT = {
  x: GAME_RESOLUTION.width / 2,
  y: HUD_LAYOUT.y + HUD_LAYOUT.height + scaleLegacyY(7),
} as const;

export const DEATH_FEEDBACK_TEXT_STYLE = {
  ...HUD_TEXT_STYLE,
  color: "#e35d6a",
} as const;

const DEATH_FEEDBACK_COPY = {
  fall: "Caiu. O chao tambem mente.",
  hazard: "Perigo tocado.",
  trap: "Armadilha ativada.",
  projectile: "Projetil acertou.",
  crusher: "Esmagado.",
  boss: "Chefe acertou.",
  "manual-restart": "Reinicio manual.",
  unknown: "Morte registrada.",
} as const satisfies Record<DeathCause, string>;

export function formatDeathFeedback(
  event: Pick<PlayerDiedEvent, "cause">,
): string {
  return DEATH_FEEDBACK_COPY[event.cause] ?? DEATH_FEEDBACK_COPY.unknown;
}

export function hasDeathSource(
  event: Pick<PlayerDiedEvent, "sourceId">,
): boolean {
  return typeof event.sourceId === "string" && event.sourceId.length > 0;
}
