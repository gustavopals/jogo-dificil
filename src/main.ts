import Phaser from "phaser";

import { createGameConfig } from "./game/config";
import { GAME_SCENES } from "./game/scenes";

new Phaser.Game(createGameConfig([...GAME_SCENES]));
