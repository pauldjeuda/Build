import React from 'react';

const variants = {
  primary:      'bg-gold-500 hover:bg-gold-600 text-obsidian-900 shadow-gold hover:shadow-none border border-gold-600/20',
  secondary:    'bg-obsidian-900 hover:bg-obsidian-800 text-white border border-obsidian-800',
  danger:       'bg-red-500 hover:bg-red-600 text-white shadow-sm border border-red-600/20',
  success:      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-700/20',
  ghost:        'bg-transparent hover:bg-black/5 text-obsidian-500 border border-transparent',
  outline:      'border border-gold-400 text-gold-600 hover:bg-gold-50 bg-white',
  'outline-gray': 'border border-[#E8E2D9] text-obsidian-500 hover:bg-canvas bg-white',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg',
  sm: 'px-3.5 py-2 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-5 py-3 text-sm gap-2.5 rounded-xl',
};

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  icon,
  iconRight,
  loading  = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-display font-semibold tracking-wide',
        'transition-all duration-150 select-none shrink-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 flex items-center">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && !loading && <span className="shrink-0 flex items-center">{iconRight}</span>}
    </button>
  );
}
