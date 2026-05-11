import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select } from '../../../components/ui/Input';
import { formatDate } from '../../../utils/formatters';
import { addMouvement } from '../store/stockSlice';

export default function MouvementsPage() {
  const { mouvements, articles } = useSelector((s) => s.stock);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    dispatch(addMouvement({ ...data, date: new Date().toISOString().split('T')[0], operateur: 'Moi' }));
    toast.success('Mouvement enregistré');
    reset();
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex justify-end">
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
            Nouveau mouvement
          </Button>
        </div>

        <Card padding={false}>
          <div className="px-5 py-4 border-b border-[#E8E2D9]">
            <h3 className="font-display text-sm font-semibold text-obsidian-800">Historique des mouvements</h3>
          </div>
          <div className="divide-y divide-[#F4F1EB]">
            {mouvements.map((m) => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-canvas/60 transition-colors">
                <div className={`p-2 rounded-xl shrink-0 ${m.type === 'entree' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {m.type === 'entree' ? <ArrowDown size={16} className="text-emerald-600" /> : <ArrowUp size={16} className="text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{m.article}</p>
                  <p className="font-sans text-xs text-obsidian-400">{m.chantier} · {m.operateur}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-display text-sm font-bold ${m.type === 'entree' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.type === 'entree' ? '+' : '-'}{m.qte}
                  </p>
                  <p className="font-sans text-xs text-obsidian-400">{formatDate(m.date)}</p>
                </div>
                <Badge variant={m.type === 'entree' ? 'success' : 'danger'}>
                  {m.type === 'entree' ? 'Entrée' : 'Sortie'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau mouvement de stock">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select label="Type *" {...register('type', { required: true })}>
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
            </Select>
            <Select label="Article *" error={errors.article?.message} {...register('article', { required: 'Requis' })}>
              <option value="">-- Sélectionner --</option>
              {articles.map((a) => <option key={a.id} value={a.designation}>{a.designation}</option>)}
            </Select>
            <Input label="Quantité *" type="number" error={errors.qte?.message} {...register('qte', { required: 'Requis', min: 1 })} />
            <Input label="Chantier *" placeholder="Chantier concerné" error={errors.chantier?.message} {...register('chantier', { required: 'Requis' })} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1">Enregistrer</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
