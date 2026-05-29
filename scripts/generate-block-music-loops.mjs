import fs from "node:fs/promises";
import path from "node:path";

const SAMPLE_RATE = 22050;
const OUTPUT_DIR = path.join(process.cwd(), "assets", "audio", "music");

const BLOCK_THEMES = [
  {
    filename: "block-2-dash-loop.wav",
    tempoBpm: 108,
    bars: 8,
    melody: [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 783.99, 880.0],
    bass: [130.81, 130.81, 146.83, 146.83, 123.47, 123.47, 146.83, 146.83],
    pulseMix: 0.18,
  },
  {
    filename: "block-3-energy-loop.wav",
    tempoBpm: 88,
    bars: 8,
    melody: [392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0, 392.0],
    bass: [98.0, 98.0, 110.0, 110.0, 87.31, 87.31, 98.0, 98.0],
    pulseMix: 0.14,
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const theme of BLOCK_THEMES) {
    const samples = renderTheme(theme);
    const outputPath = path.join(OUTPUT_DIR, theme.filename);
    await fs.writeFile(outputPath, encodeWav(samples));
    console.log(`Generated ${outputPath}`);
  }
}

function renderTheme(theme) {
  const beatDurationSec = 60 / theme.tempoBpm;
  const barDurationSec = beatDurationSec * 4;
  const totalDurationSec = barDurationSec * theme.bars;
  const totalSamples = Math.floor(totalDurationSec * SAMPLE_RATE);
  const samples = new Float32Array(totalSamples);

  for (let index = 0; index < totalSamples; index += 1) {
    const timeSec = index / SAMPLE_RATE;
    const beatIndex = Math.floor(timeSec / beatDurationSec) % theme.melody.length;
    const melodyFreq = theme.melody[beatIndex];
    const bassFreq = theme.bass[beatIndex];
    const beatPhase = (timeSec % beatDurationSec) / beatDurationSec;
    const melodyEnv = beatPhase < 0.12 ? beatPhase / 0.12 : Math.max(0, 1 - (beatPhase - 0.12) / 0.88);
    const bassEnv = beatPhase < 0.08 ? 1 : Math.max(0, 1 - (beatPhase - 0.08) / 0.4);
    const pulse = Math.sin(timeSec * Math.PI * 2 * (theme.tempoBpm / 60));

    const melody = squareWave(timeSec, melodyFreq) * melodyEnv * 0.22;
    const bass = squareWave(timeSec, bassFreq) * bassEnv * 0.16;
    const pulseLayer = pulse * theme.pulseMix * 0.04;

    samples[index] = clamp(melody + bass + pulseLayer);
  }

  return samples;
}

function squareWave(timeSec, frequency) {
  return Math.sign(Math.sin(timeSec * Math.PI * 2 * frequency));
}

function clamp(value) {
  return Math.max(-1, Math.min(1, value));
}

function encodeWav(samples) {
  const buffer = Buffer.alloc(44 + samples.length * 2);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);

  samples.forEach((sample, index) => {
    const pcm = Math.round(sample * 0x7fff);
    buffer.writeInt16LE(pcm, 44 + index * 2);
  });

  return buffer;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
