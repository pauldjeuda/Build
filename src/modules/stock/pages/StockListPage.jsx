import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Package, AlertTriangle, ArrowUpDown } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Pagination from '../../../components/ui/Pagination';
import { formatCurrency } from '../../../utils/formatters';

const PAGE_SIZE = 8;

export default function StockListPage() {
  const { articles } = useSelector((s) => s.stock);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const filtered = articles.filter(
    (a) =>
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.reference.toLowerCase().includes(search.toLowerCase()) ||
      a.categorie.toLowerCase().includes(search.toLowerCase())
  );

  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const alertCount = articles.filter((a) => a.stock <= a.seuil).length;
  const totalValeur   = articles.reduce((s, a) => s + a.valeur, 0);
  const nbCategories  = new Set(articles.map((a) => a.categorie)).size;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Articles en stock',  value: articles.length, color: 'text-slate-800',    bg: 'bg-white' },
            { label: 'Valeur totale',       value: formatCurrency(totalValeur), color: 'text-slate-800', bg: 'bg-white' },
            { label: 'Alertes seuil',       value: alertCount,      color: alertCount > 0 ? 'text-red-600' : 'text-emerald-600', bg: alertCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white' },
            { label: 'Catégories',          value: nbCategories,    color: 'text-slate-800',    bg: 'bg-white' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-100 px-5 py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]`}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Référence, désignation, catégorie…"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex gap-2">
            {alertCount > 0 && (
              <Button variant="danger" size="sm" icon={<AlertTriangle size={14} />} onClick={() => navigate('/stock/alertes')}>
                {alertCount} alerte{alertCount > 1 ? 's' : ''}
              </Button>
            )}
            <Button variant="outline-gray" size="sm" icon={<ArrowUpDown size={14} />} onClick={() => navigate('/stock/mouvements')}>
              Mouvements
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Réf.', 'Désignation', 'Catégorie', 'Chantier', 'Stock', 'Seuil', 'Valeur', 'État'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((a) => {
                  const alerte = a.stock <= a.seuil;
                  return (
                    <tr key={a.id} className={`hover:bg-slate-50/60 transition-colors ${alerte ? 'bg-red-50/20' : ''}`}>
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">{a.reference}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-slate-800">{a.designation}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="gray">{a.categorie}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">{a.chantier}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-bold ${alerte ? 'text-red-600' : 'text-slate-700'}`}>
                          {a.stock}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{a.unite}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">{a.seuil}</td>
                      <td className="py-3 px-4 text-xs font-mono font-medium text-slate-600">{formatCurrency(a.valeur)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={alerte ? 'danger' : 'success'} dot>
                          {alerte ? 'Alerte' : 'OK'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={(p) => setPage(p)} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
