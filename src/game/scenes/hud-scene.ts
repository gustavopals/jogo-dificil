import Phaser from "phaser";

import { GAME_RESOLUTION } from "../constants";
import { gameStateStore } from "../systems/game-state";
import { SCENE_KEYS } from "./scene-keys";

export class HudScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.HUD);
  }

  public create(): void {
    const deathsText = this.add.text(8, 6, "", {
      color: "#f5f7fb",
      fontFamily: "monospace",
      fontSize: "10px",
    });

    const levelText = this.add
      .text(GAME_RESOLUTION.width - 8, 6, "", {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(1, 0);

    const muteText = this.add
      .text(GAME_RESOLUTION.width - 8, 20, "", {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(1, 0);

    const unsubscribe = gameStateStore.subscribe((state) => {
      deathsText.setText(`Mortes: ${state.deathCount}`);
      levelText.setText(state.currentLevelId);
      muteText.setText(state.isMuted ? "Mudo" : "");
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
  }
}
