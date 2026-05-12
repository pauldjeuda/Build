/**
 * §11 — RBAC centralisé côté backend.
 * Même table de permissions que le frontend — le backend reste l'autorité finale (§39).
 *
 * Usage : router.post('/chantiers', authenticate, allow('create_chantier'), controller)
 */

const PERMISSIONS = {
  // Chantiers (§42)
  view_all_chantiers:   ['dg', 'daf', 'hse'],
  view_own_chantiers:   ['cdt', 'cdc', 'gst', 'log'],
  create_chantier:      ['dg', 'cdt'],
  edit_chantier:        ['dg', 'cdt'],

  // Rapports §22
  create_rapport:       ['cdc'],
  submit_rapport:       ['cdc'],
  validate_rapport:     ['cdt'],
  reject_rapport:       ['cdt'],
  view_rapports:        ['dg', 'cdt', 'cdc'],

  // Stock §29-42
  view_stock:           ['dg', 'daf', 'cdt', 'cdc', 'gst', 'log'],
  manage_stock:         ['gst'],
  request_stock:        ['cdc'],

  // Achats §23
  create_achat_demande: ['cdc'],
  validate_achat_cdt:   ['cdt'],
  validate_achat_daf:   ['daf'],
  receive_achat:        ['gst'],
  view_achats:          ['dg', 'daf', 'cdt', 'cdc', 'gst'],
  view_commandes:       ['dg', 'daf', 'cdt', 'gst'],
  create_commande:      ['daf'],
  view_fournisseurs:    ['dg', 'daf', 'cdt', 'gst'],

  // Finance §30-42
  view_finance_full:    ['dg', 'daf'],
  view_finance_partial: ['cdt'],
  manage_finance:       ['daf'],

  // HSE §24-33
  declare_incident:     ['cdc'],
  manage_incident:      ['hse'],
  view_incidents:       ['dg', 'cdt', 'cdc', 'hse'],
  manage_inspections:   ['hse'],
  view_inspections:     ['dg', 'cdt', 'hse'],

  // Engins §32-42
  view_engins:          ['dg', 'cdt', 'cdc', 'log'],
  manage_engins:        ['log'],
  request_engin:        ['cdt'],
  log_carnet_engin:     ['cdc'],
};

function can(role, permission) {
  return (PERMISSIONS[permission] ?? []).includes(role);
}

/** Middleware factory */
function allow(...permissions) {
  return (req, res, next) => {
    const role = req.user?.role;
    const granted = permissions.some((p) => can(role, p));
    if (!granted) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé — permissions insuffisantes',
      });
    }
    next();
  };
}

module.exports = { allow, can, PERMISSIONS };
