import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMouse } from '../../core/providers/ImmersiveProvider';
import { clsx } from 'clsx';

// SVG paths for organic cherry shapes
const BUBBLE_SHAPES = {
  single: 'M50,5 C75,5 95,25 95,50 C95,75 75,95 50,95 C25,95 5,75 5,50 C5,25 25,5 50,5 Z',
  organic: 'M50,3 C72,3 92,18 96,42 C98,58 88,78 68,90 C52,98 28,96 14,82 C2,70 0,48 8,28 C16,10 34,3 50,3 Z',
  soft: 'M50,5 C70,2 90,20 93,45 C96,70 80,92 52,95 C24,98 5,78 5,50 C5,22 30,8 50,5 Z',
  cherry: 'M50,8 C30,8 12,26 12,50 C12,74 30,92 50,92 C70,92 88,74 88,50 C88,26 70,8 50,8 Z',
};

type BubbleVariant = keyof typeof BUBBLE_SHAPES;
type BubbleSize = 'sm' | 'md' | 'lg' | 'xl';
export type GlowColor = 'cherry' | 'green' | 'gold' | 'blue' | 'none';

interface CherryBubbleProps {
  children: React.ReactNode;
  variant?: BubbleVariant;
  size?: BubbleSize;
  glow?: GlowColor;
  magnetic?: boolean;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const SIZE_CLASSES: Record<BubbleSize, string> = {
  sm: 'min-w-[120px] min-h-[100px] p-3',
  md: 'min-w-[180px] min-h-[150px] p-5',
  lg: 'min-w-[280px] min-h-[220px] p-6',
  xl: 'min-w-[400px] min-h-[320px] p-8',
};

const GLOW_COLORS: Record<GlowColor, string> = {
  cherry: 'rgba(196, 30, 58, 0.4)',
  green: 'rgba(50, 205, 50, 0.4)',
  gold: 'rgba(255, 215, 0, 0.4)',
  blue: 'rgba(100, 149, 237, 0.4)',
  none: 'transparent',
};

export const CherryBubble = forwardRef<HTMLDivElement, CherryBubbleProps>(
  (
    {
      children,
      variant = 'organic',
      size = 'md',
      glow = 'cherry',
      magnetic = true,
      hover = true,
      className = '',
      onClick,
      style,
    },
    ref
  ) => {
    const { x: mouseX, y: mouseY } = useMouse();
    const bubbleRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for magnetic effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Springs for smooth movement
    const springX = useSpring(x, { stiffness: 300, damping: 30 });
    const springY = useSpring(y, { stiffness: 300, damping: 30 });

    // Magnetic pull effect
    useEffect(() => {
      if (!magnetic || !bubbleRef.current) return;

      const rect = bubbleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const maxDistance = 200;
      const maxPull = 15;

      if (dist < maxDistance) {
        const pull = (1 - dist / maxDistance) * maxPull;
        x.set(dx * (pull / dist) || 0);
        y.set(dy * (pull / dist) || 0);
      } else {
        x.set(0);
        y.set(0);
      }
    }, [mouseX, mouseY, magnetic, x, y]);

    // Unique ID for clip path
    const clipId = useRef(`cherry-bubble-${Math.random().toString(36).slice(2)}`);

    return (
      <motion.div
        ref={(node) => {
          (bubbleRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={clsx(
          'relative overflow-visible',
          SIZE_CLASSES[size],
          onClick && 'cursor-pointer',
          className
        )}
        style={{
          x: magnetic ? springX : 0,
          y: magnetic ? springY : 0,
          ...style,
        }}
        whileHover={hover ? { scale: 1.03 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* SVG for clip path definition */}
        <svg className="absolute w-0 h-0">
          <defs>
            <clipPath id={clipId.current} clipPathUnits="objectBoundingBox">
              <path
                d={BUBBLE_SHAPES[variant]}
                transform="scale(0.01)"
              />
            </clipPath>
          </defs>
        </svg>

        {/* Glow effect */}
        {glow !== 'none' && (
          <motion.div
            className="absolute inset-[-20px] rounded-full blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${GLOW_COLORS[glow]} 0%, transparent 70%)`,
              opacity: isHovered ? 0.8 : 0.4,
            }}
            animate={{ opacity: isHovered ? 0.8 : 0.4 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Main bubble container */}
        <div
          className="relative w-full h-full"
          style={{
            clipPath: `url(#${clipId.current})`,
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse at 30% 20%,
                  rgba(255, 255, 255, 0.15) 0%,
                  transparent 50%
                ),
                radial-gradient(
                  ellipse at 70% 80%,
                  rgba(139, 0, 0, 0.3) 0%,
                  transparent 50%
                ),
                linear-gradient(
                  135deg,
                  rgba(45, 21, 21, 0.9) 0%,
                  rgba(26, 10, 10, 0.95) 100%
                )
              `,
            }}
          />

          {/* Glass reflection */}
          <div
            className="absolute top-[5%] left-[10%] w-[35%] h-[20%] rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
              filter: 'blur(2px)',
              transform: 'rotate(-20deg)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            {children}
          </div>

          {/* Border glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `url(#${clipId.current})`,
              boxShadow: `inset 0 0 20px ${GLOW_COLORS[glow]}, inset 0 0 40px ${GLOW_COLORS[glow]}50`,
            }}
          />
        </div>

        {/* Subtle pulse animation on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `url(#${clipId.current})`,
              border: `2px solid ${GLOW_COLORS[glow]}`,
            }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0.5, 0], scale: [1, 1.05] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }
);

CherryBubble.displayName = 'CherryBubble';

export default CherryBubble;
