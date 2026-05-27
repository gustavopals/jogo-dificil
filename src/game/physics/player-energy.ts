import {
  DEFAULT_PLAYER_INITIAL_ENERGY,
  type FacingDirection,
  PLAYER_ENERGY_MAX,
  PLAYER_ENERGY_MIN,
} from "../../shared";

export type PlayerEnergyActivity =
  | "idle"
  | "charging"
  | "burst-preparing"
  | "burst-firing";

export type PlayerEnergyRequest =
  | "none"
  | "cyan-spark"
  | "cyan-burst-prepare"
  | "cyan-burst-fire"
  | "cyan-burst-cancel";

export type PlayerEnergyEffect =
  | "cyan-energy-gained"
  | "cyan-energy-full"
  | "cyan-spark-fired"
  | "cyan-burst-preparation-started"
  | "cyan-burst-ready"
  | "cyan-burst-fired"
  | "cyan-burst-canceled"
  | "cyan-burst-finished";

export type PlayerEnergyRejectionReason =
  | "busy"
  | "cooldown"
  | "insufficient-energy"
  | "not-ready";

export type PlayerEnergyRejection = {
  readonly request: Exclude<PlayerEnergyRequest, "none" | "cyan-burst-cancel">;
  readonly reason: PlayerEnergyRejectionReason;
};

export type PlayerEnergyConfig = {
  readonly maxEnergy: number;
  readonly initialEnergy: number;
  readonly groundChargeRatePerSecond: number;
  readonly airChargeRatePerSecond: number;
  readonly sparkCost: number;
  readonly sparkCooldownMs: number;
  readonly burstCost: number;
  readonly burstPreparationMs: number;
  readonly burstDurationMs: number;
  readonly burstCooldownMs: number;
};

export type PlayerEnergyState = {
  readonly energy: number;
  readonly activity: PlayerEnergyActivity;
  readonly sparkCooldownRemainingMs: number;
  readonly burstCooldownRemainingMs: number;
  readonly burstPreparationRemainingMs: number;
  readonly burstDurationRemainingMs: number;
};

export type PlayerEnergyInput = {
  readonly state: PlayerEnergyState;
  readonly deltaMs: number;
  readonly isChargeHeld: boolean;
  readonly canCharge: boolean;
  readonly isGrounded: boolean;
  readonly request?: PlayerEnergyRequest;
  readonly config?: PlayerEnergyConfig;
};

export type PlayerEnergyResult = {
  readonly state: PlayerEnergyState;
  readonly effects: readonly PlayerEnergyEffect[];
  readonly rejections: readonly PlayerEnergyRejection[];
};

export type CyanBurstFacingLockInput = {
  readonly activity: PlayerEnergyActivity;
  readonly currentFacing: FacingDirection;
  readonly requestedFacing?: FacingDirection;
  readonly lockedFacing?: FacingDirection;
};

export type CyanBurstFacingLockResult = {
  readonly facing: FacingDirection;
  readonly lockedFacing?: FacingDirection;
};

export type PlayerEnergyMovementConstraintInput = {
  readonly state: PlayerEnergyState;
  readonly isChargeHeld: boolean;
  readonly canCharge: boolean;
  readonly isGrounded: boolean;
  readonly wasJumpPressed?: boolean;
};

export type PlayerEnergyMovementConstraint = {
  readonly horizontalSpeedScale: number;
  readonly canDash: boolean;
};

export const DEFAULT_PLAYER_ENERGY_CONFIG = {
  maxEnergy: PLAYER_ENERGY_MAX,
  initialEnergy: DEFAULT_PLAYER_INITIAL_ENERGY,
  groundChargeRatePerSecond: 45,
  airChargeRatePerSecond: 0,
  sparkCost: 10,
  sparkCooldownMs: 180,
  burstCost: 100,
  burstPreparationMs: 500,
  burstDurationMs: 280,
  burstCooldownMs: 1_200,
} as const satisfies PlayerEnergyConfig;

export const PLAYER_ENERGY_CHARGE_HORIZONTAL_SPEED_SCALE = 0.3;

export function createInitialPlayerEnergyState(
  initialEnergy?: number,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): PlayerEnergyState {
  return {
    energy: clampEnergy(initialEnergy ?? config.initialEnergy, config),
    activity: "idle",
    sparkCooldownRemainingMs: 0,
    burstCooldownRemainingMs: 0,
    burstPreparationRemainingMs: 0,
    burstDurationRemainingMs: 0,
  };
}

export function resetPlayerEnergyState(
  initialEnergy?: number,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): PlayerEnergyState {
  return createInitialPlayerEnergyState(initialEnergy, config);
}

export function clearPlayerEnergyTemporaryState(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): PlayerEnergyState {
  return createInitialPlayerEnergyState(state.energy, config);
}

