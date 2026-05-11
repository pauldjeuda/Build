import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Cloud, Users, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import { formatDate, statusLabel, statusVariant } from '../../../utils/formatters';

const FILTERS = ['all', 'brouillon', 'soumis', 'valide'];
const PAGE_SIZE = 8;

export default function RapportsListPage() {
  const { list } = useSelector((s) => s.rapports);
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage]     = useState(1);

  const filtered = list.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.chantier.toLowerCase().includes(q) || r.auteur.toLowerCase().includes(q)) &&
      (filter === 'all' || r.status === filter)
    );
  });
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-obsidian-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher…"
              className="bg-transparent font-sans text-sm text-obsidian-700 placeholder-obsidian-300 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-display font-medium transition-all',
                  filter === f ? 'bg-obsidian-900 text-white shadow-sm' : 'bg-white border border-[#E8E2D9] text-obsidian-600 hover:bg-canvas',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous' : statusLabel(f)}
              </button>
            ))}
            <Button icon={<Plus size={15} />} onClick={() => navigate('/rapports/nouveau')}>
              Nouveau rapport
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun rapport"
              description="Créez votre premier rapport journalier."
              action={<Button icon={<Plus size={15} />} onClick={() => navigate('/rapports/nouveau')}>Nouveau rapport</Button>}
            />
          ) : (
            <>
              {/* Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-5 py-3 border-b border-[#E8E2D9]">
                {[
                  { label: 'Chantier / Auteur', span: 'col-span-4' },
                  { label: 'Date',              span: 'col-span-2' },
                  { label: 'Météo',             span: 'col-span-2' },
                  { label: 'Effectif',          span: 'col-span-2' },
                  { label: 'Statut',            span: 'col-span-2 text-right' },
                ].map((h) => (
                  <span key={h.label} className={`font-display text-xs font-semibold text-obsidian-400 uppercase tracking-wide ${h.span}`}>
                    {h.label}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-[#F4F1EB]">
                {paginated.map((r) => (
                  <div key={r.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-4 hover:bg-canvas/60 transition-colors items-center">
                    <div className="col-span-4">
                      <p className="font-display text-sm font-semibold text-obsidian-800">{r.chantier}</p>
                      <p className="font-sans text-xs text-obsidian-400">{r.auteur}</p>
                      <p className="font-sans text-xs text-obsidian-500 mt-0.5 line-clamp-1 hidden sm:block">{r.travaux}</p>
                    </div>
                    <div className="col-span-2 font-sans text-sm text-obsidian-600">{formatDate(r.date)}</div>
                    <div className="col-span-2 flex items-center gap-1.5 font-sans text-xs text-obsidian-500">
                      <Cloud size={13} className="text-obsidian-300" />{r.meteo}
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 font-sans text-sm text-obsidian-600">
                      <Users size={13} className="text-obsidian-300" />{r.effectif}
                    </div>
                    <div className="col-span-2 flex items-center gap-2 sm:justify-end flex-wrap">
                      <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge>
                      {r.incidents > 0 && (
                        <Badge variant="danger">
                          <AlertTriangle size={10} /> {r.incidents}
                        </Badge>
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
