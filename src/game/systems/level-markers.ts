import { GAMEPLAY_SPRITE_KEYS, type GameplaySpriteKey } from "../../data/art";

export const LEVEL_MARKER_VISUAL = {
  checkpointInactiveAlpha: 0.72,
  checkpointActiveAlpha: 0.98,
  exitReadyAlpha: 0.94,
  exitBlockedAlpha: 0.62,
  exitBlockedTint: 0xe35d6a,
} as const;

export function getCheckpointTextureKey(isActive: boolean): GameplaySpriteKey {
  return isActive
    ? GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE
    : GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE;
}

export function getCheckpointMarkerAlpha(isActive: boolean): number {
  return isActive
    ? LEVEL_MARKER_VISUAL.checkpointActiveAlpha
    : LEVEL_MARKER_VISUAL.checkpointInactiveAlpha;
}

export function getExitTextureKey(): GameplaySpriteKey {
  return GAMEPLAY_SPRITE_KEYS.MARKER_EXIT;
}

export function getExitMarkerVisual(isBlockedByBoss: boolean): {
  readonly alpha: number;
  readonly tint: number;
} {
  return isBlockedByBoss
    ? {
        alpha: LEVEL_MARKER_VISUAL.exitBlockedAlpha,
        tint: LEVEL_MARKER_VISUAL.exitBlockedTint,
      }
    : {
        alpha: LEVEL_MARKER_VISUAL.exitReadyAlpha,
        tint: 0xffffff,
      };
}