export function updatePlayerEnergy(
  input: PlayerEnergyInput,
): PlayerEnergyResult {
  const config = input.config ?? DEFAULT_PLAYER_ENERGY_CONFIG;
  const deltaMs = Math.max(0, input.deltaMs);
  const request = input.request ?? "none";
  const effects: PlayerEnergyEffect[] = [];
  const rejections: PlayerEnergyRejection[] = [];

  let state = tickCooldowns(input.state, deltaMs);
  state = tickBurstActivity(state, deltaMs, effects);
  state = applyEnergyRequest(state, request, config, effects, rejections);
  state = applyChargeInput(state, input, config, deltaMs, effects);

  return {
    state,
    effects,
    rejections,
  };
}

export function hasFullPlayerEnergy(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): boolean {
  return state.energy >= config.maxEnergy;
}

export function canUseCyanSpark(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): boolean {
  return (
    !isBurstActivity(state.activity) &&
    state.energy >= config.sparkCost &&
    state.sparkCooldownRemainingMs <= 0
  );
}

export function canPrepareCyanBurst(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig = DEFAULT_PLAYER_ENERGY_CONFIG,
): boolean {
  return (
    !isBurstActivity(state.activity) &&
    state.energy >= config.burstCost &&
    state.burstCooldownRemainingMs <= 0
  );
}

export function resolveCyanBurstFacingLock(
  input: CyanBurstFacingLockInput,
): CyanBurstFacingLockResult {
  if (isBurstDirectionLocked(input.activity)) {
    const lockedFacing = input.lockedFacing ?? input.currentFacing;

    return {
      facing: lockedFacing,
      lockedFacing,
    };
  }

  return {
    facing: input.requestedFacing ?? input.currentFacing,
  };
}

export function getPlayerEnergyMovementConstraint(
  input: PlayerEnergyMovementConstraintInput,
): PlayerEnergyMovementConstraint {
  const isChargingMovement =
    input.canCharge &&
    input.isGrounded &&
    input.wasJumpPressed !== true &&
    (input.isChargeHeld || input.state.activity === "charging");

  return {
    horizontalSpeedScale: isChargingMovement
      ? PLAYER_ENERGY_CHARGE_HORIZONTAL_SPEED_SCALE
      : 1,
    canDash: !isChargingMovement && !isBurstActivity(input.state.activity),
  };
}

function tickCooldowns(
  state: PlayerEnergyState,
  deltaMs: number,
): PlayerEnergyState {
  return {
    ...state,
    sparkCooldownRemainingMs: reduceTimer(
      state.sparkCooldownRemainingMs,
      deltaMs,
    ),
    burstCooldownRemainingMs: reduceTimer(
      state.burstCooldownRemainingMs,
      deltaMs,
    ),
  };
}

function tickBurstActivity(
  state: PlayerEnergyState,
  deltaMs: number,
  effects: PlayerEnergyEffect[],
): PlayerEnergyState {
  if (state.activity === "burst-preparing") {
    const wasReady = state.burstPreparationRemainingMs <= 0;
    const burstPreparationRemainingMs = reduceTimer(
      state.burstPreparationRemainingMs,
      deltaMs,
    );

    if (!wasReady && burstPreparationRemainingMs <= 0) {
      effects.push("cyan-burst-ready");
    }

    return {
      ...state,
      burstPreparationRemainingMs,
    };
  }

  if (state.activity === "burst-firing") {
    const burstDurationRemainingMs = reduceTimer(
      state.burstDurationRemainingMs,
      deltaMs,
    );

    if (burstDurationRemainingMs > 0) {
      return {
        ...state,
        burstDurationRemainingMs,
      };
    }

    effects.push("cyan-burst-finished");

    return {
      ...state,
      activity: "idle",
      burstDurationRemainingMs: 0,
    };
  }

  return state;
}

function applyEnergyRequest(
  state: PlayerEnergyState,
  request: PlayerEnergyRequest,
  config: PlayerEnergyConfig,
  effects: PlayerEnergyEffect[],
  rejections: PlayerEnergyRejection[],
): PlayerEnergyState {
  switch (request) {
    case "cyan-spark":
      return requestCyanSpark(state, config, effects, rejections);
    case "cyan-burst-prepare":
      return requestCyanBurstPrepare(state, config, effects, rejections);
    case "cyan-burst-fire":
      return requestCyanBurstFire(state, config, effects, rejections);
    case "cyan-burst-cancel":
      return cancelCyanBurst(state, effects);
    case "none":
      return state;
  }
}

function requestCyanSpark(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
  effects: PlayerEnergyEffect[],
  rejections: PlayerEnergyRejection[],
): PlayerEnergyState {
  const rejectionReason = getSparkRejectionReason(state, config);

  if (rejectionReason) {
    rejections.push({
      request: "cyan-spark",
      reason: rejectionReason,
    });

    return state;
  }

  effects.push("cyan-spark-fired");

  return {
    ...state,
    energy: state.energy - config.sparkCost,
    activity: state.activity === "charging" ? "idle" : state.activity,
    sparkCooldownRemainingMs: config.sparkCooldownMs,
  };
}

