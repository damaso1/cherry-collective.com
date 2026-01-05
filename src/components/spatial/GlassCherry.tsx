import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { MeshTransmissionMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GlassCherryProps {
  position: [number, number, number];
  label: string;
  onClick?: () => void;
  color?: string;
  scale?: number;
  delay?: number;
}

// Physics spring configuration
const SPRING_CONFIG = {
  tension: 180,
  friction: 12,
  mass: 1,
};

// Cherry geometry with stem
const CherryGeometry: React.FC<{
  color: string;
  hovered: boolean;
  emissionIntensity: number;
}> = ({ color, hovered, emissionIntensity }) => {
  const cherryRef = useRef<THREE.Mesh>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  const highlightRef = useRef<THREE.Mesh>(null);

  // Animate emission on hover
  useFrame((state) => {
    if (cherryRef.current) {
      const material = cherryRef.current.material as THREE.MeshPhysicalMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity,
          hovered ? emissionIntensity : 0.1,
          0.1
        );
      }
    }

    // Subtle highlight rotation
    if (highlightRef.current) {
      highlightRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      {/* Main cherry body - glass material */}
      <mesh ref={cherryRef} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.05}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={color}
          color={color}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh scale={0.35}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.8 : 0.4}
        />
      </mesh>

      {/* Specular highlight */}
      <mesh ref={highlightRef} position={[0.15, 0.2, 0.35]} scale={0.12}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>

      {/* Stem */}
      <mesh ref={stemRef} position={[0, 0.55, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.03, 0.02, 0.3, 8]} />
        <meshStandardMaterial
          color="#2D1810"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Leaf on stem */}
      <mesh position={[0.1, 0.65, 0]} rotation={[0.3, 0.5, 0.2]} scale={[0.15, 0.08, 0.02]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#228B22"
          roughness={0.6}
          metalness={0.1}
          emissive="#228B22"
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Rim light effect (glowing edge) */}
      <mesh scale={0.52}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.15 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// Floating label component
const FloatingLabel: React.FC<{
  label: string;
  visible: boolean;
  position: [number, number, number];
}> = ({ label, visible, position }) => {
  return (
    <Html
      position={position}
      center
      style={{
        transition: 'all 0.3s ease-out',
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 10}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(26, 15, 15, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(196, 30, 58, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(196, 30, 58, 0.2)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </span>
      </div>
    </Html>
  );
};

// Main GlassCherry component with physics
export const GlassCherry: React.FC<GlassCherryProps> = ({
  position,
  label,
  onClick,
  color = '#C41E3A',
  scale = 1,
  delay = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Physics state for jiggle
  const physics = useRef({
    velocity: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    rotVelocity: new THREE.Vector3(0, 0, 0),
    targetScale: scale,
    currentScale: scale,
  });

  // Spring physics for jiggle effect
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const p = physics.current;
    const dt = Math.min(delta, 0.1);

    // Gentle floating motion
    const time = state.clock.elapsedTime + delay;
    const floatY = Math.sin(time * 0.8) * 0.05;
    const floatX = Math.cos(time * 0.6) * 0.03;

    // Spring physics for rotation (jiggle)
    if (hovered) {
      // Add jiggle impulse on hover
      p.rotVelocity.x += (Math.random() - 0.5) * 0.02;
      p.rotVelocity.z += (Math.random() - 0.5) * 0.02;
    }

    // Apply spring force to return to rest
    const springForce = SPRING_CONFIG.tension / 1000;
    const damping = 1 - (SPRING_CONFIG.friction / 100);

    p.rotVelocity.x -= p.rotation.x * springForce;
    p.rotVelocity.z -= p.rotation.z * springForce;
    p.rotVelocity.multiplyScalar(damping);

    p.rotation.x += p.rotVelocity.x * dt * 60;
    p.rotation.z += p.rotVelocity.z * dt * 60;

    // Clamp rotation
    p.rotation.x = THREE.MathUtils.clamp(p.rotation.x, -0.3, 0.3);
    p.rotation.z = THREE.MathUtils.clamp(p.rotation.z, -0.3, 0.3);

    // Scale animation
    p.targetScale = hovered ? scale * 1.15 : scale;
    if (clicked) p.targetScale = scale * 0.9;
    p.currentScale = THREE.MathUtils.lerp(p.currentScale, p.targetScale, 0.15);

    // Apply transforms
    groupRef.current.position.y = position[1] + floatY;
    groupRef.current.position.x = position[0] + floatX;
    groupRef.current.rotation.x = p.rotation.x;
    groupRef.current.rotation.z = p.rotation.z;
    groupRef.current.scale.setScalar(p.currentScale);
  });

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';

    // Add initial jiggle impulse
    physics.current.rotVelocity.x = (Math.random() - 0.5) * 0.1;
    physics.current.rotVelocity.z = (Math.random() - 0.5) * 0.1;
  };

  const handlePointerLeave = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);

    // Burst jiggle on click
    physics.current.rotVelocity.x = (Math.random() - 0.5) * 0.3;
    physics.current.rotVelocity.z = (Math.random() - 0.5) * 0.3;

    setTimeout(() => {
      setClicked(false);
      onClick?.();
    }, 150);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <CherryGeometry
        color={color}
        hovered={hovered}
        emissionIntensity={0.5}
      />
      <FloatingLabel
        label={label}
        visible={hovered}
        position={[0, 1, 0]}
      />
    </group>
  );
};

