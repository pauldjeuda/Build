import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Package } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/formatters';
import { fetchArticles } from '../store/stockSlice';

export default function AlertesStockPage() {
  const { articles } = useSelector((s) => s.stock);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(fetchArticles()); }, [dispatch]);
  const alertes = articles.filter((a) => a.stock <= a.seuil);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {alertes.length === 0 ? (
          <Card>
            <EmptyState icon={Package} title="Aucune alerte" description="Tous les articles sont au-dessus du seuil minimum." />
          </Card>
        ) : (
          <Card>
            <CardHeader
              title={`${alertes.length} article(s) en alerte`}
              subtitle="Stock en dessous du seuil minimum"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/stock')}>Voir tout le stock</Button>}
            />
            <div className="space-y-3">
              {alertes.map((a) => {
                const pct = Math.round((a.stock / a.seuil) * 100);
                return (
                  <div key={a.id} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-500 shrink-0" />
                          <p className="font-display text-sm font-semibold text-obsidian-800">{a.designation}</p>
                        </div>
                        <p className="font-sans text-xs text-obsidian-500 mt-0.5">{a.reference} · {a.categorie} · {a.chantier}</p>
                      </div>
                      <Button size="sm" onClick={() => navigate('/achats/demandes')}>Commander</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                      <div className="bg-white rounded-lg p-2">
                        <p className="font-sans text-obsidian-400">Stock actuel</p>
                        <p className="font-display font-bold text-red-600">{a.stock} {a.unite}</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="font-sans text-obsidian-400">Seuil mini</p>
                        <p className="font-display font-bold text-obsidian-700">{a.seuil} {a.unite}</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="font-sans text-obsidian-400">Valeur</p>
                        <p className="font-mono font-bold text-obsidian-700">{formatCurrency(a.valeur)}</p>
                      </div>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <p className="font-sans text-xs text-red-600 mt-1">{pct}% du seuil minimum</p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
