import Phaser from "phaser";

import { createGameConfig } from "./game/config";
import {
  AudioScene,
  BootScene,
  HudScene,
  LevelScene,
  MenuScene,
  PauseScene,
  PreloadScene,
} from "./game/scenes";

new Phaser.Game(
  createGameConfig([
    AudioScene,
    BootScene,
    PreloadScene,
    MenuScene,
    LevelScene,
    HudScene,
    PauseScene,
  ]),
);
