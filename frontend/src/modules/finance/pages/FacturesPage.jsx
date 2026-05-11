import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, FileText, ArrowDownLeft, ArrowUpRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select } from '../../../components/ui/Input';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { addFacture, updateFacture } from '../store/financeSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const STATUS_META = {
  ouvert:    { label: 'Ouvert',     variant: 'info',    icon: Clock },
  paye:      { label: 'Payé',       variant: 'success', icon: CheckCircle },
  en_retard: { label: 'En retard',  variant: 'danger',  icon: AlertCircle },
  annule:    { label: 'Annulé',     variant: 'gray',    icon: null },
};

const TYPE_FILTERS = ['all', 'client', 'fournisseur'];
const STATUS_FILTERS = ['all', 'ouvert', 'en_retard', 'paye'];

export default function FacturesPage() {
  const { factures } = useSelector((s) => s.finance);
  const dispatch = useDispatch();
  const [search, setSearch]       = useState('');
  const [typeF, setTypeF]         = useState('all');
  const [statusF, setStatusF]     = useState('all');
  const [modal, setModal]         = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const filtered = factures.filter((f) => {
    const q = search.toLowerCase();
    const matchQ = f.reference.toLowerCase().includes(q) ||
      f.tiers.toLowerCase().includes(q) ||
      f.libelle.toLowerCase().includes(q);
    return matchQ && (typeF === 'all' || f.type === typeF) && (statusF === 'all' || f.status === statusF);
  });

  const stats = {
    total:    factures.length,
    ouvert:   factures.filter((f) => f.status === 'ouvert').length,
    enRetard: factures.filter((f) => f.status === 'en_retard').length,
    montantOuvert: factures.filter((f) => ['ouvert', 'en_retard'].includes(f.status)).reduce((s, f) => s + f.montant, 0),
  };

  const onSubmit = (data) => {
    dispatch(addFacture({ ...data, montant: Number(data.montant) }));
    toast.success('Facture créée');
    reset();
    setModal(false);
  };

  const handlePay = (f) => {
    dispatch(updateFacture({ id: f.id, status: 'paye' }));
    toast.success(`Facture ${f.reference} marquée payée`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total factures',      value: stats.total,                       color: 'text-slate-800',   bg: 'bg-white' },
            { label: 'Ouvertes',            value: stats.ouvert,                      color: 'text-blue-600',    bg: 'bg-white' },
            { label: 'En retard',           value: stats.enRetard,                    color: stats.enRetard > 0 ? 'text-red-600' : 'text-emerald-600', bg: stats.enRetard > 0 ? 'bg-red-50 border-red-100' : 'bg-white' },
            { label: 'Montant à recouvrer', value: formatCurrency(stats.montantOuvert), color: 'text-slate-800', bg: 'bg-white' },
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
              placeholder="Référence, tiers, libellé…"
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type filter */}
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeF(f)}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  typeF === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous' : f === 'client' ? 'Clients' : 'Fournisseurs'}
              </button>
            ))}
            <div className="w-px h-5 bg-slate-200" />
            {/* Status filter */}
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusF(f)}
                className={[
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                  statusF === f ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {f === 'all' ? 'Tous statuts' : STATUS_META[f]?.label ?? f}
              </button>
            ))}
            <Button icon={<Plus size={15} />} onClick={() => setModal(true)}>
              Nouvelle facture
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Réf.', 'Type', 'Tiers', 'Libellé', 'Montant', 'Émission', 'Échéance', 'Statut', ''].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-sm text-slate-400">
                      <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                      Aucune facture trouvée
                    </td>
                  </tr>
                ) : filtered.map((f) => {
                  const meta = STATUS_META[f.status] ?? STATUS_META.ouvert;
                  const isClient = f.type === 'client';
                  return (
                    <tr key={f.id} className={`hover:bg-slate-50/60 transition-colors ${f.status === 'en_retard' ? 'bg-red-50/20' : ''}`}>
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">{f.reference}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {isClient
                            ? <ArrowUpRight size={14} className="text-emerald-500" />
                            : <ArrowDownLeft size={14} className="text-blue-500" />
                          }
                          <span className={`text-xs font-medium ${isClient ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {isClient ? 'Client' : 'Fourn.'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">{f.tiers}</td>
                      <td className="py-3 px-4 text-xs text-slate-500 max-w-[180px] truncate">{f.libelle}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-700 whitespace-nowrap">{formatCurrency(f.montant)}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{formatDate(f.dateEmission)}</td>
                      <td className={`py-3 px-4 text-xs font-medium ${f.status === 'en_retard' ? 'text-red-600' : 'text-slate-500'}`}>
                        {formatDate(f.dateEcheance)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={meta.variant} dot>{meta.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {['ouvert', 'en_retard'].includes(f.status) && (
                          <button
                            onClick={() => handlePay(f)}
                            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline whitespace-nowrap"
                          >
                            Marquer payé
                          </button>
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

      {/* Modal nouvelle facture */}
      <Modal
        open={modal}
        onClose={() => { setModal(false); reset(); }}
        title="Nouvelle facture"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => { setModal(false); reset(); }}>Annuler</Button>
            <Button form="form-facture" type="submit" icon={<FileText size={14} />}>
              Enregistrer
            </Button>
          </div>
        }
      >
        <form id="form-facture" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            id="type"
            label="Type"
            error={errors.type?.message}
            {...register('type', { required: 'Champ requis' })}
          >
            <option value="">Sélectionner…</option>
            <option value="client">Client</option>
            <option value="fournisseur">Fournisseur</option>
          </Select>
          <Input
            id="tiers"
            label="Tiers (client ou fournisseur)"
            placeholder="Ex: CIM Cameroun"
            error={errors.tiers?.message}
            {...register('tiers', { required: 'Champ requis' })}
          />
          <Input
            id="libelle"
            label="Libellé"
            placeholder="Ex: Fourniture béton — Immeuble Akwa"
            error={errors.libelle?.message}
            {...register('libelle', { required: 'Champ requis' })}
          />
          <Input
            id="montant"
            label="Montant (FCFA)"
            type="number"
            placeholder="0"
            error={errors.montant?.message}
            {...register('montant', { required: 'Champ requis', min: { value: 1, message: 'Montant invalide' } })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="dateEmission"
              label="Date d'émission"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              {...register('dateEmission')}
            />
            <Input
              id="dateEcheance"
              label="Date d'échéance"
              type="date"
              error={errors.dateEcheance?.message}
              {...register('dateEcheance', { required: 'Champ requis' })}
            />
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
