import React from 'react';

const colorMap = {
  blue:   { bar: 'bg-primary-600',  iconBg: 'bg-primary-50',  iconText: 'text-primary-600'  },
  green:  { bar: 'bg-emerald-500',  iconBg: 'bg-emerald-50',  iconText: 'text-emerald-600'  },
  orange: { bar: 'bg-orange-500',   iconBg: 'bg-orange-50',   iconText: 'text-orange-600'   },
  red:    { bar: 'bg-red-500',      iconBg: 'bg-red-50',      iconText: 'text-red-500'      },
  purple: { bar: 'bg-violet-500',   iconBg: 'bg-violet-50',   iconText: 'text-violet-600'   },
  amber:  { bar: 'bg-amber-500',    iconBg: 'bg-amber-50',    iconText: 'text-amber-600'    },
  cyan:   { bar: 'bg-cyan-500',     iconBg: 'bg-cyan-50',     iconText: 'text-cyan-600'     },
  gold:   { bar: 'bg-gold-500',     iconBg: 'bg-gold-50',     iconText: 'text-gold-600'     },
};

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
  const c      = colorMap[color] ?? colorMap.blue;
  const isUp   = trend === 'up';
  const isDown = trend === 'down';

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-card overflow-hidden hover:shadow-card-hover transition-shadow duration-200 group">
      {/* Accent bar */}
      <div className={`h-0.5 w-full ${c.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-medium text-obsidian-400 leading-tight pr-2 font-sans">{title}</p>
          {Icon && (
            <div className={`p-2.5 rounded-xl ${c.iconBg} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
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
                  'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md font-display',
                  isUp   ? 'bg-emerald-50 text-emerald-700' :
                  isDown ? 'bg-red-50 text-red-600'         : 'bg-[#F4F1EB] text-obsidian-500',
                ].join(' ')}
              >
                {isUp ? '↑' : isDown ? '↓' : '→'} {trendValue}
              </span>
            )}
            {subtitle && <p className="text-xs text-obsidian-400 font-sans">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
