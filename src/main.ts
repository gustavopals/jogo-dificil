import Phaser from "phaser";

import { createGameConfig } from "./game/config";
import { GAME_SCENES } from "./game/scenes";

type DebugWindow = Window & {
  __JOGO_DIFICIL_GAME__?: Phaser.Game;
};

const game = new Phaser.Game(createGameConfig([...GAME_SCENES]));

if (import.meta.env.DEV) {
  (window as DebugWindow).__JOGO_DIFICIL_GAME__ = game;

  void import("./game/systems/dev-qa-tools").then(({ installDevQaTools }) => {
    installDevQaTools(game, window);
  });
}
