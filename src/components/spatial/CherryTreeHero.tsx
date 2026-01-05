import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCherry, GlassCherryPair } from './GlassCherry';

interface CherryTreeHeroProps {
  onNavigate: (route: string) => void;
}

// Stylized tree trunk and branches
const CherryTree: React.FC = () => {
  const trunkRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (trunkRef.current) {
      // Subtle sway
      trunkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={trunkRef} position={[0, -2, 0]}>
      {/* Main trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 2.5, 16]} />
        <meshStandardMaterial
          color="#2D1810"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Trunk texture detail */}
      <mesh position={[0.25, 1.2, 0.1]} rotation={[0, 0.5, 0.2]}>
        <boxGeometry args={[0.15, 0.8, 0.1]} />
        <meshStandardMaterial color="#1a0f0a" roughness={1} />
      </mesh>

      {/* Main branches */}
      {/* Left branch */}
      <group position={[-0.2, 2.2, 0]} rotation={[0.1, 0, -0.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.18, 1.8, 12]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
        {/* Sub-branch */}
        <group position={[-0.5, 0.7, 0.2]} rotation={[0.2, 0.3, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.1, 1, 8]} />
            <meshStandardMaterial color="#3D2820" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* Right branch */}
      <group position={[0.2, 2.3, 0]} rotation={[-0.1, 0, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.15, 1.6, 12]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
        {/* Sub-branch */}
        <group position={[0.4, 0.6, -0.1]} rotation={[-0.1, -0.2, 0.5]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
            <meshStandardMaterial color="#3D2820" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* Center branch */}
      <group position={[0, 2.4, 0.15]} rotation={[0.3, 0, 0.1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 1.2, 10]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
      </group>

      {/* Back branches */}
      <group position={[-0.1, 2.1, -0.2]} rotation={[-0.4, 0.3, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.1, 1.1, 8]} />
          <meshStandardMaterial color="#3D2820" roughness={0.9} />
        </mesh>
      </group>
      <group position={[0.15, 2.0, -0.25]} rotation={[-0.5, -0.2, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.09, 0.9, 8]} />
          <meshStandardMaterial color="#3D2820" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// Bokeh-style foreground particles
const BokehParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const count = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
      pos[i * 3 + 2] = Math.random() * 2 + 3; // In front of camera
    }
    return pos;
  }, [viewport]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.3 + 0.1;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Slow drift
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.002;
        positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 0.15 + i * 0.5) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#C41E3A"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Volumetric fog effect
const VolumetricFog: React.FC = () => {
  const fogRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (fogRef.current) {
      const material = fogRef.current.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
      }
    }
  });

  const fogShader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#1a0f0f') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = vUv;
        float n = noise(uv * 10.0 + uTime * 0.1);
        float fog = smoothstep(0.0, 0.5, uv.y) * (1.0 - smoothstep(0.5, 1.0, uv.y));
        fog *= 0.15 + n * 0.05;
        gl_FragColor = vec4(uColor, fog * 0.3);
      }
    `,
    transparent: true,
  }), []);

  return (
    <mesh ref={fogRef} position={[0, 0, -3]} scale={[20, 10, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial {...fogShader} />
    </mesh>
  );
};

// Navigation items configuration
const NAV_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', position: [-1.8, 1.2, 0.5] as [number, number, number], color: '#C41E3A' },
  { label: 'Pricing', route: '/pricing', position: [1.6, 1.4, 0.3] as [number, number, number], color: '#FFD700' },
  { label: 'Leads', route: '/leads', position: [-0.8, 2.0, 0.8] as [number, number, number], color: '#32CD32' },
  { label: 'Analytics', route: '/analytics', position: [0.9, 1.8, 0.6] as [number, number, number], color: '#FF6B6B' },
];

// Main CherryTreeHero component
export const CherryTreeHero: React.FC<CherryTreeHeroProps> = ({ onNavigate }) => {
  return (
    <>
      {/* Environment and lighting */}
      <Environment preset="night" />
      <ambientLight intensity={0.2} />

      {/* Key light - warm from top right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.5}
        color="#FFE4C4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Rim light - cherry red from behind */}
      <directionalLight
        position={[-3, 2, -5]}
        intensity={2}
        color="#C41E3A"
      />

      {/* Fill light - soft blue */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={0.5}
        color="#4169E1"
      />

      {/* Ground reflection light */}
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#8B0000" />

      {/* Volumetric fog background */}
      <VolumetricFog />

      {/* The tree */}
      <CherryTree />

      {/* Navigation cherries */}
      {NAV_ITEMS.map((item, index) => (
        <GlassCherry
          key={item.route}
          position={item.position}
          label={item.label}
          color={item.color}
          onClick={() => onNavigate(item.route)}
          scale={0.8}
          delay={index * 0.3}
        />
      ))}

      {/* Hero cherry pair in center */}
      <Float
        speed={1.5}
        rotationIntensity={0.2}
        floatIntensity={0.3}
        floatingRange={[-0.1, 0.1]}
      >
        <GlassCherryPair
          position={[0, 0.8, 1.5]}
          label="Start Picking"
          color="#C41E3A"
          secondaryColor="#FF1744"
          onClick={() => onNavigate('/dashboard')}
          scale={1.2}
        />
      </Float>

      {/* Sparkle particles around tree */}
      <Sparkles
        count={100}
        scale={8}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#FFB7C5"
      />

      {/* Bokeh foreground */}
      <BokehParticles />

      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.6}
        scale={12}
        blur={2.5}
        far={4}
        color="#1a0505"
      />
    </>
  );
};

export default CherryTreeHero;
