import { PLAYER_AUDIO_IDS } from "../../data/audio";

export type PlayerActionAudioKind = "primary" | "secondary";

export type LandingAudioInput = {
  readonly wasGrounded: boolean;
  readonly isGrounded: boolean;
  readonly velocityY: number;
};

export const LANDING_AUDIO_MIN_VELOCITY_Y = 180;

export function shouldPlayLandingAudio(input: LandingAudioInput): boolean {
  return (
    !input.wasGrounded &&
    input.isGrounded &&
    input.velocityY >= LANDING_AUDIO_MIN_VELOCITY_Y
  );
}

export function getPlayerActionAudioId(action: PlayerActionAudioKind): string {
  return action === "primary"
    ? PLAYER_AUDIO_IDS.PRIMARY_ACTION
    : PLAYER_AUDIO_IDS.SECONDARY_ACTION;
}
