import React, { useEffect, useRef, useCallback } from 'react';
import { Howler } from 'howler';
import { useAudio } from '../providers/ImmersiveProvider';

// Sound definitions - Web Audio API generated
const SOUNDS = {
  hover: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  click: { frequency: 600, duration: 0.1, type: 'sine' as OscillatorType },
  pop: { frequency: 1200, duration: 0.12, type: 'sine' as OscillatorType, sweep: 'down' as const },
  burst: { frequency: 800, duration: 0.25, type: 'triangle' as OscillatorType, sweep: 'down' as const },
  whoosh: { frequency: 400, duration: 0.3, type: 'sine' as OscillatorType },
  drop: { frequency: 200, duration: 0.15, type: 'sine' as OscillatorType },
  success: { frequency: 523.25, duration: 0.2, type: 'sine' as OscillatorType },
  chime: { frequency: 659.25, duration: 0.3, type: 'triangle' as OscillatorType },
  transitionOut: { frequency: 600, duration: 0.4, type: 'sine' as OscillatorType, sweep: 'down' as const },
  transitionIn: { frequency: 400, duration: 0.5, type: 'triangle' as OscillatorType, sweep: 'up' as const },
};

interface AudioManagerProps {
  children: React.ReactNode;
}

export const AudioManager: React.FC<AudioManagerProps> = ({ children }) => {
  const { enabled, volume } = useAudio();
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);

      // Start ambient meditation audio
      startAmbientAudio();
    }

    return () => {
      stopAmbientAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  // Create ambient meditation drone
  const startAmbientAudio = useCallback(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Create ambient gain node
    ambientGainRef.current = ctx.createGain();
    ambientGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
    ambientGainRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3);
    ambientGainRef.current.connect(ctx.destination);

    // Create layered ambient tones
    const createDrone = (freq: number, detune: number, type: OscillatorType) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime(detune, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      oscGain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(ambientGainRef.current!);

      // Slow frequency modulation for organic feel
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      lfoGain.gain.setValueAtTime(2, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.start();
      return { osc, lfo };
    };

    // Deep meditation base tones (binaural-ish)
    const drone1 = createDrone(55, 0, 'sine'); // A1
    const drone2 = createDrone(55, 3, 'sine'); // Slight detune for beating
    const drone3 = createDrone(110, 0, 'triangle'); // A2 harmonic
    const drone4 = createDrone(82.5, 5, 'sine'); // E2 fifth

    // Store for cleanup
    (audioContextRef.current as any).drones = [drone1, drone2, drone3, drone4];
  }, []);

  const stopAmbientAudio = useCallback(() => {
    if (ambientGainRef.current && audioContextRef.current) {
      ambientGainRef.current.gain.linearRampToValueAtTime(
        0,
        audioContextRef.current.currentTime + 1
      );
    }

    // Stop drones
    if (audioContextRef.current && (audioContextRef.current as any).drones) {
      (audioContextRef.current as any).drones.forEach((d: any) => {
        try {
          d.osc.stop();
          d.lfo.stop();
        } catch (e) {}
      });
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
    if (ambientGainRef.current && audioContextRef.current) {
      ambientGainRef.current.gain.linearRampToValueAtTime(
        enabled ? volume * 0.1 : 0,
        audioContextRef.current.currentTime + 0.5
      );
    }
    Howler.volume(volume);
  }, [volume, enabled]);

  // Play synthesized sound
  const playTone = useCallback((soundId: keyof typeof SOUNDS) => {
    if (!enabled || !audioContextRef.current || !gainNodeRef.current) return;

    const sound = SOUNDS[soundId];
    if (!sound) return;

    const ctx = audioContextRef.current;

    // For burst effect, create multiple oscillators
    if (soundId === 'burst') {
      // Create burst of particles sound
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const envelope = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          const baseFreq = 600 + Math.random() * 800;
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.2, ctx.currentTime + 0.15);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1000, ctx.currentTime);
          filter.Q.setValueAtTime(2, ctx.currentTime);

          envelope.gain.setValueAtTime(0, ctx.currentTime);
          envelope.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.01);
          envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

          osc.connect(filter);
          filter.connect(envelope);
          envelope.connect(gainNodeRef.current!);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.15);
        }, i * 15);
      }
      return;
    }

    // Standard sound
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

    // Handle frequency sweep
    if ('sweep' in sound && sound.sweep) {
      const endFreq = sound.sweep === 'down' ? sound.frequency * 0.25 : sound.frequency * 2.5;
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + sound.duration);
    }

    // Envelope for smooth sound
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.015);
    envelope.gain.setValueAtTime(volume * 0.3, ctx.currentTime + sound.duration * 0.5);
    envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);

    oscillator.connect(envelope);
    envelope.connect(gainNodeRef.current);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  }, [enabled, volume]);

  // Listen for sound events
  useEffect(() => {
    const handlePlaySound = (e: CustomEvent<{ soundId: string; volume?: number }>) => {
      const { soundId } = e.detail;
      if (soundId in SOUNDS) {
        playTone(soundId as keyof typeof SOUNDS);
      }
    };

    window.addEventListener('playSound', handlePlaySound as EventListener);
    return () => {
      window.removeEventListener('playSound', handlePlaySound as EventListener);
    };
  }, [playTone]);

  return <>{children}</>;
};

// Utility hook for playing sounds
export const useSound = () => {
  const { enabled, volume, playSound } = useAudio();

  const play = useCallback((soundId: keyof typeof SOUNDS) => {
    if (!enabled) return;
    playSound(soundId);
  }, [enabled, playSound]);

  return { play, enabled, volume };
};

// Mute toggle button component
export const MuteToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { enabled, toggleAudio } = useAudio();

  return (
    <button
      onClick={toggleAudio}
      className={`
        fixed bottom-4 right-4 z-50 p-3 rounded-full
        bg-bark-medium/80 backdrop-blur-sm border border-cherry-ripe/30
        hover:bg-bark-light transition-all duration-300
        hover:scale-110 hover:border-cherry-ripe/50
        ${className}
      `}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      title={enabled ? 'Mute (ambient meditation playing)' : 'Enable sounds & ambient'}
    >
      {enabled ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
};

export default AudioManager;
