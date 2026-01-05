import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ============================================================================
// MOUSE CONTEXT - Global mouse position tracking
// ============================================================================
interface MouseState {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
  velocityX: number;
  velocityY: number;
  isMoving: boolean;
}

const MouseContext = createContext<MouseState>({
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  velocityX: 0,
  velocityY: 0,
  isMoving: false,
});

export const useMouse = () => useContext(MouseContext);

// ============================================================================
// AUDIO CONTEXT - Global audio state management
// ============================================================================
interface AudioState {
  enabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (vol: number) => void;
  playSound: (soundId: string) => void;
}

const AudioContext = createContext<AudioState>({
  enabled: false,
  volume: 0.3,
  toggleAudio: () => {},
  setVolume: () => {},
  playSound: () => {},
});

export const useAudio = () => useContext(AudioContext);

// ============================================================================
// CURSOR CONTEXT - Custom cursor visibility
// ============================================================================
interface CursorState {
  visible: boolean;
  variant: 'default' | 'pointer' | 'grab' | 'text';
  scale: number;
  setVariant: (variant: CursorState['variant']) => void;
  setScale: (scale: number) => void;
}

const CursorContext = createContext<CursorState>({
  visible: true,
  variant: 'default',
  scale: 1,
  setVariant: () => {},
  setScale: () => {},
});

export const useCursor = () => useContext(CursorContext);

// ============================================================================
// QUALITY CONTEXT - Adaptive performance
// ============================================================================
type QualityLevel = 'high' | 'medium' | 'low';

interface QualityState {
  level: QualityLevel;
  particleCount: number;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  setLevel: (level: QualityLevel) => void;
}

const qualityPresets: Record<QualityLevel, Omit<QualityState, 'level' | 'setLevel'>> = {
  high: { particleCount: 800, enableShadows: true, enablePostProcessing: true },
  medium: { particleCount: 400, enableShadows: true, enablePostProcessing: false },
  low: { particleCount: 150, enableShadows: false, enablePostProcessing: false },
};

const QualityContext = createContext<QualityState>({
  level: 'high',
  ...qualityPresets.high,
  setLevel: () => {},
});

export const useQuality = () => useContext(QualityContext);

// ============================================================================
// IMMERSIVE PROVIDER - Combined provider
// ============================================================================
interface ImmersiveProviderProps {
  children: ReactNode;
}

export const ImmersiveProvider: React.FC<ImmersiveProviderProps> = ({ children }) => {
  // Mouse state
  const [mouse, setMouse] = useState<MouseState>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
    isMoving: false,
  });

  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);

  // Cursor state
  const [cursorVariant, setCursorVariant] = useState<CursorState['variant']>('default');
  const [cursorScale, setCursorScale] = useState(1);

  // Quality state
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('high');

  // Mouse tracking
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();
    let moveTimeout: ReturnType<typeof setTimeout>;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 1) / 1000;

      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;

      setMouse({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
        velocityX: vx,
        velocityY: vy,
        isMoving: true,
      });

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        setMouse(prev => ({ ...prev, isMoving: false, velocityX: 0, velocityY: 0 }));
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(moveTimeout);
    };
  }, []);

  // Detect device capabilities for quality
  useEffect(() => {
    const detectQuality = () => {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile || memory < 4 || cores < 4) {
        setQualityLevel('low');
      } else if (memory < 8 || cores < 8) {
        setQualityLevel('medium');
      } else {
        setQualityLevel('high');
      }
    };

    detectQuality();
  }, []);

  // Audio controls
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

  const playSound = useCallback((soundId: string) => {
    if (!audioEnabled) return;
    // Sound playback handled by AudioManager
    window.dispatchEvent(new CustomEvent('playSound', { detail: { soundId, volume: audioVolume } }));
  }, [audioEnabled, audioVolume]);

  // Context values
  const audioValue: AudioState = {
    enabled: audioEnabled,
    volume: audioVolume,
    toggleAudio,
    setVolume: setAudioVolume,
    playSound,
  };

  const cursorValue: CursorState = {
    visible: true,
    variant: cursorVariant,
    scale: cursorScale,
    setVariant: setCursorVariant,
    setScale: setCursorScale,
  };

  const qualityValue: QualityState = {
    level: qualityLevel,
    ...qualityPresets[qualityLevel],
    setLevel: setQualityLevel,
  };

  return (
    <MouseContext.Provider value={mouse}>
      <AudioContext.Provider value={audioValue}>
        <CursorContext.Provider value={cursorValue}>
          <QualityContext.Provider value={qualityValue}>
            {children}
          </QualityContext.Provider>
        </CursorContext.Provider>
      </AudioContext.Provider>
    </MouseContext.Provider>
  );
};

export default ImmersiveProvider;
