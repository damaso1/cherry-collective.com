import React from 'react';
import { motion } from 'framer-motion';
import { MagneticElement } from '../effects/MagneticElement';
import { Settings, Bell, Search } from 'lucide-react';
import { CherryIcon } from '../icons';
import { useNavigateWithTransition } from '../../core/transitions';

interface ImmersiveHeaderProps {
  title: string;
  subtitle?: string;
}

export const ImmersiveHeader: React.FC<ImmersiveHeaderProps> = ({
  title,
  subtitle,
}) => {
  const { navigateWithTransition } = useNavigateWithTransition();

  return (
    <div className="relative px-6 py-8">
      {/* Floating nav bubbles */}
      <div className="absolute top-4 right-6 flex items-center gap-3 z-20">
        <MagneticElement
          strength={0.2}
          distance={80}
          scale={1.1}
          glowColor="rgba(196, 30, 58, 0.3)"
        >
          <motion.button
            className="w-10 h-10 rounded-full bg-bark-medium/60 backdrop-blur-sm border border-cherry-ripe/20
                       flex items-center justify-center text-white/60 hover:text-white transition-colors"
            whileHover={{ backgroundColor: 'rgba(196, 30, 58, 0.2)' }}
          >
            <Search className="w-4 h-4" />
          </motion.button>
        </MagneticElement>

        <MagneticElement
          strength={0.2}
          distance={80}
          scale={1.1}
          glowColor="rgba(50, 205, 50, 0.3)"
        >
          <motion.button
            className="w-10 h-10 rounded-full bg-bark-medium/60 backdrop-blur-sm border border-stem-light/20
                       flex items-center justify-center text-white/60 hover:text-white transition-colors relative"
            whileHover={{ backgroundColor: 'rgba(50, 205, 50, 0.2)' }}
          >
            <Bell className="w-4 h-4" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cherry-ripe" />
          </motion.button>
        </MagneticElement>

        <MagneticElement
          strength={0.2}
          distance={80}
          scale={1.1}
        >
          <motion.button
            onClick={() => navigateWithTransition('/settings')}
            className="w-10 h-10 rounded-full bg-bark-medium/60 backdrop-blur-sm border border-white/10
                       flex items-center justify-center text-white/60 hover:text-white transition-colors"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </MagneticElement>
      </div>

      {/* Main header content */}
      <div className="flex items-center gap-6">
        {/* Home bubble */}
        <MagneticElement
          strength={0.3}
          distance={100}
          glowColor="rgba(196, 30, 58, 0.4)"
          onClick={() => navigateWithTransition('/')}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-cherry-ripe to-cherry-dark
                       flex items-center justify-center shadow-lg shadow-cherry-ripe/30 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CherryIcon size={28} ripe animate />
          </motion.div>
        </MagneticElement>

        {/* Title and subtitle */}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-display font-bold text-white"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50 mt-1"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>

      {/* Decorative gradient line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cherry-ripe/30 to-transparent"
      />
    </div>
  );
};

export default ImmersiveHeader;
