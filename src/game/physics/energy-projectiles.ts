import type { FacingDirection, RectLike, Vector2Like } from "../../shared";
import { WORLD_PHYSICS_SCALE } from "../constants";

export type CyanSparkProjectileDirection = -1 | 1;

export type CyanSparkProjectileConfig = {
  readonly speed: number;
  readonly maxRange: number;
  readonly hitboxWidth: number;
  readonly hitboxHeight: number;
  readonly spawnOffsetX: number;
  readonly spawnOffsetY: number;
};

export type CyanBurstBeamConfig = {
  readonly range: number;
  readonly height: number;
  readonly originOffsetX: number;
  readonly originOffsetY: number;
};

export type CyanSparkProjectileState = {
  readonly id: string;
  readonly position: Vector2Like;
  readonly velocity: Vector2Like;
  readonly direction: CyanSparkProjectileDirection;
  readonly distanceTraveled: number;
  readonly maxRange: number;
  readonly hitboxWidth: number;
  readonly hitboxHeight: number;
};

export type CyanSparkProjectileCollisionKind =
  | "solid"
  | "target"
  | "boss"
  | "range";

export type CyanSparkProjectileCollisionTarget = {
  readonly id: string;
  readonly kind: "target" | "boss";
  readonly area: RectLike;
};

export type CyanSparkProjectileImpact = {
  readonly projectileId: string;
  readonly kind: CyanSparkProjectileCollisionKind;
  readonly targetId?: string;
};

export type CyanBurstBeamImpactKind = "cracked-block" | "target" | "boss";

export type CyanBurstBeamCollisionTarget = {
  readonly id: string;
  readonly kind: CyanBurstBeamImpactKind;
  readonly area: RectLike;
  readonly hitGroupId?: string;
};

export type CyanBurstBeamImpact = {
  readonly targetId: string;
  readonly kind: CyanBurstBeamImpactKind;
  readonly damage: number;
  readonly hitGroupId?: string;
};

export type CreateCyanSparkProjectileInput = {
  readonly id: string;
  readonly origin: Vector2Like;
  readonly facing: FacingDirection;
  readonly config?: CyanSparkProjectileConfig;
};

export type GetCyanBurstBeamAreaInput = {
  readonly origin: Vector2Like;
  readonly facing: FacingDirection;
  readonly config?: CyanBurstBeamConfig;
};

export type ResolveCyanBurstBeamInput = {
  readonly origin: Vector2Like;
  readonly facing: FacingDirection;
  readonly solids?: readonly RectLike[];
  readonly targets?: readonly CyanBurstBeamCollisionTarget[];
  readonly alreadyHitBossIds?: readonly string[];
  readonly damage?: number;
  readonly config?: CyanBurstBeamConfig;
};

export type ResolveCyanBurstBeamResult = {
  readonly area: RectLike;
  readonly impacts: readonly CyanBurstBeamImpact[];
  readonly blockedBySolid: boolean;
};

export type UpdateCyanSparkProjectilesInput = {
  readonly projectiles: readonly CyanSparkProjectileState[];
  readonly deltaMs: number;
  readonly solids?: readonly RectLike[];
  readonly targets?: readonly CyanSparkProjectileCollisionTarget[];
};

export type UpdateCyanSparkProjectilesResult = {
  readonly projectiles: readonly CyanSparkProjectileState[];
  readonly impacts: readonly CyanSparkProjectileImpact[];
};

// Fase 18: velocidade (px/s) e alcance (px) escalam com o mundo HD (2x) para
// que a centelha/rajada percorram a mesma fracao da tela em tiles que no
// baseline (Task 18.8). A colisao da Centelha (hitbox e offset de spawn)
// permanece na geometria validada em 18.8; o que cresce em 18.9 e o sprite
// visual da centelha (renderizado em 16px). Ja a Rajada Ciano teve a faixa
// (altura e offsets de origem) escalada 2x para nao virar um fio fino demais
// na resolucao HD, mantendo leitura do feixe.
export const DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG = {
  speed: 420 * WORLD_PHYSICS_SCALE,
  maxRange: 128 * WORLD_PHYSICS_SCALE,
  hitboxWidth: 8,
  hitboxHeight: 5,
  spawnOffsetX: 12,
  spawnOffsetY: -14,
} as const satisfies CyanSparkProjectileConfig;

