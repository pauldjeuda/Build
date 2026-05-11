import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-50  text-amber-800  border border-amber-200',
  danger:  'bg-red-50    text-red-700    border border-red-200',
  info:    'bg-blue-50   text-blue-700   border border-blue-200',
  gray:    'bg-[#F4F1EB] text-obsidian-500 border border-[#E8E2D9]',
  purple:  'bg-violet-50 text-violet-700 border border-violet-200',
  orange:  'bg-orange-50 text-orange-700 border border-orange-200',
  gold:    'bg-gold-100  text-gold-700   border border-gold-300',
};

const dots = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  gray:    'bg-obsidian-300',
  purple:  'bg-violet-500',
  orange:  'bg-orange-500',
  gold:    'bg-gold-500',
};

export default function Badge({ children, variant = 'gray', className = '', dot = false }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium font-display',
        variants[variant] ?? variants.gray,
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[variant] ?? dots.gray}`} />
      )}
      {children}
    </span>
  );
}
