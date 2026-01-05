import React, { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { useQuality, useMouse } from '../providers/ImmersiveProvider';
import BlossomParticles from './BlossomParticles';
import CherryOrchardScene from './CherryOrchardScene';

// Lazy load the heavy CherryTreeHero
const CherryTreeHero = lazy(() => import('../../components/spatial/CherryTreeHero'));

interface ImmersiveCanvasProps {
  className?: string;
  enableOrchard?: boolean;
  enableParticles?: boolean;
  enableTreeHero?: boolean;
  onNavigate?: (route: string) => void;
}

export const ImmersiveCanvas: React.FC<ImmersiveCanvasProps> = ({
  className = '',
  enableOrchard = true,
  enableParticles = true,
  enableTreeHero = false,
  onNavigate,
}) => {
  const { level, enableShadows, setLevel } = useQuality();
  const { normalizedX, normalizedY } = useMouse();

  // Determine pixel ratio based on quality
  const dpr = level === 'high' ? [1, 2] : level === 'medium' ? [1, 1.5] : [1, 1];

  // Handle performance degradation
  const handleIncline = () => {
    if (level === 'low') setLevel('medium');
    else if (level === 'medium') setLevel('high');
  };

  const handleDecline = () => {
    if (level === 'high') setLevel('medium');
    else if (level === 'medium') setLevel('low');
  };

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* IP Watermark - subtle corner mark */}
      <div className="absolute bottom-2 right-2 z-10 pointer-events-none select-none opacity-20 hover:opacity-40 transition-opacity">
        <div className="text-[10px] text-white/50 font-mono tracking-tight">
          <span className="text-cherry-ripe/60">Immersive Orchard</span>
          <span className="mx-1 text-white/30">|</span>
          <span>Cherry Enterprise</span>
        </div>
      </div>

      <Canvas
        dpr={dpr as [number, number]}
        gl={{
          antialias: level !== 'low',
          alpha: true,
          powerPreference: level === 'low' ? 'low-power' : 'high-performance',
          // Required for MeshTransmissionMaterial
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.2,
        }}
        camera={{
          position: enableTreeHero ? [0, 0.5, 6] : [0, 0, 10],
          fov: enableTreeHero ? 50 : 45,
          near: 0.1,
          far: 100,
        }}
        shadows={enableShadows}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          flipflops={3}
          factor={1}
        >
          <Suspense fallback={null}>
            {/* Tree Hero Mode - Glass cherries on tree */}
            {enableTreeHero && onNavigate && (
              <CherryTreeHero onNavigate={onNavigate} />
            )}

            {/* Standard Orchard Mode */}
            {!enableTreeHero && (
              <>
                {/* Ambient lighting */}
                <ambientLight intensity={0.3} color="#FFE4E1" />

                {/* Main directional light */}
                <directionalLight
                  position={[5, 10, 5]}
                  intensity={0.5}
                  color="#FFF5F5"
                  castShadow={enableShadows}
                />

                {/* Cherry-tinted point light */}
                <pointLight
                  position={[-5, 5, 5]}
                  intensity={0.3}
                  color="#C41E3A"
                  distance={20}
                />

                {/* Background gradient using mesh */}
                <mesh position={[0, 0, -20]}>
                  <planeGeometry args={[100, 100]} />
                  <meshBasicMaterial color="#1A0A0A" />
                </mesh>

                {/* Cherry orchard scene */}
                {enableOrchard && (
                  <CherryOrchardScene mouseX={normalizedX} mouseY={normalizedY} />
                )}

                {/* Floating blossom particles */}
                {enableParticles && <BlossomParticles />}
              </>
            )}

            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
};

export default ImmersiveCanvas;
