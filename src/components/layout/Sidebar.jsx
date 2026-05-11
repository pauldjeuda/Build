import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Package, ShoppingCart,
  DollarSign, ShieldAlert, Truck, LogOut, ChevronDown, X,
  ClipboardList, BarChart2, Warehouse,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../modules/auth/store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { getRoleLabel } from '../../utils/permissions';

// §12 — Sidebar dynamique selon rôle (§11 : pas de if(role==="dg") dispersés)
// Chaque rôle ne voit QUE ce à quoi il est autorisé (§42 tableau)
function buildNav(role) {
  switch (role) {
    case 'dg':
      return [
        { label: 'Tableau de bord',  icon: LayoutDashboard, dot: 'bg-primary-500',
          children: [{ label: 'Direction Générale', to: '/dashboard/dg' }] },
        { label: 'Chantiers', icon: HardHat, dot: 'bg-orange-500',
          children: [
            { label: 'Liste des chantiers', to: '/chantiers' },
            { label: 'Créer un chantier',   to: '/chantiers/nouveau' },
          ] },
        { label: 'Rapports', icon: FileText, dot: 'bg-emerald-500',
          children: [{ label: 'Tous les rapports', to: '/rapports' }] },
        { label: 'Finance', icon: DollarSign, dot: 'bg-teal-500',
          children: [
            { label: 'Vue globale', to: '/finance' },
            { label: 'Dépenses',    to: '/finance/depenses' },
            { label: 'Budgets',     to: '/finance/budgets' },
            { label: 'Factures',    to: '/finance/factures' },
          ] },
        { label: 'Stock', icon: Package, dot: 'bg-violet-500',
          children: [
            { label: 'Inventaire',    to: '/stock' },
            { label: 'Mouvements',    to: '/stock/mouvements' },
            { label: 'Alertes seuil', to: '/stock/alertes' },
          ] },
        { label: 'Achats', icon: ShoppingCart, dot: 'bg-gold-500',
          children: [
            { label: 'Demandes',  to: '/achats/demandes' },
            { label: 'Commandes', to: '/achats/commandes' },
            { label: 'Fournisseurs', to: '/achats/fournisseurs' },
          ] },
        { label: 'Engins', icon: Truck, dot: 'bg-cyan-500',
          children: [
            { label: 'Parc engins', to: '/engins' },
            { label: 'Maintenance', to: '/engins/maintenance' },
          ] },
        { label: 'HSE', icon: ShieldAlert, dot: 'bg-red-500',
          children: [
            { label: 'Incidents',   to: '/hse/incidents' },
            { label: 'Inspections', to: '/hse/inspections' },
          ] },
      ];

    case 'daf':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-gold-500',
          children: [{ label: 'Direction Finance', to: '/dashboard/daf' }] },
        { label: 'Finance', icon: DollarSign, dot: 'bg-teal-500',
          children: [
            { label: 'Vue globale', to: '/finance' },
            { label: 'Dépenses',    to: '/finance/depenses' },
            { label: 'Budgets',     to: '/finance/budgets' },
            { label: 'Factures',    to: '/finance/factures' },
          ] },
        { label: 'Achats', icon: ShoppingCart, dot: 'bg-gold-500',
          children: [
            { label: 'Demandes (budget)', to: '/achats/demandes' },
            { label: 'Commandes',         to: '/achats/commandes' },
            { label: 'Fournisseurs',      to: '/achats/fournisseurs' },
          ] },
        { label: 'Chantiers', icon: HardHat, dot: 'bg-orange-500',
          children: [{ label: 'Vue chantiers', to: '/chantiers' }] },
      ];

    case 'cdt':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-emerald-500',
          children: [{ label: 'Chef de Travaux', to: '/dashboard/cdt' }] },
        { label: 'Chantiers', icon: HardHat, dot: 'bg-orange-500',
          children: [
            { label: 'Mes chantiers',   to: '/chantiers' },
            { label: 'Créer chantier',  to: '/chantiers/nouveau' },
          ] },
        { label: 'Rapports', icon: FileText, dot: 'bg-emerald-500',
          children: [{ label: 'Rapports à valider', to: '/rapports' }] },
        { label: 'Stock', icon: Package, dot: 'bg-violet-500',
          children: [
            { label: 'Inventaire (lecture)', to: '/stock' },
            { label: 'Alertes seuil',        to: '/stock/alertes' },
          ] },
        { label: 'Achats', icon: ShoppingCart, dot: 'bg-gold-500',
          children: [{ label: 'Demandes (validation)', to: '/achats/demandes' }] },
        { label: 'Engins', icon: Truck, dot: 'bg-cyan-500',
          children: [
            { label: 'Parc engins', to: '/engins' },
            { label: 'Maintenance', to: '/engins/maintenance' },
          ] },
        { label: 'Finance', icon: DollarSign, dot: 'bg-teal-500',
          children: [
            { label: 'Mes budgets', to: '/finance/budgets' },
            { label: 'Mes dépenses', to: '/finance/depenses' },
          ] },
      ];

    case 'cdc':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-orange-500',
          children: [{ label: 'Mon chantier', to: '/dashboard/cdc' }] },
        { label: 'Mon chantier', icon: HardHat, dot: 'bg-orange-500',
          children: [{ label: 'Fiche chantier', to: '/chantiers' }] },
        { label: 'Rapports', icon: FileText, dot: 'bg-emerald-500',
          children: [
            { label: 'Mes rapports',     to: '/rapports' },
            { label: 'Nouveau rapport',  to: '/rapports/nouveau' },
          ] },
        { label: 'Achats', icon: ShoppingCart, dot: 'bg-gold-500',
          children: [{ label: 'Mes demandes', to: '/achats/demandes' }] },
        { label: 'Stock', icon: Package, dot: 'bg-violet-500',
          children: [{ label: 'Consulter stock', to: '/stock' }] },
        { label: 'HSE', icon: ShieldAlert, dot: 'bg-red-500',
          children: [{ label: 'Déclarer incident', to: '/hse/incidents' }] },
        { label: 'Engins', icon: Truck, dot: 'bg-cyan-500',
          children: [{ label: 'Engins présents', to: '/engins' }] },
      ];

    case 'gst':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-violet-500',
          children: [{ label: 'Dashboard Stock', to: '/dashboard/gst' }] },
        { label: 'Stock', icon: Warehouse, dot: 'bg-violet-500',
          children: [
            { label: 'Inventaire',    to: '/stock' },
            { label: 'Mouvements',    to: '/stock/mouvements' },
            { label: 'Alertes seuil', to: '/stock/alertes' },
          ] },
        { label: 'Achats', icon: ShoppingCart, dot: 'bg-gold-500',
          children: [
            { label: 'Demandes (réception)', to: '/achats/demandes' },
            { label: 'Commandes',            to: '/achats/commandes' },
            { label: 'Fournisseurs',         to: '/achats/fournisseurs' },
          ] },
      ];

    case 'log':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-cyan-500',
          children: [{ label: 'Dashboard Logistique', to: '/dashboard/log' }] },
        { label: 'Engins', icon: Truck, dot: 'bg-cyan-500',
          children: [
            { label: 'Parc engins', to: '/engins' },
            { label: 'Maintenance', to: '/engins/maintenance' },
          ] },
        { label: 'Chantiers', icon: HardHat, dot: 'bg-orange-500',
          children: [{ label: 'Chantiers (lecture)', to: '/chantiers' }] },
        { label: 'Stock', icon: Package, dot: 'bg-violet-500',
          children: [{ label: 'Stock (lecture)', to: '/stock' }] },
      ];

    case 'hse':
      return [
        { label: 'Tableau de bord', icon: LayoutDashboard, dot: 'bg-red-500',
          children: [{ label: 'Dashboard HSE', to: '/dashboard/hse' }] },
        { label: 'HSE', icon: ShieldAlert, dot: 'bg-red-500',
          children: [
            { label: 'Incidents',           to: '/hse/incidents' },
            { label: 'Inspections',         to: '/hse/inspections' },
          ] },
        { label: 'Chantiers', icon: HardHat, dot: 'bg-orange-500',
          children: [{ label: 'Vue chantiers', to: '/chantiers' }] },
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
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-150 group',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-obsidian-400 hover:bg-white/6 hover:text-obsidian-100',
        ].join(' ')}
      >
        <span className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="shrink-0 relative">
            <Icon size={16} strokeWidth={isActive ? 2 : 1.75}
              className={isActive ? 'text-gold-400' : 'text-obsidian-500 group-hover:text-obsidian-300'} />
            {isActive && (
              <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${item.dot} ring-1 ring-obsidian-900`} />
            )}
          </span>
          <span className="truncate">{item.label}</span>
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-obsidian-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-0.5 ml-4 pl-4 border-l border-white/8 space-y-0.5 py-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.to} to={child.to} end
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
  const { user, role, roleLabel } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() ?? 'U';
  const navItems = buildNav(role);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5 shrink-0">
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center">
            <span className="font-display font-black text-obsidian-900 text-xs leading-none">B</span>
          </div>
          <div className="w-2 h-7 bg-gold-500/20 rounded-sm ml-0.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-white text-base leading-none tracking-widest">BUILDPRO</p>
          <p className="text-obsidian-500 text-[10px] mt-0.5 tracking-wider uppercase font-sans">ERP · Gestion BTP</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-obsidian-500 hover:text-white p-1 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="mx-3 mb-4 px-3 py-2.5 rounded-xl border border-white/8 bg-white/5 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-sm font-display font-bold text-obsidian-900 shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-display font-semibold text-white truncate">{user?.name ?? 'Utilisateur'}</p>
          <p className="font-sans text-obsidian-500 truncate" style={{ fontSize: '10px' }}>
            {roleLabel}
          </p>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="En ligne" />
      </div>

      <div className="mx-5 mb-3 border-t border-white/6" />

      {/* Nav — dynamique selon rôle */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-none pb-4" aria-label="Navigation principale">
        {navItems.map((item) => <NavGroup key={item.label} item={item} />)}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/6 shrink-0">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-display font-medium text-obsidian-500 hover:text-red-400 hover:bg-red-500/8 transition-all group"
        >
          <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <aside
        className="hidden md:flex flex-col w-[260px] bg-obsidian-900 fixed inset-y-0 left-0 z-30 shadow-sidebar"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-obsidian-900/70 backdrop-blur-sm animate-fade-in"
            onClick={onMobileClose}
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 bg-obsidian-900 flex flex-col animate-slide-left"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SidebarContent onClose={onMobileClose} />
          </aside>
        </div>
      )}
    </>
  );
}
