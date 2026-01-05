import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useMouse, useCursor } from '../providers/ImmersiveProvider';

interface CherryCursorProps {
  color?: string;
  size?: number;
  trailEnabled?: boolean;
}

export const CherryCursor: React.FC<CherryCursorProps> = ({
  color = '#C41E3A',
  size = 24,
  trailEnabled = true,
}) => {
  const { x, y, isMoving } = useMouse();
  const { variant, scale } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none';

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Show cursor after a brief delay
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  // Smooth cursor follow with GSAP
  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      x: x - size / 2,
      y: y - size / 2,
      duration: 0.15,
      ease: 'power2.out',
    });
  }, [x, y, size]);

  // Inner cherry movement with more lag
  useEffect(() => {
    if (!innerRef.current) return;

    gsap.to(innerRef.current, {
      x: x - size / 2,
      y: y - size / 2,
      duration: 0.3,
      ease: 'power3.out',
    });
  }, [x, y, size]);

  // Scale animation based on cursor variant
  useEffect(() => {
    if (!cursorRef.current) return;

    const scaleValue = variant === 'pointer' ? 1.5 : variant === 'text' ? 0.5 : 1;

    gsap.to(cursorRef.current, {
      scale: scaleValue * scale,
      duration: 0.2,
      ease: 'back.out(1.7)',
    });
  }, [variant, scale]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cherry cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ width: size, height: size }}
      >
        {/* Cherry body */}
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className="drop-shadow-lg"
        >
          {/* Stem */}
          <path
            d="M12 2 C12 2 14 4 14 6 C14 8 12 9 12 9"
            stroke="#228B22"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className={isMoving ? 'animate-stem-sway origin-bottom' : ''}
          />
          {/* Leaf */}
          <ellipse
            cx="15"
            cy="5"
            rx="3"
            ry="1.5"
            fill="#32CD32"
            transform="rotate(-30 15 5)"
            className={isMoving ? 'animate-leaf-flutter' : ''}
          />
          {/* Cherry body - gradient */}
          <defs>
            <radialGradient id="cherryGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="#8B0000" />
            </radialGradient>
          </defs>
          <circle
            cx="12"
            cy="15"
            r="7"
            fill="url(#cherryGrad)"
          />
          {/* Shine highlight */}
          <ellipse
            cx="9"
            cy="13"
            rx="2"
            ry="1.5"
            fill="rgba(255,255,255,0.4)"
            transform="rotate(-30 9 13)"
          />
        </svg>
      </div>

      {/* Trail cursor (lagged inner) */}
      {trailEnabled && (
        <div
          ref={innerRef}
          className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-40"
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <circle
              cx="12"
              cy="15"
              r="7"
              fill={color}
              opacity="0.5"
            />
          </svg>
        </div>
      )}

      {/* Glow effect */}
      <div
        className="fixed pointer-events-none z-[9997] rounded-full blur-xl opacity-30 transition-opacity duration-300"
        style={{
          left: x - 30,
          top: y - 30,
          width: 60,
          height: 60,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: isMoving ? 0.4 : 0.2,
        }}
      />
    </>
  );
};

export default CherryCursor;