export const DEFAULT_CYAN_BURST_BEAM_CONFIG = {
  range: 192 * WORLD_PHYSICS_SCALE,
  height: 12 * WORLD_PHYSICS_SCALE,
  originOffsetX: 10 * WORLD_PHYSICS_SCALE,
  originOffsetY: -14 * WORLD_PHYSICS_SCALE,
} as const satisfies CyanBurstBeamConfig;

export const CYAN_SPARK_MAX_ACTIVE_PROJECTILES = 2;
export const CYAN_BURST_DAMAGE = 2;

export function canSpawnCyanSparkProjectile(
  projectiles: readonly CyanSparkProjectileState[],
  maxActiveProjectiles = CYAN_SPARK_MAX_ACTIVE_PROJECTILES,
): boolean {
  return projectiles.length < Math.max(0, maxActiveProjectiles);
}

export function createCyanSparkProjectile(
  input: CreateCyanSparkProjectileInput,
): CyanSparkProjectileState {
  const config = input.config ?? DEFAULT_CYAN_SPARK_PROJECTILE_CONFIG;
  const direction = resolveDirection(input.facing);

  return {
    id: input.id,
    position: {
      x: input.origin.x + direction * config.spawnOffsetX,
      y: input.origin.y + config.spawnOffsetY,
    },
    velocity: {
      x: direction * config.speed,
      y: 0,
    },
    direction,
    distanceTraveled: 0,
    maxRange: config.maxRange,
    hitboxWidth: config.hitboxWidth,
    hitboxHeight: config.hitboxHeight,
  };
}

export function updateCyanSparkProjectiles(
  input: UpdateCyanSparkProjectilesInput,
): UpdateCyanSparkProjectilesResult {
  const deltaSeconds = Math.max(0, input.deltaMs) / 1_000;
  const solids = input.solids ?? [];
  const targets = input.targets ?? [];
  const projectiles: CyanSparkProjectileState[] = [];
  const impacts: CyanSparkProjectileImpact[] = [];

  input.projectiles.forEach((projectile) => {
    const result = updateCyanSparkProjectile(
      projectile,
      deltaSeconds,
      solids,
      targets,
    );

    if (result.impact) {
      impacts.push(result.impact);
      return;
    }

    projectiles.push(result.projectile);
  });

  return {
    projectiles,
    impacts,
  };
}

export function getCyanSparkProjectileHitbox(
  projectile: CyanSparkProjectileState,
): RectLike {
  return {
    x: projectile.position.x - projectile.hitboxWidth / 2,
    y: projectile.position.y - projectile.hitboxHeight / 2,
    width: projectile.hitboxWidth,
    height: projectile.hitboxHeight,
  };
}

export function getCyanBurstBeamArea(
  input: GetCyanBurstBeamAreaInput,
): RectLike {
  const config = input.config ?? DEFAULT_CYAN_BURST_BEAM_CONFIG;
  const direction = resolveDirection(input.facing);
  const beamStartX = input.origin.x + direction * config.originOffsetX;

  return {
    x: direction > 0 ? beamStartX : beamStartX - config.range,
    y: input.origin.y + config.originOffsetY - config.height / 2,
    width: config.range,
    height: config.height,
  };
}

export function resolveCyanBurstBeam(
  input: ResolveCyanBurstBeamInput,
): ResolveCyanBurstBeamResult {
  const baseArea = getCyanBurstBeamArea(input);
  const direction = resolveDirection(input.facing);
  const clippedArea = clipBeamAreaBySolids(
    baseArea,
    direction,
    input.solids ?? [],
  );
  const damage = Math.max(0, Math.floor(input.damage ?? CYAN_BURST_DAMAGE));
  const impacts =
    damage > 0
      ? getCyanBurstBeamImpacts({
          area: clippedArea.area,
          direction,
          targets: input.targets ?? [],
          damage,
          alreadyHitBossIds: input.alreadyHitBossIds ?? [],
        })
      : [];

  return {
    area: clippedArea.area,
    impacts,
    blockedBySolid: clippedArea.blockedBySolid,
  };
}

