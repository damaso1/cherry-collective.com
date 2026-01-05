import { motion } from 'framer-motion';
import { GlowCard } from './GlowCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ChartCardProps {
  title: string;
  value: React.ReactNode;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  glowIntensity?: 'none' | 'subtle' | 'medium' | 'intense';
}

export const ChartCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  children,
  className = '',
  glowIntensity = 'subtle',
}: ChartCardProps) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <GlowCard
      glowIntensity={glowIntensity}
      padding="lg"
      className={className}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-white/60 font-medium mb-1">{title}</p>
          <motion.h3
            className="text-3xl font-display font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {value}
          </motion.h3>

          {/* Change indicator */}
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-stem-light" />
              ) : isNegative ? (
                <TrendingDown className="w-4 h-4 text-cherry-light" />
              ) : (
                <Minus className="w-4 h-4 text-white/40" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? 'text-stem-light'
                    : isNegative
                    ? 'text-cherry-light'
                    : 'text-white/40'
                }`}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-white/40">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className="p-3 rounded-xl bg-cherry-ripe/10 border border-cherry-ripe/20">
            {icon}
          </div>
        )}
      </div>

      {/* Chart content */}
      {children && <div className="mt-4">{children}</div>}
    </GlowCard>
  );
};

// Stat Card - Simpler version without chart
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard = ({
  label,
  value,
  subValue,
  icon,
  trend,
  trendValue,
  className = '',
  onClick,
}: StatCardProps) => {
  return (
    <GlowCard
      glowIntensity="subtle"
      padding="md"
      className={`${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="p-3 rounded-xl bg-cherry-ripe/10 border border-cherry-ripe/20">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/60 truncate">{label}</p>
          <p className="text-2xl font-display font-bold text-white truncate">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-white/40 truncate">{subValue}</p>
          )}
        </div>
        {trend && (
          <div
            className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend === 'up' ? 'bg-stem-light/10 text-stem-light' : ''}
            ${trend === 'down' ? 'bg-cherry-ripe/10 text-cherry-light' : ''}
            ${trend === 'neutral' ? 'bg-white/5 text-white/40' : ''}
          `}
          >
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
    </GlowCard>
  );
};

export default ChartCard;
