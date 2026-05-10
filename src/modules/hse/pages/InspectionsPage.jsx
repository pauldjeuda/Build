import React from 'react';
import { useSelector } from 'react-redux';
import { ClipboardCheck } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../utils/formatters';

export default function InspectionsPage() {
  const { inspections } = useSelector((s) => s.hse);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {inspections.map((insp) => (
          <Card key={insp.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <ClipboardCheck size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{insp.chantier}</p>
                    <Badge variant={insp.type === 'Périodique' ? 'info' : 'warning'}>{insp.type}</Badge>
                    <Badge variant={insp.statut === 'conforme' ? 'success' : 'danger'}>
                      {insp.statut === 'conforme' ? 'Conforme' : 'Non conforme'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">Inspecteur : {insp.inspecteur}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(insp.date)} · {insp.observations} observation(s)</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Voir rapport</Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
