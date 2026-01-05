import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Bot, Zap, Target, TrendingUp } from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';
import { CherryIcon } from '../icons';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'processing' | 'idle' | 'offline';
  tasksCompleted: number;
  currentTask?: string;
  icon: React.ReactNode;
}

const defaultAgents: Agent[] = [
  {
    id: 'cra',
    name: 'CRA Agent',
    type: 'Credit & Revenue Analysis',
    status: 'offline',
    tasksCompleted: 0,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 'mlb',
    name: 'MLB Agent',
    type: 'Market Lead Builder',
    status: 'offline',
    tasksCompleted: 0,
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'fab',
    name: 'FAB Agent',
    type: 'Financial Analysis Bot',
    status: 'offline',
    tasksCompleted: 0,
    icon: <Bot className="w-5 h-5" />,
  },
  {
    id: 'sdb',
    name: 'SDB Agent',
    type: 'Smart Data Builder',
    status: 'offline',
    tasksCompleted: 0,
    icon: <Zap className="w-5 h-5" />,
  },
];

const fetchAgentStatus = async (): Promise<Agent[]> => {
  try {
    const response = await fetch('/api/agents/status');
    if (!response.ok) {
      throw new Error('API not available');
    }
    const data = await response.json();
    // Map API response to Agent format with icons
    return data.map((agent: Omit<Agent, 'icon'>) => ({
      ...agent,
      icon: agent.id === 'cra' ? <TrendingUp className="w-5 h-5" /> :
            agent.id === 'mlb' ? <Target className="w-5 h-5" /> :
            agent.id === 'fab' ? <Bot className="w-5 h-5" /> :
            <Zap className="w-5 h-5" />
    }));
  } catch {
    // Return default offline agents when API is not available
    return defaultAgents;
  }
};

const statusConfig = {
  online: {
    color: 'bg-stem-light',
    text: 'text-stem-light',
    label: 'Online',
    glow: true,
  },
  processing: {
    color: 'bg-cherry-ripe',
    text: 'text-cherry-light',
    label: 'Processing',
    glow: true,
  },
  idle: {
    color: 'bg-amber-500',
    text: 'text-amber-400',
    label: 'Idle',
    glow: false,
  },
  offline: {
    color: 'bg-gray-500',
    text: 'text-gray-400',
    label: 'Offline',
    glow: false,
  },
};

export const AgentStatus = () => {
  const { data: agents = defaultAgents, isLoading } = useQuery({
    queryKey: ['agentStatus'],
    queryFn: fetchAgentStatus,
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 5000,
  });

  const onlineCount = agents.filter(
    (a) => a.status === 'online' || a.status === 'processing'
  ).length;

  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);

  if (isLoading) {
    return (
      <GlowCard glowIntensity="subtle" padding="none">
        <div className="px-5 py-4 border-b border-cherry-ripe/10">
          <div className="h-5 w-24 bg-bark-medium/50 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-bark-medium/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </GlowCard>
    );
  }

  return (
    <GlowCard glowIntensity="subtle" padding="none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cherry-ripe/10">
        <div>
          <h3 className="font-display font-semibold text-white">Agent Status</h3>
          <p className="text-sm text-white/50">
            {onlineCount > 0
              ? `${onlineCount} of ${agents.length} agents active`
              : 'All agents offline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CherryIcon size={24} ripe={onlineCount > 0} animate={onlineCount > 0} />
        </div>
      </div>

      {/* Agent list */}
      <div className="p-4 space-y-3">
        {agents.map((agent, index) => {
          const status = statusConfig[agent.status];

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-bark-medium/50 hover:bg-bark-medium transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${agent.status === 'processing' ? 'bg-cherry-ripe/20 text-cherry-light' : ''}
                ${agent.status === 'online' ? 'bg-stem-light/20 text-stem-light' : ''}
                ${agent.status === 'idle' ? 'bg-amber-500/20 text-amber-400' : ''}
                ${agent.status === 'offline' ? 'bg-gray-500/20 text-gray-400' : ''}
              `}
              >
                {agent.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{agent.name}</p>
                  <span
                    className={`
                    flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                    ${status.text} bg-current/10
                  `}
                  >
                    <motion.span
                      className={`w-1.5 h-1.5 rounded-full ${status.color}`}
                      animate={status.glow ? { opacity: [1, 0.5, 1] } : undefined}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-white/50 truncate">
                  {agent.currentTask || agent.type}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-sm font-mono text-white">
                  {agent.tasksCompleted.toLocaleString()}
                </p>
                <p className="text-xs text-white/40">tasks</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-cherry-ripe/10 bg-bark-dark/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Total tasks completed</span>
          <span className={`font-mono font-medium ${totalTasks > 0 ? 'text-cherry-light' : 'text-white/40'}`}>
            {totalTasks.toLocaleString()}
          </span>
        </div>
      </div>
    </GlowCard>
  );
};

export default AgentStatus;
