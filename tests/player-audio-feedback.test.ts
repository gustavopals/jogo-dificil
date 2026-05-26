import { describe, expect, it } from "vitest";

import { PLAYER_AUDIO_IDS } from "../src/data/audio";
import {
  getPlayerActionAudioId,
  LANDING_AUDIO_MIN_VELOCITY_Y,
  shouldPlayLandingAudio,
} from "../src/game/systems/player-audio-feedback";

describe("player audio feedback", () => {
  it("only plays landing audio for real falls", () => {
    expect(
      shouldPlayLandingAudio({
        wasGrounded: false,
        isGrounded: true,
        velocityY: LANDING_AUDIO_MIN_VELOCITY_Y,
      }),
    ).toBe(true);
    expect(
      shouldPlayLandingAudio({
        wasGrounded: true,
        isGrounded: true,
        velocityY: LANDING_AUDIO_MIN_VELOCITY_Y,
      }),
    ).toBe(false);
    expect(
      shouldPlayLandingAudio({
        wasGrounded: false,
        isGrounded: false,
        velocityY: LANDING_AUDIO_MIN_VELOCITY_Y,
      }),
    ).toBe(false);
    expect(
      shouldPlayLandingAudio({
        wasGrounded: false,
        isGrounded: true,
        velocityY: LANDING_AUDIO_MIN_VELOCITY_Y - 1,
      }),
    ).toBe(false);
  });

  it("maps primary and secondary actions to distinct cues", () => {
    expect(getPlayerActionAudioId("primary")).toBe(
      PLAYER_AUDIO_IDS.PRIMARY_ACTION,
    );
    expect(getPlayerActionAudioId("secondary")).toBe(
      PLAYER_AUDIO_IDS.SECONDARY_ACTION,
    );
  });
});
