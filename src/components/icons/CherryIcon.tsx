import { motion } from 'framer-motion';

interface CherryIconProps {
  size?: number;
  ripe?: boolean;
  animate?: boolean;
  className?: string;
}

export const CherryIcon = ({
  size = 24,
  ripe = true,
  animate = false,
  className = ''
}: CherryIconProps) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    whileHover={animate ? { scale: 1.1 } : undefined}
  >
    <defs>
      <radialGradient id="cherryGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#C41E3A" />
        <stop offset="100%" stopColor="#8B0000" />
      </radialGradient>
      <radialGradient id="unripeGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#FFD4D4" />
        <stop offset="50%" stopColor="#FFB3BA" />
        <stop offset="100%" stopColor="#FF9999" />
      </radialGradient>
    </defs>

    {/* Stem */}
    <motion.path
      d="M50 10 Q60 30 50 45"
      stroke="#228B22"
      strokeWidth="3"
      fill="none"
      animate={animate ? {
        d: ["M50 10 Q60 30 50 45", "M50 10 Q55 30 50 45", "M50 10 Q60 30 50 45"]
      } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Leaf */}
    <motion.ellipse
      cx="62"
      cy="20"
      rx="12"
      ry="6"
      fill="#32CD32"
      transform="rotate(-30 62 20)"
      animate={animate ? {
        scale: [1, 1.05, 1],
        rotate: [-30, -25, -30]
      } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '62px 20px' }}
    />

    {/* Cherry body */}
    <motion.circle
      cx="50"
      cy="65"
      r="28"
      fill={ripe ? "url(#cherryGradient)" : "url(#unripeGradient)"}
      animate={animate ? { y: [0, -4, 0] } : undefined}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
    />

    {/* Highlight */}
    <ellipse
      cx="40"
      cy="55"
      rx="8"
      ry="5"
      fill="rgba(255,255,255,0.4)"
      transform="rotate(-30 40 55)"
    />
  </motion.svg>
);

export default CherryIcon;
