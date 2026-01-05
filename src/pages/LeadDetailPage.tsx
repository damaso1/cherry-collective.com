import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  ShoppingBasket,
  ExternalLink,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { CherryBubble } from '../components/cherry/CherryBubble';
import { MagneticElement } from '../components/effects/MagneticElement';
import { RipenessScore } from '../components/ui/RipenessScore';
import { StatusChip } from '../components/ui/StatusChip';
import { CherryPairIcon } from '../components/icons';

// Mock lead data
const mockLead = {
  id: 'lead-001',
  company: 'TechCorp Industries',
  logo: 'T',
  industry: 'Technology',
  subIndustry: 'Enterprise Software',
  score: 92,
  status: 'ripe' as const,
  description:
    'TechCorp Industries is a leading enterprise software company specializing in AI-powered business solutions.',
  contact: {
    name: 'Sarah Johnson',
    title: 'VP of Partnerships',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
  },
  company_info: {
    revenue: '$50M-100M',
    employees: '500-1000',
    founded: '2015',
    website: 'https://techcorp.example.com',
    location: 'San Francisco, CA',
    funding: 'Series C - $75M',
  },
  metrics: {
    financialHealth: 88,
    marketPosition: 94,
    growthPotential: 91,
    dealProbability: 87,
  },
  timeline: [
    { date: '2024-12-30', event: 'Lead scored at 92%', type: 'success' },
    { date: '2024-12-29', event: 'Financial analysis complete', type: 'info' },
    { date: '2024-12-28', event: 'Lead discovered by Hunter', type: 'info' },
    { date: '2024-12-27', event: 'Initial scan completed', type: 'info' },
  ],
  notes: [
    {
      id: '1',
      author: 'CRA Agent',
      date: '2024-12-30',
      content: 'Strong financial indicators. Q3 revenue grew 45% YoY.',
    },
    {
      id: '2',
      author: 'MLB Agent',
      date: '2024-12-29',
      content: 'Recent expansion into APAC market shows growth ambition.',
    },
  ],
};

interface MetricBubbleProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  glow: 'cherry' | 'green' | 'gold' | 'blue';
  delay?: number;
}

const MetricBubble: React.FC<MetricBubbleProps> = ({ title, value, icon, glow, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring' }}
    >
      <MagneticElement
        strength={0.2}
        distance={80}
        glowColor={
          glow === 'cherry' ? 'rgba(196, 30, 58, 0.4)' :
          glow === 'green' ? 'rgba(50, 205, 50, 0.4)' :
          glow === 'gold' ? 'rgba(255, 215, 0, 0.4)' :
          'rgba(100, 149, 237, 0.4)'
        }
      >
        <CherryBubble variant="cherry" size="sm" glow={glow} magnetic={false}>
          <div className="text-center">
            <div className={`
              w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center
              ${glow === 'cherry' ? 'bg-cherry-ripe/20 text-cherry-light' : ''}
              ${glow === 'green' ? 'bg-stem-light/20 text-stem-light' : ''}
              ${glow === 'gold' ? 'bg-gold/20 text-gold' : ''}
              ${glow === 'blue' ? 'bg-blue-400/20 text-blue-400' : ''}
            `}>
              {icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}%</div>
            <div className="text-xs text-white/50">{title}</div>
          </div>
        </CherryBubble>
      </MagneticElement>
    </motion.div>
  );
};

