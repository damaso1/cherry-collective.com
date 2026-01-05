import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, CreditCard, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CherryBubble } from '../components/cherry/CherryBubble';
import { MagneticElement } from '../components/effects/MagneticElement';
import { CherryPairIcon } from '../components/icons';
import { TransitionLink } from '../core/transitions';

const subscriptionPlans = [
  {
    id: 'seedling',
    name: 'Seedling',
    price: 0,
    period: 'Forever free',
    features: ['5 leads/month', 'Basic scoring', 'Email support'],
    cta: 'Get Started',
    popular: false,
    glow: 'green' as const,
    description: 'Plant your first seeds',
  },
  {
    id: 'orchard',
    name: 'Orchard',
    price: 49,
    period: '/month',
    features: ['50 leads/month', 'Full AI scoring', 'Priority support', 'API access', '50 credits/month'],
    cta: 'Start Growing',
    popular: true,
    glow: 'cherry' as const,
    description: 'Watch your garden flourish',
  },
  {
    id: 'harvest',
    name: 'Harvest',
    price: 149,
    period: '/month',
    features: ['Unlimited leads', 'Custom agents', 'Dedicated support', 'Webhooks', '200 credits/month', 'Advanced analytics'],
    cta: 'Start Harvesting',
    popular: false,
    glow: 'gold' as const,
    description: 'Reap abundant rewards',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    period: '/month',
    features: ['Everything in Harvest', 'White-label', 'Custom integrations', 'SLA guarantee', 'Account manager', 'Unlimited credits'],
    cta: 'Contact Sales',
    popular: false,
    glow: 'blue' as const,
    description: 'Own the entire orchard',
  },
];

const creditPacks = [
  { id: 'starter', name: 'Starter', credits: 25, price: 25, perCredit: '1.00' },
  { id: 'growth', name: 'Growth', credits: 125, price: 100, perCredit: '0.80' },
  { id: 'scale', name: 'Scale', credits: 350, price: 250, perCredit: '0.71' },
  { id: 'enterprise', name: 'Enterprise', credits: 800, price: 500, perCredit: '0.63' },
];

const agentServices = [
  { name: 'CRA Analysis', credits: 2, description: 'Comprehensive lead scoring', icon: Zap },
  { name: 'MLB Outreach', credits: 5, description: 'Automated outreach sequence', icon: Crown },
  { name: 'FAB Application', credits: 10, description: 'Full application generation', icon: Building2 },
  { name: 'SDB Research', credits: 3, description: 'Deep company research', icon: Sparkles },
];

const BILLING_API_URL = import.meta.env.VITE_BILLING_API_URL || 'https://nonfallacious-emilio-nondissipative.ngrok-free.dev';

