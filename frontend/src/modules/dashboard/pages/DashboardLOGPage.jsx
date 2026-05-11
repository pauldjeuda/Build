// §18 — Dashboard Responsable Logistique
// Widgets : Parc engins, Disponibilité, Maintenance, Pannes, Livraisons, Carburant
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Truck, Wrench, AlertCircle, CheckCircle, Fuel, Package, ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';
import { fetchEngins } from '../../engins/store/enginsSlice';

const MAINTENANCES = [
  { engin: 'Grue Liebherr LTM 1060', type: 'Vidange moteur',      date: '2025-05-14', chantier: 'Immeuble Akwa',  status: 'planifie'  },
  { engin: 'Compacteur Dynapac CA',   type: 'Remplacement pneus',  date: '2025-05-16', chantier: 'Route Yassa',    status: 'en_cours'  },
  { engin: 'Pelle CAT 320',           type: 'Révision 500h',       date: '2025-05-10', chantier: 'Pont Wouri',     status: 'termine'   },
];

const CARBURANT = [
  { engin: 'Grue Liebherr',    litres: 450, cout: 315000 },
  { engin: 'Compacteur Dynapac', litres: 280, cout: 196000 },
  { engin: 'Pelle CAT 320',    litres: 620, cout: 434000 },
];

export default function DashboardLOGPage() {
  const { list: engins } = useSelector((s) => s.engins);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { dispatch(fetchEngins()); }, [dispatch]);

  const operationnels = engins.filter((e) => e.status === 'operationnel').length;
  const enMaintenance = engins.filter((e) => e.status === 'maintenance').length;
  const enPanne       = engins.filter((e) => e.status === 'en_panne').length;
  const dispo = engins.length > 0 ? Math.round((operationnels / engins.length) * 100) : 0;
  const totalCarburant = CARBURANT.reduce((s, c) => s + c.cout, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Parc total"        value={`${engins.length} engins`}    icon={Truck}        color="blue"   subtitle="sous gestion" />
          <KpiCard title="Disponibilité"     value={`${dispo}%`}                  icon={CheckCircle}  color="green"  subtitle={`${operationnels} opérationnels`} />
          <KpiCard title="En maintenance"    value={enMaintenance}                icon={Wrench}       color="amber"  subtitle="en cours de service" />
          <KpiCard title="En panne"          value={enPanne}                      icon={AlertCircle}  color="red"    subtitle="immobilisés" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* État du parc */}
          <Card>
            <CardHeader
              title="État du parc engins"
              action={<Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('/engins')}>Détail</Button>}
            />
            <div className="space-y-3">
              {engins.map((e) => {
                const isOK = e.status === 'operationnel';
                const isPanne = e.status === 'en_panne';
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${isOK ? 'bg-emerald-100' : isPanne ? 'bg-red-100' : 'bg-gold-100'}`}>
                      <Truck size={14} className={isOK ? 'text-emerald-600' : isPanne ? 'text-red-600' : 'text-gold-700'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{e.designation}</p>
                      <p className="font-sans text-xs text-obsidian-400">{e.chantier} · {e.heures}h moteur</p>
                    </div>
                    <Badge variant={isOK ? 'success' : isPanne ? 'danger' : 'warning'}>
                      {isOK ? 'OK' : isPanne ? 'Panne' : 'Maint.'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Planification maintenance */}
          <Card>
            <CardHeader
              title="Planning maintenance"
              action={<Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('/engins/maintenance')}>Voir tout</Button>}
            />
            <div className="space-y-2.5">
              {MAINTENANCES.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl border ${
                  m.status === 'en_cours' ? 'bg-gold-50 border-gold-100' :
                  m.status === 'termine'  ? 'bg-emerald-50 border-emerald-100' :
                  'bg-canvas border-[#E8E2D9]'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-display text-xs font-semibold text-obsidian-800 truncate">{m.engin}</p>
                      <p className="font-sans text-xs text-obsidian-500">{m.type}</p>
                      <p className="font-sans text-xs text-obsidian-400 mt-0.5">{m.chantier} · {formatDate(m.date)}</p>
                    </div>
                    <Badge variant={m.status === 'en_cours' ? 'warning' : m.status === 'termine' ? 'success' : 'gray'}>
                      {m.status === 'en_cours' ? 'En cours' : m.status === 'termine' ? 'Terminé' : 'Planifié'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Consommation carburant */}
        <Card padding={false}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E8E2D9' }}>
            <div className="flex items-center gap-2">
              <Fuel size={16} className="text-obsidian-500" />
              <h3 className="font-display text-sm font-bold text-obsidian-900">Consommation carburant — ce mois</h3>
            </div>
            <span className="font-mono text-sm font-bold text-obsidian-700">
              Total : {(totalCarburant / 1000).toFixed(0)} k FCFA
            </span>
          </div>
          <div className="divide-y divide-[#F4F1EB]">
            {CARBURANT.map((c, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-canvas rounded-lg">
                    <Truck size={14} className="text-obsidian-500" />
                  </div>
                  <p className="font-display text-sm font-semibold text-obsidian-700">{c.engin}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <p className="font-display text-xs font-bold text-obsidian-800">{c.litres}L</p>
                    <p className="font-sans text-xs text-obsidian-400">litres</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-obsidian-700">{(c.cout / 1000).toFixed(0)} k FCFA</p>
                    <p className="font-sans text-xs text-obsidian-400">coût</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
