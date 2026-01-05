import React, { useEffect, useRef, useState } from 'react';
import { useMouse, useQuality } from '../providers/ImmersiveProvider';

interface Petal {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  color: string;
}

const PETAL_COLORS = [
  '#FFB3BA', // Light pink
  '#FFDFDF', // Pale pink
  '#FFC0CB', // Pink
  '#FF69B4', // Hot pink
  '#FFE4E1', // Misty rose
];

export const CursorTrail: React.FC = () => {
  const { x, y, isMoving } = useMouse();
  const { level } = useQuality();
  const [petals, setPetals] = useState<Petal[]>([]);
  const petalIdRef = useRef(0);
  const lastSpawnRef = useRef({ x: 0, y: 0, time: 0 });

  // Adjust trail density based on quality
  const maxPetals = level === 'high' ? 20 : level === 'medium' ? 12 : 6;
  const spawnDistance = level === 'high' ? 15 : level === 'medium' ? 25 : 40;

  useEffect(() => {
    if (!isMoving) return;

    const now = Date.now();
    const dx = x - lastSpawnRef.current.x;
    const dy = y - lastSpawnRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Spawn new petal if moved enough distance
    if (dist > spawnDistance && now - lastSpawnRef.current.time > 30) {
      const newPetal: Petal = {
        id: petalIdRef.current++,
        x,
        y,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.8,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      };

      setPetals(prev => {
        const updated = [...prev, newPetal];
        // Remove old petals if over limit
        if (updated.length > maxPetals) {
          return updated.slice(-maxPetals);
        }
        return updated;
      });

      lastSpawnRef.current = { x, y, time: now };
    }
  }, [x, y, isMoving, spawnDistance, maxPetals]);

  // Animate and remove petals
  useEffect(() => {
    if (petals.length === 0) return;

    const interval = setInterval(() => {
      setPetals(prev =>
        prev
          .map(p => ({
            ...p,
            y: p.y + 0.5, // Slow fall
            rotation: p.rotation + 2,
            opacity: p.opacity - 0.02,
            scale: p.scale * 0.995,
          }))
          .filter(p => p.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [petals.length]);

  if (level === 'low' && petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9996] overflow-hidden">
      {petals.map(petal => (
        <PetalElement key={petal.id} petal={petal} />
      ))}
    </div>
  );
};

// Individual petal component
const PetalElement: React.FC<{ petal: Petal }> = ({ petal }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: petal.x - 6,
        top: petal.y - 6,
        transform: `rotate(${petal.rotation}deg) scale(${petal.scale})`,
        opacity: petal.opacity,
        transition: 'transform 0.1s linear',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <ellipse
          cx="6"
          cy="6"
          rx="5"
          ry="3"
          fill={petal.color}
          filter="blur(0.5px)"
        />
        {/* Petal vein */}
        <line
          x1="2"
          y1="6"
          x2="10"
          y2="6"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

export default CursorTrail;
