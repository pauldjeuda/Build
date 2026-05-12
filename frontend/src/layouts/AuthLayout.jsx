import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'Suivi chantiers en temps réel',
  'Gestion stock & approvisionnements',
  'Finance, budgets & facturation',
  'Rapports HSE & conformité réglementaire',
  'Multi-rôles : DG, DAF, CDT, CDC, GST, LOG, HSE',
];

const STATS = [
  { value: '120+', label: 'Chantiers actifs'   },
  { value: '8',    label: 'Modules intégrés'   },
  { value: '7',    label: 'Rôles métier'        },
  { value: '99.9%',label: 'Disponibilité SLA'  },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[50%] xl:w-[52%] p-12 xl:p-16 relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Blue glow */}
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-500/8 rounded-full blur-[80px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-semibold text-white text-lg tracking-tight">BuildPro</p>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase">ERP · Gestion BTP</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <p className="text-blue-400 text-xs font-medium uppercase tracking-[0.15em] mb-4">
            Plateforme de gestion BTP
          </p>
          <h2 className="text-3xl xl:text-4xl font-semibold text-white leading-[1.15] tracking-tight mb-4">
            Pilotez vos chantiers<br />
            avec précision
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-8">
            Une plateforme unifiée pour gérer chantiers, stock, finances
            et équipes — conçue pour le BTP africain.
          </p>

          {/* Features */}
          <ul className="space-y-3 mb-10">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 size={15} className="text-blue-400 shrink-0" strokeWidth={2} />
                {f}
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-semibold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">
          © 2025 BuildPro · Tous droits réservés
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-slate-900 text-lg">BuildPro</span>
          </div>

          <div className="bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden">
            {/* Blue top accent */}
            <div className="h-0.5 bg-blue-600" />
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
