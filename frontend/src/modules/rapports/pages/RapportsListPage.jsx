// §22 — Workflow Rapport Journalier
// §42 : Créer rapport = CDC seulement / Valider = CDT seulement
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Cloud, Users, AlertTriangle, Check, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import { formatDate, statusLabel, statusVariant } from '../../../utils/formatters';
import { updateRapport } from '../store/rapportsSlice';
import { useAuth } from '../../../hooks/useAuth';

const FILTERS = ['all', 'brouillon', 'soumis', 'valide', 'rejete'];
const PAGE_SIZE = 8;

export default function RapportsListPage() {
  const { list } = useSelector((s) => s.rapports);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { can, user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage]     = useState(1);

  // CDC ne voit que ses propres rapports
  const visibleList = can('validate_rapport')
    ? list
    : list.filter((r) => r.auteur === user?.name || can('view_rapports'));

  const filtered = visibleList.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.chantier.toLowerCase().includes(q) || r.auteur.toLowerCase().includes(q)) &&
      (filter === 'all' || r.status === filter)
    );
  });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // §22 — CDT valide ou rejette
  const handleValidate = (r) => {
    dispatch(updateRapport({ ...r, status: 'valide' }));
    toast.success(`Rapport validé — ${r.chantier}`);
  };
  const handleReject = (r) => {
    dispatch(updateRapport({ ...r, status: 'rejete' }));
    toast.error(`Rapport rejeté — ${r.chantier}`);
  };

  const soumisCount = list.filter((r) => r.status === 'soumis').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Alerte rapports à valider — visible CDT seulement */}
        {can('validate_rapport') && soumisCount > 0 && (
          <div className="bg-gold-50 border border-gold-200 rounded-2xl px-5 py-3.5 flex items-center gap-3">
            <AlertTriangle size={16} className="text-gold-600 shrink-0" />
            <p className="font-display text-sm font-semibold text-obsidian-800">
              {soumisCount} rapport{soumisCount > 1 ? 's' : ''} en attente de validation
            </p>
            <button onClick={() => setFilter('soumis')} className="ml-auto text-xs font-display font-bold text-gold-600 hover:text-gold-800">
              Filtrer →
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-obsidian-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Chantier, auteur…"
              className="bg-transparent font-sans text-sm text-obsidian-700 placeholder-obsidian-300 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-display font-medium transition-all',
                  filter === f ? 'bg-obsidian-900 text-white shadow-sm' : 'bg-white border border-[#E8E2D9] text-obsidian-600 hover:bg-canvas',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous' : statusLabel(f)}
              </button>
            ))}
            {/* §42 : "Nouveau rapport" visible uniquement pour CDC */}
            {can('create_rapport') && (
              <Button icon={<Plus size={15} />} onClick={() => navigate('/rapports/nouveau')}>
                Nouveau rapport
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun rapport"
              description={can('create_rapport') ? 'Créez votre premier rapport journalier.' : 'Aucun rapport à afficher.'}
              action={can('create_rapport') && (
                <Button icon={<Plus size={15} />} onClick={() => navigate('/rapports/nouveau')}>Nouveau rapport</Button>
              )}
            />
          ) : (
            <>
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 border-b border-[#E8E2D9]">
                {[
                  { label: 'Chantier / Auteur', span: 'col-span-3' },
                  { label: 'Date',              span: 'col-span-2' },
                  { label: 'Météo',             span: 'col-span-2' },
                  { label: 'Effectif',          span: 'col-span-1' },
                  { label: 'Statut',            span: 'col-span-2' },
                  { label: 'Actions',           span: 'col-span-2 text-right' },
                ].map((h) => (
                  <span key={h.label} className={`font-display text-xs font-semibold text-obsidian-400 uppercase tracking-wide ${h.span}`}>
                    {h.label}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-[#F4F1EB]">
                {paginated.map((r) => (
                  <div key={r.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-canvas/60 transition-colors items-center">
                    <div className="col-span-3">
                      <p className="font-display text-sm font-semibold text-obsidian-800">{r.chantier}</p>
                      <p className="font-sans text-xs text-obsidian-400">{r.auteur}</p>
                      <p className="font-sans text-xs text-obsidian-500 mt-0.5 line-clamp-1 hidden sm:block">{r.travaux}</p>
                    </div>
                    <div className="col-span-2 font-sans text-sm text-obsidian-600">{formatDate(r.date)}</div>
                    <div className="col-span-2 flex items-center gap-1.5 font-sans text-xs text-obsidian-500">
                      <Cloud size={13} className="text-obsidian-300" />{r.meteo}
                    </div>
                    <div className="col-span-1 flex items-center gap-1.5 font-sans text-sm text-obsidian-600">
                      <Users size={13} className="text-obsidian-300" />{r.effectif}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 flex-wrap">
                      <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge>
                      {r.incidents > 0 && <Badge variant="danger"><AlertTriangle size={10} /> {r.incidents}</Badge>}
                    </div>
                    {/* §22 — Actions validation CDT uniquement */}
                    <div className="col-span-2 flex items-center gap-1.5 justify-end">
                      {can('validate_rapport') && r.status === 'soumis' && (
                        <>
                          <button
                            onClick={() => handleValidate(r)}
                            title="Valider"
                            className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(r)}
                            title="Rejeter"
                            className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={setPage} />
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
