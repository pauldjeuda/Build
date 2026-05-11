import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { addChantier } from '../store/chantiersSlice';

export default function ChantierCreatePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    dispatch(addChantier({
      ...data,
      budget: parseFloat(data.budget),
      depenses: 0,
      avancement: 0,
      status: 'actif',
    }));
    toast.success('Chantier créé avec succès');
    navigate('/chantiers');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/chantiers')}>
            Retour
          </Button>
          <h2 className="font-display text-xl font-bold text-obsidian-900">Nouveau Chantier</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardHeader title="Informations générales" />
            <div className="space-y-4">
              <Input
                label="Nom du chantier *"
                placeholder="Ex : Immeuble R+6 Akwa"
                error={errors.nom?.message}
                {...register('nom', { required: 'Nom requis' })}
              />
              <Input
                label="Localisation *"
                placeholder="Ex : Douala, Akwa"
                error={errors.localisation?.message}
                {...register('localisation', { required: 'Localisation requise' })}
              />
              <Textarea
                label="Description"
                placeholder="Description du projet..."
                rows={3}
                {...register('description')}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Planification" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date de début *"
                type="date"
                error={errors.dateDebut?.message}
                {...register('dateDebut', { required: 'Date requise' })}
              />
              <Input
                label="Date de fin prévue *"
                type="date"
                error={errors.dateFin?.message}
                {...register('dateFin', { required: 'Date requise' })}
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Budget & Ressources" />
            <div className="space-y-4">
              <Input
                label="Budget total (FCFA) *"
                type="number"
                placeholder="Ex : 450000000"
                error={errors.budget?.message}
                {...register('budget', { required: 'Budget requis', min: { value: 1, message: 'Budget invalide' } })}
              />
              <Input
                label="Chef de chantier *"
                placeholder="Nom du responsable"
                error={errors.chef?.message}
                {...register('chef', { required: 'Chef requis' })}
              />
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate('/chantiers')}>Annuler</Button>
            <Button type="submit" loading={isSubmitting}>Créer le chantier</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
