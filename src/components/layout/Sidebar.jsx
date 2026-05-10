import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Package, ShoppingCart,
  DollarSign, ShieldAlert, Truck, LogOut, ChevronDown,
  X, Building2, ChevronRight,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../modules/auth/store/authSlice';

const NAV = [
  {
    label: 'Tableaux de bord',
    icon: LayoutDashboard,
    accent: 'text-blue-400',
    children: [
      { label: 'Direction Générale', to: '/dashboard/dg' },
      { label: 'Direction Finance',  to: '/dashboard/daf' },
      { label: 'Chef de Travaux',    to: '/dashboard/cdt' },
    ],
  },
  {
    label: 'Chantiers',
    icon: HardHat,
    accent: 'text-orange-400',
    children: [
      { label: 'Liste des chantiers', to: '/chantiers' },
      { label: 'Créer un chantier',   to: '/chantiers/nouveau' },
    ],
  },
  {
    label: 'Rapports',
    icon: FileText,
    accent: 'text-emerald-400',
    children: [
      { label: 'Mes rapports',     to: '/rapports' },
      { label: 'Nouveau rapport',  to: '/rapports/nouveau' },
    ],
  },
  {
    label: 'Stock',
    icon: Package,
    accent: 'text-violet-400',
    children: [
      { label: 'Inventaire',      to: '/stock' },
      { label: 'Mouvements',      to: '/stock/mouvements' },
      { label: 'Alertes seuil',   to: '/stock/alertes' },
    ],
  },
  {
    label: 'Achats',
    icon: ShoppingCart,
    accent: 'text-amber-400',
    children: [
      { label: 'Demandes',       to: '/achats/demandes' },
      { label: 'Commandes',      to: '/achats/commandes' },
      { label: 'Fournisseurs',   to: '/achats/fournisseurs' },
    ],
  },
  {
    label: 'Finance',
    icon: DollarSign,
    accent: 'text-green-400',
    children: [
      { label: 'Vue globale',   to: '/finance' },
      { label: 'Dépenses',      to: '/finance/depenses' },
      { label: 'Budgets',       to: '/finance/budgets' },
      { label: 'Factures',      to: '/finance/factures' },
    ],
  },
  {
    label: 'HSE',
    icon: ShieldAlert,
    accent: 'text-red-400',
    children: [
      { label: 'Incidents',    to: '/hse/incidents' },
      { label: 'Inspections',  to: '/hse/inspections' },
    ],
  },
  {
    label: 'Engins',
    icon: Truck,
    accent: 'text-cyan-400',
    children: [
      { label: 'Parc engins',   to: '/engins' },
      { label: 'Maintenance',   to: '/engins/maintenance' },
    ],
  },
];

function NavGroup({ item }) {
  const location = useLocation();
  const isActive = item.children.some((c) => location.pathname === c.to || location.pathname.startsWith(c.to + '/'));
  const [open, setOpen] = useState(isActive);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
        ].join(' ')}
      >
        <span className={`shrink-0 ${isActive ? item.accent : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
          <Icon size={17} strokeWidth={isActive ? 2 : 1.75} />
        </span>
        <span className="flex-1 text-left truncate">{item.label}</span>
        <span className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={13} />
        </span>
      </button>

      {open && (
        <div className="mt-0.5 ml-3 pl-5 border-l border-white/10 space-y-0.5 pb-1">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end
              className={({ isActive }) =>
                [
                  'block px-3 py-2 rounded-lg text-xs transition-all duration-100',
                  isActive
                    ? 'bg-primary-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                ].join(' ')
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 shrink-0">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40">
          <Building2 size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-extrabold text-base leading-none tracking-wide">BUILDPRO</p>
          <p className="text-slate-500 text-xs mt-0.5">ERP Gestion BTP</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-500 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User chip */}
      <div className="mx-3 mb-3 px-3 py-2.5 bg-white/5 rounded-xl flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {user?.name?.[0] ?? 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'Utilisateur'}</p>
          <p className="text-xs text-slate-500 truncate uppercase tracking-wide" style={{ fontSize: '10px' }}>
            {user?.role ?? 'Admin'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 border-t border-white/5" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-none pb-4">
        {NAV.map((item) => <NavGroup key={item.label} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/5 shrink-0">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 fixed inset-y-0 left-0 z-30 border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/5 flex flex-col animate-slide-up">
            <SidebarContent onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
