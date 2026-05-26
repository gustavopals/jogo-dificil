import { GAMEPLAY_SPRITE_KEYS, type GameplaySpriteKey } from "../../data/art";

export function getCheckpointTextureKey(isActive: boolean): GameplaySpriteKey {
  return isActive
    ? GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_ACTIVE
    : GAMEPLAY_SPRITE_KEYS.MARKER_CHECKPOINT_INACTIVE;
}

export function getExitTextureKey(): GameplaySpriteKey {
  return GAMEPLAY_SPRITE_KEYS.MARKER_EXIT;
}
