import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  onComplete,
}: AnimatedCounterProps) => {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) => {
    const formatted = current.toFixed(decimals);
    return `${prefix}${Number(formatted).toLocaleString()}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(value);

    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration * 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [value, spring, display, duration, onComplete]);

  return (
    <motion.span
      className={`tabular-nums ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
    </motion.span>
  );
};

// Money counter with special formatting
interface MoneyCounterProps {
  value: number;
  currency?: string;
  duration?: number;
  className?: string;
}

export const MoneyCounter = ({
  value,
  currency = '$',
  duration = 2,
  className = '',
}: MoneyCounterProps) => {
  return (
    <AnimatedCounter
      value={value}
      prefix={currency}
      decimals={2}
      duration={duration}
      className={className}
    />
  );
};

// Percentage counter
interface PercentCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const PercentCounter = ({
  value,
  duration = 1.5,
  className = '',
}: PercentCounterProps) => {
  return (
    <AnimatedCounter
      value={value}
      suffix="%"
      decimals={1}
      duration={duration}
      className={className}
    />
  );
};

export default AnimatedCounter;
