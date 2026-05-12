import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, HardHat, FileText, Package,
  DollarSign, ShieldAlert, Truck, Warehouse, MoreHorizontal, ShoppingCart,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';

const BOTTOM_NAV = {
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
    { icon: FileText,        label: 'Inspections', to: '/hse/inspections' },
    { icon: HardHat,         label: 'Chantiers',  to: '/chantiers' },
  ],
};

function MobileBottomNav({ onMoreClick }) {
  const { role } = useAuth();
  const items = BOTTOM_NAV[role] ?? BOTTOM_NAV.dg;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 flex items-stretch h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to.includes('dashboard')}
          className={({ isActive }) => [
            'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors duration-150 cursor-pointer',
            isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600',
          ].join(' ')}
        >
          {({ isActive }) => (
            <>
              <span className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.75} />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <span className="p-1 rounded-lg"><MoreHorizontal size={17} strokeWidth={1.75} /></span>
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
      <div className="flex-1 flex flex-col md:ml-[240px] min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 animate-fade-in">
          {children}
        </main>
      </div>
      <MobileBottomNav onMoreClick={() => setMobileOpen(true)} />
    </div>
  );
}