type UpdatedCyanSparkProjectile = {
  readonly projectile: CyanSparkProjectileState;
  readonly sweptHitbox: RectLike;
  readonly reachedMaxRange: boolean;
};

type UpdateCyanSparkProjectileResult =
  | {
      readonly projectile: CyanSparkProjectileState;
      readonly impact?: undefined;
    }
  | {
      readonly impact: CyanSparkProjectileImpact;
    };

type ResolvedCollisionTarget = {
  readonly kind: Exclude<CyanSparkProjectileCollisionKind, "range">;
  readonly targetId?: string;
  readonly area: RectLike;
  readonly order: number;
};

type ClippedBeamArea = {
  readonly area: RectLike;
  readonly blockedBySolid: boolean;
};

type GetCyanBurstBeamImpactsInput = {
  readonly area: RectLike;
  readonly direction: CyanSparkProjectileDirection;
  readonly targets: readonly CyanBurstBeamCollisionTarget[];
  readonly damage: number;
  readonly alreadyHitBossIds: readonly string[];
};

function updateCyanSparkProjectile(
  projectile: CyanSparkProjectileState,
  deltaSeconds: number,
  solids: readonly RectLike[],
  targets: readonly CyanSparkProjectileCollisionTarget[],
): UpdateCyanSparkProjectileResult {
  const update = advanceCyanSparkProjectile(projectile, deltaSeconds);
  const impact = findCyanSparkProjectileImpact(
    projectile,
    update.sweptHitbox,
    solids,
    targets,
  );

  if (impact) {
    return {
      impact,
    };
  }

  if (update.reachedMaxRange) {
    return {
      impact: {
        projectileId: projectile.id,
        kind: "range",
      },
    };
  }

  return {
    projectile: update.projectile,
  };
}

function advanceCyanSparkProjectile(
  projectile: CyanSparkProjectileState,
  deltaSeconds: number,
): UpdatedCyanSparkProjectile {
  const previousHitbox = getCyanSparkProjectileHitbox(projectile);
  const deltaX = projectile.velocity.x * deltaSeconds;
  const deltaY = projectile.velocity.y * deltaSeconds;
  const requestedDistance = Math.hypot(deltaX, deltaY);
  const remainingRange = Math.max(
    0,
    projectile.maxRange - projectile.distanceTraveled,
  );
  const travelScale =
    requestedDistance > 0 && requestedDistance > remainingRange
      ? remainingRange / requestedDistance
      : 1;
  const appliedDeltaX = deltaX * travelScale;
  const appliedDeltaY = deltaY * travelScale;
  const traveled = Math.hypot(appliedDeltaX, appliedDeltaY);
  const updated = {
    ...projectile,
    position: {
      x: projectile.position.x + appliedDeltaX,
      y: projectile.position.y + appliedDeltaY,
    },
    distanceTraveled: Math.min(
      projectile.maxRange,
      projectile.distanceTraveled + traveled,
    ),
  };

  return {
    projectile: updated,
    sweptHitbox: getSweptHitbox(
      previousHitbox,
      getCyanSparkProjectileHitbox(updated),
    ),
    reachedMaxRange:
      remainingRange <= 0 ||
      (requestedDistance > 0 && requestedDistance >= remainingRange),
  };
}

function resolveDirection(
  facing: FacingDirection,
): CyanSparkProjectileDirection {
  return facing === "left" ? -1 : 1;
}

function findCyanSparkProjectileImpact(
  projectile: CyanSparkProjectileState,
  sweptHitbox: RectLike,
  solids: readonly RectLike[],
  targets: readonly CyanSparkProjectileCollisionTarget[],
): CyanSparkProjectileImpact | undefined {
  const collisionTarget = getResolvedCollisionTargets(solids, targets)
    .filter((target) => rectsOverlap(sweptHitbox, target.area))
    .sort((a, b) => {
      const distanceDelta =
        getHorizontalImpactDistance(projectile, a.area) -
        getHorizontalImpactDistance(projectile, b.area);

      if (distanceDelta !== 0) {
        return distanceDelta;
      }

      return a.order - b.order;
    })[0];

  if (!collisionTarget) {
    return undefined;
  }

  const impact = {
    projectileId: projectile.id,
    kind: collisionTarget.kind,
  };

  if (collisionTarget.targetId === undefined) {
    return impact;
  }

  return {
    ...impact,
    targetId: collisionTarget.targetId,
  };
}

