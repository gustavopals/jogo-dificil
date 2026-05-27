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

type InputTransitionCacheEntry = {
  readonly frame: number;
  readonly value: boolean;
};

export class ActionInput implements InputReader {
  private readonly actionKeys = new Map<
    InputAction,
    readonly Phaser.Input.Keyboard.Key[]
  >();
  private readonly pressedCache = new Map<
    InputAction,
    InputTransitionCacheEntry
  >();
  private readonly releasedCache = new Map<
    InputAction,
    InputTransitionCacheEntry
  >();
  private readonly scene: Phaser.Scene;

  public constructor(
    scene: Phaser.Scene,
    bindings: readonly InputBinding[] = DEFAULT_INPUT_BINDINGS,
  ) {
    this.scene = scene;

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
    return this.readTransition(
      this.pressedCache,
      action,
      Phaser.Input.Keyboard.JustDown,
    );
  }

  public wasReleased(action: InputAction): boolean {
    return this.readTransition(
      this.releasedCache,
      action,
      Phaser.Input.Keyboard.JustUp,
    );
  }

  public getState(): InputState {
    return createInputState(
      INPUT_ACTIONS.filter((action) => this.isDown(action)),
    );
  }

  public destroy(): void {
    this.actionKeys.clear();
    this.pressedCache.clear();
    this.releasedCache.clear();
  }

  private getKeys(action: InputAction): readonly Phaser.Input.Keyboard.Key[] {
    return this.actionKeys.get(action) ?? [];
  }

  private readTransition(
    cache: Map<InputAction, InputTransitionCacheEntry>,
    action: InputAction,
    readKeyTransition: (key: Phaser.Input.Keyboard.Key) => boolean,
  ): boolean {
    const frame = this.scene.game.loop.frame;
    const cached = cache.get(action);

    if (cached?.frame === frame) {
      return cached.value;
    }

    const value = this.getKeys(action).some(readKeyTransition);

    cache.set(action, {
      frame,
      value,
    });

    return value;
  }
}
