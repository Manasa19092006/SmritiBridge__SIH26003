// Procedural Sound Synthesizer using Web Audio API
// No external mp3 files required - reliable, instant, and customizable

let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundService = {
  setMuted(muted) {
    isMuted = muted;
  },

  getMuted() {
    return isMuted;
  },

  toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  },

  // Soft click / bubble sound for button taps
  playBubblePop() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  // Subtle 3D card flip rustle
  playCardFlip() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  // Joyful harmonic pentatonic chime for correct matches
  playChime() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  // Gentle marimba nudge for retry (soothing, encouraging, never harsh)
  playGentleNudge() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [392.00, 329.63]; // G4, E4
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.18, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  // Grand celebration fanfare for level-up / victory / badge unlock
  playFanfare() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.50, d: 0.35 }, // C6
        { f: 880.00, d: 0.15 }, // A5
        { f: 1046.50, d: 0.6 } // C6 hold
      ];
      let offset = ctx.currentTime;

      melody.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, offset);

        gain.gain.setValueAtTime(0.25, offset);
        gain.gain.exponentialRampToValueAtTime(0.001, offset + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(offset);
        osc.stop(offset + note.d);

        offset += note.d * 0.9;
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  },

  // Harmonized note for sequence memory game
  playSequenceNote(freqIndex = 0) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const frequencies = [329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // E4, G4, A4, C5, D5, E5
      const freq = frequencies[freqIndex % frequencies.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }
};
