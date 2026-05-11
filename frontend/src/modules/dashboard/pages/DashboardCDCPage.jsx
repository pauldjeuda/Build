// §16 — Dashboard Chef de Chantier — mobile-first obligatoire
// Widgets : Tâches du jour, Rapport journalier, Pointage, Photos, Besoins matériel, Incidents, Engins présents
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Users, AlertTriangle, Package, Truck,
  CloudSun, Clock, Plus, ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card, { CardHeader } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

const TACHES = [
  { label: 'Soumettre rapport journalier',   done: false, urgent: true  },
  { label: 'Pointer les ouvriers présents',  done: true,  urgent: false },
  { label: 'Vérifier stock béton',           done: false, urgent: true  },
  { label: 'Signaler retard coffreur Z4',    done: false, urgent: false },
];

const ENGINS = [
  { nom: 'Grue Liebherr LTM',  status: 'operationnel', heures: '4h aujourd\'hui' },
  { nom: 'Bétonnière 500L',     status: 'operationnel', heures: '2h aujourd\'hui' },
  { nom: 'Compacteur Dynapac', status: 'en_panne',     heures: 'En attente pièce' },
];

export default function DashboardCDCPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Mobile-first : layout vertical, gros boutons (§9, §16) */}
      <div className="space-y-4 max-w-2xl mx-auto">

        {/* Bonjour + météo rapide */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-100 text-sm font-sans">Bonjour,</p>
              <p className="font-display text-xl font-black mt-0.5">{user?.name ?? 'Chef de Chantier'}</p>
              <p className="text-orange-100 text-xs mt-1">Immeuble Akwa · Lundi 5 mai 2025</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2">
              <CloudSun size={18} />
              <span className="font-display font-bold text-sm">28°C</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Ouvriers', value: '26', icon: Users    },
              { label: 'Incidents', value: '0', icon: AlertTriangle },
              { label: 'Avancement', value: '68%', icon: Clock },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white/15 rounded-xl p-2.5 text-center">
                  <Icon size={14} className="mx-auto mb-1 text-orange-100" />
                  <p className="font-display font-black text-base leading-none">{s.value}</p>
                  <p className="text-orange-100 text-[10px] mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides — max 3 clics (§5, §11) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/rapports/nouveau')}
            className="bg-white border-2 border-primary-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary-400 hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText size={22} className="text-primary-600" />
            </div>
            <p className="font-display text-sm font-bold text-obsidian-800 text-center">Rapport journalier</p>
          </button>
          <button
            onClick={() => navigate('/achats/demandes')}
            className="bg-white border-2 border-orange-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-orange-400 hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Package size={22} className="text-orange-600" />
            </div>
            <p className="font-display text-sm font-bold text-obsidian-800 text-center">Demande matériel</p>
          </button>
          <button
            onClick={() => navigate('/hse/incidents')}
            className="bg-white border-2 border-red-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-red-400 hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <p className="font-display text-sm font-bold text-obsidian-800 text-center">Déclarer incident</p>
          </button>
          <button
            onClick={() => navigate('/rapports')}
            className="bg-white border-2 border-emerald-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-emerald-400 hover:shadow-card-hover transition-all active:scale-95"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-emerald-600" />
            </div>
            <p className="font-display text-sm font-bold text-obsidian-800 text-center">Mes rapports</p>
          </button>
        </div>

        {/* Tâches du jour */}
        <Card>
          <CardHeader title="Tâches du jour" subtitle={`${TACHES.filter(t => !t.done).length} restantes`} />
          <div className="space-y-2">
            {TACHES.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                t.done ? 'bg-emerald-50 border-emerald-100' : t.urgent ? 'bg-red-50 border-red-100' : 'bg-canvas border-[#E8E2D9]'
              }`}>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  t.done ? 'border-emerald-400 bg-emerald-400' : 'border-obsidian-300'
                }`}>
                  {t.done && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <p className={`font-sans text-sm flex-1 ${t.done ? 'line-through text-obsidian-400' : t.urgent ? 'font-semibold text-obsidian-800' : 'text-obsidian-700'}`}>
                  {t.label}
                </p>
                {t.urgent && !t.done && <Badge variant="danger">Urgent</Badge>}
              </div>
            ))}
          </div>
        </Card>

        {/* Engins présents */}
        <Card>
          <CardHeader
            title="Engins présents"
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/engins')}>Voir tout</Button>}
          />
          <div className="space-y-2">
            {ENGINS.map((e, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#F4F1EB] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-canvas rounded-lg">
                    <Truck size={14} className="text-obsidian-500" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-obsidian-800">{e.nom}</p>
                    <p className="font-sans text-xs text-obsidian-400">{e.heures}</p>
                  </div>
                </div>
                <Badge variant={e.status === 'operationnel' ? 'success' : 'danger'}>
                  {e.status === 'operationnel' ? 'OK' : 'Panne'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
