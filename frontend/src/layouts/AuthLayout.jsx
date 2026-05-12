import React from 'react';

const STATS = [
  { value: '120+',  label: 'Chantiers gérés',  sub: 'actifs sur la plateforme' },
  { value: '8',     label: 'Modules métier',    sub: 'intégrés nativement'      },
  { value: '500+',  label: 'Utilisateurs',      sub: 'sur 7 rôles métier'       },
  { value: '99.9%', label: 'Disponibilité',     sub: 'SLA garanti'              },
];

const FEATURES = [
  'Suivi chantiers en temps réel',
  'Gestion stock & approvisionnements',
  'Finance, budgets & facturation',
  'Rapports HSE & conformité',
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-obsidian-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] xl:w-[48%] p-12 xl:p-16 relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,150,12,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,150,12,1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-500/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/4 -right-16 w-72 h-72 bg-primary-600/12 rounded-full blur-[60px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold">
              <span className="font-display font-black text-obsidian-900 text-base leading-none">B</span>
            </div>
            <div className="w-1 h-7 bg-gradient-to-b from-gold-500/70 to-transparent rounded-full" />
          </div>
          <div>
            <span className="font-display font-black text-white text-xl tracking-widest">BUILDPRO</span>
            <span className="block font-sans text-obsidian-500 text-[10px] tracking-widest uppercase mt-0.5">ERP · Gestion BTP</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 max-w-[32px] bg-gradient-to-r from-transparent to-gold-500" />
            <span className="font-sans text-gold-500 text-xs font-semibold uppercase tracking-[0.15em]">Plateforme ERP BTP</span>
          </div>

          <h2 className="font-display text-4xl xl:text-[2.75rem] font-black text-white leading-[1.05] tracking-tight">
            L'ERP pensé<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">pour le BTP</span><br />
            africain
          </h2>

          <p className="font-sans text-obsidian-400 text-base leading-relaxed max-w-sm">
            Pilotez vos chantiers, votre stock, vos finances
            et vos équipes depuis une seule plateforme unifiée.
          </p>

          {/* Feature list */}
          <ul className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 font-sans text-sm text-obsidian-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/7 transition-colors duration-200">
                <p className="font-display text-2xl font-black text-white leading-none">{s.value}</p>
                <p className="font-sans text-xs font-semibold text-obsidian-300 mt-1">{s.label}</p>
                <p className="font-sans text-[10px] text-obsidian-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 font-sans text-obsidian-600 text-xs">
          © 2025 BUILDPRO · Tous droits réservés
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-canvas">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-gold">
              <span className="font-display font-black text-obsidian-900 text-base">B</span>
            </div>
            <span className="font-display font-black text-obsidian-900 text-xl tracking-widest">BUILDPRO</span>
          </div>

          <div className="bg-white rounded-3xl shadow-modal border border-[#E8E2D9] overflow-hidden">
            {/* Gold gradient accent */}
            <div className="h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-400" />
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
