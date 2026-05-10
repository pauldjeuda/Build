import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/formatters';
import { useSelector } from 'react-redux';

const PIE_DATA = [
  { name: 'Matériaux',    value: 45, color: '#2563EB' },
  { name: "Main d'œuvre", value: 28, color: '#10B981' },
  { name: 'Engins',       value: 15, color: '#F59E0B' },
  { name: 'Divers',       value: 12, color: '#8B5CF6' },
];

const CF_DATA = [
  { mois: 'Jan', in: 95,  out: 68 },
  { mois: 'Fév', in: 112, out: 78 },
  { mois: 'Mar', in: 98,  out: 71 },
  { mois: 'Avr', in: 130, out: 89 },
  { mois: 'Mai', in: 118, out: 82 },
];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.08) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardDAFPage() {
  const { budgets } = useSelector((s) => s.finance);
  const totalBudget   = budgets.reduce((s, b) => s + b.budgetTotal, 0);
  const totalDepenses = budgets.reduce((s, b) => s + b.depenses, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Entrées du mois"       value="118 M FCFA" icon={TrendingUp}   color="green"  trend="up"   trendValue="+8%"  />
          <KpiCard title="Sorties du mois"        value="82 M FCFA"  icon={TrendingDown} color="orange" trend="up"   trendValue="+3%"  />
          <KpiCard title="Solde trésorerie"       value="36 M FCFA"  icon={DollarSign}   color="blue"   subtitle="disponible"          />
          <KpiCard title="Factures en attente"    value="5"           icon={AlertCircle}  color="red"    subtitle="à recouvrer"         />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pie */}
          <Card>
            <CardHeader title="Répartition des dépenses" subtitle="par catégorie — mois en cours" />
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    dataKey="value"
                    labelLine={false}
                    label={<CustomLabel />}
                  >
                    {PIE_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v}%`, n]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="shrink-0 space-y-2">
                {PIE_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <p className="text-xs text-slate-600">{d.name}</p>
                    <span className="text-xs font-bold text-slate-800 ml-auto pl-4">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Cashflow */}
          <Card>
            <CardHeader title="Cashflow" subtitle="Entrées vs Sorties — en M FCFA" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CF_DATA} barSize={16} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: 12 }} />
                <Bar dataKey="in"  fill="#10B981" radius={[4, 4, 0, 0]} name="Entrées" />
                <Bar dataKey="out" fill="#EF4444" radius={[4, 4, 0, 0]} name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Budget table */}
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Consommation budgétaire par chantier</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Chantier', 'Budget', 'Dépensé', 'Disponible', 'Consommation'].map((h) => (
                    <th key={h} className={`py-3 px-5 text-xs font-semibold text-slate-400 uppercase tracking-wide ${h === 'Chantier' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {budgets.map((b) => {
                  const taux = Math.round((b.depenses / b.budgetTotal) * 100);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-5 font-medium text-slate-800">{b.chantier}</td>
                      <td className="py-3 px-5 text-right text-slate-600 font-mono text-xs">{formatCurrency(b.budgetTotal)}</td>
                      <td className="py-3 px-5 text-right text-slate-600 font-mono text-xs">{formatCurrency(b.depenses)}</td>
                      <td className="py-3 px-5 text-right font-mono text-xs font-semibold text-emerald-600">{formatCurrency(b.budgetTotal - b.depenses)}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3 justify-end">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${taux > 90 ? 'bg-red-400' : taux > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${taux}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold w-8 text-right ${taux > 90 ? 'text-red-500' : 'text-slate-700'}`}>
                            {taux}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
