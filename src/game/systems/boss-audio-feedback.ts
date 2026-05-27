import { BOSS_AUDIO_IDS } from "../../data/audio";
import type { BossAttackCycleEvent } from "../physics";

export function getBossEntryAudioId(): string {
  return BOSS_AUDIO_IDS.ENTRY;
}

export function getBossAttackCycleAudioIds(
  events: readonly BossAttackCycleEvent[],
): readonly string[] {
  return events.flatMap((event) => {
    switch (event.kind) {
      case "tell-started":
        return [BOSS_AUDIO_IDS.WINDUP];
      case "attack-started":
        return [BOSS_AUDIO_IDS.ATTACK];
      case "recover-started":
      case "recover-ended":
        return [];
    }
  });
}

export function getBossDamageAudioId(input: {
  readonly didApplyDamage: boolean;
  readonly didDefeat: boolean;
}): string | undefined {
  if (input.didDefeat) {
    return BOSS_AUDIO_IDS.DEFEAT;
  }

  return input.didApplyDamage ? BOSS_AUDIO_IDS.HIT : undefined;
}
