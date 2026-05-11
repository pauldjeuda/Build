export function formatCurrency(value, currency = 'FCFA') {
  if (value === null || value === undefined) return '—';
  const formatted = new Intl.NumberFormat('fr-FR').format(value);
  return `${formatted} ${currency}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export function formatPercent(value) {
  if (value === null || value === undefined) return '—';
  return `${Math.round(value)}%`;
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

export function statusLabel(status) {
  const map = {
    // Chantiers §35
    actif: 'Actif', en_retard: 'En retard', suspendu: 'Suspendu', termine: 'Terminé',
    // Rapports §35
    brouillon: 'Brouillon', soumis: 'Soumis', valide: 'Validé', rejete: 'Rejeté',
    // Achats — workflow §23
    en_attente: 'En attente CDT', valide_cdt: 'Validé CDT', valide_daf: 'Budget approuvé',
    approuve: 'Approuvé', livre: 'Livré', annule: 'Annulé',
    // Incidents §35
    ouvert: 'Ouvert', en_cours: 'En cours', resolu: 'Résolu', cloture: 'Clôturé',
    // Engins
    operationnel: 'Opérationnel', maintenance: 'Maintenance', en_panne: 'En panne',
    // Commandes
    planifie: 'Planifié',
  };
  return map[status] || status;
}

export function statusVariant(status) {
  const map = {
    actif: 'success', valide: 'success', approuve: 'success', livre: 'success',
    operationnel: 'success', resolu: 'success', conforme: 'success',
    en_retard: 'danger', rejete: 'danger', en_panne: 'danger', grave: 'danger',
    suspendu: 'warning', en_attente: 'warning', ouvert: 'warning', en_cours: 'warning',
    maintenance: 'warning', non_conforme: 'warning', moyen: 'warning',
    brouillon: 'gray', cloture: 'gray', annule: 'gray', faible: 'gray',
    soumis: 'info', valide_cdt: 'info', planifie: 'info',
    termine: 'purple', valide_daf: 'purple',
  };
  return map[status] || 'gray';
}
