import React from 'react';
import { Building2 } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0F172A 100%)',
      }}
    >
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-white text-xl font-extrabold tracking-wide">BUILDPRO</span>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            L'ERP pensé<br />pour le BTP africain
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Pilotez vos chantiers, votre stock, vos finances et vos équipes depuis une seule plateforme.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: 'Chantiers gérés', value: '120+' },
              { label: 'Modules métier',  value: '8'    },
              { label: 'Utilisateurs',    value: '500+' },
              { label: 'Disponibilité',   value: '99.9%'},
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2025 BUILDPRO — Tous droits réservés</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-white text-lg font-extrabold">BUILDPRO</span>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
