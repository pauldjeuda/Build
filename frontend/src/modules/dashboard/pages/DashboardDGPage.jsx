import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { DollarSign, HardHat, FileText, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { statusLabel, statusVariant } from '../../../utils/formatters';

const caData = [
  { mois: 'Jan', ca: 95, dep: 68 },
  { mois: 'Fév', ca: 112, dep: 78 },
  { mois: 'Mar', ca: 98,  dep: 71 },
  { mois: 'Avr', ca: 130, dep: 89 },
  { mois: 'Mai', ca: 118, dep: 82 },
];

const progressData = [
  { nom: 'Immeuble Akwa',          avancement: 68, status: 'actif',     chef: 'P. Ngono'  },
  { nom: 'Route Yassa–Bonabéri',   avancement: 42, status: 'en_retard', chef: 'J. Mbarga' },
  { nom: 'École Primaire Mendong', avancement: 85, status: 'actif',     chef: 'A. Bello'  },
  { nom: 'Pont Wouri Phase 2',     avancement: 15, status: 'actif',     chef: 'M. Foning' },
];

const activity = [
  { text: 'Rapport journalier soumis — Immeuble Akwa',       time: 'il y a 5 min', color: 'bg-primary-500' },
  { text: 'Demande achat approuvée — 10 M FCFA ciment',      time: 'il y a 1h',    color: 'bg-emerald-500' },
  { text: 'Alerte stock — Sable de rivière sous seuil',      time: 'il y a 2h',    color: 'bg-gold-500'    },
  { text: 'Incident HSE déclaré — Pont Wouri',               time: 'il y a 3h',    color: 'bg-red-500'     },
  { text: 'Chantier École Mendong atteint 85%',              time: 'il y a 4h',    color: 'bg-violet-500'  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl p-3 shadow-modal text-xs font-sans">
      <p className="font-display font-semibold text-obsidian-800 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-obsidian-500">{p.name === 'ca' ? 'CA' : 'Dépenses'} :</span>
          <span className="font-semibold text-obsidian-800">{p.value} M FCFA</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardDGPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          <KpiCard title="CA mensuel"       value="118 M FCFA" icon={DollarSign}   color="blue"   trend="up"   trendValue="+8%"   subtitle="vs mois dernier" />
          <KpiCard title="Dépenses"         value="82 M FCFA"  icon={TrendingUp}   color="orange" trend="up"   trendValue="+3%"   subtitle="ce mois" />
          <KpiCard title="Marge nette"      value="30.5%"      icon={DollarSign}   color="green"  trend="up"   trendValue="+2 pts" />
          <KpiCard title="Chantiers actifs" value="4"          icon={HardHat}      color="purple" subtitle="sur 6 au total" />
          <KpiCard title="Rapports / sem."  value="18"         icon={FileText}     color="cyan"   subtitle="soumis cette semaine" />
          <KpiCard title="Incidents HSE"    value="2"          icon={AlertTriangle} color="red"   trend="down" trendValue="-1"    subtitle="en cours" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <Card className="lg:col-span-3">
            <CardHeader title="CA vs Dépenses" subtitle="5 derniers mois — en millions FCFA" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={caData} barSize={20} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE5" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAF8F4', radius: 6 }} />
                <Bar dataKey="ca"  fill="#1B4FDB" radius={[5, 5, 0, 0]} name="ca"  />
                <Bar dataKey="dep" fill="#C8960C" radius={[5, 5, 0, 0]} name="dep" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 pt-3 border-t border-[#F0ECE5] mt-2">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary-600" /><span className="text-xs font-sans text-obsidian-400">Chiffre d'affaires</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gold-500" /><span className="text-xs font-sans text-obsidian-400">Dépenses</span></div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Avancement chantiers" />
            <div className="space-y-4">
              {progressData.map((c) => (
                <div key={c.nom}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-display text-xs font-semibold text-obsidian-800 truncate">{c.nom}</p>
                      <p className="font-sans text-xs text-obsidian-400">{c.chef}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={statusVariant(c.status)} dot>{statusLabel(c.status)}</Badge>
                      <span className="font-display text-xs font-bold text-obsidian-700 w-8 text-right">{c.avancement}%</span>
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
        </div>

        {/* Activity feed */}
        <Card>
          <CardHeader title="Activité récente" subtitle="Mises à jour en temps réel" />
          <div className="divide-y divide-[#F4F1EB]">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5 hover:bg-canvas/50 transition-colors rounded-xl px-1 -mx-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${a.color}`} />
                <p className="font-sans text-sm text-obsidian-700 flex-1">{a.text}</p>
                <span className="font-sans text-xs text-obsidian-400 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
