import React from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

export default function BudgetsPage() {
  const { budgets } = useSelector((s) => s.finance);
  const totalBudget = budgets.reduce((s, b) => s + b.budgetTotal, 0);
  const totalDepenses = budgets.reduce((s, b) => s + b.depenses, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Budget total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Dépensé</p>
            <p className="text-xl font-bold text-orange-600 mt-1">{formatCurrency(totalDepenses)}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-400">Disponible</p>
            <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(totalBudget - totalDepenses)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((b) => {
            const taux = Math.round((b.depenses / b.budgetTotal) * 100);
            const tauxEngage = Math.round(((b.depenses + b.engagements) / b.budgetTotal) * 100);
            return (
              <Card key={b.id}>
                <CardHeader title={b.chantier} subtitle={`Budget : ${formatCurrency(b.budgetTotal)}`} />
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Dépensé</p>
                    <p className="font-bold text-orange-600 mt-0.5">{formatCurrency(b.depenses)}</p>
                    <p className="text-xs text-gray-400">{taux}%</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Engagé</p>
                    <p className="font-bold text-yellow-600 mt-0.5">{formatCurrency(b.engagements)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">Disponible</p>
                    <p className="font-bold text-green-600 mt-0.5">{formatCurrency(b.disponible)}</p>
                  </div>
                </div>
                <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="absolute left-0 top-0 h-3 bg-orange-500 rounded-full" style={{ width: `${taux}%` }} />
                  <div className="absolute top-0 h-3 bg-yellow-400 rounded-full" style={{ left: `${taux}%`, width: `${Math.min(tauxEngage - taux, 100 - taux)}%` }} />
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" />Dépensé {taux}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full" />Engagé</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-200 rounded-full" />Disponible</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
