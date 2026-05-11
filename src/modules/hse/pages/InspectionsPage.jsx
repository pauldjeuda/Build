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
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 bg-primary-50 rounded-xl shrink-0">
                  <ClipboardCheck size={18} className="text-primary-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display font-semibold text-obsidian-800">{insp.chantier}</p>
                    <Badge variant={insp.type === 'Périodique' ? 'info' : 'warning'}>{insp.type}</Badge>
                    <Badge variant={insp.statut === 'conforme' ? 'success' : 'danger'}>
                      {insp.statut === 'conforme' ? 'Conforme' : 'Non conforme'}
                    </Badge>
                  </div>
                  <p className="font-sans text-sm text-obsidian-500 mt-0.5">Inspecteur : {insp.inspecteur}</p>
                  <p className="font-sans text-xs text-obsidian-400 mt-0.5">{formatDate(insp.date)} · {insp.observations} observation(s)</p>
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
