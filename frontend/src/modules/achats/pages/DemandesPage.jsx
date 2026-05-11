// §23 — Workflow Achat multi-étapes
// CDC crée → GST vérifie dispo → CDT valide besoin → DAF valide budget → GST réceptionne → Finance comptabilise
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Check, X, PackageCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import {
  fetchDemandes, submitDemande,
  doValidateCdt, doValidateDaf, doReceive, doReject,
} from '../store/achatsSlice';
import { fetchChantiers } from '../../chantiers/store/chantiersSlice';
import { useAuth } from '../../../hooks/useAuth';

// Statuts du workflow achat §23
const STATUS_CONFIG = {
  en_attente:       { label: 'En attente CDT',    variant: 'warning' },
  valide_cdt:       { label: 'Validé CDT',         variant: 'info'    },
  valide_daf:       { label: 'Budget approuvé',    variant: 'success' },
  approuve:         { label: 'Approuvé',           variant: 'success' },
  rejete:           { label: 'Rejeté',             variant: 'danger'  },
  livre:            { label: 'Livré / Réceptionné', variant: 'purple' },
};

export default function DemandesPage() {
  const { demandes } = useSelector((s) => s.achats);
  const chantiers    = useSelector((s) => s.chantiers.list);
  const dispatch     = useDispatch();
  const { can, user, role } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchDemandes());
    dispatch(fetchChantiers());
  }, [dispatch]);

  // §23 : CDC est le seul à créer une demande
  const onSubmit = (data) => {
    const chantierId = chantiers.find((c) => c.nom === data.chantier)?.id;
    dispatch(submitDemande({
      chantier_id: chantierId,
      article: data.article,
      montant: parseFloat(data.montant),
      justification: data.justification,
    })).then((action) => {
      if (!action.error) {
        toast.success('Demande créée — en attente validation CDT');
        reset();
        setModalOpen(false);
      }
    });
  };

  const handleValidateCDT = (d) => dispatch(doValidateCdt(d.id));
  const handleValidateDAF = (d) => dispatch(doValidateDaf(d.id));
  const handleReceive = (d) => dispatch(doReceive(d.id));
  const handleReject = (d) => dispatch(doReject({ id: d.id, motif: '' }));

  // Filtrer selon rôle — CDC voit ses demandes, autres voient tout
  const visibleDemandes = can('create_achat_demande')
    ? demandes.filter((d) => d.demandeur === user?.name)
    : demandes;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* En-tête avec indicateur workflow */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-obsidian-900">Demandes d'achat</h2>
            <p className="font-sans text-xs text-obsidian-400 mt-0.5">
              Workflow : CDC → CDT → DAF → Stock
            </p>
          </div>
          {/* §42 : bouton créer visible uniquement pour CDC */}
          {can('create_achat_demande') && (
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Nouvelle demande
            </Button>
          )}
        </div>

        <Card padding={false}>
          {visibleDemandes.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="Aucune demande"
              description={can('create_achat_demande') ? 'Créez votre première demande d\'achat.' : 'Aucune demande en attente.'}
              action={can('create_achat_demande') && (
                <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Nouvelle demande</Button>
              )}
            />
          ) : (
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
                  {visibleDemandes.map((d) => {
                    const sc = STATUS_CONFIG[d.status] ?? { label: d.status, variant: 'gray' };
                    return (
                      <tr key={d.id} className="hover:bg-canvas/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-obsidian-500">{d.reference}</td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{d.article}</p>
                          {d.justification && (
                            <p className="font-sans text-xs text-obsidian-400 truncate">{d.justification}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{d.chantier}</td>
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-obsidian-700">{formatCurrency(d.montant)}</td>
                        <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{d.demandeur}</td>
                        <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{formatDate(d.date)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={sc.variant}>{sc.label}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 items-center">
                            {/* CDT valide le besoin (en_attente → valide_cdt) */}
                            {can('validate_achat_cdt') && d.status === 'en_attente' && (
                              <>
                                <button onClick={() => handleValidateCDT(d)} title="Valider le besoin"
                                  className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                                  <Check size={13} />
                                </button>
                                <button onClick={() => handleReject(d)} title="Rejeter"
                                  className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                                  <X size={13} />
                                </button>
                              </>
                            )}
                            {/* DAF approuve le budget (valide_cdt → approuve) */}
                            {can('validate_achat_daf') && d.status === 'valide_cdt' && (
                              <>
                                <button onClick={() => handleValidateDAF(d)} title="Approuver budget"
                                  className="p-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors text-xs font-display font-semibold flex items-center gap-1">
                                  <Check size={13} />
                                </button>
                                <button onClick={() => handleReject(d)} title="Refuser budget"
                                  className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                                  <X size={13} />
                                </button>
                              </>
                            )}
                            {/* GST réceptionne la livraison (approuve → livre) */}
                            {can('receive_achat') && d.status === 'approuve' && (
                              <button onClick={() => handleReceive(d)} title="Réceptionner livraison"
                                className="p-1.5 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors">
                                <PackageCheck size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Modal création — CDC uniquement */}
        {can('create_achat_demande') && (
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle demande d'achat">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Article / Description *"
                placeholder="Ex : Ciment CEM II — 500 sacs"
                error={errors.article?.message}
                {...register('article', { required: 'Requis' })}
              />
              <Select label="Chantier *" error={errors.chantier?.message} {...register('chantier', { required: 'Requis' })}>
                <option value="">-- Sélectionner --</option>
                {chantiers.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
              </Select>
              <Input label="Montant estimé (FCFA) *" type="number" error={errors.montant?.message}
                {...register('montant', { required: 'Requis', min: 1 })} />
              <Textarea label="Justification" placeholder="Pourquoi cette demande est-elle nécessaire ?" rows={3}
                {...register('justification')} />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="flex-1">Soumettre</Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
