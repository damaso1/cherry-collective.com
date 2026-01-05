import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Bot, Zap, Target, TrendingUp } from 'lucide-react';
import { CherryBubble } from '../cherry/CherryBubble';
import { MagneticElement } from '../effects/MagneticElement';
import { CherryIcon } from '../icons';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'processing' | 'idle' | 'offline';
  tasksCompleted: number;
  currentTask?: string;
}

const defaultAgents: Agent[] = [
  { id: 'cra', name: 'CRA', type: 'Credit & Revenue Analysis', status: 'offline', tasksCompleted: 0 },
  { id: 'mlb', name: 'MLB', type: 'Market Lead Builder', status: 'offline', tasksCompleted: 0 },
  { id: 'fab', name: 'FAB', type: 'Financial Analysis Bot', status: 'offline', tasksCompleted: 0 },
  { id: 'sdb', name: 'SDB', type: 'Smart Data Builder', status: 'offline', tasksCompleted: 0 },
];

const fetchAgentStatus = async (): Promise<Agent[]> => {
  try {
    const response = await fetch('/api/agents/status');
    if (!response.ok) throw new Error('API not available');
    return await response.json();
  } catch {
    return defaultAgents;
  }
};

const statusConfig = {
  online: { color: 'green' as const, pulse: true, label: 'Online' },
  processing: { color: 'cherry' as const, pulse: true, label: 'Processing' },
  idle: { color: 'gold' as const, pulse: false, label: 'Idle' },
  offline: { color: 'none' as const, pulse: false, label: 'Offline' },
};

const getAgentIcon = (id: string) => {
  switch (id) {
    case 'cra': return <TrendingUp className="w-5 h-5" />;
    case 'mlb': return <Target className="w-5 h-5" />;
    case 'fab': return <Bot className="w-5 h-5" />;
    case 'sdb': return <Zap className="w-5 h-5" />;
    default: return <Bot className="w-5 h-5" />;
  }
};

interface AgentBubbleProps {
  agent: Agent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentBubble: React.FC<AgentBubbleProps> = ({ agent, index, isSelected, onSelect }) => {
  const config = statusConfig[agent.status];
  const isActive = agent.status === 'online' || agent.status === 'processing';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
    >
      <MagneticElement
        strength={0.3}
        distance={80}
        glowColor={
          config.color === 'cherry' ? 'rgba(196, 30, 58, 0.5)' :
          config.color === 'green' ? 'rgba(50, 205, 50, 0.5)' :
          config.color === 'gold' ? 'rgba(255, 215, 0, 0.5)' :
          'rgba(100, 100, 100, 0.3)'
        }
        onClick={onSelect}
      >
        <CherryBubble
          variant="cherry"
          size="sm"
          glow={config.color}
          hover
          className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-white/30' : ''}`}
        >
          <div className="flex flex-col items-center text-center">
            {/* Status indicator */}
            <div className="relative mb-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isActive ? 'bg-white/10' : 'bg-white/5'}
                ${agent.status === 'processing' ? 'text-cherry-light' : ''}
                ${agent.status === 'online' ? 'text-stem-light' : ''}
                ${agent.status === 'idle' ? 'text-gold' : ''}
                ${agent.status === 'offline' ? 'text-white/30' : ''}
              `}>
                {getAgentIcon(agent.id)}
              </div>

              {/* Pulse indicator */}
              {config.pulse && (
                <motion.div
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full
                    ${agent.status === 'processing' ? 'bg-cherry-ripe' : 'bg-stem-light'}
                  `}
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </div>

            {/* Agent name */}
            <p className="text-sm font-bold text-white">{agent.name}</p>
            <p className={`text-xs ${isActive ? 'text-white/60' : 'text-white/30'}`}>
              {config.label}
            </p>
          </div>
        </CherryBubble>
      </MagneticElement>
    </motion.div>
  );
};

export const ImmersiveAgents: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { data: agents = defaultAgents, isLoading } = useQuery({
    queryKey: ['agentStatus'],
    queryFn: fetchAgentStatus,
    refetchInterval: 15000,
    staleTime: 5000,
  });

  const onlineCount = agents.filter(a => a.status === 'online' || a.status === 'processing').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const selected = agents.find(a => a.id === selectedAgent);

  if (isLoading) {
    return (
      <CherryBubble variant="organic" size="lg" glow="cherry">
        <div className="flex flex-wrap justify-center gap-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-20 h-24 rounded-[40%_60%_55%_45%/60%_40%_60%_40%] bg-bark-medium/30"
            />
          ))}
        </div>
      </CherryBubble>
    );
  }

  return (
    <CherryBubble variant="organic" size="xl" glow="cherry" magnetic={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-display font-bold text-white">Agent Orchard</h3>
          <p className="text-sm text-white/50">
            {onlineCount > 0 ? `${onlineCount} active` : 'All agents resting'}
          </p>
        </div>
        <CherryIcon size={24} ripe={onlineCount > 0} animate={onlineCount > 0} />
      </div>

      {/* Agent bubbles in a circular/organic layout */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {agents.map((agent, index) => (
          <AgentBubble
            key={agent.id}
            agent={agent}
            index={index}
            isSelected={selectedAgent === agent.id}
            onSelect={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          />
        ))}
      </div>

      {/* Selected agent details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-4 mt-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{selected.name} Agent</p>
                <p className="text-xs text-white/50">{selected.type}</p>
                {selected.currentTask && (
                  <p className="text-xs text-cherry-light mt-1">
                    Current: {selected.currentTask}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-white">
                  {selected.tasksCompleted.toLocaleString()}
                </p>
                <p className="text-xs text-white/40">tasks completed</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
        <span className="text-sm text-white/50">Total harvested</span>
        <span className={`text-sm font-mono font-bold ${totalTasks > 0 ? 'text-cherry-light' : 'text-white/30'}`}>
          {totalTasks.toLocaleString()} tasks
        </span>
      </div>
    </CherryBubble>
  );
};

export default ImmersiveAgents;
