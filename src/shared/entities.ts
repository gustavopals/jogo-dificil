import type { RectLike, Vector2Like } from "./geometry";

export type EntityId = string;
export type EntityKind =
  | "player"
  | "enemy"
  | "hazard"
  | "trap"
  | "item"
  | "interactive-object";
export type FacingDirection = "left" | "right";

export type EntityDefinition = {
  readonly id: EntityId;
  readonly kind: EntityKind;
  readonly position: Vector2Like;
  readonly hitbox: RectLike;
  readonly assetId?: string;
};

export type PlayerEntityState = {
  readonly id: EntityId;
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly facing: FacingDirection;
  readonly isAlive: boolean;
  readonly isGrounded: boolean;
};
