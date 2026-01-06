import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCherry, GlassCherryPair } from './GlassCherry';

interface CherryTreeHeroProps {
  onNavigate: (route: string) => void;
}

// Stylized tree trunk and branches - CENTERED
const CherryTree: React.FC = () => {
  const trunkRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (trunkRef.current) {
      // Subtle breathing sway
      trunkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.015;
    }
  });

  return (
    <group ref={trunkRef} position={[0, -1.5, 0]}>
      {/* Main trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 2, 16]} />
        <meshStandardMaterial
          color="#2D1810"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Trunk bark texture */}
      <mesh position={[0.18, 1.0, 0.08]} rotation={[0, 0.5, 0.15]}>
        <boxGeometry args={[0.12, 0.6, 0.08]} />
        <meshStandardMaterial color="#1a0f0a" roughness={1} />
      </mesh>

      {/* LEFT MAIN BRANCH - Dashboard cherry hangs here */}
      <group position={[-0.15, 1.8, 0]} rotation={[0.1, 0, -0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.15, 1.4, 12]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
        {/* Sub-branch */}
        <group position={[-0.4, 0.5, 0.15]} rotation={[0.2, 0.3, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#3D2820" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* RIGHT MAIN BRANCH - Pricing cherry hangs here */}
      <group position={[0.15, 1.9, 0]} rotation={[-0.1, 0, 0.45]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.12, 1.3, 12]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
        {/* Sub-branch */}
        <group position={[0.35, 0.45, -0.08]} rotation={[-0.1, -0.2, 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.07, 0.7, 8]} />
            <meshStandardMaterial color="#3D2820" roughness={0.85} />
          </mesh>
        </group>
      </group>

      {/* TOP CENTER BRANCH - Main cherry pair hangs here */}
      <group position={[0, 2.0, 0.1]} rotation={[0.25, 0, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.1, 1.0, 10]} />
          <meshStandardMaterial color="#2D1810" roughness={0.85} />
        </mesh>
      </group>

      {/* UPPER LEFT BRANCH - Leads cherry */}
      <group position={[-0.08, 2.1, -0.15]} rotation={[-0.3, 0.2, -0.25]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.08, 0.9, 8]} />
          <meshStandardMaterial color="#3D2820" roughness={0.9} />
        </mesh>
      </group>

      {/* UPPER RIGHT BRANCH - Analytics cherry */}
      <group position={[0.12, 2.05, -0.2]} rotation={[-0.4, -0.15, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.07, 0.75, 8]} />
          <meshStandardMaterial color="#3D2820" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// Soft bokeh particles
const BokehParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const count = 40;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 1.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
      pos[i * 3 + 2] = Math.random() * 2 + 2;
    }
    return pos;
  }, [viewport]);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.08 + i) * 0.001;
        positions[i * 3 + 1] += Math.cos(state.clock.elapsedTime * 0.1 + i * 0.5) * 0.0008;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#FFB7C5"
        transparent
        opacity={0.25}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Volumetric fog for atmosphere
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
      uColor: { value: new THREE.Color('#1a0808') },
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
        float n = noise(uv * 8.0 + uTime * 0.05);
        float fog = smoothstep(0.0, 0.4, uv.y) * (1.0 - smoothstep(0.6, 1.0, uv.y));
        fog *= 0.12 + n * 0.04;
        gl_FragColor = vec4(uColor, fog * 0.25);
      }
    `,
    transparent: true,
  }), []);

  return (
    <mesh ref={fogRef} position={[0, 0, -4]} scale={[25, 12, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial {...fogShader} />
    </mesh>
  );
};

// Navigation cherries - positioned ON the tree branches
const NAV_CHERRIES = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    // Hanging from left main branch
    position: [-0.9, 0.85, 0.4] as [number, number, number],
    color: '#C41E3A'
  },
  {
    label: 'Pricing',
    route: '/pricing',
    // Hanging from right main branch
    position: [0.85, 0.95, 0.3] as [number, number, number],
    color: '#FFD700'
  },
  {
    label: 'Leads',
    route: '/leads',
    // Hanging from upper left branch
    position: [-0.45, 1.25, 0.5] as [number, number, number],
    color: '#32CD32'
  },
  {
    label: 'Analytics',
    route: '/analytics',
    // Hanging from upper right branch
    position: [0.5, 1.15, 0.35] as [number, number, number],
    color: '#FF6B6B'
  },
];

// Main CherryTreeHero component
export const CherryTreeHero: React.FC<CherryTreeHeroProps> = ({ onNavigate }) => {
  return (
    <>
      {/* Environment and lighting */}
      <Environment preset="night" />
      <ambientLight intensity={0.25} color="#FFE4E1" />

      {/* Key light - warm from top right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
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
        intensity={1.8}
        color="#C41E3A"
      />

      {/* Fill light - soft cool */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={0.4}
        color="#6B8DD6"
      />

      {/* Ground glow */}
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#8B0000" distance={8} />

      {/* Volumetric fog background */}
      <VolumetricFog />

      {/* THE CENTERED TREE */}
      <CherryTree />

      {/* Navigation cherries - attached to branches */}
      {NAV_CHERRIES.map((item, index) => (
        <GlassCherry
          key={item.route}
          position={item.position}
          label={item.label}
          color={item.color}
          onClick={() => onNavigate(item.route)}
          scale={0.6}
          delay={index * 0.2}
        />
      ))}

      {/* Hero cherry pair - at center top of tree */}
      <GlassCherryPair
        position={[0, 1.5, 0.7]}
        label="Start Picking"
        color="#C41E3A"
        secondaryColor="#FF1744"
        onClick={() => onNavigate('/dashboard')}
        scale={0.85}
      />

      {/* Soft sparkles around tree */}
      <Sparkles
        count={80}
        scale={6}
        size={1.5}
        speed={0.2}
        opacity={0.4}
        color="#FFB7C5"
      />

      {/* Bokeh foreground */}
      <BokehParticles />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
        color="#0a0303"
      />
    </>
  );
};

export default CherryTreeHero;
