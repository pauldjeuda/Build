import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Phone, MapPin, Package } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { fetchFournisseurs } from '../store/achatsSlice';

export default function FournisseursPage() {
  const { fournisseurs } = useSelector((s) => s.achats);
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchFournisseurs()); }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fournisseurs.map((f) => (
          <Card key={f.id} className="hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-primary-50 rounded-xl">
                <Package size={20} className="text-primary-600" />
              </div>
              <Badge variant={f.status === 'actif' ? 'success' : 'gray'}>{f.status === 'actif' ? 'Actif' : 'Inactif'}</Badge>
            </div>
            <h3 className="font-display font-semibold text-obsidian-900 mb-1">{f.nom}</h3>
            <p className="font-sans text-sm text-primary-600 font-medium mb-3">{f.categorie}</p>
            <div className="space-y-2 font-sans text-sm text-obsidian-500">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-obsidian-400 shrink-0" />{f.contact}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-obsidian-400 shrink-0" />{f.ville}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
