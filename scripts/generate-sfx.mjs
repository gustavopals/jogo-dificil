import fs from "node:fs/promises";
import path from "node:path";
import {
  SAMPLE_RATE,
  encodeWav,
  envelopeAR,
  lerp,
  mix,
  noiseSample,
  pinkNoise,
  renderBuffer,
  saw,
  sine,
  square,
  triangle,
} from "./lib/audio-wav.mjs";

const OUTPUT_DIR = path.join(process.cwd(), "assets", "audio", "sfx");

const SFX = {
  "player-jump.wav": () =>
    renderTone({
      durationSec: 0.11,
      attackSec: 0.004,
      releaseSec: 0.05,
      startHz: 280,
      endHz: 520,
      wave: "sine",
      gain: 0.55,
    }),
  "player-land.wav": () =>
    renderBuffer(0.09, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.07, 0.09);
      const thump = sine(timeSec, lerp(140, 70, timeSec / 0.09)) * 0.7;
      const click = pinkNoise(timeSec) * 0.22 * Math.exp(-timeSec * 80);
      return (thump + click) * env;
    }),
  "player-death-01.wav": () => renderDeathVariant(0, 0.42),
  "player-death-02.wav": () => renderDeathVariant(1, 0.44),
  "player-death-03.wav": () => renderDeathVariant(2, 0.46),
  "player-respawn.wav": () =>
    renderBuffer(0.28, (timeSec) => {
      const env = envelopeAR(timeSec, 0.02, 0.14, 0.28);
      const notes = [392, 523.25, 659.25];
      const step = Math.min(notes.length - 1, Math.floor(timeSec / 0.08));
      const tone = sine(timeSec, notes[step]) * 0.35;
      const shimmer = sine(timeSec, notes[step] * 2) * 0.08;
      return (tone + shimmer) * env;
    }),
  "player-primary.wav": () =>
    renderBuffer(0.15, (timeSec) => {
      const env = envelopeAR(timeSec, 0.005, 0.1, 0.15);
      const sweep = lerp(900, 180, timeSec / 0.15);
      const whoosh = pinkNoise(timeSec + 3.1) * 0.55;
      const tone = sine(timeSec, sweep) * 0.18;
      return (whoosh + tone) * env;
    }),
  "player-secondary.wav": () =>
    renderBuffer(0.06, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.04, 0.06);
      const click = square(timeSec, 1200) * 0.12;
      const body = sine(timeSec, 880) * 0.2;
      return (click + body) * env;
    }),
  "level-checkpoint.wav": () =>
    renderBuffer(0.22, (timeSec) => {
      const env = envelopeAR(timeSec, 0.004, 0.12, 0.22);
      const chord = [523.25, 659.25, 783.99];
      const tone = chord.reduce((sum, hz) => sum + sine(timeSec, hz) * 0.18, 0);
      const sparkle = sine(timeSec, 1567.98) * 0.06;
      return (tone + sparkle) * env;
    }),
  "level-complete.wav": () =>
    renderBuffer(0.35, (timeSec) => {
      const env = envelopeAR(timeSec, 0.01, 0.16, 0.35);
      const melody = [523.25, 659.25, 783.99, 987.77];
      const step = Math.min(
        melody.length - 1,
        Math.floor(timeSec / 0.08),
      );
      const tone = sine(timeSec, melody[step]) * 0.32;
      const harmony = sine(timeSec, melody[step] * 0.5) * 0.1;
      return (tone + harmony) * env;
    }),
  "level-item.wav": () =>
    renderTone({
      durationSec: 0.1,
      attackSec: 0.002,
      releaseSec: 0.06,
      startHz: 880,
      endHz: 1174.66,
      wave: "triangle",
      gain: 0.45,
    }),
  "level-trap.wav": () =>
    renderBuffer(0.14, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.1, 0.14);
      const snap = square(timeSec, lerp(420, 180, timeSec / 0.14)) * 0.28;
      const grit = pinkNoise(timeSec + 9.2) * 0.35;
      return (snap + grit) * env;
    }),
  "level-falling-platform.wav": () =>
    renderBuffer(0.24, (timeSec) => {
      const env = envelopeAR(timeSec, 0.01, 0.16, 0.24);
      const rumble = sine(timeSec, 62) * 0.45 + sine(timeSec, 98) * 0.2;
      const scrape = saw(timeSec, 40) * 0.08;
      const stress = pinkNoise(timeSec) * 0.12;
      return (rumble + scrape + stress) * env;
    }),
  "level-projectile.wav": () =>
    renderBuffer(0.08, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.05, 0.08);
      const pew = sine(timeSec, lerp(1400, 620, timeSec / 0.08)) * 0.35;
      const air = pinkNoise(timeSec) * 0.12;
      return (pew + air) * env;
    }),
  "energy-charge-loop.wav": () =>
    renderBuffer(0.9, (timeSec) => {
      const pulse = (Math.sin(timeSec * Math.PI * 2 * 3.5) + 1) * 0.5;
      const hum = sine(timeSec, 110) * 0.18 + sine(timeSec, 165) * 0.1;
      const cyan = sine(timeSec, 440 + pulse * 30) * 0.08;
      const shimmer = triangle(timeSec, 5.5) * 0.03;
      return hum + cyan + shimmer;
    }),
  "energy-charge-full.wav": () =>
    renderBuffer(0.16, (timeSec) => {
      const env = envelopeAR(timeSec, 0.003, 0.1, 0.16);
      const ping = sine(timeSec, 880) * 0.28 + sine(timeSec, 1320) * 0.16;
      const glow = sine(timeSec, 1760) * 0.08;
      return (ping + glow) * env;
    }),
  "energy-shot.wav": () =>
    renderBuffer(0.1, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.06, 0.1);
      const zap = sine(timeSec, lerp(1200, 520, timeSec / 0.1)) * 0.35;
      const crackle = square(timeSec, 2200) * 0.06;
      return (zap + crackle) * env;
    }),
  "energy-shot-empty.wav": () =>
    renderBuffer(0.09, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.06, 0.09);
      const dull = sine(timeSec, lerp(260, 180, timeSec / 0.09)) * 0.28;
      const click = pinkNoise(timeSec) * 0.08;
      return (dull + click) * env;
    }),
  "energy-special-windup.wav": () =>
    renderBuffer(0.32, (timeSec) => {
      const env = envelopeAR(timeSec, 0.02, 0.12, 0.32);
      const rise = sine(timeSec, lerp(180, 620, timeSec / 0.32)) * 0.34;
      const tension = triangle(timeSec, lerp(4, 12, timeSec / 0.32)) * 0.08;
      return (rise + tension) * env;
    }),
  "energy-special-fire.wav": () =>
    renderBuffer(0.2, (timeSec) => {
      const env = envelopeAR(timeSec, 0.002, 0.12, 0.2);
      const blast = mix([
        sine(timeSec, 220) * 0.35,
        sine(timeSec, 440) * 0.2,
        pinkNoise(timeSec) * 0.25,
      ]);
      return blast * env;
    }),
  "energy-impact-small.wav": () =>
    renderBuffer(0.08, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.05, 0.08);
      const pop = sine(timeSec, lerp(900, 420, timeSec / 0.08)) * 0.32;
      return pop * env;
    }),
  "energy-impact-heavy.wav": () =>
    renderBuffer(0.16, (timeSec) => {
      const env = envelopeAR(timeSec, 0.002, 0.1, 0.16);
      const boom = mix([
        sine(timeSec, lerp(180, 90, timeSec / 0.16)) * 0.45,
        pinkNoise(timeSec) * 0.2,
      ]);
      return boom * env;
    }),
  "boss-entry.wav": () =>
    renderBuffer(0.55, (timeSec) => {
      const env = envelopeAR(timeSec, 0.01, 0.2, 0.55);
      const fanfare = [196, 246.94, 293.66, 392];
      const step = Math.min(fanfare.length - 1, Math.floor(timeSec / 0.11));
      const tone = sine(timeSec, fanfare[step]) * 0.34;
      const brass = square(timeSec, fanfare[step] * 0.5) * 0.05;
      const impact = pinkNoise(timeSec) * 0.06 * (step === fanfare.length - 1 ? 1 : 0.2);
      return (tone + brass + impact) * env;
    }),
  "boss-windup.wav": () =>
    renderBuffer(0.28, (timeSec) => {
      const env = envelopeAR(timeSec, 0.02, 0.1, 0.28);
      const rise = sine(timeSec, lerp(130, 360, timeSec / 0.28)) * 0.36;
      const grit = saw(timeSec, lerp(3, 9, timeSec / 0.28)) * 0.06;
      return (rise + grit) * env;
    }),
  "boss-attack.wav": () =>
    renderBuffer(0.18, (timeSec) => {
      const env = envelopeAR(timeSec, 0.002, 0.1, 0.18);
      const slam = mix([
        sine(timeSec, 98) * 0.42,
        pinkNoise(timeSec) * 0.22,
        square(timeSec, 160) * 0.06,
      ]);
      return slam * env;
    }),
  "boss-hit.wav": () =>
    renderBuffer(0.12, (timeSec) => {
      const env = envelopeAR(timeSec, 0.001, 0.08, 0.12);
      const metal = mix([
        sine(timeSec, 420) * 0.22,
        sine(timeSec, 630) * 0.14,
        square(timeSec, 210) * 0.08,
      ]);
      return metal * env;
    }),
  "boss-defeat.wav": () =>
    renderBuffer(0.7, (timeSec) => {
      const env = envelopeAR(timeSec, 0.01, 0.28, 0.7);
      const melody = [392, 349.23, 293.66, 246.94, 196];
      const step = Math.min(melody.length - 1, Math.floor(timeSec / 0.12));
      const tone = sine(timeSec, melody[step]) * 0.3;
      const sub = sine(timeSec, melody[step] * 0.5) * 0.12;
      return (tone + sub) * env;
    }),
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const [filename, build] of Object.entries(SFX)) {
    const samples = build();
    const outputPath = path.join(OUTPUT_DIR, filename);
    await fs.writeFile(outputPath, encodeWav(samples));
    console.log(`Generated ${outputPath} (${samples.length} samples @ ${SAMPLE_RATE}Hz)`);
  }
}

function renderDeathVariant(variant, durationSec) {
  const bases = [220, 196, 174.61];
  const baseHz = bases[variant] ?? 220;

  return renderBuffer(durationSec, (timeSec) => {
    const env = envelopeAR(timeSec, 0.004, durationSec * 0.75, durationSec);
    const fall = sine(timeSec, lerp(baseHz * 1.4, baseHz * 0.6, timeSec / durationSec)) * 0.38;
    const wobble = sine(timeSec, baseHz * 0.5 + noiseSample(timeSec) * 12) * 0.08;
    const crunch = pinkNoise(timeSec + variant * 3.7) * 0.22;
    return (fall + wobble + crunch) * env;
  });
}

function renderTone({
  durationSec,
  attackSec,
  releaseSec,
  startHz,
  endHz,
  wave,
  gain,
}) {
  return renderBuffer(durationSec, (timeSec) => {
    const env = envelopeAR(timeSec, attackSec, releaseSec, durationSec);
    const hz = lerp(startHz, endHz, timeSec / durationSec);
    const osc =
      wave === "triangle"
        ? triangle(timeSec, hz)
        : wave === "square"
          ? square(timeSec, hz)
          : sine(timeSec, hz);
    return osc * gain * env;
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
