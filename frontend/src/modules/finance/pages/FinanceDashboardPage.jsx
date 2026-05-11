import React, { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency, formatDate, statusLabel, statusVariant } from '../../../utils/formatters';
import { fetchDashboard, fetchDepenses } from '../store/financeSlice';

const cashflow = [
  { mois: 'Jan', in: 95,  out: 68 },
  { mois: 'Fév', in: 112, out: 78 },
  { mois: 'Mar', in: 98,  out: 71 },
  { mois: 'Avr', in: 130, out: 89 },
  { mois: 'Mai', in: 118, out: 82 },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8E2D9] rounded-xl p-3 shadow-modal text-xs font-sans">
      <p className="font-display font-semibold text-obsidian-800 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-obsidian-500">{p.name} :</span>
          <span className="font-semibold text-obsidian-800">{p.value} M</span>
        </div>
      ))}
    </div>
  );
};

export default function FinanceDashboardPage() {
  const { depenses, budgets } = useSelector((s) => s.finance);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchDepenses());
  }, [dispatch]);
  const totalBudget   = budgets.reduce((s, b) => s + b.budgetTotal, 0);
  const totalDepenses = budgets.reduce((s, b) => s + b.depenses, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Budget global"     value={formatCurrency(totalBudget)}              icon={DollarSign}   color="blue"   />
          <KpiCard title="Total dépensé"     value={formatCurrency(totalDepenses)}            icon={TrendingDown} color="orange" trendValue={`${Math.round((totalDepenses/totalBudget)*100)}%`} subtitle="du budget" />
          <KpiCard title="Disponible"        value={formatCurrency(totalBudget-totalDepenses)} icon={TrendingUp}  color="green"  />
          <KpiCard title="Factures ouvertes" value="5"                                        icon={AlertCircle}  color="red"    subtitle="à recouvrer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Cashflow" subtitle="Entrées vs Sorties — M FCFA" action={
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/finance/depenses')}>Dépenses</Button>
            } />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={cashflow} barSize={16} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE5" vertical={false} />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#FAF8F4' }} />
                <Bar dataKey="in"  fill="#059669" radius={[4, 4, 0, 0]} name="Entrées" />
                <Bar dataKey="out" fill="#EF4444" radius={[4, 4, 0, 0]} name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 pt-3 border-t border-[#F0ECE5] mt-1">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"/><span className="font-sans text-xs text-obsidian-400">Entrées</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"/><span className="font-sans text-xs text-obsidian-400">Sorties</span></div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Budgets par chantier" action={
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/finance/budgets')}>Détail</Button>
            } />
            <div className="space-y-4">
              {budgets.map((b) => {
                const taux = Math.round((b.depenses / b.budgetTotal) * 100);
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <p className="font-display font-semibold text-obsidian-700 truncate flex-1 mr-3">{b.chantier}</p>
                      <span className={`font-display font-bold ${taux > 90 ? 'text-red-500' : taux > 70 ? 'text-gold-600' : 'text-emerald-600'}`}>
                        {taux}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${taux > 90 ? 'bg-red-500' : taux > 70 ? 'bg-gold-500' : 'bg-emerald-500'}`}
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
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/finance/depenses')}>Voir tout</Button>
          } />
          <div className="divide-y divide-[#F4F1EB]">
            {depenses.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center gap-4 py-3.5 hover:bg-canvas/50 transition-colors rounded-xl px-1 -mx-1">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-medium text-obsidian-800 truncate">{d.libelle}</p>
                  <p className="font-sans text-xs text-obsidian-400">{d.categorie} · {d.chantier} · {formatDate(d.date)}</p>
                </div>
                <p className="font-display text-sm font-bold text-obsidian-700 shrink-0">{formatCurrency(d.montant)}</p>
                <Badge variant={statusVariant(d.status)}>{statusLabel(d.status)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
