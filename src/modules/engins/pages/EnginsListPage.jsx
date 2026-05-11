import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle, Wrench, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

const statusConfig = {
  operationnel: { label: 'Opérationnel', variant: 'success', icon: CheckCircle },
  maintenance: { label: 'En maintenance', variant: 'warning', icon: Wrench },
  en_panne: { label: 'En panne', variant: 'danger', icon: AlertCircle },
};

export default function EnginsListPage() {
  const { list } = useSelector((s) => s.engins);
  const navigate = useNavigate();

  const stats = {
    operationnel: list.filter((e) => e.status === 'operationnel').length,
    maintenance: list.filter((e) => e.status === 'maintenance').length,
    en_panne: list.filter((e) => e.status === 'en_panne').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, count]) => {
            const cfg = statusConfig[key];
            const Icon = cfg.icon;
            return (
              <div key={key} className="bg-white border border-[#E8E2D9] rounded-2xl p-4 flex items-center gap-3 shadow-card">
                <Icon size={20} className={`${cfg.variant === 'success' ? 'text-emerald-600' : cfg.variant === 'warning' ? 'text-gold-600' : 'text-red-600'}`} />
                <div>
                  <p className="font-display text-2xl font-extrabold text-obsidian-900">{count}</p>
                  <p className="font-sans text-xs text-obsidian-400">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((e) => {
            const cfg = statusConfig[e.status] || { label: e.status, variant: 'gray', icon: Truck };
            const Icon = cfg.icon;
            return (
              <Card key={e.id} className="hover:shadow-card-hover transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#F4F1EB] rounded-xl">
                      <Truck size={18} className="text-obsidian-600" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-obsidian-800">{e.designation}</p>
                      <p className="font-sans text-xs text-obsidian-400">{e.code} · {e.marque}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-canvas rounded-xl p-2.5">
                    <p className="font-sans text-obsidian-400">Chantier affecté</p>
                    <p className="font-display font-semibold text-obsidian-700 mt-0.5">{e.chantier}</p>
                  </div>
                  <div className="bg-canvas rounded-xl p-2.5">
                    <p className="font-sans text-obsidian-400">Heures moteur</p>
                    <p className="font-display font-semibold text-obsidian-700 mt-0.5">{e.heures}h</p>
                  </div>
                </div>

                {e.prochaineMaintenance && (
                  <p className="font-sans text-xs text-obsidian-400 flex items-center gap-1">
                    <Wrench size={11} />Prochaine maintenance : {formatDate(e.prochaineMaintenance)}
                  </p>
                )}

                <div className="flex justify-end mt-3">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/engins/maintenance')}>Historique</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
