import { describe, expect, it } from "vitest";

import {
  canPrepareCyanBurst,
  canUseCyanSpark,
  clearPlayerEnergyTemporaryState,
  createInitialPlayerEnergyState,
  DEFAULT_PLAYER_ENERGY_CONFIG,
  getPlayerEnergyMovementConstraint,
  hasFullPlayerEnergy,
  PLAYER_ENERGY_CHARGE_HORIZONTAL_SPEED_SCALE,
  resetPlayerEnergyState,
  resolveCyanBurstFacingLock,
  updatePlayerEnergy,
  type PlayerEnergyState,
} from "../src/game/physics";

const CONFIG = {
  ...DEFAULT_PLAYER_ENERGY_CONFIG,
  maxEnergy: 100,
  initialEnergy: 40,
  groundChargeRatePerSecond: 45,
  airChargeRatePerSecond: 0,
  sparkCost: 10,
  sparkCooldownMs: 180,
  burstCost: 100,
  burstPreparationMs: 500,
  burstDurationMs: 280,
  burstCooldownMs: 1_200,
} as const;

function update(input: {
  readonly state?: PlayerEnergyState;
  readonly deltaMs?: number;
  readonly isChargeHeld?: boolean;
  readonly canCharge?: boolean;
  readonly isGrounded?: boolean;
  readonly request?:
    | "none"
    | "cyan-spark"
    | "cyan-burst-prepare"
    | "cyan-burst-fire"
    | "cyan-burst-cancel";
}) {
  return updatePlayerEnergy({
    state: input.state ?? createInitialPlayerEnergyState(undefined, CONFIG),
    deltaMs: input.deltaMs ?? 0,
    isChargeHeld: input.isChargeHeld ?? false,
    canCharge: input.canCharge ?? false,
    isGrounded: input.isGrounded ?? true,
    request: input.request ?? "none",
    config: CONFIG,
  });
}

