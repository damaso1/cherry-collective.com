import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useQuality, useMouse } from '../providers/ImmersiveProvider';
import BlossomParticles from './BlossomParticles';
import CherryOrchardScene from './CherryOrchardScene';

interface ImmersiveCanvasProps {
  className?: string;
  enableOrchard?: boolean;
  enableParticles?: boolean;
}

export const ImmersiveCanvas: React.FC<ImmersiveCanvasProps> = ({
  className = '',
  enableOrchard = true,
  enableParticles = true,
}) => {
  const { level, enableShadows } = useQuality();
  const { normalizedX, normalizedY } = useMouse();

  // Determine pixel ratio based on quality
  const dpr = level === 'high' ? [1, 2] : level === 'medium' ? [1, 1.5] : [1, 1];

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        dpr={dpr as [number, number]}
        gl={{
          antialias: level !== 'low',
          alpha: true,
          powerPreference: level === 'low' ? 'low-power' : 'high-performance',
        }}
        camera={{
          position: [0, 0, 10],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
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

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ImmersiveCanvas;
