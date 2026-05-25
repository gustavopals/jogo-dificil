import Phaser from "phaser";

import {
  PINO_ANIMATION_KEYS,
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_TEXTURE_KEYS,
  selectPinoAnimationDefinition,
  type PinoAnimationKey,
  type PinoAnimationState,
} from "../../data/characters/pino-animations";
import type {
  FacingDirection,
  PlayerEntityState,
  RectLike,
  Vector2Like,
} from "../../shared";
import { PLAYER_SIZE } from "../constants";

export type PlayerSpawnConfig = {
  readonly id: string;
  readonly position: Vector2Like;
  readonly facing: FacingDirection;
};

export type PlayerMovementUpdate = {
  readonly velocity?: Vector2Like;
  readonly isGrounded?: boolean;
  readonly facing?: FacingDirection;
  readonly isUsingPrimaryAction?: boolean;
  readonly isUsingSecondaryAction?: boolean;
};

export type PlayerPhysicsState = {
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly isGrounded: boolean;
  readonly hitbox: RectLike;
};

export type PlayerVisualState = {
  readonly facing: FacingDirection;
  readonly animationState: PinoAnimationState;
  readonly animationKey: PinoAnimationKey;
  readonly isAlive: boolean;
  readonly isRespawning: boolean;
  readonly isUsingPrimaryAction: boolean;
  readonly isUsingSecondaryAction: boolean;
};

const PLAYER_HITBOX: RectLike = {
  x: PLAYER_SIZE.spriteMargin.left,
  y: PLAYER_SIZE.spriteMargin.top,
  width: PLAYER_SIZE.hitboxWidth,
  height: PLAYER_SIZE.hitboxHeight,
};

const MOVEMENT_EPSILON = 1;

function cloneVector(vector: Vector2Like): Vector2Like {
  return {
    x: vector.x,
    y: vector.y,
  };
}

function cloneHitbox(hitbox: RectLike): RectLike {
  return {
    x: hitbox.x,
    y: hitbox.y,
    width: hitbox.width,
    height: hitbox.height,
  };
}

export class Player {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly id: string;
  private physicsState: PlayerPhysicsState;
  private visualState: PlayerVisualState;

