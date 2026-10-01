let context: AudioContext | null = null;
let master: GainNode | null = null;
let musicTimer: number | null = null;
let musicEnabled = localStorage.getItem('miner-music') === 'on';
let volume = Number(localStorage.getItem('miner-volume') ?? '1');
let muted = localStorage.getItem('miner-muted') === 'on';

function ensureAudio() {
  context ??= new AudioContext();
  master ??= context.createGain();
  master.gain.value = muted ? 0 : volume * 0.8;
  master.connect(context.destination);
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
  const audio = ensureAudio();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  const audibleVolume = Math.min(volume * 1.35, 0.9);
  gain.gain.setValueAtTime(0.001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(audibleVolume, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  oscillator.connect(gain).connect(master!);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration + 0.03);
}

function tick() {
  const phrase = [110, 146.83, 164.81, 220, 164.81, 146.83];
  const note = phrase[Math.floor(Date.now() / 420) % phrase.length];
  tone(note, 0.42, 'triangle', 0.08);
  if (Math.floor(Date.now() / 420) % 3 === 0) tone(note * 2, 0.25, 'sine', 0.035);
}

export function startMusic() {
  musicEnabled = true;
  localStorage.setItem('miner-music', 'on');
  ensureAudio();
  if (musicTimer === null) {
    tick();
    musicTimer = window.setInterval(tick, 900);
  }
}

export function stopMusic() {
  musicEnabled = false;
  localStorage.setItem('miner-music', 'off');
  if (musicTimer !== null) window.clearInterval(musicTimer);
  musicTimer = null;
}

export function toggleMusic() {
  if (musicEnabled) stopMusic();
  else startMusic();
  return musicEnabled;
}

export function isMusicEnabled() {
  return musicEnabled;
}

export function getVolume() {
  return volume;
}

export function setVolume(nextVolume: number) {
  volume = Math.max(0, Math.min(1, nextVolume));
  localStorage.setItem('miner-volume', String(volume));
  if (master) master.gain.value = muted ? 0 : volume * 0.8;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem('miner-muted', muted ? 'on' : 'off');
  if (master) master.gain.value = muted ? 0 : volume * 0.8;
  return muted;
}

export function isMuted() {
  return muted;
}

export function playSpinSound() {
  tone(78, 0.12, 'square', 0.035);
}

export function playWinSound(amount: number) {
  const notes = amount > 300 ? [261.63, 329.63, 392, 523.25] : [220, 277.18, 329.63];
  notes.forEach((note, index) => window.setTimeout(() => tone(note, 0.24, 'triangle', 0.07), index * 90));
}

export function playScatterSound(reelIndex: number) {
  const base = [392, 440, 523.25, 659.25, 783.99][reelIndex] ?? 523.25;
  tone(base, 0.24, 'sine', 0.13);
  window.setTimeout(() => tone(base * 1.5, 0.38, 'triangle', 0.1), 90);
}
