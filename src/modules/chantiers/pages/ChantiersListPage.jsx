import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, HardHat, SlidersHorizontal } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency, statusLabel, statusVariant } from '../../../utils/formatters';
import { setSelected } from '../store/chantiersSlice';

const FILTERS = ['all', 'actif', 'en_retard', 'suspendu', 'termine'];

export default function ChantiersListPage() {
  const { list } = useSelector((s) => s.chantiers);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = list.filter((c) => {
    const q = search.toLowerCase();
    const ok = c.nom.toLowerCase().includes(q) || c.localisation.toLowerCase().includes(q);
    return ok && (filter === 'all' || c.status === filter);
  });

  const stats = {
    total:     list.length,
    actif:     list.filter((c) => c.status === 'actif').length,
    en_retard: list.filter((c) => c.status === 'en_retard').length,
  };

  const handleView = (c) => { dispatch(setSelected(c)); navigate(`/chantiers/${c.id}`); };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',       value: stats.total,     color: 'text-slate-800' },
            { label: 'En cours',    value: stats.actif,     color: 'text-emerald-600' },
            { label: 'En retard',   value: stats.en_retard, color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 px-5 py-3 flex items-center gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un chantier…"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  filter === f
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous' : statusLabel(f)}
              </button>
            ))}
            <Button icon={<Plus size={15} />} onClick={() => navigate('/chantiers/nouveau')}>
              Nouveau chantier
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={HardHat}
              title="Aucun chantier trouvé"
              description="Essayez de modifier vos filtres ou créez un nouveau chantier."
              action={<Button icon={<Plus size={15} />} onClick={() => navigate('/chantiers/nouveau')}>Créer un chantier</Button>}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {filtered.map((c) => {
              const taux = Math.round((c.depenses / c.budget) * 100);
              return (
                <div
                  key={c.id}
                  onClick={() => handleView(c)}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0 mr-3">
                      <h3 className="font-bold text-slate-900 truncate">{c.nom}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{c.localisation}</p>
                    </div>
                    <Badge variant={statusVariant(c.status)} dot>{statusLabel(c.status)}</Badge>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 line-clamp-1">{c.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Avancement</span>
                      <span className={`font-bold ${c.status === 'en_retard' ? 'text-red-500' : 'text-primary-600'}`}>
                        {c.avancement}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.status === 'en_retard' ? 'bg-red-400' : 'bg-primary-500'}`}
                        style={{ width: `${c.avancement}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">Budget</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{formatCurrency(c.budget)}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${taux > 90 ? 'bg-red-50' : 'bg-slate-50'}`}>
                      <p className="text-xs text-slate-400 mb-0.5">Dépensé ({taux}%)</p>
                      <p className={`text-xs font-bold truncate ${taux > 90 ? 'text-red-600' : 'text-slate-700'}`}>
                        {formatCurrency(c.depenses)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">{c.chef[0]}</span>
                      </div>
                      <span className="text-xs text-slate-500">{c.chef}</span>
                    </div>
                    <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
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
