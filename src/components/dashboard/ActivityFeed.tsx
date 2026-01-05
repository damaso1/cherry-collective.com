import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import { TerminalFeed } from '../ui/TerminalFeed';
import type { FeedItem } from '../ui/TerminalFeed';
import { GlowCard } from '../ui/GlowCard';

// Billing API URL
const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const fetchActivityFeed = async (): Promise<FeedItem[]> => {
  try {
    const response = await fetch(`${BILLING_API_URL}/api/dashboard/stats`);
    if (!response.ok) {
      throw new Error('API not available');
    }
    const data = await response.json();
    // Convert recent transactions to feed items
    return (data.recentTransactions || []).map((tx: { email: string; amount: number; type: string; date: string }, index: number) => ({
      id: `tx-${index}-${Date.now()}`,
      type: tx.type === 'subscription' ? 'success' : 'info',
      message: `Payment received: $${tx.amount.toFixed(2)} AUD`,
      details: `${tx.email} - ${tx.type}`,
      timestamp: tx.date ? new Date(tx.date) : new Date(),
      agent: 'BILLING',
    }));
  } catch {
    // Return empty array when API is not available
    return [];
  }
};

interface ActivityFeedProps {
  onItemClick?: (item: FeedItem) => void;
}

export const ActivityFeed = ({ onItemClick }: ActivityFeedProps) => {
  const { data: feedItems = [], isLoading } = useQuery({
    queryKey: ['activityFeed'],
    queryFn: fetchActivityFeed,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
  });

  if (isLoading) {
    return (
      <GlowCard glowIntensity="subtle" padding="none" className="overflow-hidden">
        <div className="px-4 py-3 border-b border-cherry-ripe/10 bg-bark-dark/50">
          <div className="h-5 w-24 bg-bark-medium/50 rounded animate-pulse" />
        </div>
        <div className="h-[400px] p-4 space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 bg-bark-medium/30 rounded animate-pulse" />
          ))}
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glowIntensity="subtle" padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cherry-ripe/10 bg-bark-dark/50">
        <div>
          <h3 className="font-display font-semibold text-white">
            Activity Feed
          </h3>
          <p className="text-xs text-white/50">
            {feedItems.length > 0 ? 'Real-time agent activity' : 'Waiting for activity'}
          </p>
        </div>
        {feedItems.length > 0 ? (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-stem-light/10 border border-stem-light/20"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-stem-light" />
            <span className="text-xs font-medium text-stem-light">Live</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-xs font-medium text-gray-400">Idle</span>
          </div>
        )}
      </div>

      {/* Terminal feed or empty state */}
      {feedItems.length > 0 ? (
        <TerminalFeed
          items={feedItems}
          maxItems={20}
          autoScroll
          showTimestamp
          className="h-[400px]"
          onItemClick={onItemClick}
        />
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center px-6">
          <div className="w-12 h-12 rounded-full bg-bark-medium/50 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-white/30" />
          </div>
          <p className="text-sm text-white/50 text-center">
            No recent activity
          </p>
          <p className="text-xs text-white/30 text-center mt-1">
            Agent activity will appear here in real-time
          </p>
        </div>
      )}
    </GlowCard>
  );
};

export default ActivityFeed;
