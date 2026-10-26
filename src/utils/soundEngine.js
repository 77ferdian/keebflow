// High-performance Zero-Latency Web Audio Synthesizer
// Simulates mechanical keyboard switch acoustic profiles

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.currentProfile = 'thock'; // 'thock' | 'clicky' | 'creamy' | 'typewriter' | 'off'
    this.volume = 0.35;
    this.soundOnError = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  setProfile(profile) {
    this.currentProfile = profile;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setSoundOnError(enabled) {
    this.soundOnError = !!enabled;
  }

  playKey(char = 'a') {
    if (this.currentProfile === 'off') return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const randomDetune = (Math.random() - 0.5) * 40;

    switch (this.currentProfile) {
      case 'clicky': {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + randomDetune, t);
        osc.frequency.exponentialRampToValueAtTime(150, t + 0.035);

        gain.gain.setValueAtTime(this.volume * 0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.035);
        break;
      }

      case 'creamy': {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320 + randomDetune, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);

        gain.gain.setValueAtTime(this.volume * 0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case 'typewriter': {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650 + randomDetune, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.06);

        gain.gain.setValueAtTime(this.volume * 0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
        break;
      }

      case 'thock':
      default: {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240 + randomDetune, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.045);

        gain.gain.setValueAtTime(this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.045);
        break;
      }
    }
  }

  playSpace() {
    if (this.currentProfile === 'off') return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

    gain.gain.setValueAtTime(this.volume * 1.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  playEnter() {
    if (this.currentProfile === 'off') return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.075);

    gain.gain.setValueAtTime(this.volume * 1.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.075);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.075);
  }

  // Subtle muffled error thud
  playError() {
    if (!this.soundOnError || this.currentProfile === 'off') return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }
}

export const soundEngine = new SoundEngine();
