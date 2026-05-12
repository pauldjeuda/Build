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
  '/dashboard/hse':       'Sécurité & HSE',
  '/chantiers':           'Chantiers',
  '/chantiers/nouveau':   'Nouveau chantier',
  '/rapports':            'Rapports journaliers',
  '/rapports/nouveau':    'Nouveau rapport',
  '/stock':               'Stock & inventaire',
  '/stock/mouvements':    'Mouvements de stock',
  '/stock/alertes':       'Alertes de stock',
  '/achats/demandes':     "Demandes d'achat",
  '/achats/commandes':    'Commandes fournisseurs',
  '/achats/fournisseurs': 'Fournisseurs',
  '/finance':             'Vue financière',
  '/finance/depenses':    'Dépenses',
  '/finance/budgets':     'Budgets',
  '/finance/factures':    'Factures',
  '/hse/incidents':       'Incidents HSE',
  '/hse/inspections':     'Inspections HSE',
  '/engins':              'Parc engins',
  '/engins/maintenance':  'Maintenance',
};

const NOTIFS = [
  { id: 1, type: 'warning', msg: 'Stock ciment sous le seuil minimum',        time: '5 min',  unread: true  },
  { id: 2, type: 'success', msg: 'Rapport journalier soumis — Immeuble Akwa', time: '1h',     unread: true  },
  { id: 3, type: 'info',    msg: "Demande d'achat en attente d'approbation",  time: '2h',     unread: false },
];

const TYPE_DOT = {
  warning: 'bg-amber-400',
  success: 'bg-emerald-400',
  info:    'bg-blue-400',
  danger:  'bg-red-400',
};

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
  const [searchFocus, setSearchFocus] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef,   () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const title       = TITLES[location.pathname] ?? 'BuildPro';
  const unreadCount = NOTIFS.filter((n) => n.unread).length;
  const initial     = user?.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="h-14 bg-white flex items-center gap-4 px-4 md:px-6 sticky top-0 z-20 shrink-0 border-b border-slate-100">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer shrink-0"
        aria-label="Menu"
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <h1 className="font-semibold text-slate-900 text-[15px] tracking-tight truncate flex-1 min-w-0 hidden sm:block">
        {title}
      </h1>

      {/* Search */}
      <div
        className={[
          'hidden lg:flex items-center gap-2 rounded-lg px-3 py-2 w-52 xl:w-64 transition-all duration-200 border',
          searchFocus
            ? 'bg-white border-blue-400 ring-3 ring-blue-100 shadow-xs'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300',
        ].join(' ')}
      >
        <Search size={13} className="text-slate-400 shrink-0" />
        <input
          placeholder="Rechercher…"
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
        />
        <kbd className="hidden xl:block text-[10px] text-slate-300 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded shrink-0">⌘K</kbd>
      </div>

      <div className="flex items-center gap-1 ml-auto sm:ml-0">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-modal border border-slate-100 z-50 overflow-hidden animate-slide-down">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                    {unreadCount} nouvelles
                  </span>
                )}
              </div>
              <div>
                {NOTIFS.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${n.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${TYPE_DOT[n.type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 font-medium leading-snug">{n.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">il y a {n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                  Voir tout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{initial}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
              {user?.name ?? 'Admin'}
            </span>
            <ChevronDown size={13} className="text-slate-400 hidden sm:block shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-modal border border-slate-100 z-50 overflow-hidden animate-slide-down">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Settings size={14} className="text-slate-400 shrink-0" /> Paramètres
                </button>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
