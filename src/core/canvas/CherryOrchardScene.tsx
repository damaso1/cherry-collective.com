import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuality } from '../providers/ImmersiveProvider';

interface CherryOrchardSceneProps {
  mouseX: number;
  mouseY: number;
}

// Simple cherry tree geometry
const CherryTree: React.FC<{
  position: [number, number, number];
  scale?: number;
  rotation?: number;
}> = ({ position, scale = 1, rotation = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle sway animation
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + rotation) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 2, 8]} />
        <meshStandardMaterial color="#3D2020" roughness={0.8} />
      </mesh>

      {/* Branches/Canopy - simplified as spheres */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#228B22" roughness={0.6} />
      </mesh>

      {/* Cherry clusters */}
      {[
        [0.3, 0.2, 0.3],
        [-0.4, 0.4, 0.2],
        [0.1, 0.6, -0.3],
        [-0.2, 0.1, 0.4],
        [0.4, 0.5, -0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#C41E3A"
            emissive="#8B0000"
            emissiveIntensity={0.2}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

export const CherryOrchardScene: React.FC<CherryOrchardSceneProps> = ({
  mouseX,
  mouseY,
}) => {
  const { level } = useQuality();
  const groupRef = useRef<THREE.Group>(null);

  // Generate tree positions
  const trees = useMemo(() => {
    const treeCount = level === 'high' ? 15 : level === 'medium' ? 10 : 5;
    const result = [];

    for (let i = 0; i < treeCount; i++) {
      result.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 10 - 3,
          -5 - Math.random() * 15,
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * Math.PI * 2,
      });
    }

    // Sort by z-depth for proper layering
    return result.sort((a, b) => a.position[2] - b.position[2]);
  }, [level]);

  // Parallax movement based on mouse
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseX * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseY * 0.05,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Fog for depth */}
      <fog attach="fog" args={['#1A0A0A', 5, 30]} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2D1515" roughness={1} />
      </mesh>

      {/* Trees */}
      {trees.map((tree, i) => (
        <CherryTree
          key={i}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation}
        />
      ))}

      {/* Atmospheric glow orbs */}
      {[
        [-8, 2, -10],
        [10, -1, -8],
        [-5, 3, -15],
        [7, 0, -12],
      ].map((pos, i) => (
        <mesh key={`glow-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color="#C41E3A"
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CherryOrchardScene;
