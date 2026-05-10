import React from 'react';

const variants = {
  primary:   'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  success:   'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600',
  outline:   'border border-primary-200 text-primary-600 hover:bg-primary-50',
  'outline-gray': 'border border-slate-200 text-slate-600 hover:bg-slate-50',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5',
  sm: 'px-3 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size],
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 h-4 w-4 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
