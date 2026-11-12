/** Web Audio API cartoon sound synthesizer (no external audio files). */
class SoundEngine {
  private ctx: AudioContext | null = null;
  enabled = true;

  init() {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctor) this.ctx = new Ctor();
      }
      if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    } catch (e) {
      console.warn('Web Audio not available:', e);
    }
  }

  private tone(freq: number, type: OscillatorType = 'sine', duration = 0.14, delay = 0, volume = 0.22, slideTo: number | null = null) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      /* ignore playback errors on locked devices */
    }
  }

  flip() { this.tone(320, 'sine', 0.11, 0, 0.2, 560); }

  colorMatch() {
    this.tone(523.25, 'triangle', 0.15, 0, 0.24);
    this.tone(659.25, 'triangle', 0.22, 0.11, 0.26);
  }

  exactMatch() {
    this.tone(523.25, 'triangle', 0.14, 0, 0.25);
    this.tone(659.25, 'triangle', 0.14, 0.09, 0.25);
    this.tone(783.99, 'triangle', 0.14, 0.18, 0.26);
    this.tone(1046.5, 'sine', 0.3, 0.27, 0.28);
  }

  mismatch() { this.tone(310, 'sine', 0.14, 0, 0.15, 230); }

  timerWarning(urgent = false) {
    if (urgent) {
      this.tone(880, 'sine', 0.12, 0, 0.22);
    } else {
      this.tone(587.33, 'triangle', 0.14, 0, 0.22);
      this.tone(783.99, 'triangle', 0.18, 0.12, 0.24);
    }
  }

  victory() {
    const notes = [
      [523.25, 0.14, 0], [659.25, 0.14, 0.13], [783.99, 0.14, 0.26],
      [1046.5, 0.26, 0.4], [783.99, 0.14, 0.68], [1046.5, 0.42, 0.84],
    ] as const;
    notes.forEach(([f, d, t]) => this.tone(f, 'triangle', d, t, 0.28));
  }
}

export const sound = new SoundEngine();
