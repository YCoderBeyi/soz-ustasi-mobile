export type SfxName =
  | 'tap'
  | 'letter'
  | 'correct'
  | 'wrong'
  | 'hidden'
  | 'seal'
  | 'reward'
  | 'shuffle'
  | 'hint';

type Tone = {
  frequency: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  gain?: number;
  slideTo?: number;
  pan?: number;
};

const tones: Record<SfxName, Tone[]> = {
  tap: [
    { frequency: 520, duration: 0.035, type: 'triangle', gain: 0.018 },
    { frequency: 780, duration: 0.028, delay: 0.018, type: 'sine', gain: 0.008 },
  ],
  letter: [
    { frequency: 620, duration: 0.038, type: 'sine', gain: 0.018 },
    { frequency: 1240, duration: 0.028, delay: 0.016, type: 'triangle', gain: 0.006 },
  ],
  correct: [
    { frequency: 523, duration: 0.075, type: 'triangle', gain: 0.028, pan: -0.08 },
    { frequency: 659, duration: 0.085, delay: 0.065, type: 'triangle', gain: 0.026, pan: 0.04 },
    { frequency: 784, duration: 0.13, delay: 0.135, type: 'sine', gain: 0.02, pan: 0.1 },
  ],
  wrong: [
    { frequency: 330, duration: 0.09, type: 'triangle', gain: 0.012, slideTo: 294 },
    { frequency: 262, duration: 0.11, delay: 0.065, type: 'sine', gain: 0.008, slideTo: 247 },
  ],
  hidden: [
    { frequency: 392, duration: 0.075, type: 'triangle', gain: 0.024, pan: -0.16 },
    { frequency: 523, duration: 0.075, delay: 0.07, type: 'triangle', gain: 0.023, pan: 0 },
    { frequency: 659, duration: 0.12, delay: 0.14, type: 'sine', gain: 0.02, pan: 0.16 },
    { frequency: 1047, duration: 0.22, delay: 0.235, type: 'sine', gain: 0.011, pan: 0.08 },
  ],
  seal: [
    { frequency: 98, duration: 0.22, type: 'sine', gain: 0.022, slideTo: 130 },
    { frequency: 196, duration: 0.16, delay: 0.09, type: 'triangle', gain: 0.014 },
    { frequency: 392, duration: 0.18, delay: 0.2, type: 'triangle', gain: 0.021, pan: -0.1 },
    { frequency: 587, duration: 0.26, delay: 0.34, type: 'sine', gain: 0.018, pan: 0.1 },
    { frequency: 880, duration: 0.34, delay: 0.5, type: 'sine', gain: 0.01 },
  ],
  reward: [
    { frequency: 523, duration: 0.065, type: 'triangle', gain: 0.026, pan: -0.18 },
    { frequency: 659, duration: 0.065, delay: 0.055, type: 'triangle', gain: 0.024, pan: 0 },
    { frequency: 784, duration: 0.085, delay: 0.11, type: 'triangle', gain: 0.022, pan: 0.18 },
    { frequency: 1047, duration: 0.16, delay: 0.19, type: 'sine', gain: 0.012 },
  ],
  shuffle: [
    { frequency: 392, duration: 0.035, type: 'triangle', gain: 0.014, pan: -0.16 },
    { frequency: 587, duration: 0.04, delay: 0.04, type: 'triangle', gain: 0.016, pan: 0.16 },
  ],
  hint: [
    { frequency: 440, duration: 0.07, type: 'triangle', gain: 0.018 },
    { frequency: 660, duration: 0.15, delay: 0.07, type: 'sine', gain: 0.014 },
  ],
};

let context: AudioContext | null = null;

function getContext() {
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

export function playSfx(name: SfxName, enabled: boolean) {
  if (!enabled) return;

  const audio = getContext();
  const now = audio.currentTime;
  const master = audio.createGain();
  const compressor = audio.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 18;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.12;
  master.gain.value = 0.72;
  master.connect(compressor);
  compressor.connect(audio.destination);

  for (const tone of tones[name]) {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const panner = audio.createStereoPanner();
    const start = now + (tone.delay ?? 0);
    const end = start + tone.duration;

    oscillator.type = tone.type ?? 'sine';
    const detune = name === 'letter' || name === 'tap' ? (Math.random() - 0.5) * 22 : 0;
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    oscillator.detune.setValueAtTime(detune, start);
    if (tone.slideTo) {
      oscillator.frequency.exponentialRampToValueAtTime(tone.slideTo, end);
    }
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.02, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    panner.pan.value = tone.pan ?? 0;

    oscillator.connect(gain);
    gain.connect(panner);
    panner.connect(master);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
  }
}
