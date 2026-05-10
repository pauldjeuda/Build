import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  danger:  'bg-red-50 text-red-600 ring-1 ring-red-200',
  info:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  gray:    'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  purple:  'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  orange:  'bg-orange-50 text-orange-600 ring-1 ring-orange-200',
};

export default function Badge({ children, variant = 'gray', className = '', dot = false }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant] ?? variants.gray,
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={[
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' ? 'bg-emerald-500' :
            variant === 'danger'  ? 'bg-red-500'     :
            variant === 'warning' ? 'bg-amber-500'   :
            variant === 'info'    ? 'bg-blue-500'    : 'bg-slate-400',
          ].join(' ')}
        />
      )}
      {children}
    </span>
  );
}