const LeadDetailPage: React.FC = () => {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  void _id;

  const isRipe = mockLead.score >= 80;

  return (
    <div className="min-h-screen bg-bark-dark relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-stem-light/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-6 py-6">
        {/* Back button */}
        <MagneticElement strength={0.2} distance={60} glow={false}>
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6
                       px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to leads</span>
          </motion.button>
        </MagneticElement>

        {/* Lead header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5"
          >
            {/* Company avatar bubble */}
            <MagneticElement strength={0.3} distance={80} glowColor="rgba(196, 30, 58, 0.4)">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center
                bg-gradient-to-br from-cherry-ripe/30 to-cherry-dark/50
                border-2 ${isRipe ? 'border-cherry-ripe' : 'border-white/20'}
                shadow-lg ${isRipe ? 'shadow-cherry-ripe/30' : ''}
              `}>
                <span className="text-3xl font-bold text-cherry-light">
                  {mockLead.logo}
                </span>
              </div>
            </MagneticElement>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-white">
                  {mockLead.company}
                </h1>
                <StatusChip status={mockLead.status} pulse />
              </div>
              <p className="text-white/50">
                {mockLead.industry} • {mockLead.subIndustry}
              </p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <MagneticElement strength={0.2} distance={60}>
              <motion.a
                href={mockLead.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white
                           hover:bg-white/20 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </motion.a>
            </MagneticElement>

            <MagneticElement strength={0.2} distance={60}>
              <motion.button
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cherry-ripe text-white
                           hover:bg-cherry-dark transition-colors font-medium shadow-lg shadow-cherry-ripe/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingBasket className="w-4 h-4" />
                Add to Basket
              </motion.button>
            </MagneticElement>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-12 space-y-6">
        {/* Top row - Score and metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Ripeness Score - Large cherry bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
            className="lg:col-span-2"
          >
            <MagneticElement
              strength={0.15}
              distance={120}
              glowColor="rgba(196, 30, 58, 0.5)"
            >
              <CherryBubble variant="organic" size="lg" glow="cherry" magnetic={false}>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="mb-4">
                    <CherryPairIcon size={48} animate />
                  </div>
                  <RipenessScore score={mockLead.score} size="lg" />
                  <p className="text-white/50 mt-4 text-sm">Overall Ripeness Score</p>
                  <p className="text-cherry-light text-xs mt-1">
                    {isRipe ? 'Ready for harvest!' : 'Still ripening...'}
                  </p>
                </div>
              </CherryBubble>
            </MagneticElement>
          </motion.div>

          {/* Metrics bubbles */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
            <MetricBubble
              title="Financial Health"
              value={mockLead.metrics.financialHealth}
              icon={<DollarSign className="w-5 h-5" />}
              glow="green"
              delay={0.1}
            />
            <MetricBubble
              title="Market Position"
              value={mockLead.metrics.marketPosition}
              icon={<TrendingUp className="w-5 h-5" />}
              glow="cherry"
              delay={0.2}
            />
            <MetricBubble
              title="Deal Probability"
              value={mockLead.metrics.dealProbability}
              icon={<Building2 className="w-5 h-5" />}
              glow="gold"
              delay={0.3}
            />
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company info - Large bubble spanning 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <CherryBubble variant="soft" size="xl" glow="cherry" magnetic={false}>
              <h3 className="text-xl font-display font-bold text-white mb-4">
                Company Information
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">{mockLead.description}</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: 'Location', value: mockLead.company_info.location, color: 'cherry' },
                  { icon: DollarSign, label: 'Revenue', value: mockLead.company_info.revenue, color: 'green' },
                  { icon: Users, label: 'Employees', value: mockLead.company_info.employees, color: 'blue' },
                  { icon: Calendar, label: 'Founded', value: mockLead.company_info.founded, color: 'gold' },
                  { icon: Globe, label: 'Website', value: mockLead.company_info.website.replace('https://', ''), color: 'cherry', isLink: true },
                  { icon: TrendingUp, label: 'Funding', value: mockLead.company_info.funding, color: 'green' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`
                      w-9 h-9 rounded-full flex items-center justify-center
                      ${item.color === 'cherry' ? 'bg-cherry-ripe/20 text-cherry-light' : ''}
                      ${item.color === 'green' ? 'bg-stem-light/20 text-stem-light' : ''}
                      ${item.color === 'blue' ? 'bg-blue-400/20 text-blue-400' : ''}
                      ${item.color === 'gold' ? 'bg-gold/20 text-gold' : ''}
                    `}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-white/40">{item.label}</p>
                      {item.isLink ? (
                        <a href={mockLead.company_info.website} className="text-sm text-cherry-light hover:text-cherry-bright truncate block">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-white truncate">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CherryBubble>
          </motion.div>

          {/* Contact card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CherryBubble variant="organic" size="lg" glow="green" magnetic={false}>
              <h3 className="text-lg font-display font-bold text-white mb-4 text-center">
                Primary Contact
              </h3>

              <div className="text-center mb-6">
                <MagneticElement strength={0.3} distance={60} glowColor="rgba(50, 205, 50, 0.4)">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-stem-light/30 to-stem-dark/50
                                  border-2 border-stem-light/50 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-stem-light">
                      {mockLead.contact.name.charAt(0)}
                    </span>
                  </div>
                </MagneticElement>
                <p className="font-semibold text-white">{mockLead.contact.name}</p>
                <p className="text-sm text-white/50">{mockLead.contact.title}</p>
              </div>

              <div className="space-y-2">
                <MagneticElement strength={0.15} distance={50} glow={false}>
                  <a
                    href={`mailto:${mockLead.contact.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-cherry-ripe/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-cherry-light" />
                    </div>
                    <span className="text-sm text-white/80 truncate">{mockLead.contact.email}</span>
                  </a>
                </MagneticElement>

                <MagneticElement strength={0.15} distance={50} glow={false}>
                  <a
                    href={`tel:${mockLead.contact.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-stem-light/20 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-stem-light" />
                    </div>
                    <span className="text-sm text-white/80">{mockLead.contact.phone}</span>
                  </a>
                </MagneticElement>
              </div>
            </CherryBubble>
          </motion.div>
        </div>

        {/* Bottom row - Timeline and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CherryBubble variant="soft" size="lg" glow="gold" magnetic={false}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Activity Timeline
                </h3>
              </div>

              <div className="space-y-4">
                {mockLead.timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="relative">
                      <motion.div
                        className={`w-3 h-3 rounded-full ${
                          item.type === 'success' ? 'bg-stem-light' : 'bg-cherry-ripe/50'
                        }`}
                        animate={item.type === 'success' ? { scale: [1, 1.2, 1] } : undefined}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {index < mockLead.timeline.length - 1 && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-full bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-white text-sm">{item.event}</p>
                      <p className="text-xs text-white/40 mt-1">{item.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CherryBubble>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CherryBubble variant="soft" size="lg" glow="blue" magnetic={false}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">
                    Agent Notes
                  </h3>
                </div>
                <MagneticElement strength={0.2} distance={40} glow={false}>
                  <motion.button
                    className="px-3 py-1.5 rounded-full bg-blue-400/20 text-blue-400 text-xs font-medium
                               hover:bg-blue-400/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Note
                  </motion.button>
                </MagneticElement>
              </div>

              <div className="space-y-3">
                {mockLead.notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-400/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-400">
                        {note.author}
                      </span>
                      <span className="text-xs text-white/40">{note.date}</span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{note.content}</p>
                  </motion.div>
                ))}
              </div>
            </CherryBubble>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative cherries */}
      <FloatingLeadCherries />
    </div>
  );
};

// Floating decorative cherries
const FloatingLeadCherries: React.FC = () => {
  const cherries = [
    { x: 3, delay: 0, duration: 22, size: 14 },
    { x: 95, delay: 4, duration: 18, size: 12 },
    { x: 8, delay: 8, duration: 25, size: 10 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {cherries.map((cherry, i) => (
        <motion.div
          key={i}
          className="absolute opacity-15"
          style={{ left: `${cherry.x}%` }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{ y: '-10vh', rotate: 360 }}
          transition={{
            duration: cherry.duration,
            delay: cherry.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg width={cherry.size} height={cherry.size * 1.2} viewBox="0 0 20 24" fill="none">
            <path d="M10 0 Q 12 4, 10 8" stroke="#4a7c59" strokeWidth="1.5" fill="none" />
            <circle cx="10" cy="14" r="8" fill="#C41E3A" />
            <circle cx="7" cy="12" r="2" fill="rgba(255,255,255,0.3)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default LeadDetailPage;
