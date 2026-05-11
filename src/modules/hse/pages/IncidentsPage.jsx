import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { formatDate } from '../../../utils/formatters';
import { addIncident, updateIncident } from '../store/hseSlice';

const GRAVITES = { faible: { label: 'Faible', variant: 'info' }, moyen: { label: 'Moyen', variant: 'warning' }, grave: { label: 'Grave', variant: 'danger' } };
const TYPES = ['Accident léger', 'Accident grave', 'Presque-accident', 'Incident matériel', 'Incident environnemental'];

export default function IncidentsPage() {
  const { incidents } = useSelector((s) => s.hse);
  const chantiers = useSelector((s) => s.chantiers.list);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    dispatch(addIncident({ ...data, date: new Date().toISOString().split('T')[0], status: 'en_cours' }));
    toast.success('Incident déclaré');
    reset();
    setModalOpen(false);
  };

  const handleResolve = (inc) => {
    dispatch(updateIncident({ ...inc, status: 'resolu' }));
    toast.success('Incident marqué résolu');
  };

  const open = incidents.filter((i) => i.status === 'en_cours').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex gap-3 flex-wrap">
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 shadow-card">
              <p className="font-sans text-xs text-obsidian-400">Incidents ouverts</p>
              <p className="font-display text-xl font-bold text-red-600">{open}</p>
            </div>
            <div className="bg-white border border-[#E8E2D9] rounded-2xl px-4 py-3 shadow-card">
              <p className="font-sans text-xs text-obsidian-400">Total période</p>
              <p className="font-display text-xl font-bold text-obsidian-900">{incidents.length}</p>
            </div>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>Déclarer incident</Button>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => {
            const g = GRAVITES[inc.gravite] || { label: inc.gravite, variant: 'gray' };
            return (
              <Card key={inc.id} className={inc.status === 'en_cours' ? 'border-l-4 border-l-red-500' : ''}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${inc.status === 'en_cours' ? 'bg-red-100' : 'bg-emerald-100'}`}>
                      {inc.status === 'en_cours' ? <AlertTriangle size={16} className="text-red-600" /> : <CheckCircle size={16} className="text-emerald-600" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-semibold text-obsidian-800">{inc.type}</p>
                        <Badge variant={g.variant}>{g.label}</Badge>
                        <Badge variant={inc.status === 'resolu' ? 'success' : 'warning'}>{inc.status === 'resolu' ? 'Résolu' : 'En cours'}</Badge>
                      </div>
                      <p className="font-sans text-sm text-obsidian-600 mt-1">{inc.description}</p>
                      {inc.victime && <p className="font-sans text-xs text-obsidian-400 mt-0.5">Victime : {inc.victime}</p>}
                      <p className="font-sans text-xs text-obsidian-400 mt-1">{inc.chantier} · {formatDate(inc.date)}</p>
                    </div>
                  </div>
                  {inc.status === 'en_cours' && (
                    <Button variant="success" size="sm" onClick={() => handleResolve(inc)}>Résoudre</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Déclarer un incident">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select label="Type d'incident *" {...register('type', { required: true })}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select label="Chantier *" {...register('chantier', { required: true })}>
              {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </Select>
            <Select label="Gravité *" {...register('gravite', { required: true })}>
              <option value="faible">Faible</option>
              <option value="moyen">Moyen</option>
              <option value="grave">Grave</option>
            </Select>
            <Textarea label="Description *" placeholder="Décrire l'incident en détail..." rows={3} {...register('description', { required: true })} />
            <Input label="Victime (si applicable)" placeholder="Nom et prénom" {...register('victime')} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit" variant="danger" className="flex-1">Déclarer</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
