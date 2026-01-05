import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CherryParticleSystem, TransitionOverlay } from './CherryParticleSystem';
import { useAudio } from '../providers/ImmersiveProvider';

// Context for page transitions
interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

// Provider component
interface PageTransitionProviderProps {
  children: React.ReactNode;
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'dissolve' | 'reform'>('idle');
  const [displayLocation, setDisplayLocation] = useState(location);
  const pendingNavigationRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  // Handle navigation with cherry particle transition
  const navigateWithTransition = useCallback((to: string) => {
    if (isTransitioning || to === location.pathname) return;

    pendingNavigationRef.current = to;
    setIsTransitioning(true);
    setTransitionPhase('dissolve');
    // Play dissolve sound (falling/scatter)
    playSound('transitionOut');
  }, [isTransitioning, location.pathname, playSound]);

  // Handle dissolve completion
  const handleDissolveComplete = useCallback(() => {
    if (pendingNavigationRef.current) {
      navigate(pendingNavigationRef.current);
      setTransitionPhase('reform');
      // Play reform sound (rising/coalesce)
      playSound('transitionIn');
    }
  }, [navigate, playSound]);

  // Handle reform completion
  const handleReformComplete = useCallback(() => {
    setIsTransitioning(false);
    setTransitionPhase('idle');
    pendingNavigationRef.current = null;
  }, []);

  // Update display location when location changes (after navigation)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (transitionPhase === 'reform') {
      setDisplayLocation(location);
    } else if (!isTransitioning) {
      // Direct navigation (browser back/forward or initial load)
      setDisplayLocation(location);
    }
  }, [location, transitionPhase, isTransitioning]);

  // Page content variants for fade
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {/* Cherry particle effects */}
      <CherryParticleSystem
        isActive={transitionPhase === 'dissolve'}
        mode="dissolve"
        onComplete={handleDissolveComplete}
        particleCount={80}
      />
      <CherryParticleSystem
        isActive={transitionPhase === 'reform'}
        mode="reform"
        onComplete={handleReformComplete}
        particleCount={80}
      />

      {/* Transition overlay */}
      <TransitionOverlay
        isVisible={isTransitioning}
        mode={transitionPhase === 'dissolve' ? 'dissolve' : 'reform'}
      />

      {/* Page content with fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayLocation.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TransitionContext.Provider>
  );
};

// Enhanced Link component with transition support
interface TransitionLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  to,
  children,
  className,
  onClick,
}) => {
  const { navigateWithTransition, isTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTransitioning) {
      onClick?.(e);
      navigateWithTransition(to);
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      style={{ cursor: isTransitioning ? 'wait' : 'pointer' }}
    >
      {children}
    </a>
  );
};

// Hook for programmatic navigation with transition
export const useNavigateWithTransition = () => {
  const { navigateWithTransition, isTransitioning } = usePageTransition();
  return { navigateWithTransition, isTransitioning };
};

export default PageTransitionProvider;
