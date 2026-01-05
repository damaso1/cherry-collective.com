import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Target, Zap, Shield, ArrowRight, Play, Check } from 'lucide-react';
import { CherryBubble } from '../components/cherry/CherryBubble';
import { MagneticElement } from '../components/effects/MagneticElement';
import { CherryPairIcon } from '../components/icons';
import { useAudio } from '../core/providers/ImmersiveProvider';
import { TransitionLink } from '../core/transitions';

// Animated text that types out
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Floating credential bubbles
const CredentialBubble: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}> = ({ icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, type: 'spring' }}
  >
    <MagneticElement strength={0.2} distance={100}>
      <CherryBubble size="sm" glow="cherry" variant="organic">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cherry-ripe/20 rounded-full">{icon}</div>
          <div>
            <div className="text-xs text-white/50">{label}</div>
            <div className="text-sm font-bold text-white">{value}</div>
          </div>
        </div>
      </CherryBubble>
    </MagneticElement>
  </motion.div>
);

// Feature cherry
const FeatureCherry: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  delay: number;
  glow?: 'cherry' | 'green' | 'gold' | 'blue';
}> = ({ icon, title, description, stat, delay, glow = 'cherry' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ delay, duration: 0.5, type: 'spring' }}
  >
    <MagneticElement strength={0.25} distance={120}>
      <CherryBubble size="md" glow={glow} variant="soft" hover>
        <div className="flex flex-col items-center text-center h-full justify-center">
          <div className="p-3 bg-white/10 rounded-full mb-3">{icon}</div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-xs text-white/60 mb-2">{description}</p>
          <div className="text-cherry-light font-bold text-sm">{stat}</div>
        </div>
      </CherryBubble>
    </MagneticElement>
  </motion.div>
);

