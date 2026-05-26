import {
  formatDeathCounter,
  HUD_LAYOUT,
  HUD_TEXT_STYLE,
  isHudOutsideCriticalGameplayArea,
} from "./hud";

export const DEATH_COUNTER_HUD_LAYOUT = HUD_LAYOUT;
export const DEATH_COUNTER_TEXT_STYLE = HUD_TEXT_STYLE;

export { formatDeathCounter };

export function isDeathCounterOutsideCriticalArea(): boolean {
  return isHudOutsideCriticalGameplayArea();
}
