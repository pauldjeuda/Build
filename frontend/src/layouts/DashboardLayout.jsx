import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Package, ShoppingCart,
  DollarSign, ShieldAlert, Truck, Warehouse, MoreHorizontal,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';

function getBottomNav(role) {
  const navMap = {
    dg:  [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/dg' },
      { icon: HardHat,         label: 'Chantiers', to: '/chantiers' },
      { icon: FileText,        label: 'Rapports',  to: '/rapports' },
      { icon: DollarSign,      label: 'Finance',   to: '/finance' },
    ],
    daf: [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/daf' },
      { icon: DollarSign,      label: 'Finance',   to: '/finance' },
      { icon: ShoppingCart,    label: 'Achats',    to: '/achats/demandes' },
      { icon: HardHat,         label: 'Chantiers', to: '/chantiers' },
    ],
    cdt: [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/cdt' },
      { icon: HardHat,         label: 'Chantiers', to: '/chantiers' },
      { icon: FileText,        label: 'Rapports',  to: '/rapports' },
      { icon: Package,         label: 'Stock',     to: '/stock' },
    ],
    cdc: [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/cdc' },
      { icon: HardHat,         label: 'Chantier',  to: '/chantiers' },
      { icon: FileText,        label: 'Rapports',  to: '/rapports' },
      { icon: ShieldAlert,     label: 'HSE',       to: '/hse/incidents' },
    ],
    gst: [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/gst' },
      { icon: Warehouse,       label: 'Stock',     to: '/stock' },
      { icon: ShoppingCart,    label: 'Achats',    to: '/achats/demandes' },
      { icon: Package,         label: 'Mouvts',    to: '/stock/mouvements' },
    ],
    log: [
      { icon: LayoutDashboard, label: 'Accueil',   to: '/dashboard/log' },
      { icon: Truck,           label: 'Engins',    to: '/engins' },
      { icon: HardHat,         label: 'Chantiers', to: '/chantiers' },
      { icon: Package,         label: 'Stock',     to: '/stock' },
    ],
    hse: [
      { icon: LayoutDashboard, label: 'Accueil',    to: '/dashboard/hse' },
      { icon: ShieldAlert,     label: 'Incidents',  to: '/hse/incidents' },
      { icon: FileText,        label: 'Rapports',   to: '/hse/inspections' },
      { icon: HardHat,         label: 'Chantiers',  to: '/chantiers' },
    ],
  };
  return navMap[role] ?? navMap.dg;
}

function MobileBottomNav({ onMoreClick }) {
  const { role } = useAuth();
  const items = getBottomNav(role);

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#E8E2D9] flex items-stretch h-16 safe-area-inset-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation mobile"
    >
      {items.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to.includes('dashboard')}
          className={({ isActive }) => [
            'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold font-sans transition-colors duration-150 cursor-pointer',
            isActive
              ? 'text-gold-600'
              : 'text-obsidian-400 hover:text-obsidian-700',
          ].join(' ')}
        >
          {({ isActive }) => (
            <>
              <span className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-gold-50' : ''}`}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold font-sans text-obsidian-400 hover:text-obsidian-700 transition-colors cursor-pointer"
      >
        <span className="p-1.5 rounded-xl">
          <MoreHorizontal size={18} strokeWidth={1.75} />
        </span>
        <span>Plus</span>
      </button>
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 animate-fade-in">
          {children}
        </main>
      </div>
      <MobileBottomNav onMoreClick={() => setMobileOpen(true)} />
    </div>
  );
}
