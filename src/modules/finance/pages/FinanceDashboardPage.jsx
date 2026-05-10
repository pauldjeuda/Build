import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate, statusLabel, statusVariant } from '../../../utils/formatters';

const cashflow = [
  { mois: 'Jan', in: 95, out: 68 },
  { mois: 'Fév', in: 112, out: 78 },
  { mois: 'Mar', in: 98,  out: 71 },
  { mois: 'Avr', in: 130, out: 89 },
  { mois: 'Mai', in: 118, out: 82 },
];

export default function FinanceDashboardPage() {
  const { depenses, budgets } = useSelector((s) => s.finance);
  const navigate = useNavigate();
  const totalBudget   = budgets.reduce((s, b) => s + b.budgetTotal, 0);
  const totalDepenses = budgets.reduce((s, b) => s + b.depenses, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Budget global"        value={formatCurrency(totalBudget)}     icon={DollarSign}   color="blue"   />
          <KpiCard title="Total dépensé"         value={formatCurrency(totalDepenses)}   icon={TrendingDown} color="orange" trendValue={`${Math.round((totalDepenses/totalBudget)*100)}%`} subtitle="du budget" />
          <KpiCard title="Disponible"            value={formatCurrency(totalBudget - totalDepenses)} icon={TrendingUp} color="green" />
          <KpiCard title="Factures ouvertes"     value="5"                               icon={AlertCircle}  color="red"    subtitle="à recouvrer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Cashflow" subtitle="Entrées vs Sorties — M FCFA" action={
              <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate('/finance/depenses')}>Dépenses</Button>
            } />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={cashflow} barSize={16} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9', fontSize: 12 }} />
                <Bar dataKey="in"  fill="#10B981" radius={[4, 4, 0, 0]} name="Entrées" />
                <Bar dataKey="out" fill="#EF4444" radius={[4, 4, 0, 0]} name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <CardHeader title="Budgets par chantier" action={
              <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate('/finance/budgets')}>Détail</Button>
            } />
            <div className="space-y-4">
              {budgets.map((b) => {
                const taux = Math.round((b.depenses / b.budgetTotal) * 100);
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <p className="font-semibold text-slate-700 truncate flex-1 mr-3">{b.chantier}</p>
                      <span className={`font-bold ${taux > 90 ? 'text-red-500' : taux > 70 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {taux}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${taux > 90 ? 'bg-red-400' : taux > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${taux}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Dernières dépenses" action={
            <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate('/finance/depenses')}>Voir tout</Button>
          } />
          <div className="divide-y divide-slate-50">
            {depenses.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center gap-4 py-3 hover:bg-slate-50/50 transition-colors rounded-xl px-1 -mx-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{d.libelle}</p>
                  <p className="text-xs text-slate-400">{d.categorie} · {d.chantier} · {formatDate(d.date)}</p>
                </div>
                <p className="text-sm font-bold text-slate-700 shrink-0">{formatCurrency(d.montant)}</p>
                <Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
