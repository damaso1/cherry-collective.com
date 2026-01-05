import React, { useRef, useEffect, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { useMouse, useAudio } from '../../core/providers/ImmersiveProvider';

interface MagneticElementProps {
  children: ReactNode;
  strength?: number;
  distance?: number;
  scale?: number;
  glow?: boolean;
  glowColor?: string;
  sound?: boolean;
  className?: string;
  as?: 'div' | 'button' | 'a' | 'span';
  onClick?: () => void;
}

export const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  strength = 0.3,
  distance = 150,
  scale = 1.05,
  glow = true,
  glowColor = 'rgba(196, 30, 58, 0.4)',
  sound = true,
  className = '',
  as: Component = 'div',
  onClick,
}) => {
  const { x: mouseX, y: mouseY } = useMouse();
  const { playSound } = useAudio();
  const elementRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowOpacity = useMotionValue(0);

  // Springs for smooth animation
  const springConfig = { stiffness: 400, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springGlow = useSpring(glowOpacity, { stiffness: 200, damping: 25 });

  // Calculate magnetic pull
  useEffect(() => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < distance) {
      const pull = (1 - dist / distance) * strength;
      const pullX = dx * pull;
      const pullY = dy * pull;

      x.set(pullX);
      y.set(pullY);
      glowOpacity.set((1 - dist / distance) * 0.8);

      // Play hover sound on enter
      if (!isHoveredRef.current && sound) {
        isHoveredRef.current = true;
        playSound('hover');
      }
    } else {
      x.set(0);
      y.set(0);
      glowOpacity.set(0);
      isHoveredRef.current = false;
    }
  }, [mouseX, mouseY, distance, strength, x, y, glowOpacity, sound, playSound]);

  const handleClick = () => {
    if (sound) {
      playSound('click');
    }

    // Click animation
    if (elementRef.current) {
      gsap.to(elementRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }

    onClick?.();
  };

  const MotionComponent = motion[Component] as any;

  return (
    <MotionComponent
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        x: springX,
        y: springY,
      }}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-[-10px] rounded-full blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            opacity: springGlow,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </MotionComponent>
  );
};

// Hook for using magnetic effect on custom elements
export const useMagneticPull = (
  ref: React.RefObject<HTMLElement>,
  options: { strength?: number; distance?: number } = {}
) => {
  const { x: mouseX, y: mouseY } = useMouse();
  const { strength = 0.3, distance = 150 } = options;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const springY = useSpring(y, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < distance) {
      const pull = (1 - dist / distance) * strength;
      x.set(dx * pull);
      y.set(dy * pull);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [mouseX, mouseY, distance, strength, x, y, ref]);

  return { x: springX, y: springY };
};

export default MagneticElement;
