import type {
  BossAttackDefinition,
  BossAttackId,
  BossId,
  EnergyPowerKind,
  RectLike,
  Vector2Like,
} from "../../shared";
import type { BossRuntimeState } from "./boss-state";

export type BossProjectileRuntimeState = {
  readonly id: string;
  readonly bossId: BossId;
  readonly attackId: BossAttackId;
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly hitbox: RectLike;
  readonly distanceTraveled: number;
  readonly maxRangePx?: number;
  readonly isDestructibleBy: readonly EnergyPowerKind[];
};

export type CreateBossProjectileInput = {
  readonly id: string;
  readonly boss: Pick<BossRuntimeState, "id" | "position"> &
    Partial<Pick<BossRuntimeState, "facing">>;
  readonly attack: BossAttackDefinition;
  readonly origin?: Vector2Like;
};

export type UpdateBossProjectilesInput = {
  readonly projectiles: readonly BossProjectileRuntimeState[];
  readonly deltaMs: number;
  readonly bounds?: RectLike;
  readonly solids?: readonly RectLike[];
  readonly arenasByBossId?: Partial<Record<BossId, RectLike>>;
};

export type BossProjectileRemovalKind = "arena" | "bounds" | "range" | "solid";

export type BossProjectileRemoval = {
  readonly projectileId: string;
  readonly kind: BossProjectileRemovalKind;
};

export type UpdateBossProjectilesResult = {
  readonly projectiles: readonly BossProjectileRuntimeState[];
  readonly removals: readonly BossProjectileRemoval[];
};

export function canSpawnBossProjectile(
  projectiles: readonly BossProjectileRuntimeState[],
  boss: Pick<BossRuntimeState, "id">,
  attack: BossAttackDefinition,
): boolean {
  const projectileDefinition = attack.projectile;

  if (!projectileDefinition) {
    return false;
  }

  const activeCount = projectiles.filter(
    (projectile) =>
      projectile.bossId === boss.id && projectile.attackId === attack.id,
  ).length;

  return activeCount < projectileDefinition.maxActive;
}

export function createBossProjectile(
  input: CreateBossProjectileInput,
): BossProjectileRuntimeState | undefined {
  const projectileDefinition = input.attack.projectile;

  if (!projectileDefinition) {
    return undefined;
  }

  const origin = input.origin ?? input.boss.position;

  return {
    id: input.id,
    bossId: input.boss.id,
    attackId: input.attack.id,
    position: {
      x: origin.x,
      y: origin.y,
    },
    velocity: {
      x: resolveProjectileVelocityX(
        projectileDefinition.velocity.x,
        input.boss.facing,
      ),
      y: projectileDefinition.velocity.y,
    },
    hitbox: {
      x: projectileDefinition.hitbox.x,
      y: projectileDefinition.hitbox.y,
      width: projectileDefinition.hitbox.width,
      height: projectileDefinition.hitbox.height,
    },
    distanceTraveled: 0,
    maxRangePx: projectileDefinition.maxRangePx,
    isDestructibleBy: projectileDefinition.isDestructibleBy ?? [],
  };
}

function resolveProjectileVelocityX(
  velocityX: number,
  facing: BossRuntimeState["facing"] | undefined,
): number {
  if (facing === "right" && velocityX < 0) {
    return Math.abs(velocityX);
  }

  return velocityX;
}

export function updateBossProjectiles(
  input: UpdateBossProjectilesInput,
): UpdateBossProjectilesResult {
  if (input.projectiles.length === 0) {
    return {
      projectiles: input.projectiles,
      removals: [],
    };
  }

  const deltaSeconds = Math.max(0, input.deltaMs) / 1_000;
  const projectiles: BossProjectileRuntimeState[] = [];
  const removals: BossProjectileRemoval[] = [];

  input.projectiles.forEach((projectile) => {
    const updatedProjectile = advanceBossProjectile(projectile, deltaSeconds);
    const hitbox = getBossProjectileHitbox(updatedProjectile);

    if (hasBossProjectileReachedRange(updatedProjectile)) {
      removals.push({
        projectileId: projectile.id,
        kind: "range",
      });

      return;
    }

    if (input.solids?.some((solid) => rectsOverlap(hitbox, solid))) {
      removals.push({
        projectileId: projectile.id,
        kind: "solid",
      });

      return;
    }

    const arena = input.arenasByBossId?.[updatedProjectile.bossId];

    if (arena && !rectsOverlap(hitbox, arena)) {
      removals.push({
        projectileId: projectile.id,
        kind: "arena",
      });

      return;
    }

    if (input.bounds && !rectsOverlap(hitbox, input.bounds)) {
      removals.push({
        projectileId: projectile.id,
        kind: "bounds",
      });

      return;
    }

    projectiles.push(updatedProjectile);
  });

  return {
    projectiles,
    removals,
  };
}

export function getBossProjectileHitbox(
  projectile: BossProjectileRuntimeState,
): RectLike {
  return {
    x: projectile.position.x + projectile.hitbox.x,
    y: projectile.position.y + projectile.hitbox.y,
    width: projectile.hitbox.width,
    height: projectile.hitbox.height,
  };
}

function advanceBossProjectile(
  projectile: BossProjectileRuntimeState,
  deltaSeconds: number,
): BossProjectileRuntimeState {
  const deltaX = projectile.velocity.x * deltaSeconds;
  const deltaY = projectile.velocity.y * deltaSeconds;
  const distanceTraveled = Math.hypot(deltaX, deltaY);

  return {
    ...projectile,
    position: {
      x: projectile.position.x + deltaX,
      y: projectile.position.y + deltaY,
    },
    distanceTraveled: projectile.distanceTraveled + distanceTraveled,
  };
}

function hasBossProjectileReachedRange(
  projectile: BossProjectileRuntimeState,
): boolean {
  return (
    projectile.maxRangePx !== undefined &&
    projectile.distanceTraveled >= projectile.maxRangePx
  );
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
