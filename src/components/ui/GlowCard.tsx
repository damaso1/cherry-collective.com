import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type GlowIntensity = 'none' | 'subtle' | 'medium' | 'intense';

interface GlowCardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  glowIntensity?: GlowIntensity;
  glowColor?: 'cherry' | 'green' | 'gold' | 'blue';
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const glowStyles: Record<GlowIntensity, string> = {
  none: '',
  subtle: 'shadow-[0_0_10px_rgba(196,30,58,0.2)]',
  medium: 'shadow-[0_0_20px_rgba(196,30,58,0.3),0_0_40px_rgba(196,30,58,0.1)]',
  intense: 'shadow-cherry-glow',
};

const colorGlowStyles: Record<string, Record<GlowIntensity, string>> = {
  cherry: glowStyles,
  green: {
    none: '',
    subtle: 'shadow-[0_0_10px_rgba(50,205,50,0.2)]',
    medium: 'shadow-[0_0_20px_rgba(50,205,50,0.3),0_0_40px_rgba(50,205,50,0.1)]',
    intense: 'shadow-[0_0_20px_rgba(50,205,50,0.6),0_0_40px_rgba(50,205,50,0.4)]',
  },
  gold: {
    none: '',
    subtle: 'shadow-[0_0_10px_rgba(255,215,0,0.2)]',
    medium: 'shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.1)]',
    intense: 'shadow-[0_0_20px_rgba(255,215,0,0.6),0_0_40px_rgba(255,215,0,0.4)]',
  },
  blue: {
    none: '',
    subtle: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    medium: 'shadow-[0_0_20px_rgba(59,130,246,0.3),0_0_40px_rgba(59,130,246,0.1)]',
    intense: 'shadow-[0_0_20px_rgba(59,130,246,0.6),0_0_40px_rgba(59,130,246,0.4)]',
  },
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      glowIntensity = 'subtle',
      glowColor = 'cherry',
      glass = true,
      hover = true,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const glowClass = colorGlowStyles[glowColor]?.[glowIntensity] || glowStyles[glowIntensity];

    return (
      <motion.div
        ref={ref}
        className={`
          relative rounded-xl overflow-hidden
          ${glass ? 'glass' : 'bg-bark-medium'}
          ${glowClass}
          ${paddingStyles[padding]}
          transition-all duration-300
          ${className}
        `}
        whileHover={hover ? {
          scale: 1.01,
          boxShadow: glowIntensity !== 'none' ? colorGlowStyles[glowColor]?.intense : undefined
        } : undefined}
        {...props}
      >
        {/* Border gradient */}
        <div className="absolute inset-0 rounded-xl border border-cherry-ripe/20 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

GlowCard.displayName = 'GlowCard';

export default GlowCard;
