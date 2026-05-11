// §32 — Module Engins
// §42 : Gérer engins = LOG (full) / DG = lecture / CDT = demande / CDC = carnet de bord / DAF HSE GST = non
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle, Wrench, CheckCircle, BookOpen, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input, { Select, Textarea } from '../../../components/ui/Input';
import { formatDate } from '../../../utils/formatters';
import { useAuth } from '../../../hooks/useAuth';
import { fetchEngins } from '../store/enginsSlice';

const statusConfig = {
  operationnel: { label: 'Opérationnel', variant: 'success', icon: CheckCircle },
  maintenance:  { label: 'En maintenance', variant: 'warning', icon: Wrench   },
  en_panne:     { label: 'En panne',       variant: 'danger',  icon: AlertCircle },
};

export default function EnginsListPage() {
  const { list } = useSelector((s) => s.engins);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { can }   = useAuth();

  useEffect(() => { dispatch(fetchEngins()); }, [dispatch]);
  const [carnetOpen, setCarnetOpen]     = useState(false);
  const [selectedEngin, setSelectedEngin] = useState(null);
  const [demandeOpen, setDemandeOpen]   = useState(false);

  const stats = {
    operationnel: list.filter((e) => e.status === 'operationnel').length,
    maintenance:  list.filter((e) => e.status === 'maintenance').length,
    en_panne:     list.filter((e) => e.status === 'en_panne').length,
  };

  const openCarnet = (engin) => { setSelectedEngin(engin); setCarnetOpen(true); };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Bandeau mode */}
        {can('manage_engins') && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <Truck size={15} className="text-cyan-600 shrink-0" />
            <p className="font-sans text-sm text-cyan-700 font-medium">
              Mode Logistique — gestion complète du parc engins
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, count]) => {
            const cfg  = statusConfig[key];
            const Icon = cfg.icon;
            return (
              <div key={key} className="bg-white border border-[#E8E2D9] rounded-2xl p-4 flex items-center gap-3 shadow-card">
                <Icon size={20} className={cfg.variant === 'success' ? 'text-emerald-600' : cfg.variant === 'warning' ? 'text-gold-600' : 'text-red-600'} />
                <div>
                  <p className="font-display text-2xl font-extrabold text-obsidian-900">{count}</p>
                  <p className="font-sans text-xs text-obsidian-400">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid engins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((e) => {
            const cfg  = statusConfig[e.status] ?? { label: e.status, variant: 'gray', icon: Truck };
            const Icon = cfg.icon;
            return (
              <Card key={e.id} className="hover:shadow-card-hover transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#F4F1EB] rounded-xl">
                      <Truck size={18} className="text-obsidian-600" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-obsidian-800">{e.designation}</p>
                      <p className="font-sans text-xs text-obsidian-400">{e.code} · {e.marque}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-canvas rounded-xl p-2.5">
                    <p className="font-sans text-obsidian-400">Chantier affecté</p>
                    <p className="font-display font-semibold text-obsidian-700 mt-0.5">{e.chantier}</p>
                  </div>
                  <div className="bg-canvas rounded-xl p-2.5">
                    <p className="font-sans text-obsidian-400">Heures moteur</p>
                    <p className="font-display font-semibold text-obsidian-700 mt-0.5">{e.heures}h</p>
                  </div>
                </div>

                {e.prochaineMaintenance && (
                  <p className="font-sans text-xs text-obsidian-400 flex items-center gap-1 mb-3">
                    <Wrench size={11} /> Prochaine maintenance : {formatDate(e.prochaineMaintenance)}
                  </p>
                )}

                {/* Actions selon rôle §42 */}
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D9]">
                  {/* LOG : maintenance, gestion complète */}
                  {can('manage_engins') && (
                    <Button variant="primary" size="sm" icon={<Wrench size={13} />} onClick={() => navigate('/engins/maintenance')}>
                      Maintenance
                    </Button>
                  )}
                  {/* CDC : carnet de bord */}
                  {can('log_carnet_engin') && (
                    <Button variant="outline-gray" size="sm" icon={<BookOpen size={13} />} onClick={() => openCarnet(e)}>
                      Carnet de bord
                    </Button>
                  )}
                  {/* CDT : faire une demande d'engin */}
                  {can('request_engin') && (
                    <Button variant="outline-gray" size="sm" icon={<Send size={13} />} onClick={() => setDemandeOpen(true)}>
                      Demander
                    </Button>
                  )}
                  {/* Lecture seule : historique */}
                  {!can('manage_engins') && !can('log_carnet_engin') && !can('request_engin') && (
                    <Button variant="ghost" size="sm" onClick={() => navigate('/engins/maintenance')}>Historique</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal carnet de bord — CDC */}
      {can('log_carnet_engin') && (
        <Modal open={carnetOpen} onClose={() => setCarnetOpen(false)} title={`Carnet de bord — ${selectedEngin?.designation ?? ''}`}>
          <div className="space-y-4">
            <Input label="Date *" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            <Input label="Heures de fonctionnement *" type="number" placeholder="Ex : 8" />
            <Select label="Type d'utilisation">
              <option>Transport matériaux</option>
              <option>Terrassement</option>
              <option>Levage</option>
              <option>Compactage</option>
              <option>Autre</option>
            </Select>
            <Textarea label="Observations / Anomalies" placeholder="Signaler tout problème constaté…" rows={3} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setCarnetOpen(false)}>Annuler</Button>
              <Button type="button" className="flex-1" onClick={() => {
                toast.success('Entrée carnet de bord enregistrée');
                setCarnetOpen(false);
              }}>Enregistrer</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal demande d'engin — CDT */}
      {can('request_engin') && (
        <Modal open={demandeOpen} onClose={() => setDemandeOpen(false)} title="Demande d'engin">
          <div className="space-y-4">
            <Select label="Engin souhaité *">
              {list.map((e) => <option key={e.id} value={e.id}>{e.designation}</option>)}
            </Select>
            <Input label="Chantier de destination *" placeholder="Ex : Immeuble Akwa" />
            <Input label="Date souhaitée *" type="date" />
            <Textarea label="Justification" placeholder="Pourquoi cet engin est-il nécessaire ?" rows={2} />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setDemandeOpen(false)}>Annuler</Button>
              <Button type="button" className="flex-1" onClick={() => {
                toast.success('Demande d\'engin transmise au responsable logistique');
                setDemandeOpen(false);
              }}>Envoyer</Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
