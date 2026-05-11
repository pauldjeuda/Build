import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { formatCurrency, formatDate, statusLabel, statusVariant } from '../../../utils/formatters';
import { addDemande, updateDemande } from '../store/achatsSlice';

export default function DemandesPage() {
  const { demandes } = useSelector((s) => s.achats);
  const chantiers = useSelector((s) => s.chantiers.list);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    dispatch(addDemande({ ...data, montant: parseFloat(data.montant), date: new Date().toISOString().split('T')[0], demandeur: 'Moi', status: 'en_attente' }));
    toast.success('Demande créée');
    reset();
    setModalOpen(false);
  };

  const handleApprove = (d) => {
    dispatch(updateDemande({ ...d, status: 'approuve' }));
    toast.success('Demande approuvée');
  };

  const handleReject = (d) => {
    dispatch(updateDemande({ ...d, status: 'rejete' }));
    toast.error('Demande rejetée');
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Nouvelle demande</Button>
        </div>

        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  {['Référence', 'Article', 'Chantier', 'Montant', 'Demandeur', 'Date', 'Statut', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-display text-xs font-semibold text-obsidian-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EB]">
                {demandes.map((d) => (
                  <tr key={d.id} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-obsidian-500">{d.reference}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{d.article}</p>
                    </td>
                    <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{d.chantier}</td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-obsidian-700">{formatCurrency(d.montant)}</td>
                    <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{d.demandeur}</td>
                    <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{formatDate(d.date)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {d.status === 'en_attente' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleApprove(d)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                            <Check size={14} />
                          </button>
                          <button onClick={() => handleReject(d)} className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle demande d'achat">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Article / Description *" placeholder="Ex : Ciment CEM II — 500 sacs" error={errors.article?.message} {...register('article', { required: 'Requis' })} />
            <Select label="Chantier *" error={errors.chantier?.message} {...register('chantier', { required: 'Requis' })}>
              <option value="">-- Sélectionner --</option>
              {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </Select>
            <Input label="Montant estimé (FCFA) *" type="number" error={errors.montant?.message} {...register('montant', { required: 'Requis', min: 1 })} />
            <Textarea label="Justification" placeholder="Pourquoi cette demande est-elle urgente ?" rows={3} {...register('justification')} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1">Soumettre</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
