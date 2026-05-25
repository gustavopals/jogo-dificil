export type GameplayAction =
  | "move-left"
  | "move-right"
  | "jump"
  | "primary"
  | "secondary";

export type SystemAction = "restart" | "pause" | "mute";

export type InputAction = GameplayAction | SystemAction;

export type InputBinding = {
  readonly action: InputAction;
  readonly keys: readonly string[];
};

export type InputState = Readonly<Record<InputAction, boolean>>;

export type InputReader = {
  isDown(action: InputAction): boolean;
  wasPressed(action: InputAction): boolean;
  wasReleased(action: InputAction): boolean;
  getState(): InputState;
};
