import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const colorMap = {
  blue:   { bar: 'bg-primary-600', from: 'from-primary-500',  to: 'to-primary-700',  iconText: 'text-white' },
  green:  { bar: 'bg-emerald-500', from: 'from-emerald-400',  to: 'to-emerald-600',  iconText: 'text-white' },
  orange: { bar: 'bg-orange-500',  from: 'from-orange-400',   to: 'to-orange-600',   iconText: 'text-white' },
  red:    { bar: 'bg-red-500',     from: 'from-red-400',      to: 'to-red-600',      iconText: 'text-white' },
  purple: { bar: 'bg-violet-500',  from: 'from-violet-400',   to: 'to-violet-600',   iconText: 'text-white' },
  amber:  { bar: 'bg-amber-500',   from: 'from-amber-400',    to: 'to-amber-500',    iconText: 'text-white' },
  cyan:   { bar: 'bg-cyan-500',    from: 'from-cyan-400',     to: 'to-cyan-600',     iconText: 'text-white' },
  gold:   { bar: 'bg-gold-500',    from: 'from-gold-400',     to: 'to-gold-600',     iconText: 'text-obsidian-900' },
};

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
  const c      = colorMap[color] ?? colorMap.blue;
  const isUp   = trend === 'up';
  const isDown = trend === 'down';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200 group">
      {/* Color accent bar */}
      <div className={`h-[3px] w-full ${c.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-obsidian-400 leading-tight pr-2 font-sans">{title}</p>
          {Icon && (
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${c.from} ${c.to} shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}>
              <Icon size={16} className={c.iconText} strokeWidth={2} />
            </div>
          )}
        </div>

        <p className="font-display text-[1.65rem] font-bold text-obsidian-900 leading-none tracking-tight animate-count-up">
          {value}
        </p>

        {(subtitle || trendValue) && (
          <div className="flex items-center gap-2 mt-2.5">
            {trendValue && (
              <span
                className={[
                  'inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg font-sans',
                  isUp   ? 'bg-emerald-50 text-emerald-700' :
                  isDown ? 'bg-red-50 text-red-600'         : 'bg-[#F4F1EB] text-obsidian-500',
                ].join(' ')}
              >
                <TrendIcon size={11} strokeWidth={2.5} />
                {trendValue}
              </span>
            )}
            {subtitle && <p className="text-xs text-obsidian-400 font-sans">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
