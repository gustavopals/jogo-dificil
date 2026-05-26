import Phaser from "phaser";

import { gameStateStore } from "../systems/game-state";
import {
  formatPauseMuteStatus,
  PAUSE_OVERLAY_COPY,
  PAUSE_OVERLAY_LAYOUT,
  PAUSE_OVERLAY_STYLE,
} from "../ui/pause-overlay";
import { SCENE_KEYS } from "./scene-keys";

export class PauseScene extends Phaser.Scene {
  private unsubscribeState?: () => void;
  private isResuming = false;

  public constructor() {
    super(SCENE_KEYS.PAUSE);
  }

  public create(): void {
    this.isResuming = false;
    gameStateStore.setPaused(true);

    this.add.rectangle(
      PAUSE_OVERLAY_LAYOUT.centerX,
      PAUSE_OVERLAY_LAYOUT.centerY,
      PAUSE_OVERLAY_LAYOUT.width,
      PAUSE_OVERLAY_LAYOUT.height,
      PAUSE_OVERLAY_STYLE.fillColor,
      PAUSE_OVERLAY_STYLE.fillAlpha,
    );

    this.add
      .text(
        PAUSE_OVERLAY_LAYOUT.centerX,
        PAUSE_OVERLAY_LAYOUT.titleY,
        PAUSE_OVERLAY_COPY.title,
        {
          color: PAUSE_OVERLAY_STYLE.titleColor,
          fontFamily: "monospace",
          fontSize: "18px",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        PAUSE_OVERLAY_LAYOUT.centerX,
        PAUSE_OVERLAY_LAYOUT.commandY,
        `${PAUSE_OVERLAY_COPY.resumeCommand}  ·  ${PAUSE_OVERLAY_COPY.muteCommand}`,
        {
          color: PAUSE_OVERLAY_STYLE.commandColor,
          fontFamily: "monospace",
          fontSize: "10px",
        },
      )
      .setOrigin(0.5);

    const muteText = this.add
      .text(PAUSE_OVERLAY_LAYOUT.centerX, PAUSE_OVERLAY_LAYOUT.muteY, "", {
        color: PAUSE_OVERLAY_STYLE.mutedColor,
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(0.5);

    this.unsubscribeState = gameStateStore.subscribe((state) => {
      muteText.setText(formatPauseMuteStatus(state.isMuted));
    });

    this.input.keyboard?.on("keydown-ESC", this.resumeLevel, this);
    this.input.keyboard?.on("keydown-M", this.toggleMute, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private resumeLevel(): void {
    if (this.isResuming) {
      return;
    }

    this.isResuming = true;
    gameStateStore.setPaused(false);
    this.scene.stop();
    this.scene.resume(SCENE_KEYS.LEVEL);
  }

  private toggleMute(): void {
    gameStateStore.toggleMuted();
  }

  private cleanup(): void {
    this.input.keyboard?.off("keydown-ESC", this.resumeLevel, this);
    this.input.keyboard?.off("keydown-M", this.toggleMute, this);
    this.unsubscribeState?.();
    this.unsubscribeState = undefined;
  }
}
