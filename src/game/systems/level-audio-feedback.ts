import { LEVEL_AUDIO_IDS } from "../../data/audio";
import type { ItemKind, TrapKind } from "../../shared";

export function getItemCollectionAudioId(itemKind: ItemKind): string {
  switch (itemKind) {
    case "collectible":
    case "key":
    case "optional":
    case "required":
      return LEVEL_AUDIO_IDS.ITEM_COLLECT;
  }
}

export function getTrapActivationAudioId(trapKind: TrapKind): string {
  switch (trapKind) {
    case "falling-platform":
      return LEVEL_AUDIO_IDS.FALLING_PLATFORM;
    case "projectile":
      return LEVEL_AUDIO_IDS.PROJECTILE;
    case "false-block":
    case "breakable-floor":
    case "spike-pop":
      return LEVEL_AUDIO_IDS.TRAP_ACTIVATE;
  }
}