const handleSubscribe = async (planId: string) => {
  const customerEmail = prompt('Enter your email to continue:');
  if (!customerEmail) return;

  if (planId === 'seedling') {
    window.location.href = '/dashboard';
    return;
  }

  try {
    const response = await fetch(`${BILLING_API_URL}/api/checkout/subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, customer_email: customerEmail })
    });
    const data = await response.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert('Failed to create checkout session. Please try again.');
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    alert('Failed to connect to billing service. Please try again.');
  }
};

const handleBuyCredits = async (packId: string) => {
  const customerEmail = prompt('Enter your email to continue:');
  if (!customerEmail) return;

  try {
    const response = await fetch(`${BILLING_API_URL}/api/checkout/credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pack: packId, customer_email: customerEmail })
    });
    const data = await response.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert('Failed to create checkout session. Please try again.');
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    alert('Failed to connect to billing service. Please try again.');
  }
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bark-dark relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-stem-light/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bark-dark/60 backdrop-blur-xl border-b border-cherry-ripe/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <MagneticElement strength={0.2} distance={80} glow={false}>
              <TransitionLink to="/" className="flex items-center gap-3 group">
                <CherryPairIcon size={36} animate />
                <span className="font-display font-bold text-xl text-white">
                  Cherry<span className="text-cherry-ripe">picker</span>
                </span>
              </TransitionLink>
            </MagneticElement>

            <div className="flex items-center gap-3">
              <MagneticElement strength={0.2} distance={60}>
                <motion.button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm
                             hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              </MagneticElement>

              <MagneticElement strength={0.2} distance={60}>
                <TransitionLink to="/dashboard">
                  <motion.button
                    className="px-4 py-2 rounded-full bg-cherry-ripe/20 text-cherry-light text-sm font-medium
                               hover:bg-cherry-ripe/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dashboard
                  </motion.button>
                </TransitionLink>
              </MagneticElement>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-block mb-6"
            >
              <CherryPairIcon size={64} animate />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
              Pick Your <span className="text-cherry-ripe">Plan</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start free, scale as you grow. All plans include our core AI-powered lead intelligence.
            </p>
            <p className="text-sm text-white/30 mt-3">ABN: 89 767 167 506</p>
          </motion.div>

          {/* Subscription Plans - Cherry Bubble Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                  >
                    <span className="bg-cherry-ripe px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg shadow-cherry-ripe/30">
                      Most Popular
                    </span>
                  </motion.div>
                )}

                <MagneticElement
                  strength={0.15}
                  distance={100}
                  glowColor={
                    plan.glow === 'cherry' ? 'rgba(196, 30, 58, 0.4)' :
                    plan.glow === 'green' ? 'rgba(50, 205, 50, 0.4)' :
                    plan.glow === 'gold' ? 'rgba(255, 215, 0, 0.4)' :
                    'rgba(100, 149, 237, 0.4)'
                  }
                >
                  <CherryBubble
                    variant="organic"
                    size="lg"
                    glow={plan.glow}
                    magnetic={false}
                    className={`h-full ${plan.popular ? 'ring-2 ring-cherry-ripe/50' : ''}`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Plan header */}
                      <div className="text-center mb-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
                          {plan.description}
                        </p>
                        <h3 className="text-2xl font-display font-bold text-white">{plan.name}</h3>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-4">
                        <span className="text-4xl font-bold text-white">${plan.price}</span>
                        <span className="text-white/50 text-sm">{plan.period}</span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 mb-6 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-white/80">
                            <div className="w-5 h-5 rounded-full bg-stem-light/20 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-stem-light" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <MagneticElement strength={0.3} distance={50} glow={false}>
                        <motion.button
                          onClick={() => handleSubscribe(plan.id)}
                          className={`
                            w-full py-3 rounded-full font-semibold text-sm transition-all
                            ${plan.popular
                              ? 'bg-cherry-ripe text-white shadow-lg shadow-cherry-ripe/30 hover:bg-cherry-dark'
                              : 'bg-white/10 text-white hover:bg-white/20'
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {plan.cta}
                        </motion.button>
                      </MagneticElement>
                    </div>
                  </CherryBubble>
                </MagneticElement>
              </motion.div>
            ))}
          </div>

          {/* Credit Packs Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gold" />
                </div>
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Credit Packs
              </h2>
              <p className="text-white/50 max-w-xl mx-auto">
                Power up your agents with credits for premium services
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {creditPacks.map((pack, index) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <MagneticElement strength={0.2} distance={80} glowColor="rgba(255, 215, 0, 0.3)">
                    <CherryBubble variant="soft" size="sm" glow="gold" magnetic={false}>
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-white mb-2">{pack.name}</h4>
                        <div className="text-3xl font-bold text-gold mb-1">{pack.credits}</div>
                        <div className="text-white/50 text-xs mb-3">credits</div>
                        <div className="text-xl font-bold text-white mb-1">${pack.price}</div>
                        <div className="text-white/30 text-xs mb-4">${pack.perCredit}/credit</div>
                        <motion.button
                          onClick={() => handleBuyCredits(pack.id)}
                          className="w-full py-2 rounded-full bg-gold/20 text-gold text-sm font-medium
                                     hover:bg-gold/30 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Buy Now
                        </motion.button>
                      </div>
                    </CherryBubble>
                  </MagneticElement>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Agent Services */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <CherryBubble variant="soft" size="xl" glow="cherry" magnetic={false}>
              <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">
                What Can You Do With Credits?
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {agentServices.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <motion.div
                      key={service.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="text-center"
                    >
                      <MagneticElement strength={0.3} distance={60} glowColor="rgba(196, 30, 58, 0.3)">
                        <div className="w-14 h-14 bg-cherry-ripe/20 rounded-full flex items-center justify-center mx-auto mb-3
                                        hover:bg-cherry-ripe/30 transition-colors cursor-pointer">
                          <IconComponent className="w-7 h-7 text-cherry-light" />
                        </div>
                      </MagneticElement>
                      <h4 className="font-bold text-white mb-1">{service.name}</h4>
                      <p className="text-cherry-light text-sm font-semibold mb-1">{service.credits} credits</p>
                      <p className="text-white/40 text-xs">{service.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </CherryBubble>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-white/40 text-sm mb-4">
              Secure payments powered by Stripe. Cancel anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white/30 text-xs">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stem-light/50" />
                256-bit SSL Encryption
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stem-light/50" />
                PCI Compliant
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-stem-light/50" />
                Australian Business
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative cherries */}
      <FloatingPricingCherries />

      {/* Footer */}
      <footer className="relative py-8 border-t border-cherry-ripe/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-white/40">
            © 2025 Cherrypicker Collective. ABN: 89 767 167 506. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Floating decorative cherries for pricing page
const FloatingPricingCherries: React.FC = () => {
  const cherries = [
    { x: 5, delay: 0, duration: 20, size: 16 },
    { x: 15, delay: 3, duration: 25, size: 12 },
    { x: 85, delay: 5, duration: 22, size: 14 },
    { x: 92, delay: 8, duration: 18, size: 10 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {cherries.map((cherry, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
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

export default PricingPage;
