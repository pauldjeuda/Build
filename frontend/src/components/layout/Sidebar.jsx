import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Package, ShoppingCart,
  DollarSign, ShieldAlert, Truck, LogOut, ChevronDown, X,
  Warehouse, Building2,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../modules/auth/store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { getRoleLabel } from '../../utils/permissions';

/*
 * Nav strictement calé sur le §42 Tableau Permissions MVP :
 *
 * DG  : tous chantiers ✓ | créer chantier ✓ | finances ✓ | stock lecture | engins lecture | rapports lecture | HSE lecture
 * DAF : tous chantiers ✓ | finances ✓ | achats ✓ | stock lecture
 * CDT : créer chantier ✓ | valider rapport ✓ | finances partiel | stock lecture | engins demande
 * CDC : rapport journalier ✓ | stock demande | engins carnet | achats demandes
 * GST : stock full ✓ | achats (réception)
 * LOG : engins full ✓ | chantiers partiel (lecture) | stock lecture
 * HSE : incidents/inspections ✓ | chantiers lecture
 */
function buildNav(role) {
  switch (role) {
    case 'dg':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/dg' }],
        },
        {
          label: 'Chantiers', icon: HardHat,
          children: [
            { label: 'Tous les chantiers', to: '/chantiers' },
            { label: 'Nouveau chantier',   to: '/chantiers/nouveau' },
          ],
        },
        {
          label: 'Rapports', icon: FileText,
          children: [{ label: 'Rapports journaliers', to: '/rapports' }],
        },
        {
          label: 'Finance', icon: DollarSign,
          children: [
            { label: 'Vue globale', to: '/finance' },
            { label: 'Dépenses',    to: '/finance/depenses' },
            { label: 'Budgets',     to: '/finance/budgets' },
            { label: 'Factures',    to: '/finance/factures' },
          ],
        },
        {
          label: 'Achats', icon: ShoppingCart,
          children: [
            { label: 'Demandes',     to: '/achats/demandes' },
            { label: 'Commandes',    to: '/achats/commandes' },
            { label: 'Fournisseurs', to: '/achats/fournisseurs' },
          ],
        },
        {
          label: 'Stock', icon: Package,
          children: [{ label: 'Inventaire', to: '/stock' }],
        },
        {
          label: 'Engins', icon: Truck,
          children: [{ label: 'Parc engins', to: '/engins' }],
        },
        {
          label: 'HSE', icon: ShieldAlert,
          children: [
            { label: 'Incidents',   to: '/hse/incidents' },
            { label: 'Inspections', to: '/hse/inspections' },
          ],
        },
      ];

    case 'daf':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/daf' }],
        },
        {
          label: 'Finance', icon: DollarSign,
          children: [
            { label: 'Vue globale', to: '/finance' },
            { label: 'Dépenses',    to: '/finance/depenses' },
            { label: 'Budgets',     to: '/finance/budgets' },
            { label: 'Factures',    to: '/finance/factures' },
          ],
        },
        {
          label: 'Achats', icon: ShoppingCart,
          children: [
            { label: 'Demandes',     to: '/achats/demandes' },
            { label: 'Commandes',    to: '/achats/commandes' },
            { label: 'Fournisseurs', to: '/achats/fournisseurs' },
          ],
        },
        {
          label: 'Chantiers', icon: HardHat,
          children: [{ label: 'Tous les chantiers', to: '/chantiers' }],
        },
        {
          label: 'Stock', icon: Package,
          children: [{ label: 'Inventaire', to: '/stock' }],
        },
      ];

    case 'cdt':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/cdt' }],
        },
        {
          label: 'Chantiers', icon: HardHat,
          children: [
            { label: 'Mes chantiers',  to: '/chantiers' },
            { label: 'Nouveau chantier', to: '/chantiers/nouveau' },
          ],
        },
        {
          label: 'Rapports', icon: FileText,
          children: [{ label: 'Rapports à valider', to: '/rapports' }],
        },
        {
          label: 'Finance', icon: DollarSign,
          children: [
            { label: 'Budgets',  to: '/finance/budgets' },
            { label: 'Dépenses', to: '/finance/depenses' },
          ],
        },
        {
          label: 'Engins', icon: Truck,
          children: [
            { label: 'Parc engins', to: '/engins' },
            { label: 'Maintenance', to: '/engins/maintenance' },
          ],
        },
        {
          label: 'Stock', icon: Package,
          children: [{ label: 'Inventaire', to: '/stock' }],
        },
      ];

    case 'cdc':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Mon chantier', to: '/dashboard/cdc' }],
        },
        {
          label: 'Rapports', icon: FileText,
          children: [
            { label: 'Mes rapports',    to: '/rapports' },
            { label: 'Nouveau rapport', to: '/rapports/nouveau' },
          ],
        },
        {
          label: 'Achats', icon: ShoppingCart,
          children: [{ label: 'Mes demandes', to: '/achats/demandes' }],
        },
        {
          label: 'Engins', icon: Truck,
          children: [{ label: 'Carnet de bord', to: '/engins' }],
        },
        {
          label: 'HSE', icon: ShieldAlert,
          children: [{ label: 'Déclarer incident', to: '/hse/incidents' }],
        },
      ];

    case 'gst':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/gst' }],
        },
        {
          label: 'Stock', icon: Warehouse,
          children: [
            { label: 'Inventaire',    to: '/stock' },
            { label: 'Mouvements',    to: '/stock/mouvements' },
            { label: 'Alertes seuil', to: '/stock/alertes' },
          ],
        },
        {
          label: 'Achats', icon: ShoppingCart,
          children: [
            { label: 'Demandes',     to: '/achats/demandes' },
            { label: 'Commandes',    to: '/achats/commandes' },
            { label: 'Fournisseurs', to: '/achats/fournisseurs' },
          ],
        },
      ];

    case 'log':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/log' }],
        },
        {
          label: 'Engins', icon: Truck,
          children: [
            { label: 'Parc engins', to: '/engins' },
            { label: 'Maintenance', to: '/engins/maintenance' },
          ],
        },
        {
          label: 'Chantiers', icon: HardHat,
          children: [{ label: 'Vue chantiers', to: '/chantiers' }],
        },
        {
          label: 'Stock', icon: Package,
          children: [{ label: 'Inventaire', to: '/stock' }],
        },
      ];

    case 'hse':
      return [
        {
          label: 'Accueil', icon: LayoutDashboard,
          children: [{ label: 'Tableau de bord', to: '/dashboard/hse' }],
        },
        {
          label: 'HSE', icon: ShieldAlert,
          children: [
            { label: 'Incidents',   to: '/hse/incidents' },
            { label: 'Inspections', to: '/hse/inspections' },
          ],
        },
        {
          label: 'Chantiers', icon: HardHat,
          children: [{ label: 'Tous les chantiers', to: '/chantiers' }],
        },
      ];

    default:
      return [];
  }
}

