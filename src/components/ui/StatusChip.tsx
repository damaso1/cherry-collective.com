import { motion } from 'framer-motion';
import { CherryIcon } from '../icons';

type Status = 'ripe' | 'growing' | 'picked' | 'rotten' | 'pending';

interface StatusChipProps {
  status: Status;
  showIcon?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<Status, {
  label: string;
  bg: string;
  text: string;
  border: string;
  glow: string;
}> = {
  ripe: {
    label: 'Ripe',
    bg: 'bg-cherry-ripe/20',
    text: 'text-cherry-light',
    border: 'border-cherry-ripe/40',
    glow: 'shadow-[0_0_10px_rgba(196,30,58,0.3)]',
  },
  growing: {
    label: 'Growing',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
  },
  picked: {
    label: 'Picked',
    bg: 'bg-stem-light/20',
    text: 'text-stem-light',
    border: 'border-stem-light/40',
    glow: 'shadow-[0_0_10px_rgba(50,205,50,0.3)]',
  },
  rotten: {
    label: 'Rotten',
    bg: 'bg-red-900/20',
    text: 'text-red-400',
    border: 'border-red-900/40',
    glow: '',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-gray-500/20',
    text: 'text-gray-400',
    border: 'border-gray-500/40',
    glow: '',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
};

export const StatusChip = ({
  status,
  showIcon = true,
  pulse = false,
  size = 'md',
  className = '',
}: StatusChipProps) => {
  const config = statusConfig[status];

  return (
    <motion.span
      className={`
        inline-flex items-center rounded-full font-medium
        border transition-all duration-200
        ${config.bg} ${config.text} ${config.border}
        ${pulse && status === 'ripe' ? config.glow : ''}
        ${sizeStyles[size]}
        ${className}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      {showIcon && (
        <span className="flex-shrink-0">
          {status === 'ripe' || status === 'growing' ? (
            <CherryIcon
              size={size === 'sm' ? 12 : 16}
              ripe={status === 'ripe'}
              animate={pulse}
            />
          ) : (
            <span
              className={`
                inline-block rounded-full
                ${size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}
                ${status === 'picked' ? 'bg-stem-light' :
                  status === 'rotten' ? 'bg-red-500' : 'bg-gray-500'}
              `}
            />
          )}
        </span>
      )}
      {config.label}
    </motion.span>
  );
};

export default StatusChip;
