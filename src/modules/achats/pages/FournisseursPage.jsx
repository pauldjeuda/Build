import React from 'react';
import { useSelector } from 'react-redux';
import { Phone, MapPin, Package } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

export default function FournisseursPage() {
  const { fournisseurs } = useSelector((s) => s.achats);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fournisseurs.map((f) => (
          <Card key={f.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package size={20} className="text-blue-600" />
              </div>
              <Badge variant={f.status === 'actif' ? 'success' : 'gray'}>{f.status === 'actif' ? 'Actif' : 'Inactif'}</Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{f.nom}</h3>
            <p className="text-sm text-blue-600 font-medium mb-3">{f.categorie}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />{f.contact}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />{f.ville}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
