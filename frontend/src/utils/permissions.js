// §42 Tableau Permissions MVP — source unique de vérité pour le RBAC
// Rôles MVP (§10) : DG DAF CDT CDC GST LOG HSE
export const ROLES = {
  DG:  'dg',   // Directeur Général
  DAF: 'daf',  // Directeur Administratif & Financier
  CDT: 'cdt',  // Conducteur de Travaux
  CDC: 'cdc',  // Chef de Chantier
  GST: 'gst',  // Gestionnaire de Stock
  LOG: 'log',  // Responsable Logistique
  HSE: 'hse',  // Responsable HSE
};

// Chaque clé = une action métier. Valeur = rôles autorisés.
// Approche recommandée §11 : can("create_rapport") plutôt que if(role === "cdc")
const P = {
  // ─── Chantiers ───────────────────────────────────────────────────────────
  view_all_chantiers:  ['dg', 'daf', 'hse'],
  view_own_chantiers:  ['cdt', 'cdc', 'gst', 'log'],
  create_chantier:     ['dg', 'cdt'],
  edit_chantier:       ['dg', 'cdt'],

  // ─── Rapports journaliers (workflow §22) ─────────────────────────────────
  create_rapport:      ['cdc'],
  submit_rapport:      ['cdc'],
  validate_rapport:    ['cdt'],
  reject_rapport:      ['cdt'],
  view_rapports:       ['dg', 'cdt', 'cdc'],

  // ─── Stock (§29, §42) ────────────────────────────────────────────────────
  view_stock:          ['dg', 'daf', 'cdt', 'cdc', 'gst', 'log'],
  manage_stock:        ['gst'],
  request_stock:       ['cdc'],

  // ─── Achats — workflow multi-étapes (§23) ────────────────────────────────
  // CDC crée → GST vérifie dispo → CDT valide besoin → DAF valide budget → GST reçoit
  create_achat_demande:    ['cdc'],
  validate_achat_cdt:      ['cdt'],
  validate_achat_daf:      ['daf'],
  receive_achat:           ['gst'],
  view_achats:             ['dg', 'daf', 'cdt', 'cdc', 'gst'],
  view_commandes:          ['dg', 'daf', 'cdt', 'gst'],
  view_fournisseurs:       ['dg', 'daf', 'cdt', 'gst'],

  // ─── Finance (§30, §42) ──────────────────────────────────────────────────
  view_finance_full:       ['dg', 'daf'],
  view_finance_partial:    ['cdt'],          // ses chantiers seulement

  // ─── HSE — workflow §24 : CDC déclare → HSE gère/clôture ─────────────────
  declare_incident:        ['cdc'],
  manage_incident:         ['hse'],
  view_incidents:          ['dg', 'cdt', 'cdc', 'hse'],
  manage_inspections:      ['hse'],
  view_inspections:        ['dg', 'cdt', 'hse'],

  // ─── Engins (§32, §42) ───────────────────────────────────────────────────
  view_engins:             ['dg', 'cdt', 'cdc', 'log'],
  manage_engins:           ['log'],
  request_engin:           ['cdt'],
  log_carnet_engin:        ['cdc'],

  // ─── Dashboards ──────────────────────────────────────────────────────────
  view_dashboard_dg:       ['dg'],
  view_dashboard_daf:      ['daf'],
  view_dashboard_cdt:      ['cdt'],
  view_dashboard_cdc:      ['cdc'],
  view_dashboard_gst:      ['gst'],
  view_dashboard_log:      ['log'],
  view_dashboard_hse:      ['hse'],
};

export const PERMISSIONS = P;

/** Vérification unitaire */
export function can(role, permission) {
  const allowed = P[permission];
  if (!allowed) return false;
  return allowed.includes(role);
}

/** Vrai si le rôle possède AU MOINS UNE des permissions listées */
export function canAny(role, permissions) {
  return permissions.some((p) => can(role, p));
}

/** Chemin du dashboard home pour chaque rôle */
export function getDashboardPath(role) {
  const map = {
    dg:  '/dashboard/dg',
    daf: '/dashboard/daf',
    cdt: '/dashboard/cdt',
    cdc: '/dashboard/cdc',
    gst: '/dashboard/gst',
    log: '/dashboard/log',
    hse: '/dashboard/hse',
  };
  return map[role] ?? '/dashboard/dg';
}

/** Libellé complet du rôle */
export function getRoleLabel(role) {
  const labels = {
    dg:  'Directeur Général',
    daf: 'Dir. Admin. & Financier',
    cdt: 'Conducteur de Travaux',
    cdc: 'Chef de Chantier',
    gst: 'Gestionnaire de Stock',
    log: 'Responsable Logistique',
    hse: 'Responsable HSE',
  };
  return labels[role] ?? role?.toUpperCase() ?? 'Utilisateur';
}

// Backward compat
export function hasPermission(role, permission) { return can(role, permission); }
export function canAccess(role, required) {
  if (!required?.length) return true;
  return required.includes(role);
}
