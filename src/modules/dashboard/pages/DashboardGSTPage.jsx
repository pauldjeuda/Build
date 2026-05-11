// §17 — Dashboard Gestionnaire de Stock
// Widgets : Stock global, Ruptures, Entrées, Sorties, Transferts, Inventaires, Demandes en attente
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle, ClipboardList, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import KpiCard from '../../../components/cards/KpiCard';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatters';

const MOUVEMENTS_DATA = [
  { jour: 'Lun', entrees: 12, sorties: 8  },
  { jour: 'Mar', entrees: 5,  sorties: 15 },
  { jour: 'Mer', entrees: 18, sorties: 10 },
  { jour: 'Jeu', entrees: 7,  sorties: 12 },
  { jour: 'Ven', entrees: 20, sorties: 9  },
];

const DEMANDES = [
  { reference: 'DA-2025-012', article: 'Ciment CEM II — 200 sacs',   chantier: 'Immeuble Akwa',  montant: 1200000, status: 'en_attente' },
  { reference: 'DA-2025-013', article: 'Sable de rivière — 5 m³',     chantier: 'Route Yassa',    montant: 450000,  status: 'en_attente' },
  { reference: 'DA-2025-011', article: 'Fer à béton HA12 — 2T',       chantier: 'Pont Wouri',     montant: 3200000, status: 'valide'     },
];

export default function DashboardGSTPage() {
  const { articles } = useSelector((s) => s.stock);
  const navigate = useNavigate();

  const alertCount   = articles.filter((a) => a.stock <= a.seuil).length;
  const totalValeur  = articles.reduce((s, a) => s + a.valeur, 0);
  const demandesEnAttente = DEMANDES.filter((d) => d.status === 'en_attente').length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Articles en stock"   value={articles.length}          icon={Package}        color="blue"   subtitle="références actives" />
          <KpiCard title="Valeur totale"        value={formatCurrency(totalValeur)} icon={Package}     color="green"  subtitle="valorisation stock" />
          <KpiCard title="Alertes rupture"      value={alertCount}               icon={AlertTriangle}  color="red"    trend={alertCount > 0 ? 'up' : null} trendValue={alertCount > 0 ? 'Critique' : null} />
          <KpiCard title="Demandes en attente"  value={demandesEnAttente}        icon={ClipboardList}  color="amber"  subtitle="à réceptionner" />
        </div>

        {/* Graphique mouvements */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <Card className="lg:col-span-3">
            <CardHeader title="Mouvements de stock" subtitle="Cette semaine — entrées vs sorties" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOUVEMENTS_DATA} barSize={16} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE5" vertical={false} />
                <XAxis dataKey="jour" tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#A09289', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E2D9', fontSize: 12 }} />
                <Bar dataKey="entrees" fill="#059669" radius={[4, 4, 0, 0]} name="Entrées" />
                <Bar dataKey="sorties" fill="#EF4444" radius={[4, 4, 0, 0]} name="Sorties" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 pt-3 border-t border-[#F0ECE5] mt-1">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /><span className="text-xs font-sans text-obsidian-400">Entrées</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-xs font-sans text-obsidian-400">Sorties</span></div>
            </div>
          </Card>

          {/* Alertes rupture */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Articles en rupture"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/stock/alertes')}>Voir tout</Button>}
            />
            {alertCount === 0 ? (
              <div className="text-center py-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Package size={18} className="text-emerald-600" />
                </div>
                <p className="font-sans text-sm text-obsidian-500">Aucune rupture</p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.filter((a) => a.stock <= a.seuil).slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-[#F4F1EB] last:border-0">
                    <div>
                      <p className="font-display text-xs font-semibold text-obsidian-800 truncate max-w-[140px]">{a.designation}</p>
                      <p className="font-sans text-xs text-obsidian-400">{a.chantier}</p>
                    </div>
                    <Badge variant="danger">{a.stock} {a.unite}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Demandes à traiter — workflow achat §23 */}
        <Card padding={false}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E8E2D9' }}>
            <h3 className="font-display text-sm font-bold text-obsidian-900">Demandes d'achat à réceptionner</h3>
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={13} />} onClick={() => navigate('/achats/demandes')}>
              Tout voir
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E2D9]">
                  {['Référence', 'Article', 'Chantier', 'Montant', 'Statut', 'Action'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left font-display text-xs font-semibold text-obsidian-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EB]">
                {DEMANDES.map((d) => (
                  <tr key={d.reference} className="hover:bg-canvas/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-obsidian-500">{d.reference}</td>
                    <td className="py-3 px-4 font-display text-sm font-medium text-obsidian-800">{d.article}</td>
                    <td className="py-3 px-4 font-sans text-sm text-obsidian-500">{d.chantier}</td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-obsidian-700">{formatCurrency(d.montant)}</td>
                    <td className="py-3 px-4">
                      <Badge variant={d.status === 'en_attente' ? 'warning' : 'success'}>
                        {d.status === 'en_attente' ? 'En attente' : 'Validé'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {d.status === 'valide' && (
                        <button className="text-xs font-display font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                          <ArrowDownCircle size={13} /> Réceptionner
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