function requestCyanBurstPrepare(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
  effects: PlayerEnergyEffect[],
  rejections: PlayerEnergyRejection[],
): PlayerEnergyState {
  const rejectionReason = getBurstPrepareRejectionReason(state, config);

  if (rejectionReason) {
    rejections.push({
      request: "cyan-burst-prepare",
      reason: rejectionReason,
    });

    return state;
  }

  effects.push("cyan-burst-preparation-started");

  return {
    ...state,
    activity: "burst-preparing",
    burstPreparationRemainingMs: config.burstPreparationMs,
    burstDurationRemainingMs: 0,
  };
}

function requestCyanBurstFire(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
  effects: PlayerEnergyEffect[],
  rejections: PlayerEnergyRejection[],
): PlayerEnergyState {
  const rejectionReason = getBurstFireRejectionReason(state, config);

  if (rejectionReason) {
    rejections.push({
      request: "cyan-burst-fire",
      reason: rejectionReason,
    });

    return state;
  }

  effects.push("cyan-burst-fired");

  return {
    ...state,
    energy: state.energy - config.burstCost,
    activity: "burst-firing",
    burstCooldownRemainingMs: config.burstCooldownMs,
    burstPreparationRemainingMs: 0,
    burstDurationRemainingMs: config.burstDurationMs,
  };
}

function cancelCyanBurst(
  state: PlayerEnergyState,
  effects: PlayerEnergyEffect[],
): PlayerEnergyState {
  if (state.activity !== "burst-preparing") {
    return state;
  }

  effects.push("cyan-burst-canceled");

  return {
    ...state,
    activity: "idle",
    burstPreparationRemainingMs: 0,
  };
}

function applyChargeInput(
  state: PlayerEnergyState,
  input: PlayerEnergyInput,
  config: PlayerEnergyConfig,
  deltaMs: number,
  effects: PlayerEnergyEffect[],
): PlayerEnergyState {
  if (isBurstActivity(state.activity)) {
    return state;
  }

  const chargeRatePerSecond = getChargeRatePerSecond(input, config);

  if (!input.isChargeHeld || chargeRatePerSecond <= 0) {
    return state.activity === "charging"
      ? {
          ...state,
          activity: "idle",
        }
      : state;
  }

  const previousEnergy = state.energy;
  const gainedEnergy = chargeRatePerSecond * (deltaMs / 1_000);
  const energy = clampEnergy(previousEnergy + gainedEnergy, config);

  if (energy > previousEnergy) {
    effects.push("cyan-energy-gained");
  }

  if (previousEnergy < config.maxEnergy && energy >= config.maxEnergy) {
    effects.push("cyan-energy-full");
  }

  return {
    ...state,
    energy,
    activity: "charging",
  };
}

function getChargeRatePerSecond(
  input: PlayerEnergyInput,
  config: PlayerEnergyConfig,
): number {
  if (!input.canCharge) {
    return 0;
  }

  return input.isGrounded
    ? config.groundChargeRatePerSecond
    : config.airChargeRatePerSecond;
}

function getSparkRejectionReason(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
): PlayerEnergyRejectionReason | undefined {
  if (isBurstActivity(state.activity)) {
    return "busy";
  }

  if (state.energy < config.sparkCost) {
    return "insufficient-energy";
  }

  if (state.sparkCooldownRemainingMs > 0) {
    return "cooldown";
  }

  return undefined;
}

function getBurstPrepareRejectionReason(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
): PlayerEnergyRejectionReason | undefined {
  if (isBurstActivity(state.activity)) {
    return "busy";
  }

  if (state.energy < config.burstCost) {
    return "insufficient-energy";
  }

  if (state.burstCooldownRemainingMs > 0) {
    return "cooldown";
  }

  return undefined;
}

function getBurstFireRejectionReason(
  state: PlayerEnergyState,
  config: PlayerEnergyConfig,
): PlayerEnergyRejectionReason | undefined {
  if (
    state.activity !== "burst-preparing" ||
    state.burstPreparationRemainingMs > 0
  ) {
    return "not-ready";
  }

  if (state.energy < config.burstCost) {
    return "insufficient-energy";
  }

  return undefined;
}

function isBurstActivity(activity: PlayerEnergyActivity): boolean {
  return activity === "burst-preparing" || activity === "burst-firing";
}

function isBurstDirectionLocked(activity: PlayerEnergyActivity): boolean {
  return activity === "burst-preparing" || activity === "burst-firing";
}

function clampEnergy(energy: number, config: PlayerEnergyConfig): number {
  if (!Number.isFinite(energy)) {
    return config.initialEnergy;
  }

  return Math.min(config.maxEnergy, Math.max(PLAYER_ENERGY_MIN, energy));
}

function reduceTimer(value: number, deltaMs: number): number {
  return Math.max(0, value - deltaMs);
}
