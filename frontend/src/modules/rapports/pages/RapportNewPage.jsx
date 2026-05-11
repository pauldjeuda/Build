import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Send } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { createRapport, submitRapport } from '../store/rapportsSlice';
import { fetchChantiers } from '../../chantiers/store/chantiersSlice';

const METEOS = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluie légère', 'Pluie forte', 'Orageux'];

export default function RapportNewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chantiers = useSelector((s) => s.chantiers.list);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchChantiers()); }, [dispatch]);

  const handleSave = async (data, status) => {
    setSubmitting(true);
    const payload = {
      chantier_id: parseInt(data.chantier_id, 10),
      date: data.date,
      meteo: data.meteo,
      effectif: parseInt(data.effectif, 10),
      travaux: data.travaux,
      observations: data.observations || null,
      status,
    };
    const action = await dispatch(createRapport(payload));
    if (!action.error && status === 'soumis' && action.payload?.id) {
      await dispatch(submitRapport(action.payload.id));
    }
    setSubmitting(false);
    if (!action.error) navigate('/rapports');
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
                error={errors.chantier_id?.message}
                {...register('chantier_id', { required: 'Chantier requis' })}
              >
                <option value="">-- Sélectionner --</option>
                {chantiers.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
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
            <CardHeader title="Observations" />
            <Textarea
              label="Observations générales"
              placeholder="Observations, difficultés rencontrées, besoins..."
              rows={3}
              {...register('observations')}
            />
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
