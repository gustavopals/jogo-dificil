import fs from "node:fs/promises";
import path from "node:path";
import {
  clamp,
  encodeWav,
  renderBuffer,
  renderSeamlessLoop,
  saw,
  sine,
  square,
  triangle,
} from "./lib/audio-wav.mjs";

const OUTPUT_DIR = path.join(process.cwd(), "assets", "audio", "music");

const MUSIC_THEMES = [
  {
    filename: "menu-loop.wav",
    tempoBpm: 120,
    bars: 4,
    melody: [523.25, 659.25, 783.99, 659.25],
    bass: [130.81, 130.81, 98.0, 98.0],
    harmonyMix: 0.12,
    pulseMix: 0.1,
    brightness: 0.24,
  },
  {
    filename: "mvp-loop.wav",
    tempoBpm: 96,
    bars: 4,
    melody: [392.0, 493.88, 587.33, 659.25],
    bass: [98.0, 98.0, 87.31, 87.31],
    harmonyMix: 0.1,
    pulseMix: 0.14,
    brightness: 0.22,
  },
  {
    filename: "block-2-dash-loop.wav",
    tempoBpm: 108,
    bars: 4,
    melody: [523.25, 659.25, 783.99, 659.25],
    bass: [130.81, 130.81, 146.83, 146.83],
    harmonyMix: 0.08,
    pulseMix: 0.18,
    brightness: 0.2,
  },
  {
    filename: "block-3-energy-loop.wav",
    tempoBpm: 88,
    bars: 4,
    melody: [392.0, 493.88, 587.33, 659.25],
    bass: [98.0, 98.0, 110.0, 110.0],
    harmonyMix: 0.16,
    pulseMix: 0.12,
    brightness: 0.18,
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const theme of MUSIC_THEMES) {
    const samples = renderThemeLoop(theme);
    const outputPath = path.join(OUTPUT_DIR, theme.filename);
    await fs.writeFile(outputPath, encodeWav(samples));
    console.log(`Generated ${outputPath}`);
  }

  const sting = renderLevelCompleteSting();
  const stingPath = path.join(OUTPUT_DIR, "mvp-level-complete-sting.wav");
  await fs.writeFile(stingPath, encodeWav(sting));
  console.log(`Generated ${stingPath}`);
}

function renderThemeLoop(theme) {
  const beatDurationSec = 60 / theme.tempoBpm;
  const barDurationSec = beatDurationSec * 4;
  const totalDurationSec = barDurationSec * theme.bars;

  return renderSeamlessLoop(totalDurationSec, (timeSec) => {
    const beatIndex =
      Math.floor(timeSec / beatDurationSec) % theme.melody.length;
    const melodyFreq = theme.melody[beatIndex];
    const bassFreq = theme.bass[beatIndex];
    const beatPhase = (timeSec % beatDurationSec) / beatDurationSec;
    const melodyEnv =
      beatPhase < 0.1
        ? beatPhase / 0.1
        : Math.max(0, 1 - (beatPhase - 0.1) / 0.85);
    const bassEnv =
      beatPhase < 0.08 ? 1 : Math.max(0, 1 - (beatPhase - 0.08) / 0.45);
    const pulse = Math.sin(timeSec * Math.PI * 2 * (theme.tempoBpm / 60));

    const melodyLayer = triangle(timeSec, melodyFreq) * melodyEnv * theme.brightness;
    const harmonyLayer =
      sine(timeSec, melodyFreq * 0.5) * melodyEnv * theme.harmonyMix;
    const bassLayer = square(timeSec, bassFreq) * bassEnv * 0.14;
    const pulseLayer = pulse * theme.pulseMix * 0.05;
    const pad = sine(timeSec, bassFreq * 2) * 0.03;

    return clamp(melodyLayer + harmonyLayer + bassLayer + pulseLayer + pad);
  });
}

function renderLevelCompleteSting() {
  return renderBuffer(1.6, (timeSec) => {
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
    const step = Math.min(notes.length - 1, Math.floor(timeSec / 0.22));
    const local = timeSec - step * 0.22;
    const env = Math.exp(-local * 6);
    const tone = sine(timeSec, notes[step]) * 0.28;
    const shimmer = sine(timeSec, notes[step] * 2) * 0.08;
    const tail = step === notes.length - 1 ? saw(timeSec, 3) * 0.03 * env : 0;
    return (tone + shimmer + tail) * env;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