function NavGroup({ item }) {
  const location = useLocation();
  const isActive = item.children.some(
    (c) => location.pathname === c.to || location.pathname.startsWith(c.to + '/')
  );
  const [open, setOpen] = useState(isActive);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={[
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        ].join(' ')}
      >
        <Icon
          size={16}
          strokeWidth={isActive ? 2.2 : 1.8}
          className={isActive ? 'text-blue-600 shrink-0' : 'text-slate-400 group-hover:text-slate-600 transition-colors shrink-0'}
        />
        <span className="flex-1 text-left truncate">{item.label}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isActive ? 'text-blue-400' : 'text-slate-300'}`}
        />
      </button>

      {open && (
        <div className="mt-0.5 ml-7 pl-3 border-l border-slate-100 space-y-0.5 py-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end
              className={({ isActive }) => ['nav-sub', isActive ? 'active' : ''].join(' ')}
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
  const { user, role } = useAuth();
  const roleLabel = getRoleLabel(role);
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U';
  const navItems = buildNav(role);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 shrink-0 border-b border-slate-100">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Building2 size={14} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-slate-900 text-[15px] tracking-tight">BuildPro</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto md:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-none"
        aria-label="Navigation principale"
      >
        {navItems.map((item) => <NavGroup key={item.label} item={item} />)}
      </nav>

      {/* User dock */}
      <div className="px-3 py-3 border-t border-slate-100 shrink-0 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name ?? 'Utilisateur'}</p>
            <p className="text-xs text-slate-400 truncate">{roleLabel}</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="En ligne" />
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer group"
        >
          <LogOut size={15} className="shrink-0 group-hover:translate-x-0.5 transition-transform duration-150" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <aside className="hidden md:flex flex-col w-[240px] bg-white fixed inset-y-0 left-0 z-30 shadow-sidebar">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={onMobileClose}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white flex flex-col shadow-modal animate-slide-left">
            <SidebarContent onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
