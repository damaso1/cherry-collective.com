import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { CherryPairIcon } from '../icons';
import { CherryButton } from '../ui/CherryButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const floatingCherries = [
  { x: '10%', y: '20%', size: 30, delay: 0 },
  { x: '85%', y: '15%', size: 25, delay: 0.5 },
  { x: '75%', y: '70%', size: 35, delay: 1 },
  { x: '15%', y: '75%', size: 28, delay: 1.5 },
  { x: '90%', y: '45%', size: 22, delay: 2 },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bark-dark via-bark-medium/50 to-bark-dark" />

      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,30,58,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,30,58,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating cherry decorations */}
      {floatingCherries.map((cherry, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none opacity-30"
          style={{ left: cherry.x, top: cherry.y }}
          animate={{
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            delay: cherry.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CherryPairIcon size={cherry.size} animate={false} />
        </motion.div>
      ))}

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,30,58,0.15),transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full
            bg-cherry-ripe/10 border border-cherry-ripe/30 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-cherry-light" />
          <span className="text-sm font-medium text-cherry-light">
            AI-Powered Lead Intelligence
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
        >
          Pick the{' '}
          <span className="relative inline-block">
            <span className="text-cherry-gradient bg-clip-text text-transparent bg-gradient-to-r from-cherry-light via-cherry-ripe to-cherry-dark">
              Ripest
            </span>
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cherry-light to-cherry-dark rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            />
          </span>{' '}
          Leads
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12"
        >
          Autonomous AI agents analyze, score, and harvest high-value business leads
          in real-time. Stop chasing cold leads—start picking winners.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <CherryButton size="lg" glow rightIcon={<ArrowRight className="w-5 h-5" />}>
            Start Picking Free
          </CherryButton>
          <CherryButton variant="secondary" size="lg">
            Watch Demo
          </CherryButton>
        </motion.div>

        {/* Verified Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* ABN */}
          <div className="glass rounded-xl p-6 group hover:cherry-glow transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-stem-light" />
              <span className="text-sm text-white/60">Australian Business Number</span>
            </div>
            <div className="text-2xl md:text-3xl font-display font-bold text-white font-mono">
              89 767 167 506
            </div>
            <p className="text-sm text-cherry-light mt-1">Registered Entity</p>
          </div>

          {/* NCAGE */}
          <div className="glass rounded-xl p-6 group hover:cherry-glow transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cherry-light" />
              <span className="text-sm text-white/60">NATO CAGE Code</span>
            </div>
            <div className="text-3xl md:text-4xl font-display font-bold text-white font-mono">
              Z1ME7
            </div>
            <p className="text-sm text-cherry-light mt-1">Defense Verified</p>
          </div>

          {/* Active Agents */}
          <div className="glass rounded-xl p-6 group hover:cherry-glow transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-sm text-white/60">Autonomous Agents</span>
            </div>
            <div className="text-3xl md:text-4xl font-display font-bold text-white">
              <AnimatedCounter value={12} suffix="+" duration={2} />
            </div>
            <p className="text-sm text-stem-light mt-1">Running 24/7</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bark-dark to-transparent" />
    </section>
  );
};

export default Hero;
