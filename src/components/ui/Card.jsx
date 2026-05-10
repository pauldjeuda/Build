import React from 'react';

export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100',
        'shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.04)]',
        hover && 'hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] transition-shadow duration-200 cursor-pointer',
        padding ? 'p-5' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-5 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, iconColor = 'text-primary-600', iconBg = 'bg-primary-50', trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500 leading-snug">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-xl ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-2 mt-1.5">
          {trend && (
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      )}
    </div>
  );
}
