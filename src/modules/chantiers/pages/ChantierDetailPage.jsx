import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
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
          <p className="font-sans text-obsidian-500">Chantier introuvable</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/chantiers')}>Retour à la liste</Button>
        </div>
      </DashboardLayout>
    );
  }

  const tauxBudget = Math.round((chantier.depenses / chantier.budget) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/chantiers')}>
            Retour
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-bold text-obsidian-900">{chantier.nom}</h2>
              <Badge variant={statusVariant(chantier.status)}>{statusLabel(chantier.status)}</Badge>
            </div>
            <p className="font-sans text-sm text-obsidian-500 flex items-center gap-1 mt-0.5">
              <MapPin size={13} />{chantier.localisation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="font-sans text-xs text-obsidian-400">Budget total</p>
            <p className="font-display text-lg font-bold text-obsidian-900 mt-1">{formatCurrency(chantier.budget)}</p>
          </Card>
          <Card>
            <p className="font-sans text-xs text-obsidian-400">Dépensé</p>
            <p className={`font-display text-lg font-bold mt-1 ${tauxBudget > 90 ? 'text-red-600' : 'text-obsidian-900'}`}>{formatCurrency(chantier.depenses)}</p>
            <p className="font-sans text-xs text-obsidian-400 mt-0.5">{tauxBudget}% du budget</p>
          </Card>
          <Card>
            <p className="font-sans text-xs text-obsidian-400">Avancement</p>
            <p className="font-display text-lg font-bold text-obsidian-900 mt-1">{chantier.avancement}%</p>
            <div className="progress-track mt-2">
              <div className="progress-fill bg-primary-600" style={{ width: `${chantier.avancement}%` }} />
            </div>
          </Card>
          <Card>
            <p className="font-sans text-xs text-obsidian-400">Chef de chantier</p>
            <p className="font-display text-base font-semibold text-obsidian-900 mt-1">{chantier.chef}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader title="Informations générales" />
            <div className="space-y-3 font-sans text-sm">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-obsidian-400 shrink-0" />
                <span className="text-obsidian-500">Date début :</span>
                <span className="font-medium text-obsidian-700">{formatDate(chantier.dateDebut)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-obsidian-400 shrink-0" />
                <span className="text-obsidian-500">Date fin prévue :</span>
                <span className="font-medium text-obsidian-700">{formatDate(chantier.dateFin)}</span>
              </div>
              <div className="flex items-start gap-3 mt-3 pt-3 border-t border-[#E8E2D9]">
                <p className="text-obsidian-600">{chantier.description}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Rapports récents" action={<Button variant="ghost" size="sm" onClick={() => navigate('/rapports')}>Voir tout</Button>} />
            <div className="space-y-2">
              {[
                { date: '2025-05-09', status: 'valide', travaux: 'Coulage dalle niveau 3' },
                { date: '2025-05-08', status: 'valide', travaux: 'Ferraillage poteaux niveau 4' },
                { date: '2025-05-07', status: 'valide', travaux: 'Bétonnage fondations zone C' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#F4F1EB]">
                  <div>
                    <p className="font-display text-sm font-medium text-obsidian-700">{r.travaux}</p>
                    <p className="font-sans text-xs text-obsidian-400">{formatDate(r.date)}</p>
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
