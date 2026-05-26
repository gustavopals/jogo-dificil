import type { RectLike, Vector2Like } from "../../shared";

export type KinematicBodyCollisionConfig = {
  readonly visualWidth: number;
  readonly visualHeight: number;
  readonly pivot: Vector2Like;
  readonly hitbox: RectLike;
};

export type KinematicCollisionInput = {
  readonly currentPosition: Vector2Like;
  readonly targetPosition: Vector2Like;
  readonly velocity: Vector2Like;
  readonly body: KinematicBodyCollisionConfig;
  readonly solids: readonly RectLike[];
};

export type CollisionBlockState = {
  readonly left: boolean;
  readonly right: boolean;
  readonly up: boolean;
  readonly down: boolean;
};

export type KinematicCollisionResult = {
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly isGrounded: boolean;
  readonly blocked: CollisionBlockState;
};

const TOUCH_EPSILON_PX = 1;

export function resolveKinematicCollisions(
  input: KinematicCollisionInput,
): KinematicCollisionResult {
  const blocked = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  const position = {
    ...input.currentPosition,
  };
  const velocity = {
    ...input.velocity,
  };

  const horizontal = resolveHorizontalMovement({
    currentPosition: position,
    targetX: input.targetPosition.x,
    velocityX: velocity.x,
    body: input.body,
    solids: input.solids,
  });

  position.x = horizontal.positionX;
  velocity.x = horizontal.velocityX;
  blocked.left = horizontal.blockedLeft;
  blocked.right = horizontal.blockedRight;

  const vertical = resolveVerticalMovement({
    currentPosition: position,
    targetY: input.targetPosition.y,
    velocityY: velocity.y,
    body: input.body,
    solids: input.solids,
  });

  position.y = vertical.positionY;
  velocity.y = vertical.velocityY;
  blocked.up = vertical.blockedUp;
  blocked.down = vertical.blockedDown;

  return {
    position,
    velocity,
    isGrounded:
      blocked.down || isTouchingSolidBelow(position, input.body, input.solids),
    blocked,
  };
}

export function getWorldHitbox(
  position: Vector2Like,
  body: KinematicBodyCollisionConfig,
): RectLike {
  return {
    x: position.x - body.visualWidth * body.pivot.x + body.hitbox.x,
    y: position.y - body.visualHeight * body.pivot.y + body.hitbox.y,
    width: body.hitbox.width,
    height: body.hitbox.height,
  };
}

function isTouchingSolidBelow(
  position: Vector2Like,
  body: KinematicBodyCollisionConfig,
  solids: readonly RectLike[],
): boolean {
  const hitbox = getWorldHitbox(position, body);
  const hitboxBottom = hitbox.y + hitbox.height;

  return solids.some(
    (solid) =>
      hitbox.x < solid.x + solid.width &&
      hitbox.x + hitbox.width > solid.x &&
      hitboxBottom <= solid.y &&
      solid.y - hitboxBottom <= TOUCH_EPSILON_PX,
  );
}

function resolveHorizontalMovement(input: {
  readonly currentPosition: Vector2Like;
  readonly targetX: number;
  readonly velocityX: number;
  readonly body: KinematicBodyCollisionConfig;
  readonly solids: readonly RectLike[];
}): {
  readonly positionX: number;
  readonly velocityX: number;
  readonly blockedLeft: boolean;
  readonly blockedRight: boolean;
} {
  let positionX = input.targetX;
  let velocityX = input.velocityX;
  let blockedLeft = false;
  let blockedRight = false;

  if (input.velocityX === 0) {
    return {
      positionX,
      velocityX,
      blockedLeft,
      blockedRight,
    };
  }

  const currentHitbox = getWorldHitbox(input.currentPosition, input.body);
  const targetHitbox = getWorldHitbox(
    {
      x: input.targetX,
      y: input.currentPosition.y,
    },
    input.body,
  );

  input.solids.forEach((solid) => {
    if (
      !rangesOverlap(
        currentHitbox.y,
        currentHitbox.y + currentHitbox.height,
        solid.y,
        solid.y + solid.height,
      )
    ) {
      return;
    }

    if (input.velocityX > 0) {
      const currentRight = currentHitbox.x + currentHitbox.width;
      const targetRight = targetHitbox.x + targetHitbox.width;

      if (currentRight <= solid.x && targetRight > solid.x) {
        const candidateX = getPivotXForHitboxRight(solid.x, input.body);

        if (candidateX < positionX) {
          positionX = candidateX;
          velocityX = 0;
          blockedRight = true;
        }
      }
    } else {
      const solidRight = solid.x + solid.width;

      if (currentHitbox.x >= solidRight && targetHitbox.x < solidRight) {
        const candidateX = getPivotXForHitboxLeft(solidRight, input.body);

        if (candidateX > positionX) {
          positionX = candidateX;
          velocityX = 0;
          blockedLeft = true;
        }
      }
    }
  });

  return {
    positionX,
    velocityX,
    blockedLeft,
    blockedRight,
  };
}

