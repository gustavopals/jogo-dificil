import Phaser from "phaser";

import { createGameConfig } from "./game/config";
import {
  BootScene,
  HudScene,
  LevelScene,
  MenuScene,
  PauseScene,
  PreloadScene,
} from "./game/scenes";

new Phaser.Game(
  createGameConfig([
    BootScene,
    PreloadScene,
    MenuScene,
    LevelScene,
    HudScene,
    PauseScene,
  ]),
);
