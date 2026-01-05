import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { Shield, Target, Zap } from 'lucide-react';
import { MagneticElement } from '../components/effects/MagneticElement';
import { CherryPairIcon } from '../components/icons';
import { useQuality } from '../core/providers/ImmersiveProvider';
import { useNavigateWithTransition } from '../core/transitions';

// Lazy load 3D components
const CherryTreeHero = lazy(() => import('../components/spatial/CherryTreeHero'));

// Credential badge component
const CredentialBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}> = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: 'spring' }}
  >
    <MagneticElement strength={0.15} distance={80}>
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-full
                   bg-bark-medium/40 backdrop-blur-xl border border-cherry-ripe/20
                   hover:border-cherry-ripe/40 transition-all duration-300"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="p-1.5 bg-cherry-ripe/20 rounded-full">{icon}</div>
        <div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
          <div className="text-sm font-semibold text-white">{value}</div>
        </div>
      </div>
    </MagneticElement>
  </motion.div>
);

// 3D Canvas wrapper with loading state
const TreeCanvas: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { level, enableShadows, setLevel } = useQuality();
  const dpr = level === 'high' ? [1, 2] : level === 'medium' ? [1, 1.5] : [1, 1];

  return (
    <Canvas
      dpr={dpr as [number, number]}
      gl={{
        antialias: level !== 'low',
        alpha: true,
        powerPreference: level === 'low' ? 'low-power' : 'high-performance',
        toneMapping: 3,
        toneMappingExposure: 1.2,
      }}
      camera={{
        position: [0, 0.5, 6],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      shadows={enableShadows}
      style={{ background: 'transparent' }}
    >
      <PerformanceMonitor
        onDecline={() => {
          if (level === 'high') setLevel('medium');
          else if (level === 'medium') setLevel('low');
        }}
        onIncline={() => {
          if (level === 'low') setLevel('medium');
          else if (level === 'medium') setLevel('high');
        }}
      >
        <Suspense fallback={null}>
          <CherryTreeHero onNavigate={onNavigate} />
          <Preload all />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
};

// Loading fallback
const TreeLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <CherryPairIcon size={64} animate />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="absolute mt-24 text-white/50 text-sm"
    >
      Growing your orchard...
    </motion.p>
  </div>
);

const SpatialLandingPage: React.FC = () => {
  const { navigateWithTransition } = useNavigateWithTransition();

  const handleNavigate = (route: string) => {
    navigateWithTransition(route);
  };

  return (
    <div className="min-h-screen bg-bark-dark overflow-hidden">
      {/* Full-screen 3D Canvas */}
      <div className="fixed inset-0">
        <Suspense fallback={<TreeLoader />}>
          <TreeCanvas onNavigate={handleNavigate} />
        </Suspense>
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 pointer-events-none">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 px-6 py-4 pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <MagneticElement strength={0.2}>
              <button
                onClick={() => handleNavigate('/')}
                className="flex items-center gap-3"
              >
                <CherryPairIcon size={36} animate />
                <span className="font-display font-bold text-xl text-white">
                  Cherry<span className="text-cherry-ripe">picker</span>
                </span>
              </button>
            </MagneticElement>

            {/* Nav hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white/40 text-sm hidden md:block"
            >
              Hover over cherries to navigate
            </motion.p>
          </div>
        </motion.header>

        {/* Bottom credentials bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="fixed bottom-0 left-0 right-0 px-6 py-6 pointer-events-auto"
        >
          <div className="max-w-4xl mx-auto">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mb-6"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                Pick the <span className="text-cherry-ripe">Ripest</span> Leads
              </h1>
              <p className="text-white/50 text-lg">
                AI-powered lead intelligence that grows with your business
              </p>
            </motion.div>

            {/* Credentials */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <CredentialBadge
                icon={<Shield className="w-4 h-4 text-cherry-light" />}
                label="Australian Business"
                value="ABN: 89 767 167 506"
                delay={1.8}
              />
              <CredentialBadge
                icon={<Target className="w-4 h-4 text-stem-light" />}
                label="Defense Verified"
                value="NCAGE: Z1ME7"
                delay={2.0}
              />
              <CredentialBadge
                icon={<Zap className="w-4 h-4 text-gold" />}
                label="Active Agents"
                value="12+ Running 24/7"
                delay={2.2}
              />
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-cherry-ripe rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SpatialLandingPage;
