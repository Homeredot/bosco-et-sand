import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sampleRate = 22050;
const duration = 32;
const samples = sampleRate * duration;
const data = new Float32Array(samples);
const bpm = 72;
const beat = 60 / bpm;
const note = (midi) => 440 * 2 ** ((midi - 69) / 12);
const progression = [
  [48, 55, 60, 64], // Cmaj7
  [45, 52, 57, 60], // Am7
  [41, 48, 53, 57], // Fmaj7
  [43, 50, 55, 59], // G7
];
const melody = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 81, 79, 76, 74, 72];

function addTone(start, length, frequency, volume, type = 'sine') {
  const first = Math.max(0, Math.floor(start * sampleRate));
  const last = Math.min(samples, Math.floor((start + length) * sampleRate));
  for (let i = first; i < last; i++) {
    const t = (i - first) / sampleRate;
    const phase = 2 * Math.PI * frequency * t;
    const attack = Math.min(1, t / 0.08);
    const release = Math.min(1, (length - t) / 0.7);
    const envelope = Math.max(0, Math.min(attack, release));
    let wave = Math.sin(phase);
    if (type === 'bell') wave = Math.sin(phase) + 0.34 * Math.sin(phase * 2.01) + 0.15 * Math.sin(phase * 3.98);
    data[i] += wave * volume * envelope;
  }
}

for (let bar = 0; bar < 8; bar++) {
  const chord = progression[bar % progression.length];
  const start = bar * beat * 4;
  chord.forEach((midi, index) => {
    addTone(start, beat * 4.15, note(midi), index === 0 ? 0.075 : 0.052);
    addTone(start, beat * 4.15, note(midi) / 2, index === 0 ? 0.035 : 0.018);
  });
  for (let step = 0; step < 8; step++) {
    const midi = chord[step % chord.length] + 12;
    addTone(start + step * beat / 2, beat * 0.8, note(midi), 0.045, 'bell');
  }
}

melody.forEach((midi, index) => {
  const start = index * beat * 2;
  addTone(start, beat * 1.55, note(midi), 0.055, 'bell');
});

let peak = 0;
for (const value of data) peak = Math.max(peak, Math.abs(value));
const gain = peak ? 0.72 / peak : 1;
const pcm = Buffer.alloc(samples * 2);
for (let i = 0; i < samples; i++) {
  const value = Math.max(-1, Math.min(1, data[i] * gain));
  pcm.writeInt16LE(Math.round(value * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.resolve(here, '../dist/assets/our-forever.wav');
fs.writeFileSync(output, Buffer.concat([header, pcm]));
console.log(`Created ${output} (${(fs.statSync(output).size / 1024 / 1024).toFixed(2)} MB)`);
