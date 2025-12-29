'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button component with gradient styling
 * Uses the indigo-purple-pink gradient for primary actions
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'font-medium tracking-wide transition-all duration-300',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-void',
          // Variants
          variant === 'primary' && 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]',
          variant === 'secondary' && 'border border-neutral-700 text-text-primary hover:border-purple-400 hover:text-purple-400 active:scale-[0.98]',
          variant === 'ghost' && 'text-text-secondary hover:text-text-primary hover:bg-neutral-900',
          // Sizes
          size === 'sm' && 'px-4 py-2 text-sm rounded-md',
          size === 'md' && 'px-6 py-3 text-sm rounded-lg',
          size === 'lg' && 'px-8 py-4 text-base rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
