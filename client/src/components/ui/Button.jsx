import { forwardRef } from 'react';

const VARIANTS = {
  primary:
    'bg-accent text-white hover:bg-accent-hover disabled:bg-neutral-200 disabled:text-neutral-400',
  secondary:
    'bg-transparent text-ink border border-neutral-200 hover:border-ink disabled:text-neutral-400 disabled:border-neutral-200',
  ghost:
    'bg-transparent text-ink hover:bg-neutral-100 disabled:text-neutral-400',
  danger:
    'bg-danger text-white hover:opacity-90 disabled:bg-neutral-200 disabled:text-neutral-400',
};

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium
        transition-colors duration-150 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
