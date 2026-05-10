import React from 'react';

const colorMap = {
  blue:   { bg: 'bg-blue-50',    icon: 'text-blue-600',    border: 'border-blue-100'   },
  green:  { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
  orange: { bg: 'bg-orange-50',  icon: 'text-orange-500',  border: 'border-orange-100'  },
  red:    { bg: 'bg-red-50',     icon: 'text-red-500',     border: 'border-red-100'    },
  purple: { bg: 'bg-violet-50',  icon: 'text-violet-600',  border: 'border-violet-100'  },
  amber:  { bg: 'bg-amber-50',   icon: 'text-amber-600',   border: 'border-amber-100'   },
  cyan:   { bg: 'bg-cyan-50',    icon: 'text-cyan-600',    border: 'border-cyan-100'   },
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  trendValue,
}) {
  const c = colorMap[color] ?? colorMap.blue;
  const isUp   = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-slate-500 leading-tight pr-2">{title}</p>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${c.bg} ${c.border} border shrink-0`}>
            <Icon size={16} className={c.icon} strokeWidth={2} />
          </div>
        )}
      </div>

      <p className="text-[1.6rem] font-extrabold text-slate-900 leading-none tracking-tight">{value}</p>

      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 mt-2.5">
          {trendValue && (
            <span
              className={[
                'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
                isUp   ? 'bg-emerald-50 text-emerald-600' :
                isDown ? 'bg-red-50 text-red-500'         : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {isUp ? '↑' : isDown ? '↓' : '→'} {trendValue}
            </span>
          )}
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
