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
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, count]) => {
            const cfg = statusConfig[key];
            const Icon = cfg.icon;
            return (
              <div key={key} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
                <Icon size={20} className={`${cfg.variant === 'success' ? 'text-green-600' : cfg.variant === 'warning' ? 'text-yellow-600' : 'text-red-600'}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-400">{cfg.label}</p>
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
              <Card key={e.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 rounded-xl">
                      <Truck size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{e.designation}</p>
                      <p className="text-xs text-gray-400">{e.code} · {e.marque}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Chantier affecté</p>
                    <p className="font-medium text-gray-700">{e.chantier}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Heures moteur</p>
                    <p className="font-medium text-gray-700">{e.heures}h</p>
                  </div>
                </div>

                {e.prochaineMaintenance && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
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
