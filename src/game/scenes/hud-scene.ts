import Phaser from "phaser";

import { GAME_RESOLUTION } from "../constants";
import { gameStateStore } from "../systems/game-state";
import {
  DEATH_COUNTER_HUD_LAYOUT,
  DEATH_COUNTER_TEXT_STYLE,
  formatDeathCounter,
} from "../ui/death-counter";
import { SCENE_KEYS } from "./scene-keys";

export class HudScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.HUD);
  }

  public create(): void {
    this.add
      .rectangle(
        DEATH_COUNTER_HUD_LAYOUT.x,
        DEATH_COUNTER_HUD_LAYOUT.y,
        DEATH_COUNTER_HUD_LAYOUT.width,
        DEATH_COUNTER_HUD_LAYOUT.height,
        0x050608,
        0.72,
      )
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x80d7c2, 0.45)
      .setScrollFactor(0)
      .setDepth(10);

    const deathsText = this.add
      .text(
        DEATH_COUNTER_HUD_LAYOUT.x + DEATH_COUNTER_HUD_LAYOUT.paddingX,
        DEATH_COUNTER_HUD_LAYOUT.y + DEATH_COUNTER_HUD_LAYOUT.paddingY,
        "",
        DEATH_COUNTER_TEXT_STYLE,
      )
      .setScrollFactor(0)
      .setDepth(11);

    const levelText = this.add
      .text(GAME_RESOLUTION.width - 8, 6, "", {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(11);

    const muteText = this.add
      .text(GAME_RESOLUTION.width - 8, 20, "", {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(11);

    const unsubscribe = gameStateStore.subscribe((state) => {
      deathsText.setText(formatDeathCounter(state.deathCount));
      levelText.setText(state.currentLevelId);
      muteText.setText(state.isMuted ? "Mudo" : "");
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
  }
}
