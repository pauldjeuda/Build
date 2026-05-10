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
    actif: 'Actif',
    en_retard: 'En retard',
    suspendu: 'Suspendu',
    termine: 'Terminé',
    brouillon: 'Brouillon',
    soumis: 'Soumis',
    valide: 'Validé',
    rejete: 'Rejeté',
    en_attente: 'En attente',
    approuve: 'Approuvé',
    livre: 'Livré',
  };
  return map[status] || status;
}

export function statusVariant(status) {
  const map = {
    actif: 'success', valide: 'success', approuve: 'success', livre: 'success',
    en_retard: 'danger', rejete: 'danger',
    suspendu: 'warning', en_attente: 'warning',
    brouillon: 'gray', soumis: 'info', termine: 'purple',
  };
  return map[status] || 'gray';
}
