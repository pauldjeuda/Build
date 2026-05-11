// §24 — Workflow Incident HSE
// CDC déclare l'incident → HSE analyse, crée actions correctives, suit résolution, clôture
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import EmptyState from '../../../components/ui/EmptyState';
import { formatDate } from '../../../utils/formatters';
import { addIncident, updateIncident } from '../store/hseSlice';
import { useAuth } from '../../../hooks/useAuth';

const GRAVITES = {
  faible: { label: 'Faible', variant: 'info'    },
  moyen:  { label: 'Moyen',  variant: 'warning' },
  grave:  { label: 'Grave',  variant: 'danger'  },
};

const STATUS_LABELS = {
  ouvert:    { label: 'Ouvert',     variant: 'warning' },
  en_cours:  { label: 'En cours',   variant: 'warning' },
  resolu:    { label: 'Résolu',     variant: 'success' },
  cloture:   { label: 'Clôturé',   variant: 'gray'    },
};

const TYPES = ['Accident léger', 'Accident grave', 'Presque-accident', 'Incident matériel', 'Incident environnemental'];

export default function IncidentsPage() {
  const { incidents } = useSelector((s) => s.hse);
  const chantiers     = useSelector((s) => s.chantiers.list);
  const dispatch      = useDispatch();
  const { can, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  // §24 : CDC déclare l'incident
  const onSubmit = (data) => {
    dispatch(addIncident({
      ...data,
      date: new Date().toISOString().split('T')[0],
      status: 'ouvert',
      declarePar: user?.name,
    }));
    toast.success('Incident déclaré — notifié au responsable HSE');
    reset();
    setModalOpen(false);
  };

  // HSE peut analyser, résoudre, clôturer (§24)
  const handleResolve = (inc) => {
    dispatch(updateIncident({ ...inc, status: 'resolu' }));
    toast.success('Incident marqué résolu');
  };
  const handleClose = (inc) => {
    dispatch(updateIncident({ ...inc, status: 'cloture' }));
    toast.success('Incident clôturé');
  };

  // Filtrage : CDC voit ses incidents + données mock sans declarePar, HSE/CDT/DG voient tous
  const visibleIncidents = can('declare_incident') && !can('manage_incident')
    ? incidents.filter((i) => !i.declarePar || i.declarePar === user?.name)
    : incidents;

  const open = visibleIncidents.filter((i) => ['ouvert', 'en_cours'].includes(i.status)).length;

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
              <p className="font-display text-xl font-bold text-obsidian-900">{visibleIncidents.length}</p>
            </div>
          </div>
          {/* §24 : seul CDC peut déclarer un incident */}
          {can('declare_incident') && (
            <Button icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
              Déclarer incident
            </Button>
          )}
        </div>

        {visibleIncidents.length === 0 ? (
          <Card>
            <EmptyState
              icon={AlertTriangle}
              title="Aucun incident"
              description={can('declare_incident') ? 'Déclarez un incident de chantier.' : 'Aucun incident enregistré.'}
              action={can('declare_incident') && (
                <Button icon={<Plus size={15} />} onClick={() => setModalOpen(true)}>Déclarer incident</Button>
              )}
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {visibleIncidents.map((inc) => {
              const g  = GRAVITES[inc.gravite] ?? { label: inc.gravite, variant: 'gray' };
              const sc = STATUS_LABELS[inc.status] ?? { label: inc.status, variant: 'gray' };
              const isOpen = ['ouvert', 'en_cours'].includes(inc.status);
              return (
                <Card key={inc.id} className={isOpen ? 'border-l-4 border-l-red-500' : ''}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${isOpen ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        {isOpen
                          ? <AlertTriangle size={16} className="text-red-600" />
                          : <CheckCircle size={16} className="text-emerald-600" />
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-semibold text-obsidian-800">{inc.type}</p>
                          <Badge variant={g.variant}>{g.label}</Badge>
                          <Badge variant={sc.variant}>{sc.label}</Badge>
                        </div>
                        <p className="font-sans text-sm text-obsidian-600 mt-1">{inc.description}</p>
                        {inc.victime && (
                          <p className="font-sans text-xs text-obsidian-400 mt-0.5">Victime : {inc.victime}</p>
                        )}
                        <p className="font-sans text-xs text-obsidian-400 mt-1">
                          {inc.chantier} · {formatDate(inc.date)}
                          {inc.declarePar && ` · Déclaré par ${inc.declarePar}`}
                        </p>
                      </div>
                    </div>

                    {/* §24 : actions réservées au HSE */}
                    {can('manage_incident') && (
                      <div className="flex gap-1.5 shrink-0">
                        {inc.status === 'ouvert' && (
                          <Button variant="warning" size="sm" onClick={() => dispatch(updateIncident({ ...inc, status: 'en_cours' }))}>
                            Analyser
                          </Button>
                        )}
                        {inc.status === 'en_cours' && (
                          <Button variant="success" size="sm" onClick={() => handleResolve(inc)}>
                            Résoudre
                          </Button>
                        )}
                        {inc.status === 'resolu' && (
                          <Button variant="ghost" size="sm" icon={<XCircle size={13} />} onClick={() => handleClose(inc)}>
                            Clôturer
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal déclaration — CDC seulement */}
        {can('declare_incident') && (
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Déclarer un incident HSE">
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
              <Textarea label="Description *" placeholder="Décrire l'incident en détail…" rows={3}
                {...register('description', { required: true })} />
              <Input label="Victime (si applicable)" placeholder="Nom et prénom"
                {...register('victime')} />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Annuler</Button>
                <Button type="submit" variant="danger" className="flex-1">Déclarer</Button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
