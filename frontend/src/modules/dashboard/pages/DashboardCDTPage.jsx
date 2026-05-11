import React from 'react';
import { HardHat, FileText, AlertTriangle, Users, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { statusLabel, statusVariant } from '../../../utils/formatters';

const chantiers = [
  { nom: 'Immeuble Akwa',          avancement: 68, status: 'actif',     ouvriers: 26 },
  { nom: 'Route Yassa–Bonabéri',   avancement: 42, status: 'en_retard', ouvriers: 18 },
  { nom: 'École Primaire Mendong', avancement: 85, status: 'actif',     ouvriers: 12 },
  { nom: 'Pont Wouri Phase 2',     avancement: 15, status: 'actif',     ouvriers: 24 },
];

const rapports = [
  { chantier: 'Route Yassa',   auteur: 'Jean Mbarga', heure: '09h45', incidents: 1, status: 'soumis' },
  { chantier: 'Pont Wouri',    auteur: 'Marc Foning', heure: '08h30', incidents: 0, status: 'soumis' },
  { chantier: 'Immeuble Akwa', auteur: 'Paul Ngono',  heure: '10h15', incidents: 0, status: 'valide' },
];

export default function DashboardCDTPage() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard title="Chantiers actifs"     value="4"     icon={HardHat}       color="blue"   subtitle="sous ma direction" />
          <KpiCard title="Rapports soumis"      value="3 / 4" icon={FileText}      color="green"  subtitle="aujourd'hui"       />
          <KpiCard title="Ouvriers présents"    value="80"    icon={Users}         color="purple" subtitle="sur 4 chantiers"   />
          <KpiCard title="Incidents ouverts"    value="2"     icon={AlertTriangle} color="red"    subtitle="à traiter"         />
          <KpiCard title="Alertes stock"        value="2"     icon={Package}       color="amber"  subtitle="sous seuil"        />
          <KpiCard title="Engins opérationnels" value="3/4"   icon={CheckCircle}   color="green"  subtitle="parc affecté"      />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader
              title="Avancement chantiers"
              action={<Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/chantiers')}>Voir tout</Button>}
            />
            <div className="space-y-4">
              {chantiers.map((c) => (
                <div key={c.nom}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-display text-xs font-semibold text-obsidian-700 truncate">{c.nom}</p>
                      <p className="font-sans text-xs text-obsidian-400">{c.ouvriers} ouvriers présents</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant(c.status)} dot>{statusLabel(c.status)}</Badge>
                      <span className="font-display text-sm font-bold text-obsidian-800 w-8 text-right">{c.avancement}%</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`progress-fill ${c.status === 'en_retard' ? 'bg-red-400' : 'bg-primary-600'}`}
                      style={{ width: `${c.avancement}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Rapports à traiter"
              action={<Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/rapports')}>Voir tout</Button>}
            />
            <div className="space-y-2.5">
              {rapports.map((r, i) => (
                <div
                  key={i}
                  className={[
                    'flex items-center justify-between p-3 rounded-xl border transition-colors',
                    r.status === 'soumis'
                      ? 'bg-gold-50 border-gold-100 hover:bg-gold-100'
                      : 'bg-emerald-50 border-emerald-100',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-display text-sm font-semibold text-obsidian-800 truncate">{r.chantier}</p>
                    <p className="font-sans text-xs text-obsidian-500">{r.auteur} · {r.heure}</p>
                    {r.incidents > 0 && (
                      <p className="font-sans text-xs text-red-500 font-medium mt-0.5 flex items-center gap-1">
                        <AlertTriangle size={11} />{r.incidents} incident(s) signalé(s)
                      </p>
                    )}
                  </div>
                  <Badge variant={statusVariant(r.status)} dot>{statusLabel(r.status)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
