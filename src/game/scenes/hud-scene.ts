import Phaser from "phaser";

import { getRequiredLevelDefinition } from "../../data/levels";
import { gameStateStore } from "../systems/game-state";
import {
  formatHudLabels,
  HUD_ACCENT_TEXT_STYLE,
  HUD_LAYOUT,
  HUD_PANEL_STYLE,
  HUD_TEXT_STYLE,
} from "../ui/hud";
import { SCENE_KEYS } from "./scene-keys";

export class HudScene extends Phaser.Scene {
  public constructor() {
    super(SCENE_KEYS.HUD);
  }

  public create(): void {
    this.add
      .rectangle(
        HUD_LAYOUT.x,
        HUD_LAYOUT.y,
        HUD_LAYOUT.width,
        HUD_LAYOUT.height,
        HUD_PANEL_STYLE.fillColor,
        HUD_PANEL_STYLE.fillAlpha,
      )
      .setOrigin(0, 0)
      .setStrokeStyle(
        1,
        HUD_PANEL_STYLE.strokeColor,
        HUD_PANEL_STYLE.strokeAlpha,
      )
      .setScrollFactor(0)
      .setDepth(10);

    const deathsText = this.add
      .text(
        HUD_LAYOUT.deathsX,
        HUD_LAYOUT.y + HUD_LAYOUT.paddingY,
        "",
        HUD_TEXT_STYLE,
      )
      .setScrollFactor(0)
      .setDepth(11);

    const levelText = this.add
      .text(
        HUD_LAYOUT.levelX,
        HUD_LAYOUT.y + HUD_LAYOUT.paddingY,
        "",
        HUD_ACCENT_TEXT_STYLE,
      )
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(11);

    const muteText = this.add
      .text(
        HUD_LAYOUT.muteX,
        HUD_LAYOUT.y + HUD_LAYOUT.paddingY,
        "",
        HUD_TEXT_STYLE,
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(11);

    const unsubscribe = gameStateStore.subscribe((state) => {
      const labels = formatHudLabels(
        state,
        getRequiredLevelDefinition(state.currentLevelId),
      );

      deathsText.setText(labels.deaths);
      levelText.setText(labels.level);
      muteText.setText(labels.mute);
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, unsubscribe);
  }
}
