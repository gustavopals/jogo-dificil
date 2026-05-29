import type { RectLike, TrapDefinition, Vector2Like } from "../../shared";
import { GAMEPLAY_SPRITE_KEYS, type GameplaySpriteKey } from "../../data/art";
import type { RoomRuntimeState, TrapRuntimeState } from "./room-state";
import { VISUAL_READABILITY_SEMANTIC_COLORS } from "./visual-readability";

export type TriggeredTrap = {
  readonly trap: TrapDefinition;
  readonly state: TrapRuntimeState;
};

export type TrapVisualFeedback = {
  readonly state: TrapVisualState;
  readonly triggerColor: number;
  readonly triggerAlpha: number;
  readonly triggerStrokeColor: number;
  readonly triggerStrokeAlpha: number;
  readonly bodyColor: number;
  readonly bodyAlpha: number;
  readonly bodyTint: number;
  readonly tellColor: number;
  readonly tellAlpha: number;
  readonly tellStrokeAlpha: number;
  readonly crackColor: number;
  readonly crackAlpha: number;
};

export type TrapFutureAudioFeedback = {
  readonly cueId: string;
  readonly event: "armed" | "triggered";
};

export type TrapFeedback = {
  readonly visual: TrapVisualFeedback;
  readonly audio: TrapFutureAudioFeedback;
};

export type TrapVisualState = "armed" | "triggered" | "resolved";

export type ProjectileTrailFeedback = {
  readonly area: RectLike;
  readonly color: number;
  readonly alpha: number;
};

const TRAP_BODY_COLORS = {
  "false-block": VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "falling-platform": VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "spike-pop": VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger,
  projectile: VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "breakable-floor": VISUAL_READABILITY_SEMANTIC_COLORS.trap.breakableFloor,
} as const satisfies Record<TrapDefinition["kind"], number>;

const TRAP_BODY_TEXTURE_KEYS = {
  "false-block": GAMEPLAY_SPRITE_KEYS.TRAP_FALSE_BLOCK,
  "falling-platform": GAMEPLAY_SPRITE_KEYS.TRAP_FALLING_PLATFORM,
  "spike-pop": GAMEPLAY_SPRITE_KEYS.TRAP_SPIKES,
  projectile: GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE,
  "breakable-floor": GAMEPLAY_SPRITE_KEYS.TRAP_BREAKABLE_FLOOR,
} as const satisfies Record<TrapDefinition["kind"], GameplaySpriteKey>;

const TRAP_TELL_COLORS = {
  "false-block": VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "falling-platform": VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "spike-pop": VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger,
  projectile: VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary,
  "breakable-floor": VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger,
} as const satisfies Record<TrapDefinition["kind"], number>;

const PROJECTILE_TRAIL_COLOR = VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary;
const PROJECTILE_TRAIL_ALPHA = 0.42;
const PROJECTILE_TRAIL_MIN_LENGTH_PX = 14;
const PROJECTILE_TRAIL_THICKNESS_PX = 3;

export function findTriggeredPositionTraps(
  playerHitbox: RectLike,
  traps: readonly TrapDefinition[],
  roomState: RoomRuntimeState,
): readonly TriggeredTrap[] {
  return traps.flatMap((trap) => {
    const state = roomState.traps[trap.id];

    if (
      !state ||
      state.isTriggered ||
      trap.trigger.kind === "interaction" ||
      !rectsOverlap(playerHitbox, trap.trigger.area)
    ) {
      return [];
    }

    return [
      {
        trap,
        state,
      },
    ];
  });
}

export function getTrapFeedback(
  trap: TrapDefinition,
  state: TrapRuntimeState,
): TrapFeedback {
  const visualState = getTrapVisualState(trap, state);
  const event = visualState === "armed" ? "armed" : "triggered";

  return {
    visual: {
      state: visualState,
      triggerColor:
        visualState === "armed"
          ? VISUAL_READABILITY_SEMANTIC_COLORS.trap.primary
          : VISUAL_READABILITY_SEMANTIC_COLORS.trap.triggered,
      triggerAlpha: visualState === "armed" ? 0.08 : 0.24,
      triggerStrokeColor:
        visualState === "armed"
          ? 0xd5dae6
          : VISUAL_READABILITY_SEMANTIC_COLORS.trap.triggered,
      triggerStrokeAlpha: visualState === "armed" ? 0.28 : 0.75,
      bodyColor: TRAP_BODY_COLORS[trap.kind],
      bodyAlpha: getTrapBodyAlpha(trap, visualState),
      bodyTint: getTrapBodyTint(trap, visualState),
      tellColor: TRAP_TELL_COLORS[trap.kind],
      tellAlpha: getTrapTellAlpha(trap, visualState),
      tellStrokeAlpha: getTrapTellStrokeAlpha(trap, visualState),
      crackColor: VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger,
      crackAlpha: getTrapCrackAlpha(trap, visualState),
    },
    audio: {
      cueId: `trap:${trap.kind}:${event}`,
      event,
    },
  };
}