// Cherry pair (two cherries on one stem)
export const GlassCherryPair: React.FC<GlassCherryProps & { secondaryColor?: string }> = ({
  position,
  label,
  onClick,
  color = '#C41E3A',
  secondaryColor = '#8B0000',
  scale = 1,
  delay = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Physics state
  const physics = useRef({
    rotation: new THREE.Euler(0, 0, 0),
    rotVelocity: new THREE.Vector3(0, 0, 0),
    currentScale: scale,
  });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const p = physics.current;
    const dt = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime + delay;

    // Floating
    const floatY = Math.sin(time * 0.7) * 0.06;
    const floatRotZ = Math.sin(time * 0.5) * 0.05;

    // Spring jiggle
    if (hovered) {
      p.rotVelocity.x += (Math.random() - 0.5) * 0.015;
      p.rotVelocity.z += (Math.random() - 0.5) * 0.015;
    }

    const springForce = 0.15;
    const damping = 0.92;

    p.rotVelocity.x -= p.rotation.x * springForce;
    p.rotVelocity.z -= p.rotation.z * springForce;
    p.rotVelocity.multiplyScalar(damping);

    p.rotation.x += p.rotVelocity.x * dt * 60;
    p.rotation.z += p.rotVelocity.z * dt * 60;

    // Scale
    const targetScale = hovered ? scale * 1.12 : scale;
    p.currentScale = THREE.MathUtils.lerp(p.currentScale, clicked ? scale * 0.92 : targetScale, 0.12);

    groupRef.current.position.y = position[1] + floatY;
    groupRef.current.rotation.x = p.rotation.x;
    groupRef.current.rotation.z = p.rotation.z + floatRotZ;
    groupRef.current.scale.setScalar(p.currentScale);
  });

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    physics.current.rotVelocity.set(
      (Math.random() - 0.5) * 0.08,
      0,
      (Math.random() - 0.5) * 0.08
    );
  };

  const handlePointerLeave = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);
    physics.current.rotVelocity.set(
      (Math.random() - 0.5) * 0.2,
      0,
      (Math.random() - 0.5) * 0.2
    );
    setTimeout(() => {
      setClicked(false);
      onClick?.();
    }, 150);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Shared stem */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#2D1810" roughness={0.8} />
      </mesh>

      {/* Branch split */}
      <mesh position={[-0.15, 0.45, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.02, 0.025, 0.35, 8]} />
        <meshStandardMaterial color="#2D1810" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.45, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.02, 0.025, 0.35, 8]} />
        <meshStandardMaterial color="#2D1810" roughness={0.8} />
      </mesh>

      {/* Left cherry */}
      <group position={[-0.35, 0.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.92}
            roughness={0.05}
            thickness={0.4}
            ior={1.5}
            chromaticAberration={0.05}
            clearcoat={1}
            attenuationDistance={0.4}
            attenuationColor={color}
            color={color}
          />
        </mesh>
        <mesh scale={0.25}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.7 : 0.35} />
        </mesh>
        <mesh position={[0.1, 0.15, 0.28]} scale={0.08}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Right cherry */}
      <group position={[0.35, 0.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.4, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.92}
            roughness={0.05}
            thickness={0.4}
            ior={1.5}
            chromaticAberration={0.05}
            clearcoat={1}
            attenuationDistance={0.4}
            attenuationColor={secondaryColor}
            color={secondaryColor}
          />
        </mesh>
        <mesh scale={0.25}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={secondaryColor} transparent opacity={hovered ? 0.7 : 0.35} />
        </mesh>
        <mesh position={[0.1, 0.15, 0.28]} scale={0.08}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="white" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Leaf */}
      <mesh position={[0.05, 0.85, 0.05]} rotation={[0.2, 0.3, 0.1]} scale={[0.18, 0.1, 0.025]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#228B22"
          roughness={0.5}
          emissive="#228B22"
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </mesh>

      <FloatingLabel label={label} visible={hovered} position={[0, 1.3, 0]} />
    </group>
  );
};

export default GlassCherry;
