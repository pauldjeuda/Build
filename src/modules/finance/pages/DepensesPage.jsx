import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select } from '../../../components/ui/Input';
import { formatCurrency, formatDate, statusLabel, statusVariant } from '../../../utils/formatters';
import { addDepense } from '../store/financeSlice';

const CATEGORIES = ['Matériaux', 'Main d\'œuvre', 'Carburant', 'Location engins', 'Transport', 'Divers'];

export default function DepensesPage() {
  const { depenses } = useSelector((s) => s.finance);
  const chantiers = useSelector((s) => s.chantiers.list);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    dispatch(addDepense({ ...data, montant: parseFloat(data.montant), date: new Date().toISOString().split('T')[0], status: 'en_attente' }));
    toast.success('Dépense enregistrée');
    reset();
    setModalOpen(false);
  };

  const total = depenses.reduce((s, d) => s + d.montant, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3">
            <p className="text-xs text-gray-400">Total dépenses</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Nouvelle dépense</Button>
        </div>

        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Date', 'Libellé', 'Catégorie', 'Chantier', 'Montant', 'Statut'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-gray-400 text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {depenses.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{formatDate(d.date)}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{d.libelle}</td>
                    <td className="py-3 px-4"><Badge variant="info">{d.categorie}</Badge></td>
                    <td className="py-3 px-4 text-gray-500">{d.chantier}</td>
                    <td className="py-3 px-4 font-bold text-gray-700">{formatCurrency(d.montant)}</td>
                    <td className="py-3 px-4"><Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle dépense">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Libellé *" placeholder="Description de la dépense" error={errors.libelle?.message} {...register('libelle', { required: 'Requis' })} />
            <Select label="Catégorie *" error={errors.categorie?.message} {...register('categorie', { required: 'Requis' })}>
              <option value="">-- Sélectionner --</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="Chantier *" error={errors.chantier?.message} {...register('chantier', { required: 'Requis' })}>
              <option value="">-- Sélectionner --</option>
              <option value="Tous">Tous chantiers</option>
              {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </Select>
            <Input label="Montant (FCFA) *" type="number" error={errors.montant?.message} {...register('montant', { required: 'Requis', min: 1 })} />
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1">Enregistrer</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
