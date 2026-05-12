import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const colorMap = {
  blue:   { border: 'border-l-blue-500',    icon: 'bg-blue-50 text-blue-600'   },
  green:  { border: 'border-l-emerald-500', icon: 'bg-emerald-50 text-emerald-600' },
  orange: { border: 'border-l-orange-500',  icon: 'bg-orange-50 text-orange-600'  },
  red:    { border: 'border-l-red-500',      icon: 'bg-red-50 text-red-600'    },
  purple: { border: 'border-l-violet-500',  icon: 'bg-violet-50 text-violet-600'  },
  amber:  { border: 'border-l-amber-500',   icon: 'bg-amber-50 text-amber-600' },
  cyan:   { border: 'border-l-cyan-500',    icon: 'bg-cyan-50 text-cyan-600'   },
  gold:   { border: 'border-l-blue-500',    icon: 'bg-blue-50 text-blue-600'   },
};

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
  const c      = colorMap[color] ?? colorMap.blue;
  const isUp   = trend === 'up';
  const isDown = trend === 'down';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 border-l-[3px] ${c.border} shadow-card p-5 hover:shadow-card-hover transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-lg ${c.icon} shrink-0`}>
            <Icon size={15} strokeWidth={2} />
          </div>
        )}
      </div>

      <p className="text-2xl font-semibold text-slate-900 tracking-tight animate-count-up">
        {value}
      </p>

      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 mt-2">
          {trendValue && (
            <span className={[
              'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md',
              isUp   ? 'bg-emerald-50 text-emerald-700' :
              isDown ? 'bg-red-50 text-red-600'         : 'bg-slate-100 text-slate-500',
            ].join(' ')}>
              <TrendIcon size={11} strokeWidth={2} />
              {trendValue}
            </span>
          )}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
