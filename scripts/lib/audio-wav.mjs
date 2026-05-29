/** Shared WAV helpers for procedural audio generators (Phase 20). */

export const SAMPLE_RATE = 44100;
export const TARGET_PEAK = 0.707; // ~ -3 dBFS

export function clamp(value, min = -1, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function envelopeAR(timeSec, attackSec, releaseSec, durationSec) {
  if (timeSec < 0 || timeSec > durationSec) {
    return 0;
  }

  if (timeSec < attackSec) {
    return attackSec <= 0 ? 1 : timeSec / attackSec;
  }

  const releaseStart = Math.max(attackSec, durationSec - releaseSec);

  if (timeSec < releaseStart) {
    return 1;
  }

  if (releaseSec <= 0) {
    return 0;
  }

  return 1 - (timeSec - releaseStart) / releaseSec;
}

export function sine(timeSec, frequency, phase = 0) {
  return Math.sin((timeSec * frequency + phase) * Math.PI * 2);
}

export function triangle(timeSec, frequency) {
  const phase = (timeSec * frequency) % 1;
  return 1 - 4 * Math.abs(phase - 0.5);
}

export function square(timeSec, frequency) {
  return Math.sign(sine(timeSec, frequency));
}

export function saw(timeSec, frequency) {
  const phase = (timeSec * frequency) % 1;
  return phase * 2 - 1;
}

export function noiseSample(seed) {
  const value = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function pinkNoise(timeSec) {
  let sum = 0;
  for (let octave = 0; octave < 5; octave += 1) {
    sum += noiseSample(timeSec * (octave + 1) * 17.13) / (octave + 1);
  }
  return sum / 2.2;
}

export function renderBuffer(durationSec, renderSample) {
  const length = Math.max(1, Math.floor(durationSec * SAMPLE_RATE));
  const samples = new Float32Array(length);

  for (let index = 0; index < length; index += 1) {
    samples[index] = renderSample(index / SAMPLE_RATE, index, length);
  }

  return normalizePeak(samples, TARGET_PEAK);
}

export function renderSeamlessLoop(durationSec, renderSample) {
  const samples = renderBuffer(durationSec, renderSample);
  const blend = Math.min(2048, Math.floor(samples.length / 8));

  for (let index = 0; index < blend; index += 1) {
    const t = index / blend;
    const tailIndex = samples.length - blend + index;
    samples[tailIndex] = lerp(samples[tailIndex], samples[index], t);
  }

  return normalizePeak(samples, TARGET_PEAK);
}

export function mix(layers) {
  let sum = 0;
  layers.forEach((layer) => {
    sum += layer ?? 0;
  });
  return sum;
}

export function normalizePeak(samples, peak = TARGET_PEAK) {
  let max = 0;
  samples.forEach((sample) => {
    max = Math.max(max, Math.abs(sample));
  });

  if (max <= 0.00001) {
    return samples;
  }

  const gain = peak / max;
  samples.forEach((sample, index) => {
    samples[index] = clamp(sample * gain);
  });

  return samples;
}

export function encodeWav(samples, { channels = 1 } = {}) {
  const bytesPerSample = 2;
  const blockAlign = channels * bytesPerSample;
  const dataSize = samples.length * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  samples.forEach((sample, index) => {
    const pcm = Math.round(clamp(sample) * 0x7fff);
    buffer.writeInt16LE(pcm, 44 + index * 2);
  });

  return buffer;
}
