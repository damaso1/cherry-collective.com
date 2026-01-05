import { motion } from 'framer-motion';
import { CherryIcon } from '../icons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'cherry' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: { spinner: 20, cherry: 24 },
  md: { spinner: 32, cherry: 40 },
  lg: { spinner: 48, cherry: 64 },
};

export const LoadingSpinner = ({
  size = 'md',
  variant = 'spinner',
  className = '',
  text,
}: LoadingSpinnerProps) => {
  const sizes = sizeMap[size];

  if (variant === 'cherry') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CherryIcon size={sizes.cherry} ripe animate />
        </motion.div>
        {text && (
          <span className="text-sm text-white/60 animate-pulse">{text}</span>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-cherry-ripe"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
        {text && <span className="ml-2 text-sm text-white/60">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <motion.div
          className="rounded-full bg-cherry-ripe/20"
          style={{ width: sizes.spinner, height: sizes.spinner }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-cherry-ripe/40 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full bg-cherry-ripe" />
          </div>
        </motion.div>
        {text && <span className="text-sm text-white/60">{text}</span>}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <motion.div
        style={{ width: sizes.spinner, height: sizes.spinner }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="rgba(196,30,58,0.2)"
            strokeWidth="3"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="#C41E3A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      {text && <span className="text-sm text-white/60">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
