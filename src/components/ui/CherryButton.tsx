import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CherryButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-cherry-ripe to-cherry-dark
    text-white
    hover:from-cherry-bright hover:to-cherry-ripe
    shadow-cherry
    hover:shadow-cherry-lg
  `,
  secondary: `
    bg-bark-medium
    text-white
    border border-cherry-ripe/30
    hover:bg-bark-light
    hover:border-cherry-ripe/50
  `,
  ghost: `
    bg-transparent
    text-cherry-light
    hover:bg-cherry-ripe/10
    hover:text-cherry-bright
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-red-800
    text-white
    hover:from-red-500 hover:to-red-700
  `,
  success: `
    bg-gradient-to-r from-stem-light to-stem-DEFAULT
    text-white
    hover:from-green-400 hover:to-stem-light
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-xl',
};

export const CherryButton = forwardRef<HTMLButtonElement, CherryButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      glow = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={`
          relative inline-flex items-center justify-center gap-2
          font-semibold transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glow ? 'animate-pulse-glow' : ''}
          ${className}
        `}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect */}
        {variant === 'primary' && (
          <span className="absolute inset-0 overflow-hidden rounded-lg">
            <span className="absolute inset-0 -translate-x-full animate-shine-sweep bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
        )}

        {isLoading ? (
          <motion.span
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

CherryButton.displayName = 'CherryButton';

export default CherryButton;
