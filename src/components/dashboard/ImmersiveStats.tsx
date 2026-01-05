import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  Target,
  ShoppingBasket,
  Zap,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react';
import { CherryBubble } from '../cherry/CherryBubble';
import { MagneticElement } from '../effects/MagneticElement';
import { MoneyCounter, AnimatedCounter } from '../ui/AnimatedCounter';
import type { GlowColor } from '../cherry/CherryBubble';

interface DashboardStats {
  totalRevenue: number;
  leadsPicked: number;
  inBasket: number;
  conversionRate: number;
  activeAgents: number;
  teamMembers: number;
}

// Billing API URL
const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${BILLING_API_URL}/api/dashboard/stats`);
    if (!response.ok) {
      throw new Error('API not available');
    }
    const data = await response.json();
    return {
      totalRevenue: data.totalRevenue || 0,
      leadsPicked: data.totalLeads || 0,
      inBasket: data.ripeLeads || 0,
      conversionRate: data.totalLeads > 0 ? (data.ripeLeads / data.totalLeads) * 100 : 0,
      activeAgents: data.agentsActive || 0,
      teamMembers: 1,
    };
  } catch {
    return {
      totalRevenue: 0,
      leadsPicked: 0,
      inBasket: 0,
      conversionRate: 0,
      activeAgents: 0,
      teamMembers: 0,
    };
  }
};

interface StatBubbleProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  glow: GlowColor;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StatBubble: React.FC<StatBubbleProps> = ({
  label,
  value,
  icon,
  glow,
  delay = 0,
  size = 'md',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
    >
      <MagneticElement
        strength={0.25}
        distance={100}
        glowColor={
          glow === 'cherry' ? 'rgba(196, 30, 58, 0.4)' :
          glow === 'green' ? 'rgba(50, 205, 50, 0.4)' :
          glow === 'gold' ? 'rgba(255, 215, 0, 0.4)' :
          'rgba(100, 149, 237, 0.4)'
        }
      >
        <CherryBubble
          variant="organic"
          size={size}
          glow={glow}
          hover
          className="text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${glow === 'cherry' ? 'bg-cherry-ripe/20 text-cherry-light' : ''}
              ${glow === 'green' ? 'bg-stem-light/20 text-stem-light' : ''}
              ${glow === 'gold' ? 'bg-gold/20 text-gold' : ''}
              ${glow === 'blue' ? 'bg-blue-400/20 text-blue-400' : ''}
            `}>
              {icon}
            </div>
          </div>

          {/* Value */}
          <div className="text-2xl font-display font-bold text-white mb-1">
            {value}
          </div>

          {/* Label */}
          <div className="text-xs text-white/60 uppercase tracking-wider">
            {label}
          </div>
        </CherryBubble>
      </MagneticElement>
    </motion.div>
  );
};

export const ImmersiveStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const hasNoData = !stats?.totalRevenue && !stats?.leadsPicked;

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="w-36 h-28 rounded-[40%_60%_55%_45%/60%_40%_60%_40%] bg-bark-medium/30"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* No data warning */}
      {hasNoData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent
                     border border-amber-500/20 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-sm text-amber-200">
            Your orchard is waiting to bloom. Stats will flourish as leads ripen and payments flow.
          </p>
        </motion.div>
      )}

      {/* Stats cluster - organic layout */}
      <div className="relative flex flex-wrap justify-center gap-4 md:gap-6">
        {/* Revenue - Large center bubble */}
        <StatBubble
          label="Total Revenue"
          value={<MoneyCounter value={stats?.totalRevenue ?? 0} duration={2} />}
          icon={<DollarSign className="w-5 h-5" />}
          glow="green"
          delay={0}
          size="lg"
        />

        {/* Row of smaller bubbles */}
        <div className="flex flex-wrap justify-center gap-4">
          <StatBubble
            label="Leads Picked"
            value={<AnimatedCounter value={stats?.leadsPicked ?? 0} duration={1.5} />}
            icon={<Target className="w-5 h-5" />}
            glow="cherry"
            delay={0.1}
          />

          <StatBubble
            label="In Basket"
            value={<AnimatedCounter value={stats?.inBasket ?? 0} duration={1.5} />}
            icon={<ShoppingBasket className="w-5 h-5" />}
            glow="gold"
            delay={0.15}
          />

          <StatBubble
            label="Conversion"
            value={<AnimatedCounter value={stats?.conversionRate ?? 0} suffix="%" decimals={1} duration={1.5} />}
            icon={<TrendingUp className="w-5 h-5" />}
            glow="green"
            delay={0.2}
          />

          <StatBubble
            label="Active Agents"
            value={<AnimatedCounter value={stats?.activeAgents ?? 0} duration={1.5} />}
            icon={<Zap className="w-5 h-5" />}
            glow="cherry"
            delay={0.25}
          />

          <StatBubble
            label="Team"
            value={<AnimatedCounter value={stats?.teamMembers ?? 0} duration={1.5} />}
            icon={<Users className="w-5 h-5" />}
            glow="blue"
            delay={0.3}
          />
        </div>
      </div>

      {/* Decorative connecting lines (stems) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: -1 }}>
        <defs>
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a7c59" stopOpacity="0" />
            <stop offset="50%" stopColor="#4a7c59" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4a7c59" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ImmersiveStats;
