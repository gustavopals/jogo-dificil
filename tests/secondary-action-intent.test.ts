import { describe, expect, it } from "vitest";

import {
  createInitialSecondaryActionIntentState,
  resolveSecondaryActionIntent,
  type SecondaryActionIntentState,
} from "../src/game/input/secondary-action-intent";

const CONFIG = {
  specialHoldThresholdMs: 500,
} as const;

function resolve(input: {
  readonly isSecondaryDown?: boolean;
  readonly wasSecondaryPressed?: boolean;
  readonly wasSecondaryReleased?: boolean;
  readonly hasNearbyInteraction?: boolean;
  readonly canPrepareSpecial?: boolean;
  readonly deltaMs?: number;
  readonly state?: SecondaryActionIntentState;
}) {
  return resolveSecondaryActionIntent({
    isSecondaryDown: input.isSecondaryDown ?? false,
    wasSecondaryPressed: input.wasSecondaryPressed ?? false,
    wasSecondaryReleased: input.wasSecondaryReleased ?? false,
    hasNearbyInteraction: input.hasNearbyInteraction ?? false,
    canPrepareSpecial: input.canPrepareSpecial ?? false,
    deltaMs: input.deltaMs ?? 0,
    state: input.state ?? createInitialSecondaryActionIntentState(),
    config: CONFIG,
  });
}

describe("secondary action intent", () => {
  it("preserves nearby interaction on the K/X press", () => {
    const pressed = resolve({
      isSecondaryDown: true,
      wasSecondaryPressed: true,
      hasNearbyInteraction: true,
      deltaMs: 16,
    });

    expect(pressed.intent).toBe("interact");
    expect(pressed.state).toEqual({
      mode: "interaction-consumed",
      heldMs: 0,
    });

    const released = resolve({
      wasSecondaryReleased: true,
      state: pressed.state,
    });

    expect(released.intent).toBe("none");
    expect(released.state).toEqual(createInitialSecondaryActionIntentState());
  });

  it("turns a short K/X tap without interaction into a quick shot intent", () => {
    const pressed = resolve({
      isSecondaryDown: true,
      wasSecondaryPressed: true,
      deltaMs: 80,
    });
    const released = resolve({
      wasSecondaryReleased: true,
      state: pressed.state,
    });

    expect(released.intent).toBe("quick-shot");
    expect(released.state).toEqual(createInitialSecondaryActionIntentState());
  });

  it("resolves a same-frame K/X tap as a quick shot", () => {
    const tapped = resolve({
      wasSecondaryPressed: true,
      wasSecondaryReleased: true,
    });

    expect(tapped.intent).toBe("quick-shot");
    expect(tapped.state).toEqual(createInitialSecondaryActionIntentState());
  });

  it("does not emit a shot while K/X is still held below the special threshold", () => {
    const pressed = resolve({
      isSecondaryDown: true,
      wasSecondaryPressed: true,
      deltaMs: 120,
    });
    const held = resolve({
      isSecondaryDown: true,
      deltaMs: 180,
      state: pressed.state,
    });

    expect(held.intent).toBe("none");
    expect(held.state).toEqual({
      mode: "holding",
      heldMs: 300,
    });
  });

  it("starts special charging when K/X is held with full energy", () => {
    const pressed = resolve({
      isSecondaryDown: true,
      wasSecondaryPressed: true,
      canPrepareSpecial: true,
      deltaMs: 240,
    });
    const held = resolve({
      isSecondaryDown: true,
      canPrepareSpecial: true,
      deltaMs: 260,
      state: pressed.state,
    });

    expect(held.intent).toBe("special-charge-start");
    expect(held.state).toEqual({
      mode: "special-charging",
      heldMs: CONFIG.specialHoldThresholdMs,
    });
  });

  it("does not repeat special charge start while K/X stays held", () => {
    const held = resolve({
      isSecondaryDown: true,
      canPrepareSpecial: true,
      deltaMs: 120,
      state: {
        mode: "special-charging",
        heldMs: CONFIG.specialHoldThresholdMs,
      },
    });

    expect(held.intent).toBe("none");
    expect(held.state).toEqual({
      mode: "special-charging",
      heldMs: CONFIG.specialHoldThresholdMs + 120,
    });
  });

  it("does not start special charging when full energy is not available", () => {
    const pressed = resolve({
      isSecondaryDown: true,
      wasSecondaryPressed: true,
      canPrepareSpecial: false,
      deltaMs: 240,
    });
    const held = resolve({
      isSecondaryDown: true,
      canPrepareSpecial: false,
      deltaMs: 260,
      state: pressed.state,
    });

    expect(held.intent).toBe("none");
    expect(held.state).toEqual({
      mode: "holding",
      heldMs: CONFIG.specialHoldThresholdMs,
    });
  });

  it("fires the special when K/X is released after charging started", () => {
    const released = resolve({
      wasSecondaryReleased: true,
      state: {
        mode: "special-charging",
        heldMs: 620,
      },
    });

    expect(released.intent).toBe("special-fire");
    expect(released.state).toEqual(createInitialSecondaryActionIntentState());
  });

  it("cancels a long hold that never reached special charging", () => {
    const released = resolve({
      wasSecondaryReleased: true,
      state: {
        mode: "holding",
        heldMs: 620,
      },
    });

    expect(released.intent).toBe("special-cancel");
    expect(released.state).toEqual(createInitialSecondaryActionIntentState());
  });

  it("resets a dangling K/X hold if the key is no longer down", () => {
    const cleared = resolve({
      state: {
        mode: "holding",
        heldMs: 260,
      },
    });

    expect(cleared.intent).toBe("none");
    expect(cleared.state).toEqual(createInitialSecondaryActionIntentState());
  });
});
