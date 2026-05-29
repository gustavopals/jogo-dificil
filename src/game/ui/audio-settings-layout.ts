import type { PersistedAudioSettings } from "../systems/audio-settings-persistence";
import { scaleLegacyFontPx, scaleLegacyX, scaleLegacyY } from "../scale";

export type AudioSettingsSliderRow = {
  readonly key: keyof PersistedAudioSettings;
  readonly label: string;
  readonly y: number;
};

export type AudioSettingsControlsLayout = {
  readonly originX: number;
  readonly originY: number;
  readonly rowHeight: number;
  readonly labelWidth: number;
  readonly trackWidth: number;
  readonly trackHeight: number;
  readonly thumbRadius: number;
  readonly fontSize: string;
  readonly rows: readonly AudioSettingsSliderRow[];
};

export function createMenuAudioSettingsLayout(): AudioSettingsControlsLayout {
  const originX = scaleLegacyX(295);
  const originY = scaleLegacyY(190);
  const rowHeight = scaleLegacyY(11);

  return {
    originX,
    originY,
    rowHeight,
    labelWidth: scaleLegacyX(32),
    trackWidth: scaleLegacyX(60),
    trackHeight: scaleLegacyY(3),
    thumbRadius: scaleLegacyY(3),
    fontSize: scaleLegacyFontPx(7),
    rows: [
      { key: "masterVolume", label: "Geral", y: 0 },
      { key: "musicVolume", label: "Musica", y: rowHeight },
      { key: "sfxVolume", label: "Efeitos", y: rowHeight * 2 },
    ],
  };
}

export function createPauseAudioSettingsLayout(): AudioSettingsControlsLayout {
  const originX = scaleLegacyX(318);
  const originY = scaleLegacyY(188);
  const rowHeight = scaleLegacyY(14);

  return {
    originX,
    originY,
    rowHeight,
    labelWidth: scaleLegacyX(48),
    trackWidth: scaleLegacyX(108),
    trackHeight: scaleLegacyY(5),
    thumbRadius: scaleLegacyY(5),
    fontSize: scaleLegacyFontPx(9),
    rows: [
      { key: "masterVolume", label: "Geral", y: 0 },
      { key: "musicVolume", label: "Musica", y: rowHeight },
      { key: "sfxVolume", label: "Efeitos", y: rowHeight * 2 },
    ],
  };
}

export function resolveAudioSettingsHitArea(
  layout: AudioSettingsControlsLayout,
): {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
} {
  const valueLabelWidth = scaleLegacyX(28);

  return {
    x: layout.originX,
    y: layout.originY - layout.rowHeight / 2,
    width:
      layout.labelWidth +
      layout.trackWidth +
      valueLabelWidth +
      scaleLegacyX(8),
    height: layout.rowHeight * layout.rows.length + layout.rowHeight / 2,
  };
}

export function isPointInsideAudioSettingsHitArea(
  x: number,
  y: number,
  layout: AudioSettingsControlsLayout,
): boolean {
  const hitArea = resolveAudioSettingsHitArea(layout);

  return (
    x >= hitArea.x &&
    x <= hitArea.x + hitArea.width &&
    y >= hitArea.y &&
    y <= hitArea.y + hitArea.height
  );
}
