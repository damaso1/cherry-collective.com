import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBasket,
  Trash2,
  ExternalLink,
  CheckCircle,
  DollarSign,
  Target,
  Zap,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CherryBubble } from '../components/cherry/CherryBubble';
import { MagneticElement } from '../components/effects/MagneticElement';
import { RipenessScore } from '../components/ui/RipenessScore';
import { StatusChip } from '../components/ui/StatusChip';
import { MoneyCounter, AnimatedCounter } from '../components/ui/AnimatedCounter';
import { toast } from '../components/ui/Toast';
import { CherryPairIcon } from '../components/icons';
import { useNavigateWithTransition } from '../core/transitions';

interface BasketItem {
  id: string;
  company: string;
  industry: string;
  score: number;
  status: 'ripe' | 'growing' | 'picked' | 'rotten' | 'pending';
  estimatedValue: number;
  addedAt: string;
  priority: 'high' | 'medium' | 'low';
}

const mockBasketItems: BasketItem[] = [
  {
    id: 'lead-001',
    company: 'TechCorp Industries',
    industry: 'Technology',
    score: 92,
    status: 'ripe',
    estimatedValue: 125000,
    addedAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: 'lead-002',
    company: 'CloudSync Solutions',
    industry: 'SaaS',
    score: 87,
    status: 'ripe',
    estimatedValue: 85000,
    addedAt: '5 hours ago',
    priority: 'high',
  },
  {
    id: 'lead-003',
    company: 'DataFlow Analytics',
    industry: 'Data & Analytics',
    score: 78,
    status: 'growing',
    estimatedValue: 45000,
    addedAt: '1 day ago',
    priority: 'medium',
  },
];

const priorityConfig = {
  high: { bg: 'bg-cherry-ripe/20', text: 'text-cherry-light', border: 'border-cherry-ripe/30' },
  medium: { bg: 'bg-gold/20', text: 'text-gold', border: 'border-gold/30' },
  low: { bg: 'bg-white/10', text: 'text-white/60', border: 'border-white/20' },
};

interface StatBubbleProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  glow: 'cherry' | 'green' | 'gold' | 'blue';
  delay?: number;
}

