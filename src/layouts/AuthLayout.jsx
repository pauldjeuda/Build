import React from 'react';

const STATS = [
  { value: '120+',  label: 'Chantiers gérés' },
  { value: '8',     label: 'Modules métier'  },
  { value: '500+',  label: 'Utilisateurs'    },
  { value: '99.9%', label: 'Disponibilité'   },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-obsidian-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-14 xl:p-16 relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,150,12,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,150,12,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Gold glow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/8 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl translate-x-1/2" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center">
              <span className="font-display font-black text-obsidian-900 text-sm">B</span>
            </div>
            <div className="w-2 h-8 bg-gold-500/25 rounded-sm ml-0.5" />
          </div>
          <div>
            <span className="font-display font-black text-white text-xl tracking-widest">BUILDPRO</span>
            <span className="block font-sans text-obsidian-500 text-[10px] tracking-widest uppercase mt-0.5">ERP · Gestion BTP</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-display text-gold-500 text-xs font-semibold uppercase tracking-widest">Plateforme de gestion</span>
          </div>
          <h2 className="font-display text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
            L'ERP pensé<br />
            <span className="text-gold-400">pour le BTP</span><br />
            africain
          </h2>
          <p className="font-sans text-obsidian-400 text-base leading-relaxed max-w-sm">
            Pilotez vos chantiers, votre stock, vos finances
            et vos équipes depuis une seule plateforme.
          </p>

          {/* Stats grid */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
                <p className="font-display text-2xl font-black text-white">{s.value}</p>
                <p className="font-sans text-xs text-obsidian-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 font-sans text-obsidian-600 text-xs">
          © 2025 BUILDPRO — Tous droits réservés
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-canvas">
        {/* Mobile logo */}
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center">
              <span className="font-display font-black text-obsidian-900 text-sm">B</span>
            </div>
            <span className="font-display font-black text-obsidian-900 text-xl tracking-widest">BUILDPRO</span>
          </div>

          <div className="bg-white rounded-3xl shadow-modal border border-[#E8E2D9] overflow-hidden">
            {/* Gold accent line */}
            <div className="h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300" />
            <div className="p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
