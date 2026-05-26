import type { RectLike, TrapDefinition } from "../../shared";
import type { RoomRuntimeState, TrapRuntimeState } from "./room-state";

export type TriggeredTrap = {
  readonly trap: TrapDefinition;
  readonly state: TrapRuntimeState;
};

export type TrapVisualFeedback = {
  readonly triggerColor: number;
  readonly triggerAlpha: number;
  readonly triggerStrokeColor: number;
  readonly triggerStrokeAlpha: number;
  readonly bodyColor: number;
  readonly bodyAlpha: number;
};

export type TrapFutureAudioFeedback = {
  readonly cueId: string;
  readonly event: "armed" | "triggered";
};

export type TrapFeedback = {
  readonly visual: TrapVisualFeedback;
  readonly audio: TrapFutureAudioFeedback;
};

const TRAP_BODY_COLORS = {
  "false-block": 0xf4d35e,
  "falling-platform": 0x80d7c2,
  "spike-pop": 0xe76f51,
  projectile: 0x9b5de5,
  "breakable-floor": 0xf4a261,
} as const satisfies Record<TrapDefinition["kind"], number>;

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
  const event = state.isTriggered ? "triggered" : "armed";
  const isDisabledBody =
    state.isResolved &&
    (trap.kind === "false-block" ||
      trap.kind === "falling-platform" ||
      trap.kind === "breakable-floor");

  return {
    visual: {
      triggerColor: state.isTriggered ? 0xf4d35e : 0x9b5de5,
      triggerAlpha: state.isTriggered ? 0.22 : 0.12,
      triggerStrokeColor: state.isTriggered ? 0xf4d35e : 0xd5dae6,
      triggerStrokeAlpha: state.isTriggered ? 0.75 : 0.35,
      bodyColor: TRAP_BODY_COLORS[trap.kind],
      bodyAlpha: isDisabledBody ? 0.12 : state.isTriggered ? 0.72 : 0.36,
    },
    audio: {
      cueId: `trap:${trap.kind}:${event}`,
      event,
    },
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
