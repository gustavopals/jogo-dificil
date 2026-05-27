import { ENERGY_AUDIO_IDS } from "../../data/audio";
import type {
  CyanBurstBeamImpact,
  CyanSparkProjectileImpact,
  PlayerEnergyActivity,
  PlayerEnergyEffect,
  PlayerEnergyRejection,
} from "../physics";

export type EnergyAudioCue = {
  readonly action: "play" | "stop";
  readonly audioId: string;
  readonly category: "sfx";
  readonly loop?: boolean;
};

export type PlayerEnergyAudioCueInput = {
  readonly previousActivity: PlayerEnergyActivity;
  readonly nextActivity: PlayerEnergyActivity;
  readonly effects: readonly PlayerEnergyEffect[];
};

export function getPlayerEnergyAudioCues(
  input: PlayerEnergyAudioCueInput,
): readonly EnergyAudioCue[] {
  const cues: EnergyAudioCue[] = [];

  if (
    input.previousActivity !== "charging" &&
    input.nextActivity === "charging"
  ) {
    cues.push(playEnergyCue(ENERGY_AUDIO_IDS.CHARGE_LOOP, { loop: true }));
  }

  if (
    input.previousActivity === "charging" &&
    input.nextActivity !== "charging"
  ) {
    cues.push(stopEnergyCue(ENERGY_AUDIO_IDS.CHARGE_LOOP));
  }

  if (input.effects.includes("cyan-energy-full")) {
    cues.push(playEnergyCue(ENERGY_AUDIO_IDS.CHARGE_FULL));
  }

  if (input.effects.includes("cyan-spark-fired")) {
    cues.push(playEnergyCue(ENERGY_AUDIO_IDS.SHOT));
  }

  if (input.effects.includes("cyan-burst-preparation-started")) {
    cues.push(playEnergyCue(ENERGY_AUDIO_IDS.SPECIAL_WINDUP));
  }

  if (input.effects.includes("cyan-burst-fired")) {
    cues.push(playEnergyCue(ENERGY_AUDIO_IDS.SPECIAL_FIRE));
  }

  return cues;
}

export function getPlayerEnergyRejectionAudioCues(
  rejections: readonly PlayerEnergyRejection[],
): readonly EnergyAudioCue[] {
  return rejections.some(
    (rejection) => rejection.reason === "insufficient-energy",
  )
    ? [playEnergyCue(ENERGY_AUDIO_IDS.SHOT_EMPTY)]
    : [];
}

export function getCyanSparkImpactAudioCues(
  impacts: readonly CyanSparkProjectileImpact[],
): readonly EnergyAudioCue[] {
  return impacts.some((impact) => impact.kind !== "range")
    ? [playEnergyCue(ENERGY_AUDIO_IDS.IMPACT_SMALL)]
    : [];
}

export function getCyanBurstImpactAudioCues(
  impacts: readonly CyanBurstBeamImpact[],
): readonly EnergyAudioCue[] {
  return impacts.length > 0
    ? [playEnergyCue(ENERGY_AUDIO_IDS.IMPACT_HEAVY)]
    : [];
}

export function getStopPlayerEnergyAudioCues(): readonly EnergyAudioCue[] {
  return [stopEnergyCue(ENERGY_AUDIO_IDS.CHARGE_LOOP)];
}

function playEnergyCue(
  audioId: string,
  options: { readonly loop?: boolean } = {},
): EnergyAudioCue {
  return {
    action: "play",
    audioId,
    category: "sfx",
    ...(options.loop === undefined ? {} : { loop: options.loop }),
  };
}

function stopEnergyCue(audioId: string): EnergyAudioCue {
  return {
    action: "stop",
    audioId,
    category: "sfx",
  };
}
