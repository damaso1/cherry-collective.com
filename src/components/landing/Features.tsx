import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  Zap,
  Shield,
  LineChart,
  Users,
  Bot,
  Workflow,
} from 'lucide-react';
import { CherryIcon } from '../icons';
import { GlowCard } from '../ui/GlowCard';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Scoring',
    description:
      'Deep learning models analyze 50+ signals to calculate lead ripeness with 94% accuracy.',
    color: 'cherry',
  },
  {
    icon: Target,
    title: 'Smart Lead Discovery',
    description:
      'Autonomous hunters scan the web 24/7 finding high-intent prospects before competitors.',
    color: 'cherry',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description:
      '4,800 leads processed per hour. From discovery to scored in under 3 seconds.',
    color: 'gold',
  },
  {
    icon: Shield,
    title: 'CRAO Governance',
    description:
      'Every decision audited and approved. Full transparency with human oversight.',
    color: 'green',
  },
  {
    icon: LineChart,
    title: 'Revenue Forecasting',
    description:
      'Predict deal value and close probability with financial stability analysis.',
    color: 'cherry',
  },
  {
    icon: Bot,
    title: 'Multi-Agent System',
    description:
      'Specialized squads—Talent Hunters, Arbitrage Seekers, Niche Specialists.',
    color: 'blue',
  },
  {
    icon: Workflow,
    title: 'Seamless Integration',
    description:
      'Connect with your CRM, Slack, and workflow tools via API or webhooks.',
    color: 'cherry',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Shared baskets, team assignments, and collaborative lead nurturing.',
    color: 'green',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const glowColors: Record<string, 'cherry' | 'green' | 'gold' | 'blue'> = {
  cherry: 'cherry',
  green: 'green',
  gold: 'gold',
  blue: 'blue',
};

export const Features = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-bark-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.1),transparent_70%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center mb-6"
          >
            <CherryIcon size={48} ripe animate />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Why Teams Choose{' '}
            <span className="text-cherry-light">Cherrypicker</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            The complete AI-powered platform for finding, scoring, and converting
            your highest-value leads.
          </motion.p>
        </div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <GlowCard
                  glowIntensity="subtle"
                  glowColor={glowColors[feature.color]}
                  padding="lg"
                  className="h-full"
                >
                  {/* Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    ${feature.color === 'cherry' ? 'bg-cherry-ripe/20 text-cherry-light' : ''}
                    ${feature.color === 'green' ? 'bg-stem-light/20 text-stem-light' : ''}
                    ${feature.color === 'gold' ? 'bg-gold/20 text-gold' : ''}
                    ${feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : ''}
                  `}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