  public static registerAnimations(scene: Phaser.Scene): void {
    PINO_ANIMATIONS.forEach((animation) => {
      if (scene.anims.exists(animation.key)) {
        return;
      }

      const frames = animation.frames.map((frame) => {
        if (frame.frame === undefined) {
          return {
            key: frame.textureKey,
          };
        }

        return {
          key: frame.textureKey,
          frame: frame.frame,
        };
      });

      scene.anims.create({
        key: animation.key,
        frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }

  public constructor(scene: Phaser.Scene, config: PlayerSpawnConfig) {
    this.id = config.id;

    this.sprite = scene.physics.add
      .sprite(config.position.x, config.position.y, PINO_TEXTURE_KEYS.IDLE)
      .setOrigin(PLAYER_SIZE.pivot.x, PLAYER_SIZE.pivot.y);

    this.applyHitbox();
    this.getBody().allowGravity = false;

    this.physicsState = {
      position: cloneVector(config.position),
      velocity: {
        x: 0,
        y: 0,
      },
      isGrounded: true,
      hitbox: cloneHitbox(PLAYER_HITBOX),
    };

    this.visualState = {
      facing: config.facing,
      animationState: PINO_ANIMATION_STATES.IDLE,
      animationKey: PINO_ANIMATION_KEYS.IDLE,
      isAlive: true,
      isRespawning: false,
      isUsingPrimaryAction: false,
      isUsingSecondaryAction: false,
    };

    this.applyFacing(config.facing);
    this.playAnimation();
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getEntityState(): PlayerEntityState {
    return {
      id: this.id,
      position: cloneVector(this.physicsState.position),
      velocity: cloneVector(this.physicsState.velocity),
      facing: this.visualState.facing,
      isAlive: this.visualState.isAlive,
      isGrounded: this.physicsState.isGrounded,
    };
  }

  public getPhysicsState(): PlayerPhysicsState {
    return {
      position: cloneVector(this.physicsState.position),
      velocity: cloneVector(this.physicsState.velocity),
      isGrounded: this.physicsState.isGrounded,
      hitbox: cloneHitbox(this.physicsState.hitbox),
    };
  }

  public getVisualState(): PlayerVisualState {
    return {
      ...this.visualState,
    };
  }

  public updateMovement(update: PlayerMovementUpdate = {}): void {
    const body = this.getBody();

    if (update.velocity) {
      this.sprite.setVelocity(update.velocity.x, update.velocity.y);
    }

    const velocity = update.velocity ?? {
      x: body.velocity.x,
      y: body.velocity.y,
    };
    const isGrounded = update.isGrounded ?? body.blocked.down;
    const facing = update.facing ?? this.resolveFacingFromVelocity(velocity);

    this.physicsState = {
      position: {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      velocity: cloneVector(velocity),
      isGrounded,
      hitbox: cloneHitbox(PLAYER_HITBOX),
    };
    this.visualState = {
      ...this.visualState,
      facing,
      isUsingPrimaryAction: update.isUsingPrimaryAction ?? false,
      isUsingSecondaryAction: update.isUsingSecondaryAction ?? false,
    };

    this.applyFacing(facing);
    this.playAnimation();
  }

  public die(): void {
    if (!this.visualState.isAlive) {
      return;
    }

    this.sprite.setVelocity(0, 0);
    this.getBody().enable = false;
    this.visualState = {
      ...this.visualState,
      isAlive: false,
      isRespawning: false,
      isUsingPrimaryAction: false,
      isUsingSecondaryAction: false,
    };
    this.physicsState = {
      ...this.physicsState,
      velocity: {
        x: 0,
        y: 0,
      },
    };

    this.playAnimation();
  }

  public respawn(
    position: Vector2Like,
    facing = this.visualState.facing,
  ): void {
    this.getBody().enable = true;
    this.sprite.setPosition(position.x, position.y);
    this.sprite.setVelocity(0, 0);

    this.physicsState = {
      position: cloneVector(position),
      velocity: {
        x: 0,
        y: 0,
      },
      isGrounded: true,
      hitbox: cloneHitbox(PLAYER_HITBOX),
    };
    this.visualState = {
      facing,
      animationState: PINO_ANIMATION_STATES.RESPAWN,
      animationKey: PINO_ANIMATION_KEYS.RESPAWN,
      isAlive: true,
      isRespawning: true,
      isUsingPrimaryAction: false,
      isUsingSecondaryAction: false,
    };

    this.applyFacing(facing);
    this.playAnimation();
  }

  public finishRespawn(): void {
    if (!this.visualState.isRespawning) {
      return;
    }

    this.visualState = {
      ...this.visualState,
      isRespawning: false,
    };

    this.playAnimation();
  }

  public destroy(): void {
    this.sprite.destroy();
  }

  private applyHitbox(): void {
    const body = this.getBody();

    body.setSize(PLAYER_SIZE.hitboxWidth, PLAYER_SIZE.hitboxHeight);
    body.setOffset(PLAYER_HITBOX.x, PLAYER_HITBOX.y);
  }

  private applyFacing(facing: FacingDirection): void {
    this.sprite.setFlipX(facing === "left");
  }

  private playAnimation(): void {
    const animation = selectPinoAnimationDefinition({
      isAlive: this.visualState.isAlive,
      isRespawning: this.visualState.isRespawning,
      isGrounded: this.physicsState.isGrounded,
      velocity: this.physicsState.velocity,
      isUsingPrimaryAction: this.visualState.isUsingPrimaryAction,
      isUsingSecondaryAction: this.visualState.isUsingSecondaryAction,
    });

    this.visualState = {
      ...this.visualState,
      animationState: animation.state,
      animationKey: animation.key,
    };

    this.sprite.play(animation.key, true);
  }

  private resolveFacingFromVelocity(velocity: Vector2Like): FacingDirection {
    if (velocity.x < -MOVEMENT_EPSILON) {
      return "left";
    }

    if (velocity.x > MOVEMENT_EPSILON) {
      return "right";
    }

    return this.visualState.facing;
  }

  private getBody(): Phaser.Physics.Arcade.Body {
    const { body } = this.sprite;

    if (!body) {
      throw new Error("Player sprite was created without an Arcade body.");
    }

    return body as Phaser.Physics.Arcade.Body;
  }
}
