import Phaser from "phaser";

import {
  PINO_ANIMATION_KEYS,
  PINO_ANIMATION_STATES,
  PINO_ANIMATIONS,
  PINO_POWER_ANIMATION_MODES,
  applyPinoVisualDisplaySize,
  resolveInitialPinoSpriteFrame,
  selectPinoAnimationDefinition,
  type PinoAnimationKey,
  type PinoAnimationState,
  type PinoPowerAnimationMode,
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
  readonly position?: Vector2Like;
  readonly velocity?: Vector2Like;
  readonly isGrounded?: boolean;
  readonly facing?: FacingDirection;
  readonly isUsingPrimaryAction?: boolean;
  readonly isUsingSecondaryAction?: boolean;
  readonly powerAnimationMode?: PinoPowerAnimationMode;
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
  readonly powerAnimationMode: PinoPowerAnimationMode;
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
    const initialFrame = resolveInitialPinoSpriteFrame();

    this.sprite = scene.physics.add
      .sprite(
        config.position.x,
        config.position.y,
        initialFrame.textureKey,
        initialFrame.frame,
      )
      .setOrigin(PLAYER_SIZE.pivot.x, PLAYER_SIZE.pivot.y);

    applyPinoVisualDisplaySize(this.sprite);
    this.sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, () => {
      applyPinoVisualDisplaySize(this.sprite);
    });

    this.applyHitbox();
    this.getBody().allowGravity = false;
    this.getBody().moves = false;

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
      powerAnimationMode: PINO_POWER_ANIMATION_MODES.NONE,
    };

    this.applyFacing(config.facing);
    this.playAnimation();
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getEntityState(): PlayerEntityState {
    const physicsState = this.getPhysicsState();

    return {
      id: this.id,
      position: physicsState.position,
      velocity: physicsState.velocity,
      facing: this.visualState.facing,
      isAlive: this.visualState.isAlive,
      isGrounded: physicsState.isGrounded,
    };
  }

  public getPhysicsState(): PlayerPhysicsState {
    const body = this.getBody();

    return {
      position: {
        x: this.sprite.x,
        y: this.sprite.y,
      },
      velocity: {
        x: body.velocity.x,
        y: body.velocity.y,
      },
      isGrounded: this.physicsState.isGrounded,
      hitbox: cloneHitbox(this.physicsState.hitbox),
    };
  }

  public getWorldHitbox(): RectLike {
    const body = this.getBody();

    return {
      x: body.x,
      y: body.y,
      width: body.width,
      height: body.height,
    };
  }

  public getVisualState(): PlayerVisualState {
    return {
      ...this.visualState,
    };
  }

  public updateMovement(update: PlayerMovementUpdate = {}): void {
    if (!this.visualState.isAlive) {
      return;
    }

    const body = this.getBody();

    if (update.position) {
      this.sprite.setPosition(update.position.x, update.position.y);
    }

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
      powerAnimationMode:
        update.powerAnimationMode ?? PINO_POWER_ANIMATION_MODES.NONE,
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
      powerAnimationMode: PINO_POWER_ANIMATION_MODES.NONE,
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
      powerAnimationMode: PINO_POWER_ANIMATION_MODES.NONE,
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
      powerAnimationMode: this.visualState.powerAnimationMode,
    });

    this.visualState = {
      ...this.visualState,
      animationState: animation.state,
      animationKey: animation.key,
    };

    this.applyAnimationTransform(animation.state);
    this.sprite.play(animation.key, true);
  }

  private applyAnimationTransform(state: PinoAnimationState): void {
    const facingSign = this.visualState.facing === "left" ? -1 : 1;
    const transformByState = {
      [PINO_ANIMATION_STATES.IDLE]: {
        scaleX: 1,
        scaleY: 1,
        angle: 0,
      },
      [PINO_ANIMATION_STATES.RUN]: {
        scaleX: 1.08,
        scaleY: 0.96,
        angle: -3 * facingSign,
      },
      [PINO_ANIMATION_STATES.JUMP]: {
        scaleX: 0.94,
        scaleY: 1.08,
        angle: -5 * facingSign,
      },
      [PINO_ANIMATION_STATES.FALL]: {
        scaleX: 1.04,
        scaleY: 0.98,
        angle: 5 * facingSign,
      },
      [PINO_ANIMATION_STATES.DEATH]: {
        scaleX: 1.16,
        scaleY: 0.72,
        angle: 12 * facingSign,
      },
      [PINO_ANIMATION_STATES.RESPAWN]: {
        scaleX: 0.88,
        scaleY: 1.12,
        angle: 0,
      },
      [PINO_ANIMATION_STATES.PRIMARY_ACTION]: {
        scaleX: 1.2,
        scaleY: 0.86,
        angle: -8 * facingSign,
      },
      [PINO_ANIMATION_STATES.SECONDARY_ACTION]: {
        scaleX: 1.04,
        scaleY: 1,
        angle: -4 * facingSign,
      },
      [PINO_ANIMATION_STATES.CYAN_CHARGE]: {
        scaleX: 1.02,
        scaleY: 1.02,
        angle: -2 * facingSign,
      },
      [PINO_ANIMATION_STATES.CYAN_SPARK]: {
        scaleX: 1.12,
        scaleY: 0.94,
        angle: -6 * facingSign,
      },
      [PINO_ANIMATION_STATES.CYAN_BURST_PREPARE]: {
        scaleX: 0.96,
        scaleY: 1.08,
        angle: -3 * facingSign,
      },
      [PINO_ANIMATION_STATES.CYAN_BURST_FIRE]: {
        scaleX: 1.16,
        scaleY: 0.9,
        angle: -7 * facingSign,
      },
    } as const satisfies Record<
      PinoAnimationState,
      {
        readonly scaleX: number;
        readonly scaleY: number;
        readonly angle: number;
      }
    >;
    const transform = transformByState[state];

    this.sprite.setScale(transform.scaleX, transform.scaleY);
    this.sprite.setAngle(transform.angle);
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
