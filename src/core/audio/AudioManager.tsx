import React, { useEffect, useRef, useCallback } from 'react';
import { Howler } from 'howler';
import { useAudio } from '../providers/ImmersiveProvider';

// Sound definitions - we'll use Web Audio API generated sounds
// to avoid needing actual audio files
const SOUNDS = {
  hover: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  click: { frequency: 600, duration: 0.1, type: 'sine' as OscillatorType },
  pop: { frequency: 1000, duration: 0.08, type: 'sine' as OscillatorType },
  whoosh: { frequency: 400, duration: 0.3, type: 'sine' as OscillatorType },
  drop: { frequency: 200, duration: 0.15, type: 'sine' as OscillatorType },
  success: { frequency: 523.25, duration: 0.2, type: 'sine' as OscillatorType }, // C5
  chime: { frequency: 659.25, duration: 0.3, type: 'triangle' as OscillatorType }, // E5
  // Page transition sounds
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

  // Initialize Web Audio API
  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
    Howler.volume(volume);
  }, [volume]);

  // Play synthesized sound
  const playTone = useCallback((soundId: keyof typeof SOUNDS) => {
    if (!enabled || !audioContextRef.current || !gainNodeRef.current) return;

    const sound = SOUNDS[soundId];
    if (!sound) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);

    // Handle frequency sweep for transition sounds
    if ('sweep' in sound && sound.sweep) {
      const endFreq = sound.sweep === 'down' ? sound.frequency * 0.3 : sound.frequency * 2;
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + sound.duration);
    }

    // Envelope for smooth sound
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(volume * 0.25, ctx.currentTime + 0.02);
    envelope.gain.setValueAtTime(volume * 0.25, ctx.currentTime + sound.duration * 0.6);
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
