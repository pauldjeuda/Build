// §19 — Dashboard HSE
// Widgets : Incidents ouverts, Actions correctives, Inspections, Statistiques sécurité, Alertes critiques
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { ShieldAlert, AlertTriangle, CheckSquare, Eye, ClipboardCheck, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

const GRAVITE_COLORS = {
  faible: { label: 'Faible', variant: 'info'    },
  moyen:  { label: 'Moyen',  variant: 'warning' },
  grave:  { label: 'Grave',  variant: 'danger'  },
};

const STATS_DATA = [
  { mois: 'Fév', incidents: 3, inspections: 5 },
  { mois: 'Mar', incidents: 2, inspections: 6 },
  { mois: 'Avr', incidents: 4, inspections: 4 },
  { mois: 'Mai', incidents: 1, inspections: 7 },
];

const ACTIONS = [
  { titre: 'Formation port EPI obligatoire', echeance: '2025-05-15', status: 'en_cours',  responsable: 'Équipe Akwa'  },
  { titre: 'Réparation garde-corps niveau 4', echeance: '2025-05-12', status: 'en_cours', responsable: 'CDT Mbarga'   },
  { titre: 'Signalétique zone danger zone C', echeance: '2025-05-09', status: 'termine', responsable: 'Chef Ngono'   },
];

export default function DashboardHSEPage() {
  const navigate = useNavigate();
  const { incidents } = useSelector((s) => s.hse);

  const ouverts  = incidents.filter((i) => i.status === 'en_cours').length;
  const resolus  = incidents.filter((i) => i.status === 'resolu').length;
  const graves   = incidents.filter((i) => i.gravite === 'grave').length;
  const actionsEnCours = ACTIONS.filter((a) => a.status === 'en_cours').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Incidents ouverts"   value={ouverts}         icon={AlertTriangle}  color="red"    subtitle="nécessitent action" />
          <KpiCard title="Incidents résolus"   value={resolus}         icon={CheckSquare}    color="green"  subtitle="ce mois" />
          <KpiCard title="Incidents graves"    value={graves}          icon={ShieldAlert}    color="orange" subtitle="à surveiller" />
          <KpiCard title="Actions correctives" value={actionsEnCours}  icon={ClipboardCheck} color="amber"  subtitle="en cours" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Statistiques sécurité */}
          <Card className="lg:col-span-3">
            <CardHeader title="Évolution sécurité" subtitle="Incidents vs Inspections — 4 derniers mois" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={STATS_DATA} barSize={16} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE5" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#A09289' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A09289' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E2D9', fontSize: 12 }} />
                <Bar dataKey="incidents"   fill="#EF4444" radius={[4, 4, 0, 0]} name="Incidents" />
                <Bar dataKey="inspections" fill="#1B4FDB" radius={[4, 4, 0, 0]} name="Inspections" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 pt-3 border-t border-[#F0ECE5] mt-1">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-xs font-sans text-obsidian-400">Incidents</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary-600" /><span className="text-xs font-sans text-obsidian-400">Inspections</span></div>
            </div>
          </Card>

          {/* Incidents ouverts */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Incidents ouverts"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/hse/incidents')}>Voir tout</Button>}
            />
            {ouverts === 0 ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <ShieldAlert size={18} className="text-emerald-600" />
                </div>
                <p className="font-sans text-sm text-emerald-700 font-semibold">Aucun incident ouvert</p>
                <p className="font-sans text-xs text-obsidian-400">Bonne performance sécurité !</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {incidents.filter((i) => i.status === 'en_cours').map((inc) => {
                  const g = GRAVITE_COLORS[inc.gravite] ?? { label: inc.gravite, variant: 'gray' };
                  return (
                    <div key={inc.id} className={`p-3 rounded-xl border-l-4 ${inc.gravite === 'grave' ? 'border-red-500 bg-red-50' : 'border-gold-400 bg-gold-50'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-display text-xs font-semibold text-obsidian-800 truncate">{inc.type}</p>
                          <p className="font-sans text-xs text-obsidian-500">{inc.chantier} · {formatDate(inc.date)}</p>
                        </div>
                        <Badge variant={g.variant}>{g.label}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Actions correctives */}
        <Card padding={false}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E8E2D9' }}>
            <h3 className="font-display text-sm font-bold text-obsidian-900">Actions correctives</h3>
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('/hse/incidents')}>
              Gérer
            </Button>
          </div>
          <div className="divide-y divide-[#F4F1EB]">
            {ACTIONS.map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas/60 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${a.status === 'termine' ? 'bg-emerald-400' : 'bg-gold-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{a.titre}</p>
                  <p className="font-sans text-xs text-obsidian-400">{a.responsable} · Échéance : {formatDate(a.echeance)}</p>
                </div>
                <Badge variant={a.status === 'termine' ? 'success' : 'warning'}>
                  {a.status === 'termine' ? 'Terminé' : 'En cours'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
