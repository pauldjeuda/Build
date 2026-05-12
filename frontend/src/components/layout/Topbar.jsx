import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { logout } from '../../modules/auth/store/authSlice';

const TITLES = {
  '/dashboard/dg':        'Direction Générale',
  '/dashboard/daf':       'Direction Finance',
  '/dashboard/cdt':       'Chef de Travaux',
  '/dashboard/cdc':       'Mon Chantier',
  '/dashboard/gst':       'Gestion Stock',
  '/dashboard/log':       'Logistique',
  '/dashboard/hse':       'HSE',
  '/chantiers':           'Chantiers',
  '/chantiers/nouveau':   'Nouveau Chantier',
  '/rapports':            'Rapports Journaliers',
  '/rapports/nouveau':    'Nouveau Rapport',
  '/stock':               'Stock & Inventaire',
  '/stock/mouvements':    'Mouvements de Stock',
  '/stock/alertes':       'Alertes de Stock',
  '/achats/demandes':     "Demandes d'Achat",
  '/achats/commandes':    'Commandes Fournisseurs',
  '/achats/fournisseurs': 'Fournisseurs',
  '/finance':             'Vue Financière',
  '/finance/depenses':    'Dépenses',
  '/finance/budgets':     'Budgets Chantiers',
  '/finance/factures':    'Factures',
  '/hse/incidents':       'Incidents HSE',
  '/hse/inspections':     'Inspections HSE',
  '/engins':              'Parc Engins',
  '/engins/maintenance':  'Maintenance Engins',
};

const NOTIFS = [
  { id: 1, msg: 'Stock ciment sous le seuil minimum',        time: 'il y a 5 min', dot: 'bg-amber-400',   unread: true  },
  { id: 2, msg: 'Rapport journalier soumis — Immeuble Akwa', time: 'il y a 1h',    dot: 'bg-emerald-400', unread: true  },
  { id: 3, msg: "Demande d'achat en attente d'approbation",  time: 'il y a 2h',    dot: 'bg-primary-400', unread: false },
];

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

export default function Topbar({ onMenuClick }) {
  const location  = useLocation();
  const dispatch  = useDispatch();
  const user      = useSelector((s) => s.auth.user);

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef,   () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const title       = TITLES[location.pathname] ?? 'BUILDPRO';
  const unreadCount = NOTIFS.filter((n) => n.unread).length;
  const initial     = user?.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <header
      className="h-[60px] bg-white flex items-center gap-3 px-4 md:px-6 sticky top-0 z-20 shrink-0"
      style={{ borderBottom: '1px solid #E8E2D9' }}
    >
      {/* Mobile burger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-xl hover:bg-canvas text-obsidian-500 transition-colors shrink-0 cursor-pointer"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-sm font-bold text-obsidian-900 truncate hidden sm:block tracking-tight">
          {title}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-canvas border border-[#E8E2D9] hover:border-obsidian-300 focus-within:border-gold-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-gold-400/20 rounded-xl px-3 py-2 w-56 transition-all duration-200 group">
        <Search size={13} className="text-obsidian-300 shrink-0 group-focus-within:text-obsidian-500 transition-colors" />
        <input
          placeholder="Rechercher…"
          className="bg-transparent text-sm font-sans text-obsidian-700 placeholder-obsidian-300 focus:outline-none w-full"
        />
        <kbd className="hidden xl:flex items-center text-[10px] text-obsidian-300 font-mono bg-white border border-[#E8E2D9] px-1.5 py-0.5 rounded-md shrink-0">⌘K</kbd>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-canvas text-obsidian-400 hover:text-obsidian-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse-dot" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-modal border border-[#E8E2D9] z-50 overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid #E8E2D9' }}>
                <p className="font-display text-sm font-bold text-obsidian-900">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs bg-gold-100 text-gold-700 font-semibold px-2 py-0.5 rounded-full border border-gold-200">
                    {unreadCount} nouvelles
                  </span>
                )}
              </div>
              <div className="divide-y divide-[#F4F1EB]">
                {NOTIFS.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3.5 hover:bg-canvas cursor-pointer transition-colors ${n.unread ? 'bg-gold-50/50' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-obsidian-700 leading-snug">{n.msg}</p>
                      <p className="text-xs font-sans text-obsidian-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid #E8E2D9' }}>
                <button className="text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors cursor-pointer">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-canvas transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <span className="font-display font-bold text-obsidian-900 text-xs">{initial}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-display text-xs font-bold text-obsidian-900 leading-none">{user?.name ?? 'Admin'}</p>
              <p className="font-sans text-obsidian-400 mt-0.5 uppercase tracking-wider" style={{ fontSize: '10px' }}>
                {user?.role ?? 'admin'}
              </p>
            </div>
            <ChevronDown size={12} className="text-obsidian-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-modal border border-[#E8E2D9] z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3.5" style={{ borderBottom: '1px solid #E8E2D9' }}>
                <p className="font-display text-xs font-bold text-obsidian-900">{user?.name}</p>
                <p className="font-sans text-xs text-obsidian-400 mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium text-obsidian-600 hover:bg-canvas transition-colors cursor-pointer">
                  <Settings size={14} className="text-obsidian-400 shrink-0" /> Paramètres
                </button>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={14} className="shrink-0" /> Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
