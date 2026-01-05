import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Copyright, ExternalLink } from 'lucide-react';
import { CherryPairIcon } from '../icons';
import { MagneticElement } from '../effects/MagneticElement';
import { useNavigateWithTransition } from '../../core/transitions';

interface LegalFooterProps {
  className?: string;
  minimal?: boolean;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({ className = '', minimal = false }) => {
  const { navigateWithTransition } = useNavigateWithTransition();

  const currentYear = 2026;

  if (minimal) {
    return (
      <footer className={`py-4 text-center ${className}`}>
        <p className="text-white/30 text-xs">
          © {currentYear} Cherry Enterprise (ABN: 89 767 167 506). All Rights Reserved.
        </p>
      </footer>
    );
  }

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`relative bg-bark-dark/80 backdrop-blur-xl border-t border-cherry-ripe/10 ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-cherry-ripe/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-32 bg-cherry-dark/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-1 md:col-span-2">
            <MagneticElement strength={0.15}>
              <button
                onClick={() => navigateWithTransition('/')}
                className="flex items-center gap-3 mb-4"
              >
                <CherryPairIcon size={32} animate />
                <span className="font-display font-bold text-xl text-white">
                  Cherry<span className="text-cherry-ripe">picker</span>
                </span>
              </button>
            </MagneticElement>
            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-4">
              AI-powered lead intelligence platform with the Immersive Orchard interface.
              Pick the ripest leads with precision and grow your business.
            </p>
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>ABN: 89 767 167 506</span>
              </div>
              <div>NCAGE: Z1ME7</div>
            </div>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <MagneticElement strength={0.1}>
                  <button
                    onClick={() => navigateWithTransition('/terms')}
                    className="text-white/50 hover:text-cherry-light transition-colors text-sm"
                  >
                    Terms of Service
                  </button>
                </MagneticElement>
              </li>
              <li>
                <MagneticElement strength={0.1}>
                  <button
                    onClick={() => navigateWithTransition('/privacy')}
                    className="text-white/50 hover:text-cherry-light transition-colors text-sm"
                  >
                    Privacy Policy
                  </button>
                </MagneticElement>
              </li>
              <li>
                <MagneticElement strength={0.1}>
                  <button
                    onClick={() => navigateWithTransition('/ip')}
                    className="text-white/50 hover:text-cherry-light transition-colors text-sm"
                  >
                    IP & Trademarks
                  </button>
                </MagneticElement>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <MagneticElement strength={0.1}>
                  <button
                    onClick={() => navigateWithTransition('/pricing')}
                    className="text-white/50 hover:text-cherry-light transition-colors text-sm"
                  >
                    Pricing
                  </button>
                </MagneticElement>
              </li>
              <li>
                <MagneticElement strength={0.1}>
                  <button
                    onClick={() => navigateWithTransition('/dashboard')}
                    className="text-white/50 hover:text-cherry-light transition-colors text-sm"
                  >
                    Dashboard
                  </button>
                </MagneticElement>
              </li>
              <li>
                <a
                  href="mailto:support@cherry-collective.com"
                  className="flex items-center gap-1 text-white/50 hover:text-cherry-light transition-colors text-sm"
                >
                  Contact
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="pt-8 border-t border-cherry-ripe/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Copyright className="w-3 h-3" />
              <span>{currentYear} Cherry Enterprise. All Rights Reserved.</span>
            </div>
            <div className="text-white/20 text-xs text-center md:text-right">
              <p>
                Protected by Australian Copyright Act 1968 and International Treaties.
              </p>
              <p className="mt-1">
                The Immersive Orchard is a registered trademark of Cherry Enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default LegalFooter;
