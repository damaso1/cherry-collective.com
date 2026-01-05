import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { CherryPairIcon } from '../icons';
import { CherryButton } from '../ui/CherryButton';

const benefits = [
  'Unlimited lead scoring',
  'Real-time AI analysis',
  '24/7 autonomous hunting',
  'Full CRAO governance',
  'API & webhook access',
  'Priority support',
];

export const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bark-dark via-cherry-dark/20 to-bark-dark" />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cherry-ripe/20 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center cherry-border-glow"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex mb-8"
          >
            <CherryPairIcon size={80} animate />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Ready to Start Picking?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/70 mb-8 max-w-2xl mx-auto"
          >
            Join forward-thinking teams using AI to identify and close their
            best opportunities faster.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-cherry-ripe/10 rounded-full border border-cherry-ripe/20"
              >
                <Check className="w-4 h-4 text-stem-light" />
                <span className="text-sm text-white/80">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <CherryButton
              size="lg"
              glow
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </CherryButton>
            <CherryButton variant="ghost" size="lg">
              Contact Sales
            </CherryButton>
          </motion.div>

          {/* Trust badges */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-sm text-white/40"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
