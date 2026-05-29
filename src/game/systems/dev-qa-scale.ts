import {
  GAME_RESOLUTION,
  PLAYER_SIZE,
  TILE_SIZE_PX,
  WORLD_PHYSICS_SCALE,
} from "../constants";

export type DevQaScaleSnapshot = {
  readonly resolution: {
    readonly width: number;
    readonly height: number;
  };
  readonly tileSizePx: number;
  readonly worldPhysicsScale: number;
  readonly playerVisual: {
    readonly width: number;
    readonly height: number;
  };
  readonly playerHitbox: {
    readonly width: number;
    readonly height: number;
  };
  readonly playerHitboxMargin: {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  };
};

export function getDevQaScaleSnapshot(): DevQaScaleSnapshot {
  return {
    resolution: {
      width: GAME_RESOLUTION.width,
      height: GAME_RESOLUTION.height,
    },
    tileSizePx: TILE_SIZE_PX,
    worldPhysicsScale: WORLD_PHYSICS_SCALE,
    playerVisual: {
      width: PLAYER_SIZE.visualWidth,
      height: PLAYER_SIZE.visualHeight,
    },
    playerHitbox: {
      width: PLAYER_SIZE.hitboxWidth,
      height: PLAYER_SIZE.hitboxHeight,
    },
    playerHitboxMargin: {
      left: PLAYER_SIZE.spriteMargin.left,
      right: PLAYER_SIZE.spriteMargin.right,
      top: PLAYER_SIZE.spriteMargin.top,
      bottom: PLAYER_SIZE.spriteMargin.bottom,
    },
  };
}
