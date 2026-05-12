import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50   text-amber-700   border border-amber-100',
  danger:  'bg-red-50     text-red-700     border border-red-100',
  info:    'bg-blue-50    text-blue-700    border border-blue-100',
  gray:    'bg-slate-50   text-slate-600   border border-slate-200',
  purple:  'bg-violet-50  text-violet-700  border border-violet-100',
  orange:  'bg-orange-50  text-orange-700  border border-orange-100',
  /* keep "gold" as blue alias */
  gold:    'bg-blue-50    text-blue-700    border border-blue-100',
};

const dots = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  gray:    'bg-slate-400',
  purple:  'bg-violet-500',
  orange:  'bg-orange-500',
  gold:    'bg-blue-500',
};

export default function Badge({ children, variant = 'gray', className = '', dot = false }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        variants[variant] ?? variants.gray,
        className,
      ].join(' ')}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[variant] ?? dots.gray}`} />}
      {children}
    </span>
  );
}
