import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

const PIE_DATA = [
  { name: 'Matériaux',    value: 45, color: '#1B4FDB' },
  { name: "Main d'œuvre", value: 28, color: '#059669' },
  { name: 'Engins',       value: 15, color: '#C8960C' },
  { name: 'Divers',       value: 12, color: '#7C3AED' },
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
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={700} fontFamily="Syne">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl p-3 shadow-modal text-xs font-sans">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-display font-semibold text-obsidian-800">{p.name} : {p.value} M FCFA</span>
        </div>
      ))}
    </div>
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
          <KpiCard title="Entrées du mois"    value="118 M FCFA" icon={TrendingUp}   color="green"  trend="up" trendValue="+8%" />
          <KpiCard title="Sorties du mois"    value="82 M FCFA"  icon={TrendingDown} color="orange" trend="up" trendValue="+3%" />
          <KpiCard title="Solde trésorerie"   value="36 M FCFA"  icon={DollarSign}   color="blue"   subtitle="disponible" />
          <KpiCard title="Factures en attente" value="5"         icon={AlertCircle}  color="red"    subtitle="à recouvrer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pie */}
          <Card>
            <CardHeader title="Répartition des dépenses" subtitle="par catégorie — mois en cours" />
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" outerRadius={88} innerRadius={46}
                    dataKey="value" labelLine={false} label={<CustomLabel />}>
                    {PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E8E2D9', fontSize: 12, fontFamily: 'DM Sans' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="shrink-0 space-y-2.5">
                {PIE_DATA.map((d) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
                    <p className="font-sans text-xs text-obsidian-600">{d.name}</p>
                    <span className="font-display text-xs font-bold text-obsidian-800 ml-auto pl-3">{d.value}%</span>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE5" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#FAF8F4' }} />
                <Bar dataKey="in"  fill="#059669" radius={[4, 4, 0, 0]} name="Entrées" />
                <Bar dataKey="out" fill="#EF4444" radius={[4, 4, 0, 0]} name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 pt-3 border-t border-[#F0ECE5] mt-1">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /><span className="font-sans text-xs text-obsidian-400">Entrées</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="font-sans text-xs text-obsidian-400">Sorties</span></div>
            </div>
          </Card>
        </div>

        {/* Budget table */}
        <Card padding={false}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #E8E2D9' }}>
            <h3 className="font-display text-sm font-bold text-obsidian-900 tracking-tight">Consommation budgétaire par chantier</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {['Chantier', 'Budget total', 'Dépensé', 'Disponible', 'Consommation'].map((h) => (
                    <th key={h} className={`py-3 px-5 text-xs font-display font-semibold text-obsidian-400 uppercase tracking-wide border-b border-[#E8E2D9] ${h === 'Chantier' ? 'text-left' : 'text-right'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgets.map((b) => {
                  const taux = Math.round((b.depenses / b.budgetTotal) * 100);
                  return (
                    <tr key={b.id} className="hover:bg-canvas/60 transition-colors border-b border-[#F4F1EB] last:border-0">
                      <td className="py-3.5 px-5 font-display font-semibold text-obsidian-800 text-sm">{b.chantier}</td>
                      <td className="py-3.5 px-5 text-right font-mono text-xs text-obsidian-500">{formatCurrency(b.budgetTotal)}</td>
                      <td className="py-3.5 px-5 text-right font-mono text-xs text-obsidian-600">{formatCurrency(b.depenses)}</td>
                      <td className="py-3.5 px-5 text-right font-mono text-xs font-semibold text-emerald-700">{formatCurrency(b.budgetTotal - b.depenses)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3 justify-end">
                          <div className="w-24 rounded-full overflow-hidden" style={{ height: '5px', background: '#E8E2D9' }}>
                            <div
                              className={`h-full rounded-full ${taux > 90 ? 'bg-red-500' : taux > 70 ? 'bg-gold-500' : 'bg-emerald-500'}`}
                              style={{ width: `${taux}%` }}
                            />
                          </div>
                          <span className={`font-display text-xs font-bold w-9 text-right ${taux > 90 ? 'text-red-500' : 'text-obsidian-700'}`}>
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
