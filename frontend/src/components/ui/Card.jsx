import React from 'react';

export default function Card({ children, className = '', padding = true, hover = false, accent, elevated = false }) {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-slate-100',
        elevated ? 'shadow-modal' : 'shadow-card',
        hover && 'hover:shadow-card-hover hover:-translate-y-px transition-all duration-200 cursor-pointer',
        accent && `border-l-[3px] border-l-${accent}`,
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
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, iconColor = 'text-blue-600', iconBg = 'bg-blue-50', trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
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
