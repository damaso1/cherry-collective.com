import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  delay: number;
  duration: number;
  targetX: number;
  targetY: number;
  variant: 'petal' | 'cherry' | 'leaf';
}

interface CherryParticleSystemProps {
  isActive: boolean;
  mode: 'dissolve' | 'reform';
  onComplete?: () => void;
  particleCount?: number;
}

// Cherry blossom color palette
const PARTICLE_COLORS = [
  '#DC143C', // Cherry red
  '#FF6B8A', // Light cherry pink
  '#FFB7C5', // Pale pink
  '#8B0000', // Dark cherry
  '#FF1744', // Bright cherry
  '#C41E3A', // Cardinal
];

// Generate random particles
const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => {
    const variant = Math.random() > 0.7 ? 'cherry' : Math.random() > 0.5 ? 'leaf' : 'petal';
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: variant === 'cherry' ? 12 + Math.random() * 8 : 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 0.6 + Math.random() * 0.4,
      targetX: 50 + (Math.random() - 0.5) * 30,
      targetY: 50 + (Math.random() - 0.5) * 30,
      variant,
    };
  });
};

// Petal SVG shape
const PetalShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 20 30" fill="none">
    <path
      d="M10 0C10 0 0 10 0 20C0 25 4 30 10 30C16 30 20 25 20 20C20 10 10 0 10 0Z"
      fill={color}
      opacity={0.9}
    />
    <path
      d="M10 5C10 5 5 12 5 18C5 22 7 25 10 25"
      stroke={color}
      strokeWidth="0.5"
      opacity={0.4}
      fill="none"
    />
  </svg>
);

// Cherry SVG shape
const CherryShape: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size * 2} height={size} viewBox="0 0 40 24" fill="none">
    {/* Stem */}
    <path
      d="M20 0C20 0 18 4 16 8M20 0C20 0 22 4 24 8"
      stroke="#2D1810"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Left cherry */}
    <circle cx="12" cy="16" r="8" fill={color}>
      <animate
        attributeName="r"
        values="8;8.5;8"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
    <ellipse cx="9" cy="13" rx="2" ry="1.5" fill="white" opacity="0.3" />
    {/* Right cherry */}
    <circle cx="28" cy="16" r="8" fill={color}>
      <animate
        attributeName="r"
        values="8;8.5;8"
        dur="1s"
        begin="0.5s"
        repeatCount="indefinite"
      />
    </circle>
    <ellipse cx="25" cy="13" rx="2" ry="1.5" fill="white" opacity="0.3" />
  </svg>
);

// Leaf SVG shape
const LeafShape: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 30 18" fill="none">
    <path
      d="M0 9C0 9 7 0 15 0C23 0 30 9 30 9C30 9 23 18 15 18C7 18 0 9 0 9Z"
      fill="#228B22"
      opacity={0.8}
    />
    <path
      d="M0 9H30"
      stroke="#1B5E20"
      strokeWidth="0.5"
      opacity={0.5}
    />
  </svg>
);

// Single particle component
const Particle: React.FC<{
  particle: Particle;
  mode: 'dissolve' | 'reform';
}> = ({ particle, mode }) => {
  const isDissolve = mode === 'dissolve';

  // Calculate scatter positions for dissolve
  const scatterX = particle.x + (Math.random() - 0.5) * 60;
  const scatterY = particle.y < 50 ? -20 : 120;

  const variants = {
    // Starting position
    initial: isDissolve
      ? {
          x: `${particle.x}vw`,
          y: `${particle.y}vh`,
          scale: 1,
          opacity: 1,
          rotate: particle.rotation,
        }
      : {
          x: `${scatterX}vw`,
          y: `${scatterY}vh`,
          scale: 0,
          opacity: 0,
          rotate: particle.rotation + 180,
        },
    // Ending position
    animate: isDissolve
      ? {
          x: `${scatterX}vw`,
          y: `${scatterY}vh`,
          scale: 0,
          opacity: 0,
          rotate: particle.rotation + 360,
        }
      : {
          x: `${particle.targetX}vw`,
          y: `${particle.targetY}vh`,
          scale: 1,
          opacity: 1,
          rotate: particle.rotation,
        },
  };

  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        zIndex: 9999,
        filter: `drop-shadow(0 0 ${particle.size / 2}px ${particle.color}40)`,
      }}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: isDissolve ? [0.4, 0, 1, 1] : [0, 0, 0.2, 1],
      }}
    >
      {particle.variant === 'cherry' ? (
        <CherryShape color={particle.color} size={particle.size} />
      ) : particle.variant === 'leaf' ? (
        <LeafShape size={particle.size} />
      ) : (
        <PetalShape color={particle.color} size={particle.size} />
      )}
    </motion.div>
  );
};

// Main particle system
export const CherryParticleSystem: React.FC<CherryParticleSystemProps> = ({
  isActive,
  mode,
  onComplete,
  particleCount = 60,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles when activated
  useEffect(() => {
    if (isActive) {
      setParticles(generateParticles(particleCount));

      // Call onComplete after animation finishes
      const maxDuration = 1.2; // Max duration + delay
      const timer = setTimeout(() => {
        onComplete?.();
      }, maxDuration * 1000);

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive, mode, particleCount, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} mode={mode} />
      ))}
    </div>
  );
};

// Overlay that covers the screen during transition
export const TransitionOverlay: React.FC<{
  isVisible: boolean;
  mode: 'dissolve' | 'reform';
}> = ({ isVisible, mode }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9998 }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: mode === 'dissolve' ? [0, 0.3, 0.5] : [0.5, 0.3, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Radial gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(220, 20, 60, 0.1) 0%, rgba(45, 24, 16, 0.3) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing transition state
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMode, setTransitionMode] = useState<'dissolve' | 'reform'>('dissolve');
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  const startTransition = useCallback((navigate: () => void) => {
    setIsTransitioning(true);
    setTransitionMode('dissolve');
    setPendingNavigation(() => navigate);
  }, []);

  const onDissolveComplete = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
      setTransitionMode('reform');
    }
  }, [pendingNavigation]);

  const onReformComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingNavigation(null);
  }, []);

  return {
    isTransitioning,
    transitionMode,
    startTransition,
    onDissolveComplete,
    onReformComplete,
  };
};

export default CherryParticleSystem;