export function getTrapVisualState(
  trap: TrapDefinition,
  state: TrapRuntimeState,
): TrapVisualState {
  if (!state.isTriggered) {
    return "armed";
  }

  return isTrapBodyVisuallyResolved(trap, state) ? "resolved" : "triggered";
}

export function getTrapBodyTextureKey(
  trap: Pick<TrapDefinition, "kind">,
): GameplaySpriteKey {
  return TRAP_BODY_TEXTURE_KEYS[trap.kind];
}

export function getProjectileTextureKey(): GameplaySpriteKey {
  return GAMEPLAY_SPRITE_KEYS.TRAP_PROJECTILE;
}

export function getProjectileTrailFeedback(
  hitbox: RectLike,
  velocity: Vector2Like,
): ProjectileTrailFeedback {
  const length = Math.max(
    PROJECTILE_TRAIL_MIN_LENGTH_PX,
    Math.max(hitbox.width, hitbox.height) * 1.75,
  );
  const isHorizontal = Math.abs(velocity.x) >= Math.abs(velocity.y);

  if (isHorizontal) {
    return {
      area: {
        x: velocity.x < 0 ? hitbox.x + hitbox.width : hitbox.x - length,
        y: hitbox.y + hitbox.height / 2 - PROJECTILE_TRAIL_THICKNESS_PX / 2,
        width: length,
        height: PROJECTILE_TRAIL_THICKNESS_PX,
      },
      color: PROJECTILE_TRAIL_COLOR,
      alpha: velocity.x === 0 ? 0 : PROJECTILE_TRAIL_ALPHA,
    };
  }

  return {
    area: {
      x: hitbox.x + hitbox.width / 2 - PROJECTILE_TRAIL_THICKNESS_PX / 2,
      y: velocity.y < 0 ? hitbox.y + hitbox.height : hitbox.y - length,
      width: PROJECTILE_TRAIL_THICKNESS_PX,
      height: length,
    },
    color: PROJECTILE_TRAIL_COLOR,
    alpha: velocity.y === 0 ? 0 : PROJECTILE_TRAIL_ALPHA,
  };
}

function isTrapBodyVisuallyResolved(
  trap: TrapDefinition,
  state: TrapRuntimeState,
): boolean {
  return (
    state.isResolved &&
    (trap.kind === "false-block" ||
      trap.kind === "falling-platform" ||
      trap.kind === "breakable-floor")
  );
}

function getTrapBodyAlpha(
  trap: TrapDefinition,
  visualState: TrapVisualState,
): number {
  if (visualState === "armed") {
    return trap.kind === "spike-pop" ? 0.05 : 0.62;
  }

  if (visualState === "resolved") {
    return trap.kind === "breakable-floor" ? 0.24 : 0.16;
  }

  return trap.kind === "spike-pop" ? 1 : 0.78;
}

function getTrapBodyTint(
  trap: TrapDefinition,
  visualState: TrapVisualState,
): number {
  if (visualState === "resolved") {
    return trap.kind === "breakable-floor"
      ? VISUAL_READABILITY_SEMANTIC_COLORS.trap.danger
      : VISUAL_READABILITY_SEMANTIC_COLORS.trap.resolved;
  }

  if (visualState === "triggered") {
    return TRAP_TELL_COLORS[trap.kind];
  }

  return 0xffffff;
}

function getTrapTellAlpha(
  trap: TrapDefinition,
  visualState: TrapVisualState,
): number {
  if (trap.kind === "projectile") {
    return visualState === "armed" ? 0.3 : 0.46;
  }

  if (trap.kind === "breakable-floor") {
    return visualState === "armed" ? 0.1 : 0.58;
  }

  if (trap.kind === "spike-pop") {
    return visualState === "armed" ? 0 : 0.42;
  }

  return visualState === "armed" ? 0.12 : 0.32;
}

function getTrapTellStrokeAlpha(
  trap: TrapDefinition,
  visualState: TrapVisualState,
): number {
  if (trap.kind === "projectile") {
    return visualState === "armed" ? 0.6 : 0.82;
  }

  return visualState === "armed" ? 0.24 : 0.7;
}

function getTrapCrackAlpha(
  trap: TrapDefinition,
  visualState: TrapVisualState,
): number {
  if (trap.kind !== "breakable-floor") {
    return 0;
  }

  return visualState === "armed" ? 0.16 : 0.86;
}

function rectsOverlap(a: RectLike, b: RectLike): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
