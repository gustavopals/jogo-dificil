export type SecondaryActionIntent =
  | "none"
  | "interact"
  | "quick-shot"
  | "special-charge-start"
  | "special-fire"
  | "special-cancel";

export type SecondaryActionIntentMode =
  | "idle"
  | "holding"
  | "interaction-consumed"
  | "special-charging";

export type SecondaryActionIntentState = {
  readonly mode: SecondaryActionIntentMode;
  readonly heldMs: number;
};

export type SecondaryActionIntentConfig = {
  readonly specialHoldThresholdMs: number;
};

export type SecondaryActionIntentInput = {
  readonly isSecondaryDown: boolean;
  readonly wasSecondaryPressed: boolean;
  readonly wasSecondaryReleased: boolean;
  readonly hasNearbyInteraction: boolean;
  readonly canPrepareSpecial: boolean;
  readonly deltaMs: number;
  readonly state: SecondaryActionIntentState;
  readonly config?: SecondaryActionIntentConfig;
};

export type SecondaryActionIntentResult = {
  readonly intent: SecondaryActionIntent;
  readonly state: SecondaryActionIntentState;
};

export const DEFAULT_SECONDARY_ACTION_INTENT_CONFIG = {
  specialHoldThresholdMs: 500,
} as const satisfies SecondaryActionIntentConfig;

export function createInitialSecondaryActionIntentState(): SecondaryActionIntentState {
  return {
    mode: "idle",
    heldMs: 0,
  };
}

export function resolveSecondaryActionIntent(
  input: SecondaryActionIntentInput,
): SecondaryActionIntentResult {
  const config = input.config ?? DEFAULT_SECONDARY_ACTION_INTENT_CONFIG;
  const deltaMs = Math.max(0, input.deltaMs);
  let state = input.state;
  let intent: SecondaryActionIntent = "none";

  if (input.wasSecondaryPressed) {
    if (input.hasNearbyInteraction) {
      state = {
        mode: "interaction-consumed",
        heldMs: 0,
      };
      intent = "interact";
    } else {
      state = {
        mode: "holding",
        heldMs: 0,
      };
    }
  }

  if (input.isSecondaryDown) {
    state = updateHeldSecondaryAction(state, deltaMs, input, config, (next) => {
      intent = next;
    });
  }

  if (input.wasSecondaryReleased) {
    const releaseResult = resolveSecondaryActionRelease(state, config);

    state = releaseResult.state;
    if (intent === "none") {
      intent = releaseResult.intent;
    }
  } else if (!input.isSecondaryDown && state.mode !== "idle") {
    state = createInitialSecondaryActionIntentState();
  }

  return {
    intent,
    state,
  };
}

function updateHeldSecondaryAction(
  state: SecondaryActionIntentState,
  deltaMs: number,
  input: SecondaryActionIntentInput,
  config: SecondaryActionIntentConfig,
  setIntent: (intent: SecondaryActionIntent) => void,
): SecondaryActionIntentState {
  if (state.mode === "holding") {
    const heldMs = state.heldMs + deltaMs;

    if (heldMs >= config.specialHoldThresholdMs && input.canPrepareSpecial) {
      setIntent("special-charge-start");

      return {
        mode: "special-charging",
        heldMs,
      };
    }

    return {
      mode: "holding",
      heldMs,
    };
  }

  if (state.mode === "special-charging") {
    return {
      mode: "special-charging",
      heldMs: state.heldMs + deltaMs,
    };
  }

  return state;
}

function resolveSecondaryActionRelease(
  state: SecondaryActionIntentState,
  config: SecondaryActionIntentConfig,
): SecondaryActionIntentResult {
  if (state.mode === "holding") {
    return {
      intent:
        state.heldMs < config.specialHoldThresholdMs
          ? "quick-shot"
          : "special-cancel",
      state: createInitialSecondaryActionIntentState(),
    };
  }

  if (state.mode === "special-charging") {
    return {
      intent: "special-fire",
      state: createInitialSecondaryActionIntentState(),
    };
  }

  return {
    intent: "none",
    state: createInitialSecondaryActionIntentState(),
  };
}
