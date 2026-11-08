import { beforeEach, describe, expect, it, vi } from 'vitest';
import { playSfx, volumePercentToGain } from './audio';

class FakeAudioParam {
  value = 0;

  setValueAtTime(value: number) {
    this.value = value;
  }

  exponentialRampToValueAtTime(value: number) {
    this.value = value;
  }
}

class FakeAudioNode {
  connections: unknown[] = [];

  connect(target: unknown) {
    this.connections.push(target);
    return target;
  }

  disconnect() {
    this.connections = [];
  }
}

class FakeGainNode extends FakeAudioNode {
  gain = new FakeAudioParam();
}

class FakeStereoPannerNode extends FakeAudioNode {
  pan = { value: 0 };
}

class FakeDynamicsCompressorNode extends FakeAudioNode {
  threshold = { value: 0 };
  knee = { value: 0 };
  ratio = { value: 0 };
  attack = { value: 0 };
  release = { value: 0 };
}

class FakeOscillatorNode extends FakeAudioNode {
  type: OscillatorType = 'sine';
  frequency = new FakeAudioParam();
  detune = new FakeAudioParam();
  onended: (() => void) | null = null;

  start() {}

  stop() {
    this.onended?.();
  }
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];

  currentTime = 0;
  state: AudioContextState = 'running';
  destination = new FakeAudioNode();
  gains: FakeGainNode[] = [];
  compressors: FakeDynamicsCompressorNode[] = [];
  oscillators: FakeOscillatorNode[] = [];

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  static lastInstance() {
    return FakeAudioContext.instances.at(-1);
  }

  resume = vi.fn(async () => undefined);

  createGain() {
    const node = new FakeGainNode();
    this.gains.push(node);
    return node;
  }

  createDynamicsCompressor() {
    const node = new FakeDynamicsCompressorNode();
    this.compressors.push(node);
    return node;
  }

  createStereoPanner() {
    return new FakeStereoPannerNode();
  }

  createOscillator() {
    const node = new FakeOscillatorNode();
    this.oscillators.push(node);
    return node;
  }
}

beforeEach(() => {
  FakeAudioContext.instances = [];
  vi.stubGlobal('AudioContext', FakeAudioContext);
});

describe('volumePercentToGain', () => {
  it('maps the volume range to a perceptual gain curve', () => {
    expect(volumePercentToGain(0)).toBe(0);
    expect(volumePercentToGain(50)).toBeGreaterThan(0.3);
    expect(volumePercentToGain(50)).toBeLessThan(0.6);
    expect(volumePercentToGain(100)).toBe(1);
  });

  it('clamps invalid percentages', () => {
    expect(volumePercentToGain(-20)).toBe(0);
    expect(volumePercentToGain(120)).toBe(1);
  });
});

describe('playSfx', () => {
  it('does not create audio nodes when sound is disabled or muted', () => {
    playSfx('tap', false, 80);
    playSfx('tap', true, 0);

    expect(FakeAudioContext.instances).toHaveLength(0);
  });

  // The module caches its audio context, so each test loads a fresh copy and stays order-independent.
  async function freshAudio() {
    vi.resetModules();
    return import('./audio');
  }

  it('routes enabled sounds through one shared compressor with the current gain curve', async () => {
    const { playSfx: play, volumePercentToGain: curve } = await freshAudio();
    play('reward', true, 50);

    const audio = FakeAudioContext.lastInstance();
    expect(audio).toBeDefined();
    expect(audio?.compressors).toHaveLength(1);
    expect(audio?.oscillators).toHaveLength(4);
    const expectedGain = 1.9 * curve(50);
    const master = audio?.gains.find((g) => Math.abs(g.gain.value - expectedGain) < 1e-5);
    expect(master).toBeDefined();
    expect(audio?.compressors[0]?.threshold.value).toBe(-16);
    expect(audio?.compressors[0]?.ratio.value).toBe(5);
    const bus = master?.connections[0] as { connections: unknown[] } | undefined;
    expect(bus?.connections[0]).toBe(audio?.compressors[0]);
    expect(audio?.compressors[0]?.connections[0]).toBe(audio?.destination);
  });

  it('does not build a new compressor for every sound (fast letter swipes stay cheap)', async () => {
    const { playSfx: play } = await freshAudio();
    play('letter', true, 50);
    play('letter', true, 50);
    play('letter', true, 50);

    expect(FakeAudioContext.lastInstance()?.compressors).toHaveLength(1);
  });
});