function resolveVerticalMovement(input: {
  readonly currentPosition: Vector2Like;
  readonly targetY: number;
  readonly velocityY: number;
  readonly body: KinematicBodyCollisionConfig;
  readonly solids: readonly RectLike[];
}): {
  readonly positionY: number;
  readonly velocityY: number;
  readonly blockedUp: boolean;
  readonly blockedDown: boolean;
} {
  let positionY = input.targetY;
  let velocityY = input.velocityY;
  let blockedUp = false;
  let blockedDown = false;

  if (input.velocityY === 0) {
    return {
      positionY,
      velocityY,
      blockedUp,
      blockedDown,
    };
  }

  const currentHitbox = getWorldHitbox(input.currentPosition, input.body);
  const targetHitbox = getWorldHitbox(
    {
      x: input.currentPosition.x,
      y: input.targetY,
    },
    input.body,
  );

  input.solids.forEach((solid) => {
    if (
      !rangesOverlap(
        currentHitbox.x,
        currentHitbox.x + currentHitbox.width,
        solid.x,
        solid.x + solid.width,
      )
    ) {
      return;
    }

    if (input.velocityY > 0) {
      const currentBottom = currentHitbox.y + currentHitbox.height;
      const targetBottom = targetHitbox.y + targetHitbox.height;

      if (currentBottom <= solid.y && targetBottom > solid.y) {
        const candidateY = getPivotYForHitboxBottom(solid.y, input.body);

        if (candidateY < positionY) {
          positionY = candidateY;
          velocityY = 0;
          blockedDown = true;
        }
      }
    } else {
      const solidBottom = solid.y + solid.height;

      if (currentHitbox.y >= solidBottom && targetHitbox.y < solidBottom) {
        const candidateY = getPivotYForHitboxTop(solidBottom, input.body);

        if (candidateY > positionY) {
          positionY = candidateY;
          velocityY = 0;
          blockedUp = true;
        }
      }
    }
  });

  return {
    positionY,
    velocityY,
    blockedUp,
    blockedDown,
  };
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function getPivotXForHitboxRight(
  hitboxRight: number,
  body: KinematicBodyCollisionConfig,
): number {
  return (
    hitboxRight -
    body.hitbox.width -
    body.hitbox.x +
    body.visualWidth * body.pivot.x
  );
}

function getPivotXForHitboxLeft(
  hitboxLeft: number,
  body: KinematicBodyCollisionConfig,
): number {
  return hitboxLeft - body.hitbox.x + body.visualWidth * body.pivot.x;
}

function getPivotYForHitboxBottom(
  hitboxBottom: number,
  body: KinematicBodyCollisionConfig,
): number {
  return (
    hitboxBottom -
    body.hitbox.height -
    body.hitbox.y +
    body.visualHeight * body.pivot.y
  );
}

function getPivotYForHitboxTop(
  hitboxTop: number,
  body: KinematicBodyCollisionConfig,
): number {
  return hitboxTop - body.hitbox.y + body.visualHeight * body.pivot.y;
}
