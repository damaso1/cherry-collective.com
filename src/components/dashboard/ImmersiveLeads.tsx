import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Plus, Search, Target, ChevronDown } from 'lucide-react';
import { CherryBubble } from '../cherry/CherryBubble';
import { MagneticElement } from '../effects/MagneticElement';
import { RipenessScore } from '../ui/RipenessScore';
import { StatusChip } from '../ui/StatusChip';

interface Lead {
  id: string;
  company: string;
  industry: string;
  score: number;
  status: 'ripe' | 'growing' | 'picked' | 'rotten' | 'pending';
  revenue: string;
  employees: string;
  location: string;
  lastActivity: string;
}

const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${BILLING_API_URL}/api/leads`);
    if (!response.ok) throw new Error('API not available');
    const data = await response.json();
    return data.map((lead: Lead & { lastActivity?: string }) => ({
      ...lead,
      lastActivity: lead.lastActivity
        ? new Date(lead.lastActivity).toLocaleDateString('en-AU', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })
        : 'Just now',
    }));
  } catch {
    return [];
  }
};

interface LeadRowProps {
  lead: Lead;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead, index, isExpanded, onToggle, onNavigate }) => {
  const isRipe = lead.score >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <MagneticElement
        strength={0.1}
        distance={60}
        glow={false}
        sound={false}
      >
        <motion.div
          className={`
            relative p-4 rounded-2xl cursor-pointer transition-all duration-300
            ${isRipe ? 'bg-cherry-ripe/10 border border-cherry-ripe/20' : 'bg-bark-medium/30 border border-white/5'}
            hover:bg-bark-medium/50 hover:border-cherry-ripe/30
          `}
          onClick={onToggle}
          whileHover={{ scale: 1.01 }}
        >
          {/* Ripe glow effect */}
          {isRipe && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cherry-ripe/10 to-transparent pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <div className="flex items-center gap-4 relative z-10">
            {/* Company avatar */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
              ${isRipe ? 'bg-cherry-ripe/30 text-cherry-light' : 'bg-bark-medium text-white/60'}
            `}>
              {lead.company.charAt(0)}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-white truncate">{lead.company}</p>
                <StatusChip status={lead.status} size="sm" />
              </div>
              <p className="text-sm text-white/50 truncate">{lead.industry}</p>
            </div>

            {/* Ripeness score */}
            <RipenessScore score={lead.score} size="sm" showLabel={false} />

            {/* Expand toggle */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-white/40"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Expanded details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Revenue</p>
                    <p className="text-sm font-semibold text-white">{lead.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Employees</p>
                    <p className="text-sm font-semibold text-white">{lead.employees}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-white">{lead.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Last Activity</p>
                    <p className="text-sm font-semibold text-white">{lead.lastActivity}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <MagneticElement strength={0.2} distance={50}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-cherry-ripe/20 text-cherry-light text-sm font-medium
                                 hover:bg-cherry-ripe/30 transition-colors"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <Plus className="w-4 h-4" />
                      Add to Basket
                    </motion.button>
                  </MagneticElement>

                  <MagneticElement strength={0.2} distance={50}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium
                                 hover:bg-white/10 transition-colors"
                      onClick={(e) => { e.stopPropagation(); onNavigate(); }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </motion.button>
                  </MagneticElement>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </MagneticElement>
    </motion.div>
  );
};

interface ImmersiveLeadsProps {
  onRowClick?: (lead: Lead) => void;
}

export const ImmersiveLeads: React.FC<ImmersiveLeadsProps> = ({ onRowClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const filteredLeads = leads.filter(lead =>
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <CherryBubble variant="soft" size="xl" glow="cherry" magnetic={false}>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-bark-medium/30 rounded-full animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-bark-medium/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </CherryBubble>
    );
  }

  if (leads.length === 0) {
    return (
      <CherryBubble variant="soft" size="xl" glow="cherry" magnetic={false}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-cherry-ripe/10 flex items-center justify-center mb-6">
            <Target className="w-10 h-10 text-cherry-light/40" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">No Leads Yet</h3>
          <p className="text-white/50 text-center max-w-md mb-6">
            Your cherry tree is ready for planting. Start finding ripe leads to grow your orchard.
          </p>
          <MagneticElement strength={0.3} distance={80}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-cherry-ripe text-white font-medium
                         shadow-lg shadow-cherry-ripe/30"
            >
              <Search className="w-5 h-5" />
              Find Leads
            </motion.button>
          </MagneticElement>
        </div>
      </CherryBubble>
    );
  }

  return (
    <CherryBubble variant="soft" size="xl" glow="cherry" magnetic={false} className="overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Lead Orchard</h3>
          <p className="text-sm text-white/50">{leads.length} leads ripening</p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-bark-medium/50 border border-white/10 text-white text-sm
                       placeholder:text-white/30 focus:outline-none focus:border-cherry-ripe/50 w-48"
          />
        </div>
      </div>

      {/* Leads list */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cherry-ripe/30 scrollbar-track-transparent">
        {filteredLeads.map((lead, index) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            index={index}
            isExpanded={expandedId === lead.id}
            onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
            onNavigate={() => onRowClick?.(lead)}
          />
        ))}

        {filteredLeads.length === 0 && searchTerm && (
          <div className="text-center py-8 text-white/40">
            No leads match "{searchTerm}"
          </div>
        )}
      </div>
    </CherryBubble>
  );
};

export default ImmersiveLeads;
