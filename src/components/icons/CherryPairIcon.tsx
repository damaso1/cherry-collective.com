import { motion } from 'framer-motion';

interface CherryPairIconProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export const CherryPairIcon = ({
  size = 48,
  animate = true,
  className = ''
}: CherryPairIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 120 100"
    className={className}
    whileHover={animate ? { scale: 1.05 } : undefined}
  >
    <defs>
      <radialGradient id="cherryPairGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#C41E3A" />
        <stop offset="100%" stopColor="#8B0000" />
      </radialGradient>
      <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#32CD32" />
        <stop offset="100%" stopColor="#228B22" />
      </linearGradient>
      <filter id="cherryGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Left Stem */}
    <motion.path
      d="M60 5 Q40 25 35 50"
      stroke="url(#stemGradient)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      animate={animate ? {
        d: ["M60 5 Q40 25 35 50", "M60 5 Q38 25 35 50", "M60 5 Q40 25 35 50"]
      } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Right Stem */}
    <motion.path
      d="M60 5 Q80 25 85 50"
      stroke="url(#stemGradient)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      animate={animate ? {
        d: ["M60 5 Q80 25 85 50", "M60 5 Q82 25 85 50", "M60 5 Q80 25 85 50"]
      } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    />

    {/* Leaf */}
    <motion.ellipse
      cx="60"
      cy="12"
      rx="15"
      ry="7"
      fill="#32CD32"
      animate={animate ? {
        scale: [1, 1.05, 1],
        rotate: [0, 5, 0]
      } : undefined}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '60px 12px' }}
    />

    {/* Left Cherry */}
    <motion.circle
      cx="35"
      cy="70"
      r="25"
      fill="url(#cherryPairGradient)"
      filter="url(#cherryGlow)"
      animate={animate ? { y: [0, -3, 0] } : undefined}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
    />

    {/* Right Cherry */}
    <motion.circle
      cx="85"
      cy="70"
      r="25"
      fill="url(#cherryPairGradient)"
      filter="url(#cherryGlow)"
      animate={animate ? { y: [0, -3, 0] } : undefined}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut", delay: 0.3 }}
    />

    {/* Left Highlight */}
    <ellipse
      cx="27"
      cy="62"
      rx="7"
      ry="4"
      fill="rgba(255,255,255,0.4)"
      transform="rotate(-30 27 62)"
    />

    {/* Right Highlight */}
    <ellipse
      cx="77"
      cy="62"
      rx="7"
      ry="4"
      fill="rgba(255,255,255,0.4)"
      transform="rotate(-30 77 62)"
    />
  </motion.svg>
);

export default CherryPairIcon;
