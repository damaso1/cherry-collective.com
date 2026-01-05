import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Plus, Search, Target } from 'lucide-react';
import { DataTable } from '../ui/DataTable';
import type { Column } from '../ui/DataTable';
import { StatusChip } from '../ui/StatusChip';
import { RipenessScore } from '../ui/RipenessScore';
import { CherryButton } from '../ui/CherryButton';
import { GlowCard } from '../ui/GlowCard';

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

// Billing API URL
const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const fetchLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${BILLING_API_URL}/api/leads`);
    if (!response.ok) {
      throw new Error('API not available');
    }
    const data = await response.json();
    // Map API response and format lastActivity
    return data.map((lead: Lead & { lastActivity?: string }) => ({
      ...lead,
      lastActivity: lead.lastActivity
        ? new Date(lead.lastActivity).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Just now',
    }));
  } catch {
    // Return empty array when API is not available
    return [];
  }
};

const columns: Column<Lead>[] = [
  {
    key: 'company',
    header: 'Company',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cherry-ripe/10 border border-cherry-ripe/20 flex items-center justify-center">
          <span className="text-sm font-bold text-cherry-light">
            {row.company.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-white">{row.company}</p>
          <p className="text-xs text-white/50">{row.industry}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'score',
    header: 'Ripeness',
    sortable: true,
    align: 'center',
    render: (value) => (
      <RipenessScore score={value as number} size="sm" showLabel={false} />
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (value) => (
      <StatusChip status={value as Lead['status']} size="sm" />
    ),
  },
  {
    key: 'revenue',
    header: 'Est. Revenue',
    sortable: true,
  },
  {
    key: 'employees',
    header: 'Employees',
    sortable: true,
  },
  {
    key: 'location',
    header: 'Location',
  },
  {
    key: 'lastActivity',
    header: 'Last Activity',
    render: (value) => (
      <span className="text-white/50">{value as string}</span>
    ),
  },
  {
    key: 'actions',
    header: '',
    width: '80px',
    render: () => (
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-cherry-ripe/10 transition-colors"
          title="Add to basket"
        >
          <Plus className="w-4 h-4 text-white/60" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-cherry-ripe/10 transition-colors"
          title="View details"
        >
          <ExternalLink className="w-4 h-4 text-white/60" />
        </motion.button>
      </div>
    ),
  },
];

interface LeadsTableProps {
  onRowClick?: (lead: Lead) => void;
}

export const LeadsTable = ({ onRowClick }: LeadsTableProps) => {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: fetchLeads,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-cherry-ripe/10">
          <div className="h-6 w-32 bg-bark-medium/50 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-bark-medium/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <GlowCard glowIntensity="subtle" padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cherry-ripe/10">
          <div>
            <h3 className="font-display font-semibold text-lg text-white">
              Recent Leads
            </h3>
            <p className="text-sm text-white/50">No leads yet</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-16 h-16 rounded-full bg-cherry-ripe/10 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-cherry-light/50" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No leads found</h4>
          <p className="text-sm text-white/50 text-center max-w-md mb-6">
            Your lead pipeline is empty. Start by adding leads through the API or importing from a data source.
          </p>
          <CherryButton variant="secondary" size="sm" leftIcon={<Search className="w-4 h-4" />}>
            Find Leads
          </CherryButton>
        </div>
      </GlowCard>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cherry-ripe/10">
        <div>
          <h3 className="font-display font-semibold text-lg text-white">
            Recent Leads
          </h3>
          <p className="text-sm text-white/50">
            {leads.length} leads found
          </p>
        </div>
        <CherryButton variant="secondary" size="sm">
          View All
        </CherryButton>
      </div>

      {/* Table */}
      <DataTable<Lead>
        data={leads}
        columns={columns}
        keyField="id"
        onRowClick={onRowClick}
        searchable
        searchPlaceholder="Search leads..."
        rowClassName={(row) =>
          row.score >= 80 ? 'ripe' : ''
        }
      />
    </div>
  );
};

export default LeadsTable;
