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
import { StatCard } from '../ui/ChartCard';
import { MoneyCounter, AnimatedCounter } from '../ui/AnimatedCounter';

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
    // Map API response to dashboard format
    return {
      totalRevenue: data.totalRevenue || 0,
      leadsPicked: data.totalLeads || 0,
      inBasket: data.ripeLeads || 0,
      conversionRate: data.totalLeads > 0 ? (data.ripeLeads / data.totalLeads) * 100 : 0,
      activeAgents: data.agentsActive || 0,
      teamMembers: 1,
    };
  } catch {
    // Return zeros when API is not available
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const StatsOverview = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });

  const statCards = [
    {
      label: 'Total Revenue',
      value: stats?.totalRevenue ?? 0,
      format: 'money' as const,
      icon: <DollarSign className="w-5 h-5 text-stem-light" />,
      trend: stats?.totalRevenue ? ('up' as const) : ('neutral' as const),
      trendValue: stats?.totalRevenue ? '' : 'No sales yet',
    },
    {
      label: 'Leads Picked',
      value: stats?.leadsPicked ?? 0,
      format: 'number' as const,
      icon: <Target className="w-5 h-5 text-cherry-light" />,
      trend: stats?.leadsPicked ? ('up' as const) : ('neutral' as const),
      trendValue: stats?.leadsPicked ? '' : 'Start picking',
    },
    {
      label: 'In Basket',
      value: stats?.inBasket ?? 0,
      format: 'number' as const,
      icon: <ShoppingBasket className="w-5 h-5 text-amber-400" />,
      trend: 'neutral' as const,
      trendValue: '',
    },
    {
      label: 'Conversion Rate',
      value: stats?.conversionRate ?? 0,
      format: 'percent' as const,
      icon: <TrendingUp className="w-5 h-5 text-stem-light" />,
      trend: stats?.conversionRate ? ('up' as const) : ('neutral' as const),
      trendValue: stats?.conversionRate ? '' : 'N/A',
    },
    {
      label: 'Active Agents',
      value: stats?.activeAgents ?? 0,
      format: 'number' as const,
      icon: <Zap className="w-5 h-5 text-gold" />,
      trend: stats?.activeAgents ? ('up' as const) : ('neutral' as const),
      trendValue: stats?.activeAgents ? 'Online' : 'Offline',
    },
    {
      label: 'Team Members',
      value: stats?.teamMembers ?? 1,
      format: 'number' as const,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      trend: 'neutral' as const,
      trendValue: '',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-bark-medium/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const hasNoData = !stats?.totalRevenue && !stats?.leadsPicked;

  return (
    <div>
      {hasNoData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-200">
            No transactions yet. Stats will update as you process leads and receive payments.
          </p>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatCard
              label={stat.label}
              value={
                stat.format === 'money' ? (
                  <MoneyCounter value={stat.value} duration={2} />
                ) : stat.format === 'percent' ? (
                  <AnimatedCounter value={stat.value} suffix="%" decimals={1} duration={1.5} />
                ) : (
                  <AnimatedCounter value={stat.value} duration={1.5} />
                )
              }
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsOverview;
