import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Circle, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

export interface FeedItem {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error' | 'processing';
  message: string;
  details?: string;
  leadId?: string;
  score?: number;
}

interface TerminalFeedProps {
  items: FeedItem[];
  maxItems?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  className?: string;
  onItemClick?: (item: FeedItem) => void;
}

const typeConfig = {
  info: {
    icon: Circle,
    color: 'text-blue-400',
    prefix: 'INFO',
  },
  success: {
    icon: CheckCircle,
    color: 'text-stem-light',
    prefix: 'PICK',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-amber-400',
    prefix: 'WARN',
  },
  error: {
    icon: AlertCircle,
    color: 'text-cherry-light',
    prefix: 'ERR!',
  },
  processing: {
    icon: Zap,
    color: 'text-cherry-ripe',
    prefix: 'PROC',
  },
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const TerminalFeed = ({
  items,
  maxItems = 50,
  autoScroll = true,
  showTimestamp = true,
  className = '',
  onItemClick,
}: TerminalFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayItems = items.slice(-maxItems);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [items, autoScroll]);

  return (
    <div
      ref={containerRef}
      className={`
        terminal overflow-y-auto p-4 font-mono text-sm
        bg-black/80 backdrop-blur-sm
        ${className}
      `}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cherry-ripe/20">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cherry-ripe" />
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="w-3 h-3 rounded-full bg-stem-light" />
        </div>
        <span className="text-white/40 text-xs ml-2">cherry-feed</span>
        <div className="ml-auto flex items-center gap-1 text-xs text-white/30">
          <Clock className="w-3 h-3" />
          <span>Live</span>
          <motion.span
            className="w-2 h-2 rounded-full bg-stem-light ml-1"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Feed items */}
      <AnimatePresence mode="popLayout">
        {displayItems.map((item, index) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={`
                terminal-line py-1.5 flex items-start gap-3
                ${onItemClick ? 'cursor-pointer hover:bg-cherry-ripe/5 rounded px-2 -mx-2' : ''}
                ${index !== displayItems.length - 1 ? 'border-b border-white/5' : ''}
              `}
              onClick={() => onItemClick?.(item)}
            >
              {/* Timestamp */}
              {showTimestamp && (
                <span className="terminal-timestamp flex-shrink-0 w-20">
                  [{formatTime(item.timestamp)}]
                </span>
              )}

              {/* Type prefix */}
              <span className={`flex-shrink-0 ${config.color} font-bold w-12`}>
                {config.prefix}
              </span>

              {/* Icon */}
              <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.color}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="text-white/90">{item.message}</span>
                {item.details && (
                  <span className="text-white/40 ml-2">— {item.details}</span>
                )}
                {item.score !== undefined && (
                  <span className={`ml-2 ${item.score >= 80 ? 'text-cherry-light' : item.score >= 60 ? 'text-amber-400' : 'text-white/50'}`}>
                    [{item.score}%]
                  </span>
                )}
              </div>

              {/* Lead ID */}
              {item.leadId && (
                <span className="flex-shrink-0 text-xs text-cherry-ripe/60 font-mono">
                  #{item.leadId.slice(0, 8)}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Cursor */}
      <motion.div
        className="flex items-center gap-2 mt-2 text-cherry-light"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <span className="text-stem-light">$</span>
        <span className="w-2 h-4 bg-cherry-light" />
      </motion.div>
    </div>
  );
};

export default TerminalFeed;
