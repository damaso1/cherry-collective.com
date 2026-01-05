import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQuality } from '../providers/ImmersiveProvider';

const PETAL_COLORS = [
  new THREE.Color('#FFB3BA'),
  new THREE.Color('#FFDFDF'),
  new THREE.Color('#FFC0CB'),
  new THREE.Color('#FFE4E1'),
  new THREE.Color('#FF6B6B'),
];

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  colorIndex: number;
  phase: number;
}

export const BlossomParticles: React.FC = () => {
  const { particleCount } = useQuality();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize particle data
  const particles = useMemo<Particle[]>(() => {
    const result: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      result.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          Math.random() * 20 + 5,
          (Math.random() - 0.5) * 20 - 5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          -0.5 - Math.random() * 0.5,
          (Math.random() - 0.5) * 0.3
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        scale: 0.05 + Math.random() * 0.1,
        colorIndex: Math.floor(Math.random() * PETAL_COLORS.length),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, [particleCount]);

  // Create colors array for instanced mesh
  const colors = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    particles.forEach((p, i) => {
      const color = PETAL_COLORS[p.colorIndex];
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    });
    return arr;
  }, [particles, particleCount]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      // Wind effect - sinusoidal movement
      const windX = Math.sin(time * 0.3 + particle.phase) * 0.02;
      const windZ = Math.cos(time * 0.2 + particle.phase) * 0.01;

      // Update position
      particle.position.x += particle.velocity.x + windX;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z + windZ;

      // Update rotation
      particle.rotation.x += particle.rotationSpeed.x;
      particle.rotation.y += particle.rotationSpeed.y;
      particle.rotation.z += particle.rotationSpeed.z;

      // Reset particles that fall below view
      if (particle.position.y < -10) {
        particle.position.y = 15 + Math.random() * 10;
        particle.position.x = (Math.random() - 0.5) * 40;
        particle.position.z = (Math.random() - 0.5) * 20 - 5;
      }

      // Wrap particles that go too far horizontally
      if (Math.abs(particle.position.x) > 25) {
        particle.position.x = -Math.sign(particle.position.x) * 20;
      }

      // Update instance matrix
      dummy.position.copy(particle.position);
      dummy.rotation.copy(particle.rotation);
      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particleCount]}
      frustumCulled={false}
    >
      {/* Petal shape - flattened sphere */}
      <sphereGeometry args={[1, 6, 4]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </sphereGeometry>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        roughness={0.5}
      />
    </instancedMesh>
  );
};

export default BlossomParticles;
