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
  getHudEnergyMeterView,
  HUD_ACCENT_TEXT_STYLE,
  HUD_ENERGY_METER_STYLE,
  HUD_LAYOUT,
  HUD_MUSIC_BUTTON_STYLE,
  HUD_PANEL_STYLE,
  HUD_TEXT_STYLE,
} from "../ui/hud";
import { SCENE_KEYS } from "./scene-keys";

const ENERGY_FEEDBACK_TWEEN_MS = {
  full: 240,
  insufficient: 150,
} as const;

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

    const energySegmentFills: Phaser.GameObjects.Rectangle[] = [];
    const energyMeterWidth =
      HUD_LAYOUT.energySegmentCount * HUD_LAYOUT.energySegmentWidth +
      (HUD_LAYOUT.energySegmentCount - 1) * HUD_LAYOUT.energySegmentGap;

    for (let index = 0; index < HUD_LAYOUT.energySegmentCount; index++) {
      const segmentX =
        HUD_LAYOUT.energyMeterX +
        index * (HUD_LAYOUT.energySegmentWidth + HUD_LAYOUT.energySegmentGap);

      this.add
        .rectangle(
          segmentX,
          HUD_LAYOUT.energyMeterY,
          HUD_LAYOUT.energySegmentWidth,
          HUD_LAYOUT.energySegmentHeight,
          HUD_ENERGY_METER_STYLE.emptyFillColor,
          HUD_ENERGY_METER_STYLE.emptyFillAlpha,
        )
        .setOrigin(0, 0)
        .setStrokeStyle(
          1,
          HUD_ENERGY_METER_STYLE.emptyStrokeColor,
          HUD_ENERGY_METER_STYLE.emptyStrokeAlpha,
        )
        .setScrollFactor(0)
        .setDepth(11);

      const fill = this.add
        .rectangle(
          segmentX,
          HUD_LAYOUT.energyMeterY,
          HUD_LAYOUT.energySegmentWidth,
          HUD_LAYOUT.energySegmentHeight,
          HUD_ENERGY_METER_STYLE.fillColor,
          HUD_ENERGY_METER_STYLE.fillAlpha,
        )
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(12);

      energySegmentFills.push(fill);
    }

    const energyFeedbackOverlay = this.add
      .rectangle(
        HUD_LAYOUT.energyMeterX + energyMeterWidth / 2,
        HUD_LAYOUT.energyMeterY + HUD_LAYOUT.energySegmentHeight / 2,
        energyMeterWidth + 5,
        HUD_LAYOUT.energySegmentHeight + 5,
        HUD_ENERGY_METER_STYLE.fullFeedbackColor,
        0,
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(13);

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
    let lastEnergyFeedbackSequence =
      gameStateStore.getSnapshot().playerEnergy.feedback.sequence;

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

      const energyMeter = getHudEnergyMeterView(state.playerEnergy);

      energySegmentFills.forEach((segment, index) => {
        const fillRatio = energyMeter.segmentFillRatios[index] ?? 0;
        const width = HUD_LAYOUT.energySegmentWidth * fillRatio;

        segment
          .setFillStyle(energyMeter.fillColor, energyMeter.fillAlpha)
          .setDisplaySize(Math.max(1, width), HUD_LAYOUT.energySegmentHeight)
          .setVisible(width > 0);
      });

      const energyFeedback = state.playerEnergy.feedback;

      if (energyFeedback.sequence === lastEnergyFeedbackSequence) {
        return;
      }

      lastEnergyFeedbackSequence = energyFeedback.sequence;

      if (energyFeedback.kind === "full") {
        this.playEnergyMeterFeedback(energyFeedbackOverlay, "full");
      }

      if (energyFeedback.kind === "insufficient") {
        this.playEnergyMeterFeedback(energyFeedbackOverlay, "insufficient");
      }
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

  private playEnergyMeterFeedback(
    overlay: Phaser.GameObjects.Rectangle,
    kind: "full" | "insufficient",
  ): void {
    this.tweens.killTweensOf(overlay);

    const isFullFeedback = kind === "full";
    const color = isFullFeedback
      ? HUD_ENERGY_METER_STYLE.fullFeedbackColor
      : HUD_ENERGY_METER_STYLE.insufficientFeedbackColor;

    overlay
      .setFillStyle(color, isFullFeedback ? 0.34 : 0.42)
      .setStrokeStyle(1, color, isFullFeedback ? 0.72 : 0.82)
      .setScale(1)
      .setAlpha(isFullFeedback ? 0.68 : 0.78)
      .setVisible(true);

    this.tweens.add({
      targets: overlay,
      alpha: 0,
      scaleX: isFullFeedback ? 1.14 : 1.04,
      scaleY: isFullFeedback ? 1.34 : 1.12,
      duration: isFullFeedback
        ? ENERGY_FEEDBACK_TWEEN_MS.full
        : ENERGY_FEEDBACK_TWEEN_MS.insufficient,
      ease: "Quad.easeOut",
      onComplete: () => {
        overlay.setVisible(false).setScale(1);
      },
    });
  }
}
