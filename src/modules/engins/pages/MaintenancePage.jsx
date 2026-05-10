import React from 'react';
import { useSelector } from 'react-redux';
import { Wrench } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

export default function MaintenancePage() {
  const { maintenances, list } = useSelector((s) => s.engins);
  const upcoming = list.filter((e) => e.prochaineMaintenance).sort((a, b) => new Date(a.prochaineMaintenance) - new Date(b.prochaineMaintenance));

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <Card>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Maintenances à venir</h3>
          {upcoming.length === 0 ? (
            <EmptyState icon={Wrench} title="Aucune maintenance planifiée" />
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Wrench size={16} className="text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{e.designation}</p>
                      <p className="text-xs text-gray-400">{e.code} · {e.chantier}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-700">{formatDate(e.prochaineMaintenance)}</p>
                    <p className="text-xs text-gray-400">{e.heures}h moteur</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Historique maintenance</h3>
            <Button size="sm" variant="outline">Planifier maintenance</Button>
          </div>
          {maintenances.length === 0 ? (
            <EmptyState icon={Wrench} title="Aucun historique" description="Les maintenances effectuées apparaîtront ici." />
          ) : (
            <div className="space-y-2">
              {maintenances.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium">{m.type}</p>
                    <p className="text-xs text-gray-400">{m.engin} · {formatDate(m.date)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{m.cout ? `${m.cout} FCFA` : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
