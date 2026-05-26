import Phaser from "phaser";

import { MUSIC_AUDIO_IDS } from "../../data/audio";
import { getRequiredLevelDefinition } from "../../data/levels";
import type { LevelId } from "../../shared";
import { GAME_BACKGROUND_COLOR, GAME_RESOLUTION } from "../constants";
import { emitGameEvent, GAME_EVENTS } from "../systems/game-events";
import { gameStateStore } from "../systems/game-state";
import type { LevelCompletionResult } from "../systems/level-results";
import {
  createLevelTransitionLabels,
  LEVEL_TRANSITION_DELAY_MS,
  normalizeTransitionDeathCount,
} from "../ui/level-transition";
import { SCENE_KEYS } from "./scene-keys";

export type LevelTransitionSceneData = {
  readonly completedLevelId: LevelId;
  readonly nextLevelId?: LevelId;
  readonly deathCount: number;
  readonly levelResult?: LevelCompletionResult;
};

export class LevelTransitionScene extends Phaser.Scene {
  private nextLevelId?: LevelId;
  private transitionTimer?: Phaser.Time.TimerEvent;

  public constructor() {
    super(SCENE_KEYS.LEVEL_TRANSITION);
  }

  public create(data: LevelTransitionSceneData): void {
    const completedLevel = getRequiredLevelDefinition(data.completedLevelId);
    const nextLevel = data.nextLevelId
      ? getRequiredLevelDefinition(data.nextLevelId)
      : undefined;
    const labels = createLevelTransitionLabels(
      completedLevel,
      nextLevel,
      normalizeTransitionDeathCount(data.deathCount),
      data.levelResult ?? null,
    );

    this.nextLevelId = nextLevel?.id;
    this.cameras.main.setBackgroundColor(GAME_BACKGROUND_COLOR);
    this.drawTransition(
      labels.title,
      labels.detail,
      labels.result,
      labels.deaths,
      labels.prompt,
    );

    if (nextLevel) {
      this.transitionTimer = this.time.delayedCall(
        LEVEL_TRANSITION_DELAY_MS,
        this.startNextLevel,
        undefined,
        this,
      );
    } else {
      this.bindFinalScreenInput();
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
  }

  private drawTransition(
    title: string,
    detail: string,
    result: string,
    deaths: string,
    prompt: string,
  ): void {
    const centerX = GAME_RESOLUTION.width / 2;
    const centerY = GAME_RESOLUTION.height / 2;
    const hasResult = result.length > 0;
    const deathsY = hasResult ? centerY + 34 : centerY + 18;
    const separatorY = hasResult ? centerY + 52 : centerY + 44;
    const promptY = hasResult ? centerY + 64 : centerY + 56;

    this.add.rectangle(
      centerX,
      centerY,
      GAME_RESOLUTION.width,
      GAME_RESOLUTION.height,
      0x111217,
      1,
    );
    this.add.rectangle(
      centerX,
      separatorY,
      GAME_RESOLUTION.width,
      2,
      0x80d7c2,
      0.45,
    );

    const titleText = this.add
      .text(centerX, centerY - 36, title, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "20px",
      })
      .setOrigin(0.5)
      .setAlpha(0);
    const detailText = this.add
      .text(centerX, centerY - 4, detail, {
        color: "#80d7c2",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(0.5)
      .setAlpha(0);
    const resultText = this.add
      .text(centerX, centerY + 14, result, {
        color: "#f4d35e",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(0.5)
      .setAlpha(0);
    const deathsText = this.add
      .text(centerX, deathsY, deaths, {
        color: "#f5f7fb",
        fontFamily: "monospace",
        fontSize: "10px",
      })
      .setOrigin(0.5)
      .setAlpha(0);

    if (prompt) {
      this.add
        .text(centerX, promptY, prompt, {
          color: "#80d7c2",
          fontFamily: "monospace",
          fontSize: "10px",
        })
        .setOrigin(0.5);
    }

    this.tweens.add({
      targets: [titleText, detailText, resultText, deathsText],
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut",
    });
  }

  private bindFinalScreenInput(): void {
    this.input.keyboard?.once("keydown-ENTER", this.restartRun, this);
    this.input.keyboard?.once("keydown-SPACE", this.restartRun, this);
    this.input.once(Phaser.Input.Events.POINTER_DOWN, this.restartRun, this);
  }

  private startNextLevel(): void {
    if (!this.nextLevelId) {
      return;
    }

    const nextLevel = getRequiredLevelDefinition(this.nextLevelId);

    gameStateStore.startLevel(nextLevel.id, nextLevel.spawn);
    emitGameEvent(GAME_EVENTS.AUDIO_PLAY_REQUESTED, {
      audioId: MUSIC_AUDIO_IDS.MVP_LOOP,
      category: "music",
    });
    this.scene.start(SCENE_KEYS.LEVEL);
  }

  private restartRun(): void {
    gameStateStore.resetRun();
    this.scene.start(SCENE_KEYS.MENU);
  }

  private cleanup(): void {
    this.transitionTimer?.remove(false);
    this.transitionTimer = undefined;
    this.input.keyboard?.off("keydown-ENTER", this.restartRun, this);
    this.input.keyboard?.off("keydown-SPACE", this.restartRun, this);
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.restartRun, this);
  }
}