describe("player energy", () => {
  it("creates the default energy state with no temporary timers", () => {
    expect(createInitialPlayerEnergyState(undefined, CONFIG)).toEqual({
      energy: CONFIG.initialEnergy,
      activity: "idle",
      sparkCooldownRemainingMs: 0,
      burstCooldownRemainingMs: 0,
      burstPreparationRemainingMs: 0,
      burstDurationRemainingMs: 0,
    });
  });

  it("clamps initial energy and falls back for invalid values", () => {
    expect(createInitialPlayerEnergyState(-20, CONFIG).energy).toBe(0);
    expect(createInitialPlayerEnergyState(250, CONFIG).energy).toBe(
      CONFIG.maxEnergy,
    );
    expect(createInitialPlayerEnergyState(Number.NaN, CONFIG).energy).toBe(
      CONFIG.initialEnergy,
    );
  });

  it("treats negative delta as zero for energy and timers", () => {
    const state = {
      ...createInitialPlayerEnergyState(50, CONFIG),
      sparkCooldownRemainingMs: 80,
      burstCooldownRemainingMs: 400,
    };
    const result = update({
      state,
      deltaMs: -120,
      isChargeHeld: true,
      canCharge: true,
    });

    expect(result.state).toEqual({
      ...state,
      activity: "charging",
    });
    expect(result.effects).toEqual([]);
    expect(result.rejections).toEqual([]);
  });

  it("charges energy while charge is held and clamps at the maximum", () => {
    const firstSecond = update({
      isChargeHeld: true,
      canCharge: true,
      deltaMs: 1_000,
    });
    const secondSecond = update({
      state: firstSecond.state,
      isChargeHeld: true,
      canCharge: true,
      deltaMs: 1_000,
    });

    expect(firstSecond.state).toMatchObject({
      energy: 85,
      activity: "charging",
    });
    expect(firstSecond.effects).toContain("cyan-energy-gained");
    expect(secondSecond.state.energy).toBe(CONFIG.maxEnergy);
    expect(secondSecond.effects).toEqual([
      "cyan-energy-gained",
      "cyan-energy-full",
    ]);
    expect(hasFullPlayerEnergy(secondSecond.state, CONFIG)).toBe(true);
  });

  it("does not charge when the caller blocks charge availability or is airborne", () => {
    const blocked = update({
      isChargeHeld: true,
      canCharge: false,
      deltaMs: 1_000,
    });
    const airborne = update({
      isChargeHeld: true,
      canCharge: true,
      isGrounded: false,
      deltaMs: 1_000,
    });

    expect(blocked.state).toEqual(
      createInitialPlayerEnergyState(undefined, CONFIG),
    );
    expect(blocked.effects).toEqual([]);
    expect(airborne.state).toEqual(
      createInitialPlayerEnergyState(undefined, CONFIG),
    );
    expect(airborne.effects).toEqual([]);
  });

  it("limits movement and blocks dash while Carga Ciano is active on the ground", () => {
    expect(
      getPlayerEnergyMovementConstraint({
        state: createInitialPlayerEnergyState(40, CONFIG),
        isChargeHeld: true,
        canCharge: true,
        isGrounded: true,
      }),
    ).toEqual({
      horizontalSpeedScale: PLAYER_ENERGY_CHARGE_HORIZONTAL_SPEED_SCALE,
      canDash: false,
    });

    expect(
      getPlayerEnergyMovementConstraint({
        state: {
          ...createInitialPlayerEnergyState(40, CONFIG),
          activity: "charging",
        },
        isChargeHeld: false,
        canCharge: true,
        isGrounded: true,
      }),
    ).toEqual({
      horizontalSpeedScale: PLAYER_ENERGY_CHARGE_HORIZONTAL_SPEED_SCALE,
      canDash: false,
    });
  });

  it("does not limit movement when Carga Ciano is unavailable or canceled by jump", () => {
    const state = createInitialPlayerEnergyState(40, CONFIG);

    expect(
      getPlayerEnergyMovementConstraint({
        state,
        isChargeHeld: true,
        canCharge: true,
        isGrounded: false,
      }),
    ).toEqual({
      horizontalSpeedScale: 1,
      canDash: true,
    });

    expect(
      getPlayerEnergyMovementConstraint({
        state,
        isChargeHeld: true,
        canCharge: true,
        isGrounded: true,
        wasJumpPressed: true,
      }),
    ).toEqual({
      horizontalSpeedScale: 1,
      canDash: true,
    });

    expect(
      getPlayerEnergyMovementConstraint({
        state,
        isChargeHeld: true,
        canCharge: false,
        isGrounded: true,
      }),
    ).toEqual({
      horizontalSpeedScale: 1,
      canDash: true,
    });
  });

  it("blocks dash while Rajada Ciano is preparing or firing", () => {
    expect(
      getPlayerEnergyMovementConstraint({
        state: {
          ...createInitialPlayerEnergyState(100, CONFIG),
          activity: "burst-preparing",
        },
        isChargeHeld: false,
        canCharge: true,
        isGrounded: true,
      }),
    ).toEqual({
      horizontalSpeedScale: 1,
      canDash: false,
    });

    expect(
      getPlayerEnergyMovementConstraint({
        state: {
          ...createInitialPlayerEnergyState(0, CONFIG),
          activity: "burst-firing",
        },
        isChargeHeld: false,
        canCharge: true,
        isGrounded: true,
      }),
    ).toEqual({
      horizontalSpeedScale: 1,
      canDash: false,
    });
  });

  it("spends energy on Centelha Ciano and starts its cooldown", () => {
    const fired = update({
      request: "cyan-spark",
    });

    expect(fired.state).toMatchObject({
      energy: 30,
      sparkCooldownRemainingMs: CONFIG.sparkCooldownMs,
    });
    expect(fired.effects).toEqual(["cyan-spark-fired"]);
    expect(fired.rejections).toEqual([]);
    expect(canUseCyanSpark(fired.state, CONFIG)).toBe(false);

    const cooled = update({
      state: fired.state,
      deltaMs: 80,
    });

    expect(cooled.state.sparkCooldownRemainingMs).toBe(100);
  });

  it("returns from charging to idle when charge is released", () => {
    const charging = update({
      isChargeHeld: true,
      canCharge: true,
      deltaMs: 100,
    });
    const released = update({
      state: charging.state,
      isChargeHeld: false,
      canCharge: true,
      deltaMs: 100,
    });

    expect(charging.state.activity).toBe("charging");
    expect(released.state.activity).toBe("idle");
    expect(released.effects).toEqual([]);
  });

  it("rejects Centelha Ciano without energy or during cooldown", () => {
    const noEnergy = update({
      state: createInitialPlayerEnergyState(5, CONFIG),
      request: "cyan-spark",
    });
    const onCooldown = update({
      state: {
        ...createInitialPlayerEnergyState(40, CONFIG),
        sparkCooldownRemainingMs: 20,
      },
      request: "cyan-spark",
    });

    expect(noEnergy.rejections).toEqual([
      {
        request: "cyan-spark",
        reason: "insufficient-energy",
      },
    ]);
    expect(onCooldown.rejections).toEqual([
      {
        request: "cyan-spark",
        reason: "cooldown",
      },
    ]);
    expect(onCooldown.state.energy).toBe(40);
    expect(onCooldown.effects).toEqual([]);
  });

  it("prepares Rajada Ciano only with full energy and exposes readiness", () => {
    const rejected = update({
      request: "cyan-burst-prepare",
    });
    const started = update({
      state: createInitialPlayerEnergyState(100, CONFIG),
      request: "cyan-burst-prepare",
    });
    const ready = update({
      state: started.state,
      deltaMs: CONFIG.burstPreparationMs,
    });

    expect(rejected.rejections).toEqual([
      {
        request: "cyan-burst-prepare",
        reason: "insufficient-energy",
      },
    ]);
    expect(
      canPrepareCyanBurst(createInitialPlayerEnergyState(99, CONFIG), CONFIG),
    ).toBe(false);
    expect(
      canPrepareCyanBurst(createInitialPlayerEnergyState(100, CONFIG), CONFIG),
    ).toBe(true);
    expect(started.state).toMatchObject({
      energy: 100,
      activity: "burst-preparing",
      burstPreparationRemainingMs: CONFIG.burstPreparationMs,
    });
    expect(started.state.energy).toBe(CONFIG.burstCost);
    expect(started.effects).toEqual(["cyan-burst-preparation-started"]);
    expect(canPrepareCyanBurst(started.state, CONFIG)).toBe(false);
    expect(ready.state.burstPreparationRemainingMs).toBe(0);
    expect(ready.effects).toEqual(["cyan-burst-ready"]);
  });

  it("rejects energy actions while Rajada Ciano is busy", () => {
    const preparing = {
      ...createInitialPlayerEnergyState(100, CONFIG),
      activity: "burst-preparing" as const,
      burstPreparationRemainingMs: 250,
    };
    const firing = {
      ...createInitialPlayerEnergyState(100, CONFIG),
      activity: "burst-firing" as const,
      burstDurationRemainingMs: 120,
    };

    expect(
      update({
        state: preparing,
        request: "cyan-spark",
      }).rejections,
    ).toEqual([
      {
        request: "cyan-spark",
        reason: "busy",
      },
    ]);
    expect(
      update({
        state: firing,
        request: "cyan-burst-prepare",
      }).rejections,
    ).toEqual([
      {
        request: "cyan-burst-prepare",
        reason: "busy",
      },
    ]);
  });

  it("locks Rajada Ciano facing during preparation", () => {
    const started = resolveCyanBurstFacingLock({
      activity: "burst-preparing",
      currentFacing: "right",
      requestedFacing: "left",
    });
    const kept = resolveCyanBurstFacingLock({
      activity: "burst-preparing",
      currentFacing: "left",
      requestedFacing: "left",
      lockedFacing: started.lockedFacing,
    });
    const released = resolveCyanBurstFacingLock({
      activity: "idle",
      currentFacing: "right",
      requestedFacing: "left",
      lockedFacing: started.lockedFacing,
    });

    expect(started).toEqual({
      facing: "right",
      lockedFacing: "right",
    });
    expect(kept).toEqual({
      facing: "right",
      lockedFacing: "right",
    });
    expect(released).toEqual({
      facing: "left",
    });
  });

  it("fires Rajada Ciano after preparation and then finishes the active beam", () => {
    const prepared = {
      ...createInitialPlayerEnergyState(100, CONFIG),
      activity: "burst-preparing" as const,
      burstPreparationRemainingMs: 0,
    };
    const fired = update({
      state: prepared,
      request: "cyan-burst-fire",
    });
    const finished = update({
      state: fired.state,
      deltaMs: CONFIG.burstDurationMs,
    });

    expect(fired.state).toMatchObject({
      energy: 0,
      activity: "burst-firing",
      burstCooldownRemainingMs: CONFIG.burstCooldownMs,
      burstDurationRemainingMs: CONFIG.burstDurationMs,
    });
    expect(prepared.energy).toBe(CONFIG.burstCost);
    expect(fired.state.energy).toBe(0);
    expect(fired.effects).toEqual(["cyan-burst-fired"]);
    expect(finished.state).toMatchObject({
      activity: "idle",
      burstDurationRemainingMs: 0,
      burstCooldownRemainingMs: CONFIG.burstCooldownMs - CONFIG.burstDurationMs,
    });
    expect(finished.effects).toEqual(["cyan-burst-finished"]);
  });

  it("rejects Rajada Ciano fire before preparation is ready", () => {
    const rejected = update({
      state: {
        ...createInitialPlayerEnergyState(100, CONFIG),
        activity: "burst-preparing",
        burstPreparationRemainingMs: 1,
      },
      request: "cyan-burst-fire",
    });

    expect(rejected.state).toMatchObject({
      energy: 100,
      activity: "burst-preparing",
      burstPreparationRemainingMs: 1,
    });
    expect(rejected.effects).toEqual([]);
    expect(rejected.rejections).toEqual([
      {
        request: "cyan-burst-fire",
        reason: "not-ready",
      },
    ]);
  });

  it("cancels Rajada Ciano preparation without spending energy", () => {
    const canceled = update({
      state: {
        ...createInitialPlayerEnergyState(100, CONFIG),
        activity: "burst-preparing",
        burstPreparationRemainingMs: 120,
      },
      request: "cyan-burst-cancel",
    });

    expect(canceled.state).toMatchObject({
      energy: 100,
      activity: "idle",
      burstPreparationRemainingMs: 0,
    });
    expect(canceled.effects).toEqual(["cyan-burst-canceled"]);
  });

  it("resets energy to a checkpoint value and clears all temporary state", () => {
    const dirtyState = {
      energy: 90,
      activity: "burst-firing" as const,
      sparkCooldownRemainingMs: 140,
      burstCooldownRemainingMs: 900,
      burstPreparationRemainingMs: 120,
      burstDurationRemainingMs: 180,
    };

    expect(resetPlayerEnergyState(25, CONFIG)).toEqual({
      ...dirtyState,
      energy: 25,
      activity: "idle",
      sparkCooldownRemainingMs: 0,
      burstCooldownRemainingMs: 0,
      burstPreparationRemainingMs: 0,
      burstDurationRemainingMs: 0,
    });
  });

  it("clears temporary state while preserving current energy for pause", () => {
    const dirtyState = {
      energy: 90,
      activity: "burst-preparing" as const,
      sparkCooldownRemainingMs: 140,
      burstCooldownRemainingMs: 900,
      burstPreparationRemainingMs: 120,
      burstDurationRemainingMs: 0,
    };

    expect(clearPlayerEnergyTemporaryState(dirtyState, CONFIG)).toEqual({
      ...dirtyState,
      activity: "idle",
      sparkCooldownRemainingMs: 0,
      burstCooldownRemainingMs: 0,
      burstPreparationRemainingMs: 0,
      burstDurationRemainingMs: 0,
    });
  });
});
