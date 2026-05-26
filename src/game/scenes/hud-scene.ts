import Phaser from "phaser";

import { getRequiredLevelDefinition } from "../../data/levels";
import { GAME_EVENTS, onGameEvent } from "../systems/game-events";
import { gameStateStore } from "../systems/game-state";
import {
  DEATH_FEEDBACK_DURATION_MS,
  DEATH_FEEDBACK_LAYOUT,
  DEATH_FEEDBACK_TEXT_STYLE,
  formatDeathFeedback,
} from "../ui/death-feedback";
import {
  formatHudLabels,
  HUD_ACCENT_TEXT_STYLE,
  HUD_LAYOUT,
  HUD_MUSIC_BUTTON_STYLE,
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

    const musicButton = this.add
      .rectangle(
        HUD_LAYOUT.musicButtonX,
        HUD_LAYOUT.musicButtonY,
        HUD_LAYOUT.musicButtonWidth,
        HUD_LAYOUT.musicButtonHeight,
        HUD_MUSIC_BUTTON_STYLE.fillColor,
        HUD_MUSIC_BUTTON_STYLE.fillAlpha,
      )
      .setOrigin(0, 0)
      .setStrokeStyle(
        1,
        HUD_MUSIC_BUTTON_STYLE.strokeColor,
        HUD_MUSIC_BUTTON_STYLE.strokeAlpha,
      )
      .setScrollFactor(0)
      .setDepth(11)
      .setInteractive({ useHandCursor: true });

    const musicButtonText = this.add
      .text(
        HUD_LAYOUT.musicButtonTextX,
        HUD_LAYOUT.musicButtonTextY,
        "",
        HUD_TEXT_STYLE,
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(12);

    musicButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      gameStateStore.toggleMusicMuted();
    });

    const deathFeedbackText = this.add
      .text(
        DEATH_FEEDBACK_LAYOUT.x,
        DEATH_FEEDBACK_LAYOUT.y,
        "",
        DEATH_FEEDBACK_TEXT_STYLE,
      )
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(12);

    let deathFeedbackTimer: Phaser.Time.TimerEvent | undefined;

    const unsubscribe = gameStateStore.subscribe((state) => {
      const labels = formatHudLabels(
        state,
        getRequiredLevelDefinition(state.currentLevelId),
      );

      deathsText.setText(labels.deaths);
      levelText.setText(labels.level);
      musicButtonText.setText(labels.music);
      musicButtonText.setColor(
        state.isMusicMuted
          ? HUD_MUSIC_BUTTON_STYLE.mutedTextColor
          : HUD_MUSIC_BUTTON_STYLE.textColor,
      );
      musicButton.setFillStyle(
        state.isMusicMuted
          ? HUD_MUSIC_BUTTON_STYLE.mutedFillColor
          : HUD_MUSIC_BUTTON_STYLE.fillColor,
        state.isMusicMuted
          ? HUD_MUSIC_BUTTON_STYLE.mutedFillAlpha
          : HUD_MUSIC_BUTTON_STYLE.fillAlpha,
      );
      muteText.setText(labels.mute);
    });
    const unsubscribeDeathFeedback = onGameEvent(
      GAME_EVENTS.PLAYER_DIED,
      (event) => {
        deathFeedbackTimer?.remove(false);
        deathFeedbackText.setText(formatDeathFeedback(event));
        deathFeedbackText.setAlpha(1);
        deathFeedbackTimer = this.time.delayedCall(
          DEATH_FEEDBACK_DURATION_MS,
          () => {
            deathFeedbackText.setText("");
            deathFeedbackTimer = undefined;
          },
        );
      },
    );

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      deathFeedbackTimer?.remove(false);
      unsubscribe();
      unsubscribeDeathFeedback();
    });
  }
}
