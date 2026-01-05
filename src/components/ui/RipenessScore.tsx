import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface RipenessScoreProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 60, stroke: 4, fontSize: 'text-xs' },
  md: { width: 80, stroke: 5, fontSize: 'text-sm' },
  lg: { width: 120, stroke: 6, fontSize: 'text-lg' },
};

const getScoreColor = (score: number) => {
  if (score >= 80) return { color: '#C41E3A', glow: 'rgba(196,30,58,0.5)', label: 'Ripe' };
  if (score >= 60) return { color: '#FFB347', glow: 'rgba(255,179,71,0.5)', label: 'Growing' };
  if (score >= 40) return { color: '#32CD32', glow: 'rgba(50,205,50,0.5)', label: 'Fresh' };
  return { color: '#FFD4D4', glow: 'rgba(255,212,212,0.3)', label: 'Unripe' };
};

export const RipenessScore = ({
  score,
  size = 'md',
  showLabel = true,
  animate = true,
  className = '',
}: RipenessScoreProps) => {
  const config = sizeConfig[size];
  const { color, glow, label } = getScoreColor(score);

  const circumference = useMemo(() => {
    const radius = (config.width - config.stroke) / 2;
    return 2 * Math.PI * radius;
  }, [config]);

  const strokeDashoffset = useMemo(() => {
    return circumference - (score / 100) * circumference;
  }, [circumference, score]);

  const radius = (config.width - config.stroke) / 2;
  const center = config.width / 2;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-md opacity-50"
          style={{ backgroundColor: glow }}
        />

        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={config.stroke}
          />

          {/* Progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold ${config.fontSize}`}
            style={{ color }}
            initial={animate ? { opacity: 0, scale: 0.5 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(score)}
          </motion.span>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <motion.span
          className={`mt-2 ${config.fontSize} font-medium`}
          style={{ color }}
          initial={animate ? { opacity: 0, y: 10 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
};

export default RipenessScore;
