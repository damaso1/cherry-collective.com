import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              <LeftIcon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full bg-bark-medium border rounded-lg text-white
              transition-all duration-200
              placeholder:text-white/30
              focus:outline-none focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${LeftIcon ? 'pl-10' : 'pl-4'}
              ${RightIcon ? 'pr-10' : 'pr-4'}
              py-2.5
              ${
                error
                  ? 'border-cherry-ripe focus:border-cherry-ripe focus:ring-cherry-ripe/30'
                  : 'border-cherry-ripe/20 focus:border-cherry-ripe/50 focus:ring-cherry-ripe/20'
              }
              ${className}
            `}
            {...props}
          />

          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-sm text-cherry-light"
          >
            {error}
          </motion.p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-white/40">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input variant
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={Search}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch((e.target as HTMLInputElement).value);
          }
        }}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default Input;
