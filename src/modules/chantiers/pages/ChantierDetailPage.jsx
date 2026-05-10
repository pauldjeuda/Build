import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, DollarSign, TrendingUp, FileText, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { formatCurrency, formatDate, statusLabel, statusVariant } from '../../../utils/formatters';

export default function ChantierDetailPage() {
  const navigate = useNavigate();
  const chantier = useSelector((s) => s.chantiers.selected);

  if (!chantier) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Chantier introuvable</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/chantiers')}>Retour à la liste</Button>
        </div>
      </DashboardLayout>
    );
  }

  const tauxBudget = Math.round((chantier.depenses / chantier.budget) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/chantiers')}>
            Retour
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{chantier.nom}</h2>
              <Badge variant={statusVariant(chantier.status)}>{statusLabel(chantier.status)}</Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={13} />{chantier.localisation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-gray-400">Budget total</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(chantier.budget)}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400">Dépensé</p>
            <p className={`text-lg font-bold mt-1 ${tauxBudget > 90 ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(chantier.depenses)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{tauxBudget}% du budget</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-400">Avancement</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{chantier.avancement}%</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${chantier.avancement}%` }} />
            </div>
          </Card>
          <Card>
            <p className="text-xs text-gray-400">Chef de chantier</p>
            <p className="text-base font-semibold text-gray-900 mt-1">{chantier.chef}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Informations générales" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-500">Date début :</span>
                <span className="font-medium">{formatDate(chantier.dateDebut)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-500">Date fin prévue :</span>
                <span className="font-medium">{formatDate(chantier.dateFin)}</span>
              </div>
              <div className="flex items-start gap-3 mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-600">{chantier.description}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Rapports récents" action={<Button variant="outline" size="sm" onClick={() => navigate('/rapports')}>Voir tout</Button>} />
            <div className="space-y-2">
              {[
                { date: '2025-05-09', status: 'valide', travaux: 'Coulage dalle niveau 3' },
                { date: '2025-05-08', status: 'valide', travaux: 'Ferraillage poteaux niveau 4' },
                { date: '2025-05-07', status: 'valide', travaux: 'Bétonnage fondations zone C' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.travaux}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.date)}</p>
                  </div>
                  <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
