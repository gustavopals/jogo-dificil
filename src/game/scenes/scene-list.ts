import { AudioScene } from "./audio-scene";
import { BootScene } from "./boot-scene";
import { HudScene } from "./hud-scene";
import { LevelScene } from "./level-scene";
import { MenuScene } from "./menu-scene";
import { PauseScene } from "./pause-scene";
import { PreloadScene } from "./preload-scene";
import { SCENE_KEYS } from "./scene-keys";
import { GAME_SCENE_ORDER } from "./scene-order";

const GAME_SCENES_BY_KEY = {
  [SCENE_KEYS.BOOT]: BootScene,
  [SCENE_KEYS.AUDIO]: AudioScene,
  [SCENE_KEYS.PRELOAD]: PreloadScene,
  [SCENE_KEYS.MENU]: MenuScene,
  [SCENE_KEYS.LEVEL]: LevelScene,
  [SCENE_KEYS.HUD]: HudScene,
  [SCENE_KEYS.PAUSE]: PauseScene,
} as const;

export const GAME_SCENES = GAME_SCENE_ORDER.map(
  (sceneKey) => GAME_SCENES_BY_KEY[sceneKey],
);