const StatBubble: React.FC<StatBubbleProps> = ({ label, value, icon, glow, delay = 0 }) => (
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
            ${glow === 'cherry' ? 'bg-cherry-ripe/20' : ''}
            ${glow === 'green' ? 'bg-stem-light/20' : ''}
            ${glow === 'gold' ? 'bg-gold/20' : ''}
            ${glow === 'blue' ? 'bg-blue-400/20' : ''}
          `}>
            {icon}
          </div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          <div className="text-xs text-white/50">{label}</div>
        </div>
      </CherryBubble>
    </MagneticElement>
  </motion.div>
);

const BasketPage: React.FC = () => {
  const { navigateWithTransition } = useNavigateWithTransition();
  const [items, setItems] = useState(mockBasketItems);

  const totalValue = items.reduce((sum, item) => sum + item.estimatedValue, 0);
  const avgScore = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length)
    : 0;
  const ripeCount = items.filter((item) => item.status === 'ripe').length;

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Lead removed from basket');
  };

  const handlePick = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'picked' as const } : item
      )
    );
    toast.success('Lead marked as picked!');
  };

  const handleClearAll = () => {
    setItems([]);
    toast.info('Basket cleared');
  };

  return (
    <div className="min-h-screen bg-bark-dark relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-stem-light/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-gold/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <MagneticElement strength={0.2} distance={60} glow={false}>
            <motion.button
              onClick={() => navigateWithTransition('/dashboard')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors
                         px-4 py-2 rounded-full bg-white/5 hover:bg-white/10"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </motion.button>
          </MagneticElement>

          <MagneticElement strength={0.2} distance={60}>
            <div className="flex items-center gap-3">
              <ShoppingBasket className="w-6 h-6 text-cherry-light" />
              <span className="text-white/50 text-sm">{items.length} items</span>
            </div>
          </MagneticElement>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <MagneticElement strength={0.3} distance={80} glowColor="rgba(196, 30, 58, 0.4)">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cherry-ripe/30 to-cherry-dark/50
                            border-2 border-cherry-ripe/50 flex items-center justify-center
                            shadow-lg shadow-cherry-ripe/20">
              <ShoppingBasket className="w-8 h-8 text-cherry-light" />
            </div>
          </MagneticElement>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Your Basket</h1>
            <p className="text-white/50">
              {items.length > 0 ? `${items.length} leads ready for harvest` : 'Start collecting ripe leads'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative px-6 pb-12 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBubble
            label="Pipeline Value"
            value={<MoneyCounter value={totalValue} duration={1.5} />}
            icon={<DollarSign className="w-5 h-5 text-stem-light" />}
            glow="green"
            delay={0}
          />
          <StatBubble
            label="In Basket"
            value={<AnimatedCounter value={items.length} duration={1} />}
            icon={<ShoppingBasket className="w-5 h-5 text-cherry-light" />}
            glow="cherry"
            delay={0.1}
          />
          <StatBubble
            label="Avg Score"
            value={<AnimatedCounter value={avgScore} suffix="%" duration={1} />}
            icon={<Target className="w-5 h-5 text-gold" />}
            glow="gold"
            delay={0.2}
          />
          <StatBubble
            label="Ripe Leads"
            value={<AnimatedCounter value={ripeCount} duration={1} />}
            icon={<Zap className="w-5 h-5 text-blue-400" />}
            glow="blue"
            delay={0.3}
          />
        </div>

        {/* Actions bar */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm">Sort:</span>
              <select className="bg-bark-medium/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white
                                 focus:outline-none focus:border-cherry-ripe/50 cursor-pointer">
                <option>Score (High to Low)</option>
                <option>Value (High to Low)</option>
                <option>Recently Added</option>
                <option>Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <MagneticElement strength={0.2} distance={50} glow={false}>
                <motion.button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-full bg-white/5 text-white/60 text-sm
                             hover:bg-white/10 hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All
                </motion.button>
              </MagneticElement>

              <MagneticElement strength={0.2} distance={50}>
                <motion.button
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-cherry-ripe text-white
                             font-medium shadow-lg shadow-cherry-ripe/30 hover:bg-cherry-dark transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Process All Ripe
                </motion.button>
              </MagneticElement>
            </div>
          </motion.div>
        )}

        {/* Basket items or empty state */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center py-8"
          >
            <MagneticElement strength={0.1} distance={150} glowColor="rgba(196, 30, 58, 0.3)">
              <CherryBubble variant="organic" size="xl" glow="cherry" magnetic={false}>
                <div className="text-center py-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-cherry-ripe/10 flex items-center justify-center mx-auto">
                      <ShoppingBasket className="w-12 h-12 text-cherry-light/40" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">
                    Your basket is empty
                  </h3>
                  <p className="text-white/50 mb-8 max-w-sm mx-auto">
                    Start picking ripe leads from your orchard to fill your basket
                  </p>
                  <MagneticElement strength={0.3} distance={60}>
                    <motion.button
                      onClick={() => navigateWithTransition('/dashboard')}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-cherry-ripe text-white
                                 font-medium shadow-lg shadow-cherry-ripe/30 mx-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      Browse Leads
                    </motion.button>
                  </MagneticElement>
                </div>
              </CherryBubble>
            </MagneticElement>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const isRipe = item.score >= 80;
                const priority = priorityConfig[item.priority];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MagneticElement
                      strength={0.08}
                      distance={100}
                      glowColor={isRipe ? 'rgba(196, 30, 58, 0.3)' : 'rgba(255, 215, 0, 0.2)'}
                      glow={false}
                    >
                      <CherryBubble
                        variant="soft"
                        size="lg"
                        glow={isRipe ? 'cherry' : 'gold'}
                        magnetic={false}
                        className="overflow-visible"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Company avatar */}
                          <MagneticElement strength={0.3} distance={50} glow={false}>
                            <div className={`
                              w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                              ${isRipe
                                ? 'bg-gradient-to-br from-cherry-ripe/30 to-cherry-dark/50 border-2 border-cherry-ripe/50'
                                : 'bg-gradient-to-br from-gold/20 to-amber-900/30 border-2 border-gold/30'
                              }
                            `}>
                              <span className={`text-xl font-bold ${isRipe ? 'text-cherry-light' : 'text-gold'}`}>
                                {item.company.charAt(0)}
                              </span>
                            </div>
                          </MagneticElement>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white truncate">{item.company}</h3>
                              <StatusChip status={item.status} size="sm" />
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}>
                                {item.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-white/50">
                              {item.industry} • Added {item.addedAt}
                            </p>
                          </div>

                          {/* Score */}
                          <div className="flex-shrink-0">
                            <RipenessScore score={item.score} size="sm" showLabel={false} />
                          </div>

                          {/* Value */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-display font-bold text-stem-light">
                              ${item.estimatedValue.toLocaleString()}
                            </p>
                            <p className="text-xs text-white/40">Est. Value</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <MagneticElement strength={0.3} distance={40} glow={false}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigateWithTransition(`/leads/${item.id}`)}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                title="View details"
                              >
                                <ExternalLink className="w-5 h-5 text-white/50 hover:text-white" />
                              </motion.button>
                            </MagneticElement>

                            {item.status !== 'picked' && (
                              <MagneticElement strength={0.2} distance={40}>
                                <motion.button
                                  onClick={() => handlePick(item.id)}
                                  className="px-4 py-1.5 rounded-full bg-cherry-ripe text-white text-sm font-medium
                                             hover:bg-cherry-dark transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Pick
                                </motion.button>
                              </MagneticElement>
                            )}

                            <MagneticElement strength={0.3} distance={40} glow={false}>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemove(item.id)}
                                className="p-2 rounded-full hover:bg-cherry-ripe/20 transition-colors"
                                title="Remove from basket"
                              >
                                <Trash2 className="w-5 h-5 text-cherry-light/70 hover:text-cherry-light" />
                              </motion.button>
                            </MagneticElement>
                          </div>
                        </div>

                        {/* Score progress bar */}
                        <div className="mt-4 h-1 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              item.score >= 80 ? 'bg-gradient-to-r from-cherry-ripe to-cherry-light' :
                              item.score >= 60 ? 'bg-gradient-to-r from-gold to-amber-400' :
                              'bg-gradient-to-r from-gray-500 to-gray-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </CherryBubble>
                    </MagneticElement>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Summary footer when items exist */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CherryBubble variant="organic" size="lg" glow="green" magnetic={false}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <CherryPairIcon size={40} animate />
                  <div>
                    <p className="text-white/50 text-sm">Total Pipeline Value</p>
                    <p className="text-3xl font-display font-bold text-stem-light">
                      <MoneyCounter value={totalValue} duration={2} />
                    </p>
                  </div>
                </div>

                <MagneticElement strength={0.2} distance={60}>
                  <motion.button
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-stem-light text-bark-dark
                               font-bold shadow-lg shadow-stem-light/30 hover:bg-stem-bright transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Harvest All ({ripeCount} ripe)
                  </motion.button>
                </MagneticElement>
              </div>
            </CherryBubble>
          </motion.div>
        )}
      </div>

      {/* Floating decorative cherries */}
      <FloatingBasketCherries />
    </div>
  );
};

// Floating decorative cherries
const FloatingBasketCherries: React.FC = () => {
  const cherries = [
    { x: 5, delay: 0, duration: 20, size: 14 },
    { x: 92, delay: 3, duration: 24, size: 12 },
    { x: 10, delay: 7, duration: 18, size: 10 },
    { x: 88, delay: 10, duration: 22, size: 16 },
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

export default BasketPage;
