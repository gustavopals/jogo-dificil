import Phaser from "phaser";

import type { PersistedAudioSettings } from "../systems/audio-settings-persistence";
import { scaleLegacyX } from "../scale";
import {
  resolveAudioSettingsHitArea,
  type AudioSettingsControlsLayout,
} from "./audio-settings-layout";

export {
  createMenuAudioSettingsLayout,
  createPauseAudioSettingsLayout,
  resolveAudioSettingsHitArea,
  type AudioSettingsControlsLayout,
  type AudioSettingsSliderRow,
} from "./audio-settings-layout";

export const AUDIO_SETTINGS_UI_STYLE = {
  labelColor: "#c8d0dc",
  valueColor: "#80d7c2",
  trackColor: 0x262b31,
  fillColor: 0x80d7c2,
  thumbColor: 0xf5f7fb,
  fontFamily: "monospace",
} as const;

export type AudioSettingsControls = {
  readonly container: Phaser.GameObjects.Container;
  destroy(): void;
  setValues(settings: PersistedAudioSettings): void;
  containsPoint(x: number, y: number): boolean;
};

export type CreateAudioSettingsControlsOptions = {
  readonly scene: Phaser.Scene;
  readonly layout: AudioSettingsControlsLayout;
  readonly initialSettings: PersistedAudioSettings;
  readonly onChange: (settings: PersistedAudioSettings) => void;
};

export function createAudioSettingsControls(
  options: CreateAudioSettingsControlsOptions,
): AudioSettingsControls {
  const { scene, layout, initialSettings, onChange } = options;
  const container = scene.add.container(layout.originX, layout.originY);
  const values: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
  } = {
    masterVolume: initialSettings.masterVolume,
    musicVolume: initialSettings.musicVolume,
    sfxVolume: initialSettings.sfxVolume,
  };
  const setters = new Map<keyof PersistedAudioSettings, (volume: number) => void>();
  let activeDrag: ((pointer: Phaser.Input.Pointer) => void) | null = null;

  const onPointerMove = (pointer: Phaser.Input.Pointer) => {
    activeDrag?.(pointer);
  };

  const onPointerUp = () => {
    activeDrag = null;
  };

  scene.input.on(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
  scene.input.on(Phaser.Input.Events.POINTER_UP, onPointerUp);

  layout.rows.forEach((row) => {
    const label = scene.add
      .text(0, row.y, row.label, {
        color: AUDIO_SETTINGS_UI_STYLE.labelColor,
        fontFamily: AUDIO_SETTINGS_UI_STYLE.fontFamily,
        fontSize: layout.fontSize,
      })
      .setOrigin(0, 0.5);

    const trackX = layout.labelWidth;
    const track = scene.add
      .rectangle(
        trackX,
        row.y,
        layout.trackWidth,
        layout.trackHeight,
        AUDIO_SETTINGS_UI_STYLE.trackColor,
        1,
      )
      .setOrigin(0, 0.5);

    const fill = scene.add
      .rectangle(
        trackX,
        row.y,
        1,
        layout.trackHeight,
        AUDIO_SETTINGS_UI_STYLE.fillColor,
        0.95,
      )
      .setOrigin(0, 0.5);

    const thumb = scene.add
      .circle(trackX, row.y, layout.thumbRadius, AUDIO_SETTINGS_UI_STYLE.thumbColor, 1)
      .setInteractive({ useHandCursor: true });

    const valueText = scene.add
      .text(trackX + layout.trackWidth + scaleLegacyX(8), row.y, "", {
        color: AUDIO_SETTINGS_UI_STYLE.valueColor,
        fontFamily: AUDIO_SETTINGS_UI_STYLE.fontFamily,
        fontSize: layout.fontSize,
      })
      .setOrigin(0, 0.5);

    const setValue = (volume: number) => {
      const clamped = clampVolume(volume);
      values[row.key] = clamped;
      fill.width = Math.max(1, layout.trackWidth * clamped);
      thumb.x = trackX + layout.trackWidth * clamped;
      valueText.setText(formatVolumePercent(clamped));
      onChange({ ...values });
    };

    const updateFromPointer = (pointer: Phaser.Input.Pointer) => {
      const localX = Phaser.Math.Clamp(
        pointer.x - container.x - trackX,
        0,
        layout.trackWidth,
      );
      setValue(localX / layout.trackWidth);
    };

    const startDrag = (pointer: Phaser.Input.Pointer) => {
      activeDrag = updateFromPointer;
      updateFromPointer(pointer);
    };

    track.setInteractive({ useHandCursor: true });
    track.on(Phaser.Input.Events.POINTER_DOWN, startDrag);
    thumb.on(Phaser.Input.Events.POINTER_DOWN, startDrag);

    setters.set(row.key, setValue);
    setValue(values[row.key]);
    container.add([label, track, fill, thumb, valueText]);
  });

  const hitArea = resolveAudioSettingsHitArea(layout);

  return {
    container,
    destroy: () => {
      scene.input.off(Phaser.Input.Events.POINTER_MOVE, onPointerMove);
      scene.input.off(Phaser.Input.Events.POINTER_UP, onPointerUp);
      container.destroy(true);
    },
    setValues: (settings) => {
      layout.rows.forEach((row) => {
        setters.get(row.key)?.(settings[row.key]);
      });
    },
    containsPoint: (x, y) =>
      x >= hitArea.x &&
      x <= hitArea.x + hitArea.width &&
      y >= hitArea.y &&
      y <= hitArea.y + hitArea.height,
  };
}

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return 0;
  }

  return Math.max(0, Math.min(1, volume));
}

function formatVolumePercent(volume: number): string {
  return `${Math.round(volume * 100)}%`;
}