// Pricing tier as growing cherry
const PricingCherry: React.FC<{
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  delay: number;
}> = ({ name, price, features, popular, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, type: 'spring' }}
    className="relative"
  >
    {popular && (
      <motion.div
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="bg-cherry-ripe px-4 py-1 rounded-full text-xs font-bold text-white">
          Most Popular
        </span>
      </motion.div>
    )}
    <MagneticElement strength={0.2} distance={100}>
      <CherryBubble
        size="lg"
        glow={popular ? 'cherry' : 'none'}
        variant="cherry"
        hover
      >
        <div className="flex flex-col items-center text-center h-full py-4">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-white/50">/mo</span>
          </div>
          <ul className="space-y-2 text-left w-full px-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                <Check className="w-4 h-4 text-stem-light flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <TransitionLink to="/pricing" className="mt-4 w-full block">
            <MagneticElement strength={0.3}>
              <motion.button
                className={`w-full py-2 px-4 rounded-full font-bold transition-all ${
                  popular
                    ? 'bg-cherry-ripe text-white hover:bg-cherry-bright'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </MagneticElement>
          </TransitionLink>
        </div>
      </CherryBubble>
    </MagneticElement>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const { playSound } = useAudio();

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <MagneticElement strength={0.2}>
              <TransitionLink to="/" className="flex items-center gap-3">
                <CherryPairIcon size={36} animate />
                <span className="font-display font-bold text-xl text-white">
                  Cherry<span className="text-cherry-ripe">picker</span>
                </span>
              </TransitionLink>
            </MagneticElement>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Docs'].map((item) => (
                <MagneticElement key={item} strength={0.3} distance={60}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item}
                  </a>
                </MagneticElement>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <MagneticElement strength={0.3}>
                <TransitionLink
                  to="/dashboard"
                  className="px-5 py-2 bg-cherry-ripe text-white rounded-full font-bold text-sm hover:bg-cherry-bright transition-colors"
                  onClick={() => playSound('click')}
                >
                  Dashboard
                </TransitionLink>
              </MagneticElement>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <MagneticElement>
              <CherryBubble size="sm" glow="gold" variant="organic">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-white">
                    AI-Powered Lead Intelligence
                  </span>
                </div>
              </CherryBubble>
            </MagneticElement>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Pick the{' '}
            <span className="relative inline-block">
              <span className="text-cherry-ripe">Ripest</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-cherry-ripe rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              />
            </span>{' '}
            Leads
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
          >
            <TypewriterText
              text="Autonomous AI agents that hunt, score, and nurture leads 24/7. Turn cold prospects into ripe opportunities."
              delay={1200}
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <MagneticElement strength={0.3}>
              <TransitionLink
                to="/pricing"
                className="group flex items-center gap-2 px-8 py-4 bg-cherry-ripe text-white rounded-full font-bold text-lg hover:bg-cherry-bright transition-all shadow-cherry-lg"
              >
                Start Picking Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </TransitionLink>
            </MagneticElement>

            <MagneticElement strength={0.3}>
              <button className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </MagneticElement>
          </motion.div>

          {/* Credential Bubbles */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CredentialBubble
              icon={<Shield className="w-5 h-5 text-cherry-light" />}
              label="Australian Business"
              value="ABN: 89 767 167 506"
              delay={1.4}
            />
            <CredentialBubble
              icon={<Target className="w-5 h-5 text-stem-light" />}
              label="Defense Verified"
              value="NCAGE: Z1ME7"
              delay={1.6}
            />
            <CredentialBubble
              icon={<Zap className="w-5 h-5 text-gold" />}
              label="Active Agents"
              value="12+ Running 24/7"
              delay={1.8}
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              The <span className="text-cherry-ripe">Orchard</span> of Features
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Each cherry represents a powerful capability, ready for you to pick.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <FeatureCherry
              icon={<Target className="w-6 h-6 text-cherry-light" />}
              title="AI Scoring"
              description="Smart lead qualification"
              stat="94% Accuracy"
              delay={0}
              glow="cherry"
            />
            <FeatureCherry
              icon={<Zap className="w-6 h-6 text-gold" />}
              title="Real-Time"
              description="Instant processing"
              stat="4,800/hour"
              delay={0.1}
              glow="gold"
            />
            <FeatureCherry
              icon={<Shield className="w-6 h-6 text-stem-light" />}
              title="Governance"
              description="CRAO compliance"
              stat="100% Audited"
              delay={0.2}
              glow="green"
            />
            <FeatureCherry
              icon={<Sparkles className="w-6 h-6 text-blue-400" />}
              title="Multi-Agent"
              description="Specialized AI teams"
              stat="4 Agents"
              delay={0.3}
              glow="blue"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Pick Your <span className="text-cherry-ripe">Plan</span>
            </h2>
            <p className="text-lg text-white/60">
              Start free, scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            <PricingCherry
              name="Seedling"
              price={0}
              features={['5 leads/month', 'Basic scoring', 'Email support']}
              delay={0}
            />
            <PricingCherry
              name="Orchard"
              price={49}
              features={['50 leads/month', 'Full AI scoring', 'Priority support', 'API access']}
              popular
              delay={0.1}
            />
            <PricingCherry
              name="Harvest"
              price={149}
              features={['Unlimited leads', 'Custom agents', 'Dedicated support', 'Webhooks']}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <CherryBubble size="xl" glow="cherry" variant="organic">
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <CherryPairIcon size={80} animate />
                </motion.div>
                <h2 className="text-3xl font-display font-bold text-white mt-6 mb-4">
                  Ready to Start Picking?
                </h2>
                <p className="text-white/60 mb-6 max-w-md">
                  Join hundreds of businesses using AI to find their perfect leads.
                </p>
                <MagneticElement strength={0.3}>
                  <TransitionLink
                    to="/pricing"
                    className="px-10 py-4 bg-cherry-ripe text-white rounded-full font-bold text-lg hover:bg-cherry-bright transition-all shadow-cherry-lg"
                  >
                    Get Started Free
                  </TransitionLink>
                </MagneticElement>
                <p className="text-xs text-white/40 mt-4">
                  No credit card required
                </p>
              </div>
            </CherryBubble>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <CherryPairIcon size={28} animate={false} />
              <span className="font-display font-bold text-white">
                Cherry<span className="text-cherry-ripe">picker</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm text-white/40">
              © 2025 Cherry Collective. ABN: 89 767 167 506
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
