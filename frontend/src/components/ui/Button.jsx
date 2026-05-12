import React from 'react';

const variants = {
  primary:        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-btn hover:shadow-btn-hover border border-blue-700/20',
  secondary:      'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs',
  danger:         'bg-red-600 hover:bg-red-700 text-white shadow-xs border border-red-700/20',
  success:        'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-700/20',
  ghost:          'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 border border-transparent',
  outline:        'border border-blue-200 text-blue-700 hover:bg-blue-50 active:bg-blue-100 bg-white',
  'outline-gray': 'border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 bg-white',
  /* keep legacy "gold" name as blue */
  gold:           'bg-blue-600 hover:bg-blue-700 text-white shadow-btn border border-blue-700/20',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-md',
  sm: 'px-3    py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-4    py-2   text-sm gap-2   rounded-lg',
  lg: 'px-5    py-2.5 text-sm gap-2   rounded-lg',
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
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-150 select-none shrink-0 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
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
