import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Send } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { addRapport } from '../store/rapportsSlice';

const METEOS = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluie légère', 'Pluie forte', 'Orageux'];

export default function RapportNewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chantiers = useSelector((s) => s.chantiers.list);
  const user = useSelector((s) => s.auth.user);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (data, status) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(addRapport({
      ...data,
      effectif: parseInt(data.effectif, 10),
      incidents: parseInt(data.incidents || 0, 10),
      status,
      auteur: user?.name || 'Utilisateur',
    }));
    toast.success(status === 'brouillon' ? 'Brouillon enregistré' : 'Rapport soumis avec succès');
    navigate('/rapports');
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/rapports')}>Retour</Button>
          <h2 className="font-display text-xl font-bold text-obsidian-900">Rapport Journalier</h2>
        </div>

        <form className="space-y-5">
          <Card>
            <CardHeader title="Informations générales" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Chantier *"
                error={errors.chantier?.message}
                {...register('chantier', { required: 'Chantier requis' })}
              >
                <option value="">-- Sélectionner --</option>
                {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
              </Select>
              <Input
                label="Date *"
                type="date"
                error={errors.date?.message}
                {...register('date', { required: 'Date requise' })}
              />
              <Select label="Météo *" {...register('meteo', { required: true })}>
                {METEOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Input
                label="Effectif présent *"
                type="number"
                placeholder="Ex : 24"
                error={errors.effectif?.message}
                {...register('effectif', { required: 'Effectif requis', min: 0 })}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Travaux réalisés" />
            <Textarea
              label="Description des travaux *"
              placeholder="Décrire les travaux effectués aujourd'hui..."
              rows={4}
              error={errors.travaux?.message}
              {...register('travaux', { required: 'Description requise' })}
            />
          </Card>

          <Card>
            <CardHeader title="Incidents & Observations" />
            <div className="space-y-4">
              <Input
                label="Nombre d'incidents"
                type="number"
                placeholder="0"
                {...register('incidents')}
              />
              <Textarea
                label="Observations générales"
                placeholder="Observations, difficultés rencontrées, besoins..."
                rows={3}
                {...register('observations')}
              />
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button type="button" variant="secondary" icon={<Save size={16} />} loading={submitting} onClick={handleSubmit((d) => handleSave(d, 'brouillon'))}>
              Enregistrer brouillon
            </Button>
            <Button type="button" icon={<Send size={16} />} loading={submitting} onClick={handleSubmit((d) => handleSave(d, 'soumis'))}>
              Soumettre rapport
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
