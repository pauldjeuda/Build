import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingCart, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select } from '../../../components/ui/Input';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { addCommande, updateCommande } from '../store/achatsSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const STATUS_META = {
  en_cours: { label: 'En cours',  variant: 'info',    icon: Clock },
  livre:    { label: 'Livré',     variant: 'success', icon: CheckCircle },
  annule:   { label: 'Annulé',    variant: 'danger',  icon: XCircle },
};

const FILTERS = ['all', 'en_cours', 'livre', 'annule'];

export default function CommandesPage() {
  const { commandes, fournisseurs } = useSelector((s) => s.achats);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal]   = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const filtered = commandes.filter((c) => {
    const q = search.toLowerCase();
    const match = c.reference.toLowerCase().includes(q) ||
      c.fournisseur.toLowerCase().includes(q) ||
      c.article.toLowerCase().includes(q) ||
      c.chantier.toLowerCase().includes(q);
    return match && (filter === 'all' || c.status === filter);
  });

  const stats = {
    total:    commandes.length,
    en_cours: commandes.filter((c) => c.status === 'en_cours').length,
    livre:    commandes.filter((c) => c.status === 'livre').length,
    montant:  commandes.filter((c) => c.status !== 'annule').reduce((s, c) => s + c.montant, 0),
  };

  const onSubmit = (data) => {
    dispatch(addCommande({ ...data, montant: Number(data.montant) }));
    toast.success('Bon de commande créé');
    reset();
    setModal(false);
  };

  const markLivre = (c) => {
    dispatch(updateCommande({ id: c.id, status: 'livre' }));
    toast.success(`Commande ${c.reference} marquée livrée`);
  };

  const markAnnule = (c) => {
    dispatch(updateCommande({ id: c.id, status: 'annule' }));
    toast('Commande annulée', { icon: '⚠️' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total commandes',  value: stats.total,              color: 'text-slate-800' },
            { label: 'En cours',         value: stats.en_cours,           color: 'text-blue-600' },
            { label: 'Livrées',          value: stats.livre,              color: 'text-emerald-600' },
            { label: 'Montant engagé',   value: formatCurrency(stats.montant), color: 'text-slate-800' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
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
              placeholder="Référence, fournisseur, article…"
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
                  filter === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {f === 'all' ? 'Toutes' : STATUS_META[f].label}
              </button>
            ))}
            <Button variant="outline-gray" size="sm" onClick={() => navigate('/achats/demandes')}>
              Demandes
            </Button>
            <Button icon={<Plus size={15} />} onClick={() => setModal(true)}>
              Nouvelle commande
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Réf.', 'Fournisseur', 'Article / Chantier', 'Montant', 'Date Cmd.', 'Livraison prévue', 'Statut', ''].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm text-slate-400">
                      <ShoppingCart size={32} className="mx-auto mb-2 text-slate-300" />
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : filtered.map((c) => {
                  const meta = STATUS_META[c.status] ?? STATUS_META.en_cours;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">{c.reference}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Truck size={13} className="text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-slate-800">{c.fournisseur}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-700 truncate max-w-[180px]">{c.article}</p>
                        <p className="text-xs text-slate-400">{c.chantier}</p>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                        {formatCurrency(c.montant)}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">{formatDate(c.dateCommande)}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{formatDate(c.dateLivraison)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={meta.variant} dot>{meta.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {c.status === 'en_cours' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => markLivre(c)}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              Livré
                            </button>
                            <span className="text-slate-200">·</span>
                            <button
                              onClick={() => markAnnule(c)}
                              className="text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal nouvelle commande */}
      <Modal
        open={modal}
        onClose={() => { setModal(false); reset(); }}
        title="Nouveau bon de commande"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setModal(false); reset(); }}>Annuler</Button>
            <Button form="form-commande" type="submit" icon={<ShoppingCart size={14} />}>
              Créer la commande
            </Button>
          </div>
        }
      >
        <form id="form-commande" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            id="fournisseur"
            label="Fournisseur"
            error={errors.fournisseur?.message}
            {...register('fournisseur', { required: 'Champ requis' })}
          >
            <option value="">Sélectionner…</option>
            {fournisseurs.map((f) => <option key={f.id} value={f.nom}>{f.nom}</option>)}
          </Select>
          <Input
            id="article"
            label="Article / Désignation"
            placeholder="Ex: Ciment CEM II — 200 sacs"
            error={errors.article?.message}
            {...register('article', { required: 'Champ requis' })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="montant"
              label="Montant (FCFA)"
              type="number"
              placeholder="0"
              error={errors.montant?.message}
              {...register('montant', { required: 'Champ requis', min: { value: 1, message: 'Montant invalide' } })}
            />
            <Input
              id="chantier"
              label="Chantier"
              placeholder="Ex: Immeuble Akwa"
              error={errors.chantier?.message}
              {...register('chantier', { required: 'Champ requis' })}
            />
          </div>
          <Input
            id="dateLivraison"
            label="Date de livraison prévue"
            type="date"
            error={errors.dateLivraison?.message}
            {...register('dateLivraison', { required: 'Champ requis' })}
          />
          <Input
            id="dateCommande"
            label="Date de commande"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            {...register('dateCommande')}
          />
        </form>
      </Modal>
    </DashboardLayout>
  );
}
