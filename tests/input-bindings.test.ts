import { describe, expect, it } from "vitest";

import type { InputAction, InputBinding } from "../src/shared";
import {
  createInputState,
  DEFAULT_INPUT_BINDINGS,
  getKeysForAction,
  INPUT_ACTIONS,
  isInputAction,
} from "../src/game/input/input-bindings";

describe("input bindings", () => {
  it("maps every gameplay and system action to the expected keys", () => {
    expect(getKeysForAction("move-left")).toEqual(["A", "LEFT"]);
    expect(getKeysForAction("move-right")).toEqual(["D", "RIGHT"]);
    expect(getKeysForAction("jump")).toEqual(["SPACE", "W", "UP"]);
    expect(getKeysForAction("primary")).toEqual(["J", "Z"]);
    expect(getKeysForAction("secondary")).toEqual(["K", "X"]);
    expect(getKeysForAction("charge-energy")).toEqual(["L", "C"]);
    expect(getKeysForAction("restart")).toEqual(["R"]);
    expect(getKeysForAction("pause")).toEqual(["ESC"]);
    expect(getKeysForAction("mute")).toEqual(["M"]);
  });

  it("keeps one binding entry for each input action", () => {
    const boundActions = DEFAULT_INPUT_BINDINGS.map(
      (binding) => binding.action,
    );

    expect(boundActions).toEqual(INPUT_ACTIONS);
    expect(new Set(boundActions).size).toBe(INPUT_ACTIONS.length);
  });

  it("creates a complete input state from active actions", () => {
    expect(createInputState(["jump", "mute"])).toEqual({
      "move-left": false,
      "move-right": false,
      jump: true,
      primary: false,
      secondary: false,
      "charge-energy": false,
      restart: false,
      pause: false,
      mute: true,
    });
  });

  it("keeps charge-energy as a held gameplay action independent from secondary", () => {
    expect(createInputState(["charge-energy"])).toMatchObject({
      secondary: false,
      "charge-energy": true,
    });
    expect(createInputState(["secondary"])).toMatchObject({
      secondary: true,
      "charge-energy": false,
    });
  });

  it("keeps K/X secondary keys separate from L/C charge keys", () => {
    const secondaryKeys = new Set(getKeysForAction("secondary"));
    const chargeKeys = getKeysForAction("charge-energy");

    expect(chargeKeys).toEqual(["L", "C"]);
    expect(chargeKeys.every((key) => !secondaryKeys.has(key))).toBe(true);
  });

  it("resolves custom binding maps without falling back to defaults", () => {
    const customBindings = [
      {
        action: "jump",
        keys: ["I"],
      },
      {
        action: "restart",
        keys: ["BACKSPACE"],
      },
    ] as const satisfies readonly InputBinding[];

    expect(getKeysForAction("jump", customBindings)).toEqual(["I"]);
    expect(getKeysForAction("restart", customBindings)).toEqual(["BACKSPACE"]);
    expect(getKeysForAction("mute", customBindings)).toEqual([]);
  });

  it("identifies known input actions", () => {
    expect(isInputAction("primary")).toBe(true);
    expect(isInputAction("charge-energy")).toBe(true);
    expect(isInputAction("pause")).toBe(true);
    expect(isInputAction("enter")).toBe(false);

    const actionName = "restart";

    if (isInputAction(actionName)) {
      const action: InputAction = actionName;

      expect(action).toBe("restart");
    }
  });
});
