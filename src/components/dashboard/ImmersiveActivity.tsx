import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Activity, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { CherryBubble } from '../cherry/CherryBubble';

interface FeedItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  details?: string;
  timestamp: Date;
  agent?: string;
}

const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const fetchActivityFeed = async (): Promise<FeedItem[]> => {
  try {
    const response = await fetch(`${BILLING_API_URL}/api/dashboard/stats`);
    if (!response.ok) throw new Error('API not available');
    const data = await response.json();
    return (data.recentTransactions || []).map((tx: { email: string; amount: number; type: string; date: string }, index: number) => ({
      id: `tx-${index}-${Date.now()}`,
      type: tx.type === 'subscription' ? 'success' : 'info',
      message: `Payment received: $${tx.amount.toFixed(2)} AUD`,
      details: `${tx.email} - ${tx.type}`,
      timestamp: tx.date ? new Date(tx.date) : new Date(),
      agent: 'BILLING',
    }));
  } catch {
    return [];
  }
};

const getIcon = (type: string, agent?: string) => {
  if (agent === 'BILLING') return <DollarSign className="w-4 h-4" />;
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4" />;
    case 'warning': return <AlertCircle className="w-4 h-4" />;
    case 'error': return <AlertCircle className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const typeColors = {
  success: {
    bg: 'bg-stem-light/20',
    text: 'text-stem-light',
    border: 'border-stem-light/30',
  },
  info: {
    bg: 'bg-blue-400/20',
    text: 'text-blue-400',
    border: 'border-blue-400/30',
  },
  warning: {
    bg: 'bg-gold/20',
    text: 'text-gold',
    border: 'border-gold/30',
  },
  error: {
    bg: 'bg-cherry-ripe/20',
    text: 'text-cherry-light',
    border: 'border-cherry-ripe/30',
  },
};

interface ActivityItemProps {
  item: FeedItem;
  index: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item, index }) => {
  const colors = typeColors[item.type];
  const timeAgo = getTimeAgo(item.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300 }}
      className={`
        flex items-start gap-3 p-3 rounded-xl border
        ${colors.bg} ${colors.border}
        hover:scale-[1.02] transition-transform cursor-pointer
      `}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text}`}>
        {getIcon(item.type, item.agent)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white truncate">{item.message}</p>
          {item.agent && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-bark-medium text-white/50">
              {item.agent}
            </span>
          )}
        </div>
        {item.details && (
          <p className="text-xs text-white/40 truncate mt-0.5">{item.details}</p>
        )}
      </div>

      {/* Timestamp */}
      <span className="text-xs text-white/30 flex-shrink-0">{timeAgo}</span>
    </motion.div>
  );
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export const ImmersiveActivity: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: feedItems = [], isLoading } = useQuery({
    queryKey: ['activityFeed'],
    queryFn: fetchActivityFeed,
    refetchInterval: 10000,
    staleTime: 5000,
  });

  // Auto-scroll to bottom when new items arrive
  useEffect(() => {
    if (scrollRef.current && feedItems.length > 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [feedItems.length]);

  const isLive = feedItems.length > 0;

  if (isLoading) {
    return (
      <CherryBubble variant="organic" size="lg" glow="green" magnetic={false}>
        <div className="space-y-3">
          <div className="h-6 w-32 bg-bark-medium/30 rounded-full animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-bark-medium/20 rounded-xl animate-pulse" />
          ))}
        </div>
      </CherryBubble>
    );
  }

  return (
    <CherryBubble variant="organic" size="lg" glow={isLive ? 'green' : 'none'} magnetic={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-white">Activity Feed</h3>
          <p className="text-xs text-white/50">
            {feedItems.length > 0 ? 'Real-time updates' : 'Waiting for activity'}
          </p>
        </div>

        {/* Live indicator */}
        {isLive ? (
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-stem-light/10 border border-stem-light/20"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-stem-light"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-stem-light">Live</span>
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-xs font-medium text-white/30">Idle</span>
          </div>
        )}
      </div>

      {/* Feed content */}
      {feedItems.length > 0 ? (
        <div
          ref={scrollRef}
          className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stem-light/30 scrollbar-track-transparent"
        >
          <AnimatePresence mode="popLayout">
            {feedItems.slice(0, 20).map((item, index) => (
              <ActivityItem key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-14 h-14 rounded-full bg-bark-medium/30 flex items-center justify-center mb-4">
            <Activity className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No recent activity</p>
          <p className="text-xs text-white/20 mt-1">Updates will bloom here in real-time</p>
        </div>
      )}

      {/* Decorative pulse at bottom when live */}
      {isLive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stem-light/50 to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </CherryBubble>
  );
};

export default ImmersiveActivity;
