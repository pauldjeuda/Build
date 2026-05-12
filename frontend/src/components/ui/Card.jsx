import React from 'react';

export default function Card({ children, className = '', padding = true, hover = false, accent, elevated = false }) {
  return (
    <div
      className={[
        'bg-white rounded-2xl border border-[#E8E2D9]',
        elevated ? 'shadow-modal' : 'shadow-card',
        hover && 'hover:shadow-card-hover transition-all duration-200 cursor-pointer hover:-translate-y-px',
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
    <div className={`flex items-start justify-between mb-5 ${className}`}>
      <div>
        <h3 className="font-display text-sm font-bold text-obsidian-900 leading-tight tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-obsidian-400 mt-0.5 font-sans">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, iconColor = 'text-gold-500', iconBg = 'bg-gold-50', trend, trendUp }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-obsidian-400 leading-snug font-sans">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-xl ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-obsidian-900 tracking-tight">{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-2 mt-1.5">
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          {sub && <p className="text-xs text-obsidian-400 font-sans">{sub}</p>}
        </div>
      )}
    </div>
  );
}
