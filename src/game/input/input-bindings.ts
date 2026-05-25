import type {
  GameplayAction,
  InputAction,
  InputBinding,
  InputState,
  SystemAction,
} from "../../shared";

export const GAMEPLAY_ACTIONS = [
  "move-left",
  "move-right",
  "jump",
  "primary",
  "secondary",
] as const satisfies readonly GameplayAction[];

export const SYSTEM_ACTIONS = [
  "restart",
  "pause",
  "mute",
] as const satisfies readonly SystemAction[];

export const INPUT_ACTIONS = [
  ...GAMEPLAY_ACTIONS,
  ...SYSTEM_ACTIONS,
] as const satisfies readonly InputAction[];

export const DEFAULT_INPUT_BINDINGS = [
  {
    action: "move-left",
    keys: ["A", "LEFT"],
  },
  {
    action: "move-right",
    keys: ["D", "RIGHT"],
  },
  {
    action: "jump",
    keys: ["SPACE", "W", "UP"],
  },
  {
    action: "primary",
    keys: ["J", "Z"],
  },
  {
    action: "secondary",
    keys: ["K", "X"],
  },
  {
    action: "restart",
    keys: ["R"],
  },
  {
    action: "pause",
    keys: ["ESC"],
  },
  {
    action: "mute",
    keys: ["M"],
  },
] as const satisfies readonly InputBinding[];

export function createInputState(
  activeActions: readonly InputAction[] = [],
): InputState {
  const activeActionSet = new Set<InputAction>(activeActions);
  const state = {} as Record<InputAction, boolean>;

  INPUT_ACTIONS.forEach((action) => {
    state[action] = activeActionSet.has(action);
  });

  return state;
}

export function getKeysForAction(
  action: InputAction,
  bindings: readonly InputBinding[] = DEFAULT_INPUT_BINDINGS,
): readonly string[] {
  return bindings.find((binding) => binding.action === action)?.keys ?? [];
}

export function isInputAction(value: string): value is InputAction {
  return (INPUT_ACTIONS as readonly string[]).includes(value);
}
