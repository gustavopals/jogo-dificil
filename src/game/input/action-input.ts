import Phaser from "phaser";

import type {
  InputAction,
  InputBinding,
  InputReader,
  InputState,
} from "../../shared";
import {
  createInputState,
  DEFAULT_INPUT_BINDINGS,
  INPUT_ACTIONS,
} from "./input-bindings";

export class ActionInput implements InputReader {
  private readonly actionKeys = new Map<
    InputAction,
    readonly Phaser.Input.Keyboard.Key[]
  >();

  public constructor(
    scene: Phaser.Scene,
    bindings: readonly InputBinding[] = DEFAULT_INPUT_BINDINGS,
  ) {
    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("ActionInput requires the Phaser keyboard plugin.");
    }

    bindings.forEach((binding) => {
      this.actionKeys.set(
        binding.action,
        binding.keys.map((key) => keyboard.addKey(key, true, false)),
      );
    });
  }

  public isDown(action: InputAction): boolean {
    return this.getKeys(action).some((key) => key.isDown);
  }

  public wasPressed(action: InputAction): boolean {
    return this.getKeys(action).some((key) =>
      Phaser.Input.Keyboard.JustDown(key),
    );
  }

  public wasReleased(action: InputAction): boolean {
    return this.getKeys(action).some((key) =>
      Phaser.Input.Keyboard.JustUp(key),
    );
  }

  public getState(): InputState {
    return createInputState(
      INPUT_ACTIONS.filter((action) => this.isDown(action)),
    );
  }

  public destroy(): void {
    this.actionKeys.clear();
  }

  private getKeys(action: InputAction): readonly Phaser.Input.Keyboard.Key[] {
    return this.actionKeys.get(action) ?? [];
  }
}
