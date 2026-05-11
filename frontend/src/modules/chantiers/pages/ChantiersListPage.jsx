// §26 — Module Chantiers
// §42 : Voir tous : DG✓ DAF✓ HSE✓ / voir partiel : CDT CDC GST LOG / Créer : DG CDT seulement
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, HardHat } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency, statusLabel, statusVariant } from '../../../utils/formatters';
import { setSelected, fetchChantiers } from '../store/chantiersSlice';
import { useAuth } from '../../../hooks/useAuth';

const FILTERS = ['all', 'actif', 'en_retard', 'suspendu', 'termine'];

export default function ChantiersListPage() {
  const { list } = useSelector((s) => s.chantiers);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { can, user }   = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchChantiers()); }, [dispatch]);

  // §42 : CDT, CDC, GST, LOG voient seulement leurs chantiers (partiel)
  // DG, DAF, HSE voient tout
  const canViewAll = can('view_all_chantiers');
  const visibleList = canViewAll
    ? list
    : list.filter((c) => c.chef === user?.name || c.conducteur === user?.name);

  const filtered = visibleList.filter((c) => {
    const q = search.toLowerCase();
    const ok = c.nom.toLowerCase().includes(q) || c.localisation.toLowerCase().includes(q);
    return ok && (filter === 'all' || c.status === filter);
  });

  const stats = {
    total:     visibleList.length,
    actif:     visibleList.filter((c) => c.status === 'actif').length,
    en_retard: visibleList.filter((c) => c.status === 'en_retard').length,
  };

  const handleView = (c) => { dispatch(setSelected(c)); navigate(`/chantiers/${c.id}`); };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: canViewAll ? 'Total' : 'Mes chantiers', value: stats.total,     color: 'text-obsidian-900' },
            { label: 'En cours',                              value: stats.actif,     color: 'text-emerald-600'  },
            { label: 'En retard',                             value: stats.en_retard, color: 'text-red-500'      },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#E8E2D9] px-5 py-4 shadow-card flex items-center gap-4">
              <div>
                <p className={`font-display text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="font-sans text-xs text-obsidian-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-obsidian-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un chantier…"
              className="bg-transparent font-sans text-sm text-obsidian-700 placeholder-obsidian-300 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-display font-medium transition-all',
                  filter === f ? 'bg-obsidian-900 text-white shadow-sm' : 'bg-white border border-[#E8E2D9] text-obsidian-600 hover:bg-canvas',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous' : statusLabel(f)}
              </button>
            ))}
            {/* §42 : bouton "Créer" visible uniquement pour DG et CDT */}
            {can('create_chantier') && (
              <Button icon={<Plus size={15} />} onClick={() => navigate('/chantiers/nouveau')}>
                Nouveau chantier
              </Button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={HardHat}
              title="Aucun chantier trouvé"
              description={canViewAll ? 'Essayez de modifier vos filtres ou créez un nouveau chantier.' : 'Aucun chantier ne vous est assigné.'}
              action={can('create_chantier') && (
                <Button icon={<Plus size={15} />} onClick={() => navigate('/chantiers/nouveau')}>Créer un chantier</Button>
              )}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((c) => {
              const taux = Math.round((c.depenses / c.budget) * 100);
              return (
                <div
                  key={c.id}
                  onClick={() => handleView(c)}
                  className="bg-white rounded-2xl border border-[#E8E2D9] p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-display font-bold text-obsidian-900 truncate">{c.nom}</h3>
                      <p className="font-sans text-xs text-obsidian-400 mt-0.5">{c.localisation}</p>
                    </div>
                    <Badge variant={statusVariant(c.status)} dot>{statusLabel(c.status)}</Badge>
                  </div>

                  <p className="font-sans text-xs text-obsidian-400 mb-4 line-clamp-1">{c.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-sans text-obsidian-500 font-medium">Avancement</span>
                      <span className={`font-display font-bold ${c.status === 'en_retard' ? 'text-red-500' : 'text-primary-600'}`}>{c.avancement}%</span>
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${c.status === 'en_retard' ? 'bg-red-400' : 'bg-primary-600'}`} style={{ width: `${c.avancement}%` }} />
                    </div>
                  </div>

                  {/* Finance visible seulement pour DG, DAF, CDT (§42) */}
                  {can('view_finance_full') || can('view_finance_partial') ? (
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      <div className="bg-canvas rounded-xl p-3">
                        <p className="font-sans text-xs text-obsidian-400 mb-0.5">Budget</p>
                        <p className="font-display text-xs font-bold text-obsidian-700 truncate">{formatCurrency(c.budget)}</p>
                      </div>
                      <div className={`rounded-xl p-3 ${taux > 90 ? 'bg-red-50' : 'bg-canvas'}`}>
                        <p className="font-sans text-xs text-obsidian-400 mb-0.5">Dépensé ({taux}%)</p>
                        <p className={`font-display text-xs font-bold truncate ${taux > 90 ? 'text-red-600' : 'text-obsidian-700'}`}>{formatCurrency(c.depenses)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 bg-canvas rounded-xl p-3">
                      <p className="font-sans text-xs text-obsidian-400 mb-0.5">Chef de chantier</p>
                      <p className="font-display text-xs font-bold text-obsidian-700">{c.chef}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gold-100 flex items-center justify-center">
                        <span className="font-display text-xs font-bold text-gold-700">{c.chef[0]}</span>
                      </div>
                      <span className="font-sans text-xs text-obsidian-500">{c.chef}</span>
                    </div>
                    <span className="font-display text-xs text-gold-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Eye size={12} /> Voir détail
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
