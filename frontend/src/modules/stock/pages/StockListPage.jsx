// §29 — Module Stock
// §42 : Gérer stock = GST (full) / DG DAF CDT LOG = lecture seule / CDC = demande / HSE = non
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, ArrowUpDown, Plus, PackagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select } from '../../../components/ui/Input';
import Pagination from '../../../components/ui/Pagination';
import { formatCurrency } from '../../../utils/formatters';
import { useAuth } from '../../../hooks/useAuth';

const PAGE_SIZE = 8;

export default function StockListPage() {
  const { articles } = useSelector((s) => s.stock);
  const chantiers    = useSelector((s) => s.chantiers.list);
  const navigate     = useNavigate();
  const { can }      = useAuth();
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [demandeOpen, setDemandeOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered  = articles.filter(
    (a) =>
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.reference.toLowerCase().includes(search.toLowerCase()) ||
      a.categorie.toLowerCase().includes(search.toLowerCase())
  );
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const alertCount = articles.filter((a) => a.stock <= a.seuil).length;
  const totalValeur= articles.reduce((s, a) => s + a.valeur, 0);
  const nbCategories = new Set(articles.map((a) => a.categorie)).size;

  // CDC peut faire une demande de matériel
  const handleDemande = (article) => {
    setSelectedArticle(article);
    setDemandeOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Bandeau rôle */}
        {can('manage_stock') && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <PackagePlus size={15} className="text-violet-600 shrink-0" />
            <p className="font-sans text-sm text-violet-700 font-medium">
              Mode Gestionnaire de Stock — accès complet (entrées, sorties, transferts, inventaires)
            </p>
          </div>
        )}
        {!can('manage_stock') && !can('request_stock') && (
          <div className="bg-canvas border border-[#E8E2D9] rounded-2xl px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={15} className="text-obsidian-400 shrink-0" />
            <p className="font-sans text-sm text-obsidian-500">Lecture seule — contactez le GST pour toute modification</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Articles en stock', value: articles.length,             color: 'text-obsidian-900', bg: 'bg-white' },
            { label: 'Valeur totale',      value: formatCurrency(totalValeur), color: 'text-obsidian-900', bg: 'bg-white' },
            { label: 'Alertes seuil',      value: alertCount,                  color: alertCount > 0 ? 'text-red-600' : 'text-emerald-600', bg: alertCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white' },
            { label: 'Catégories',         value: nbCategories,                color: 'text-obsidian-900', bg: 'bg-white' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-[#E8E2D9] px-5 py-4 shadow-card`}>
              <p className={`font-display text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="font-sans text-xs text-obsidian-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-white border border-[#E8E2D9] rounded-xl px-3 py-2.5 flex-1 max-w-xs shadow-sm">
            <Search size={15} className="text-obsidian-300 shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Référence, désignation, catégorie…"
              className="bg-transparent font-sans text-sm text-obsidian-700 placeholder-obsidian-300 focus:outline-none w-full"
            />
          </div>
          <div className="flex gap-2">
            {alertCount > 0 && (
              <Button variant="danger" size="sm" icon={<AlertTriangle size={14} />} onClick={() => navigate('/stock/alertes')}>
                {alertCount} alerte{alertCount > 1 ? 's' : ''}
              </Button>
            )}
            {/* Mouvements : GST uniquement peut saisir des entrées/sorties */}
            {can('manage_stock') && (
              <Button variant="outline-gray" size="sm" icon={<ArrowUpDown size={14} />} onClick={() => navigate('/stock/mouvements')}>
                Saisir mouvement
              </Button>
            )}
            {!can('manage_stock') && (
              <Button variant="outline-gray" size="sm" icon={<ArrowUpDown size={14} />} onClick={() => navigate('/stock/mouvements')}>
                Mouvements
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  {['Réf.', 'Désignation', 'Catégorie', 'Chantier', 'Stock', 'Seuil', 'Valeur', 'État', can('request_stock') ? 'Demande' : ''].filter(Boolean).map((h) => (
                    <th key={h} className="py-3 px-4 text-left font-display text-xs font-semibold text-obsidian-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((a) => {
                  const alerte = a.stock <= a.seuil;
                  return (
                    <tr key={a.id} className={`border-b border-[#F4F1EB] last:border-0 hover:bg-canvas/60 transition-colors ${alerte ? 'bg-red-50/30' : ''}`}>
                      <td className="py-3.5 px-4 font-mono text-xs text-obsidian-500">{a.reference}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-display text-sm font-semibold text-obsidian-800">{a.designation}</p>
                      </td>
                      <td className="py-3.5 px-4"><Badge variant="gray">{a.categorie}</Badge></td>
                      <td className="py-3.5 px-4 font-sans text-xs text-obsidian-500">{a.chantier}</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-display text-sm font-bold ${alerte ? 'text-red-600' : 'text-obsidian-700'}`}>{a.stock}</span>
                        <span className="font-sans text-xs text-obsidian-400 ml-1">{a.unite}</span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-xs text-obsidian-400">{a.seuil}</td>
                      <td className="py-3.5 px-4 font-mono text-xs font-medium text-obsidian-600">{formatCurrency(a.valeur)}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={alerte ? 'danger' : 'success'} dot>{alerte ? 'Alerte' : 'OK'}</Badge>
                      </td>
                      {/* CDC peut faire une demande d'article */}
                      {can('request_stock') && (
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleDemande(a)}
                            className="text-xs font-display font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                          >
                            <Plus size={12} /> Demander
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={setPage} />
        </Card>
      </div>

      {/* Modal demande de matériel — CDC */}
      {can('request_stock') && (
        <Modal open={demandeOpen} onClose={() => setDemandeOpen(false)} title="Demande de matériel">
          <div className="space-y-4">
            {selectedArticle && (
              <div className="bg-canvas rounded-xl p-3">
                <p className="font-display text-sm font-semibold text-obsidian-800">{selectedArticle.designation}</p>
                <p className="font-sans text-xs text-obsidian-400">Stock actuel : {selectedArticle.stock} {selectedArticle.unite}</p>
              </div>
            )}
            <Input label="Quantité souhaitée *" type="number" placeholder="Ex : 50" />
            <Select label="Chantier *">
              {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </Select>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setDemandeOpen(false)}>Annuler</Button>
              <Button type="button" className="flex-1" onClick={() => {
                toast.success('Demande transmise au GST');
                setDemandeOpen(false);
              }}>Envoyer la demande</Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
