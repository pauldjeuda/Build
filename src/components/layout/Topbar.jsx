import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../modules/auth/store/authSlice';

const TITLES = {
  '/dashboard/dg':        'Dashboard — Direction Générale',
  '/dashboard/daf':       'Dashboard — Direction Finance',
  '/dashboard/cdt':       'Dashboard — Chef de Travaux',
  '/chantiers':           'Chantiers',
  '/chantiers/nouveau':   'Nouveau Chantier',
  '/rapports':            'Rapports Journaliers',
  '/rapports/nouveau':    'Nouveau Rapport',
  '/stock':               'Stock & Inventaire',
  '/stock/mouvements':    'Mouvements de Stock',
  '/stock/alertes':       'Alertes de Stock',
  '/achats/demandes':     "Demandes d'Achat",
  '/achats/commandes':    'Commandes',
  '/achats/fournisseurs': 'Fournisseurs',
  '/finance':             'Finance — Vue Globale',
  '/finance/depenses':    'Dépenses',
  '/finance/budgets':     'Budgets',
  '/finance/factures':    'Factures',
  '/hse/incidents':       'HSE — Incidents',
  '/hse/inspections':     'HSE — Inspections',
  '/engins':              'Parc Engins',
  '/engins/maintenance':  'Maintenance Engins',
};

const NOTIFS = [
  { id: 1, msg: 'Stock ciment sous le seuil minimum', time: 'il y a 5 min', dot: 'bg-amber-500', unread: true },
  { id: 2, msg: 'Rapport journalier soumis — Immeuble Akwa', time: 'il y a 1h', dot: 'bg-emerald-500', unread: true },
  { id: 3, msg: "Demande d'achat en attente d'approbation", time: 'il y a 2h', dot: 'bg-blue-500', unread: false },
];

function useOutsideClick(ref, cb) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef,   () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const title = TITLES[location.pathname] ?? 'BUILDPRO';
  const unreadCount = NOTIFS.filter((n) => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-20 shrink-0">
      {/* Mobile burger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-800 truncate hidden sm:block">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 w-56 transition-colors group">
        <Search size={14} className="text-slate-400 shrink-0" />
        <input
          placeholder="Rechercher…"
          className="bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none w-full"
        />
        <kbd className="hidden xl:block text-xs text-slate-300 font-mono">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="text-xs bg-primary-100 text-primary-700 font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} nouvelles
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {NOTIFS.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-snug">{n.msg}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                <button className="text-xs text-primary-600 font-medium hover:text-primary-700">
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
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">{user?.name?.[0] ?? 'U'}</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wide" style={{ fontSize: '10px' }}>
                {user?.role ?? 'admin'}
              </p>
            </div>
            <ChevronDown size={13} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition-colors">
                  <Settings size={14} /> Paramètres
                </button>
                <button
                  onClick={() => dispatch(logout())}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
