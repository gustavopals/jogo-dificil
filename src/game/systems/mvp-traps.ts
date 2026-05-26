import type { DeathCause } from "./game-events";
import type {
  LevelDefinition,
  RectLike,
  TrapDefinition,
  TrapId,
  TrapKind,
} from "../../shared";
import {
  markTrapResolved,
  markTrapTriggered,
  setMovingPlatformFalling,
  spawnRoomProjectile,
  type ProjectileRuntimeState,
  type RoomRuntimeState,
} from "./room-state";

export const DEFAULT_TRAP_PROJECTILE_SIZE_PX = 8;
export const DEFAULT_TRAP_PROJECTILE_SPEED_PX_PER_SECOND = 140;

export type TouchedTrapThreat = {
  readonly trapId: TrapId;
  readonly cause: DeathCause;
};

const DISABLED_SOLID_TRAP_KINDS = new Set<TrapKind>([
  "false-block",
  "breakable-floor",
]);

export function activateMvpTrap(
  state: RoomRuntimeState,
  trap: TrapDefinition,
): RoomRuntimeState {
  const triggeredState = markTrapTriggered(state, trap.id);

  switch (trap.kind) {
    case "false-block":
    case "breakable-floor":
    case "spike-pop":
      return markTrapResolved(triggeredState, trap.id);
    case "falling-platform":
      return markTrapResolved(
        setMovingPlatformFalling(triggeredState, trap.id),
        trap.id,
      );
    case "projectile": {
      const projectile = createProjectileFromTrap(trap);

      if (!projectile) {
        return markTrapResolved(triggeredState, trap.id);
      }

      return markTrapResolved(
        spawnRoomProjectile(triggeredState, projectile),
        trap.id,
      );
    }
  }
}

export function updateTrapProjectiles(
  state: RoomRuntimeState,
  level: Pick<LevelDefinition, "bounds">,
  deltaMs: number,
): RoomRuntimeState {
  if (state.projectiles.length === 0) {
    return state;
  }

  const deltaSeconds = deltaMs / 1000;
  const projectiles = state.projectiles
    .map((projectile) => ({
      ...projectile,
      position: {
        x: projectile.position.x + projectile.velocity.x * deltaSeconds,
        y: projectile.position.y + projectile.velocity.y * deltaSeconds,
      },
    }))
    .filter((projectile) =>
      isProjectileInsideExpandedBounds(projectile, level.bounds),
    );

  return {
    ...state,
    projectiles,
  };
}

export function findTouchedTrapThreat(
  playerHitbox: RectLike,
  traps: readonly TrapDefinition[],
  state: RoomRuntimeState,
): TouchedTrapThreat | undefined {
  const spikeTrap = traps.find((trap) => {
    const trapState = state.traps[trap.id];

    return (
      trap.kind === "spike-pop" &&
      trap.area !== undefined &&
      trapState?.isTriggered === true &&
      rectsOverlap(playerHitbox, trap.area)
    );
  });

  if (spikeTrap) {
    return {
      trapId: spikeTrap.id,
      cause: "trap",
    };
  }

  const projectile = state.projectiles.find((candidate) =>
    rectsOverlap(playerHitbox, getProjectileHitbox(candidate)),
  );

  if (projectile) {
    return {
      trapId: projectile.sourceId,
      cause: "trap",
    };
  }

  return undefined;
}

export function removeDisabledTrapSolids(
  solids: readonly RectLike[],
  traps: readonly TrapDefinition[],
  state: RoomRuntimeState,
): readonly RectLike[] {
  return traps.reduce<readonly RectLike[]>((currentSolids, trap) => {
    const trapArea = trap.area;

    if (!trapArea || !isTrapSolidDisabled(trap, state)) {
      return currentSolids;
    }

    return currentSolids.flatMap((solid) => subtractRect(solid, trapArea));
  }, solids);
}

export function getProjectileHitbox(
  projectile: ProjectileRuntimeState,
): RectLike {
  return {
    x: projectile.position.x,
    y: projectile.position.y,
    width: DEFAULT_TRAP_PROJECTILE_SIZE_PX,
    height: DEFAULT_TRAP_PROJECTILE_SIZE_PX,
  };
}

export function isTrapSolidDisabled(
  trap: TrapDefinition,
  state: RoomRuntimeState,
): boolean {
  const trapState = state.traps[trap.id];

  if (!trapState?.isTriggered) {
    return false;
  }

  if (DISABLED_SOLID_TRAP_KINDS.has(trap.kind)) {
    return true;
  }

  if (trap.kind === "falling-platform") {
    return state.movingPlatforms[trap.id]?.isDisabled === true;
  }

  return false;
}

function createProjectileFromTrap(
  trap: TrapDefinition,
): ProjectileRuntimeState | undefined {
  if (!trap.area) {
    return undefined;
  }

  return {
    id: `${trap.id}-projectile`,
    sourceId: trap.id,
    position: {
      x: trap.area.x,
      y: trap.area.y,
    },
    velocity: {
      x: readNumberConfig(
        trap,
        "velocityX",
        DEFAULT_TRAP_PROJECTILE_SPEED_PX_PER_SECOND,
      ),
      y: readNumberConfig(trap, "velocityY", 0),
    },
  };
}

function readNumberConfig(
  trap: TrapDefinition,
  key: string,
  fallback: number,
): number {
  const value = trap.config?.[key];

  return typeof value === "number" ? value : fallback;
}

function subtractRect(solid: RectLike, cutter: RectLike): readonly RectLike[] {
  const overlap = getIntersection(solid, cutter);

  if (!overlap) {
    return [solid];
  }

  const solidRight = solid.x + solid.width;
  const solidBottom = solid.y + solid.height;
  const overlapRight = overlap.x + overlap.width;
  const overlapBottom = overlap.y + overlap.height;

  return [
    {
      x: solid.x,
      y: solid.y,
      width: solid.width,
      height: overlap.y - solid.y,
    },
    {
      x: solid.x,
      y: overlapBottom,
      width: solid.width,
      height: solidBottom - overlapBottom,
    },
    {
      x: solid.x,
      y: overlap.y,
      width: overlap.x - solid.x,
      height: overlap.height,
    },
    {
      x: overlapRight,
      y: overlap.y,
      width: solidRight - overlapRight,
      height: overlap.height,
    },
  ].filter((rect) => rect.width > 0 && rect.height > 0);
}

function getIntersection(a: RectLike, b: RectLike): RectLike | undefined {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  const width = right - x;
  const height = bottom - y;

  if (width <= 0 || height <= 0) {
    return undefined;
  }

  return {
    x,
    y,
    width,
    height,
  };
}

function isProjectileInsideExpandedBounds(
  projectile: ProjectileRuntimeState,
  bounds: RectLike,
): boolean {
  const margin = DEFAULT_TRAP_PROJECTILE_SIZE_PX * 8;

  return (
    projectile.position.x >= bounds.x - margin &&
    projectile.position.x <= bounds.x + bounds.width + margin &&
    projectile.position.y >= bounds.y - margin &&
    projectile.position.y <= bounds.y + bounds.height + margin
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
