import { describe, expect, it } from "vitest";

import { ENERGY_AUDIO_IDS } from "../src/data/audio";
import {
  getCyanBurstImpactAudioCues,
  getCyanSparkImpactAudioCues,
  getPlayerEnergyAudioCues,
  getPlayerEnergyRejectionAudioCues,
  getStopPlayerEnergyAudioCues,
  type EnergyAudioCue,
} from "../src/game/systems/player-energy-audio-feedback";
import type {
  CyanBurstBeamImpact,
  CyanSparkProjectileImpact,
} from "../src/game/physics";

describe("player energy audio feedback", () => {
  it("starts and stops the Carga Ciano loop only on activity transitions", () => {
    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "idle",
        nextActivity: "charging",
        effects: ["cyan-energy-gained"],
      }),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.CHARGE_LOOP, { loop: true })]);

    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "charging",
        nextActivity: "charging",
        effects: ["cyan-energy-gained"],
      }),
    ).toEqual([]);

    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "charging",
        nextActivity: "idle",
        effects: [],
      }),
    ).toEqual([stopCue(ENERGY_AUDIO_IDS.CHARGE_LOOP)]);
  });

  it("plays one-shot cues for full energy and energy attacks", () => {
    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "charging",
        nextActivity: "charging",
        effects: ["cyan-energy-gained", "cyan-energy-full"],
      }),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.CHARGE_FULL)]);

    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "idle",
        nextActivity: "idle",
        effects: ["cyan-spark-fired"],
      }),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.SHOT)]);

    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "idle",
        nextActivity: "burst-preparing",
        effects: ["cyan-burst-preparation-started"],
      }),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.SPECIAL_WINDUP)]);

    expect(
      getPlayerEnergyAudioCues({
        previousActivity: "burst-preparing",
        nextActivity: "burst-firing",
        effects: ["cyan-burst-fired"],
      }),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.SPECIAL_FIRE)]);
  });

  it("plays the failure cue only when energy is insufficient", () => {
    expect(
      getPlayerEnergyRejectionAudioCues([
        {
          request: "cyan-spark",
          reason: "insufficient-energy",
        },
      ]),
    ).toEqual([playCue(ENERGY_AUDIO_IDS.SHOT_EMPTY)]);

    expect(
      getPlayerEnergyRejectionAudioCues([
        {
          request: "cyan-spark",
          reason: "cooldown",
        },
      ]),
    ).toEqual([]);
  });

  it("maps projectile and beam impacts to compact impact cues", () => {
    const rangeImpact: CyanSparkProjectileImpact = {
      projectileId: "spark-1",
      kind: "range",
    };
    const solidImpact: CyanSparkProjectileImpact = {
      projectileId: "spark-1",
      kind: "solid",
    };
    const burstImpact: CyanBurstBeamImpact = {
      targetId: "core-1",
      kind: "target",
      damage: 2,
    };

    expect(getCyanSparkImpactAudioCues([rangeImpact])).toEqual([]);
    expect(getCyanSparkImpactAudioCues([solidImpact])).toEqual([
      playCue(ENERGY_AUDIO_IDS.IMPACT_SMALL),
    ]);
    expect(getCyanBurstImpactAudioCues([])).toEqual([]);
    expect(getCyanBurstImpactAudioCues([burstImpact])).toEqual([
      playCue(ENERGY_AUDIO_IDS.IMPACT_HEAVY),
    ]);
  });

  it("exposes an explicit stop cue for reset, pause and cleanup", () => {
    expect(getStopPlayerEnergyAudioCues()).toEqual([
      stopCue(ENERGY_AUDIO_IDS.CHARGE_LOOP),
    ]);
  });
});

function playCue(
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

function stopCue(audioId: string): EnergyAudioCue {
  return {
    action: "stop",
    audioId,
    category: "sfx",
  };
}