function getResolvedCollisionTargets(
  solids: readonly RectLike[],
  targets: readonly CyanSparkProjectileCollisionTarget[],
): readonly ResolvedCollisionTarget[] {
  return [
    ...solids.map((solid, index) => ({
      kind: "solid" as const,
      area: solid,
      order: index,
    })),
    ...targets.map((target, index) => ({
      kind: target.kind,
      targetId: target.id,
      area: target.area,
      order: solids.length + index,
    })),
  ];
}

function getHorizontalImpactDistance(
  projectile: CyanSparkProjectileState,
  target: RectLike,
): number {
  const hitbox = getCyanSparkProjectileHitbox(projectile);

  if (projectile.direction > 0) {
    return Math.max(0, target.x - (hitbox.x + hitbox.width));
  }

  return Math.max(0, hitbox.x - (target.x + target.width));
}

function getCyanBurstBeamImpacts(
  input: GetCyanBurstBeamImpactsInput,
): readonly CyanBurstBeamImpact[] {
  const alreadyHitBossIds = new Set(input.alreadyHitBossIds);
  const hitBossIds = new Set<string>();
  const impacts: CyanBurstBeamImpact[] = [];

  input.targets
    .filter((target) => rectsOverlap(input.area, target.area))
    .sort((a, b) => {
      const distanceDelta =
        getHorizontalBeamImpactDistance(input.area, input.direction, a.area) -
        getHorizontalBeamImpactDistance(input.area, input.direction, b.area);

      if (distanceDelta !== 0) {
        return distanceDelta;
      }

      return a.id.localeCompare(b.id);
    })
    .forEach((target) => {
      if (target.kind !== "boss") {
        impacts.push({
          targetId: target.id,
          kind: target.kind,
          damage: input.damage,
        });

        return;
      }

      const hitGroupId = target.hitGroupId ?? target.id;

      if (alreadyHitBossIds.has(hitGroupId) || hitBossIds.has(hitGroupId)) {
        return;
      }

      hitBossIds.add(hitGroupId);
      impacts.push({
        targetId: target.id,
        kind: target.kind,
        damage: input.damage,
        hitGroupId,
      });
    });

  return impacts;
}

function clipBeamAreaBySolids(
  area: RectLike,
  direction: CyanSparkProjectileDirection,
  solids: readonly RectLike[],
): ClippedBeamArea {
  const blockers = solids.filter((solid) => rectsOverlap(area, solid));

  if (blockers.length === 0) {
    return {
      area,
      blockedBySolid: false,
    };
  }

  if (direction > 0) {
    const blockerX = Math.min(...blockers.map((solid) => solid.x));

    return {
      area: {
        ...area,
        width: Math.max(0, blockerX - area.x),
      },
      blockedBySolid: true,
    };
  }

  const blockerRight = Math.max(
    ...blockers.map((solid) => solid.x + solid.width),
  );
  const beamRight = area.x + area.width;
  const clippedX = Math.min(beamRight, blockerRight);

  return {
    area: {
      ...area,
      x: clippedX,
      width: Math.max(0, beamRight - clippedX),
    },
    blockedBySolid: true,
  };
}

function getHorizontalBeamImpactDistance(
  beamArea: RectLike,
  direction: CyanSparkProjectileDirection,
  target: RectLike,
): number {
  if (direction > 0) {
    return Math.max(0, target.x - beamArea.x);
  }

  return Math.max(0, beamArea.x + beamArea.width - (target.x + target.width));
}

function getSweptHitbox(previous: RectLike, current: RectLike): RectLike {
  const x = Math.min(previous.x, current.x);
  const y = Math.min(previous.y, current.y);
  const right = Math.max(
    previous.x + previous.width,
    current.x + current.width,
  );
  const bottom = Math.max(
    previous.y + previous.height,
    current.y + current.height,
  );

  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
  };
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
