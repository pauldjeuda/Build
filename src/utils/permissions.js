export const ROLES = {
  DG: 'dg',
  DAF: 'daf',
  CDT: 'cdt',
  RH: 'rh',
  MAGASINIER: 'magasinier',
  CHEF_CHANTIER: 'chef_chantier',
  OPERATEUR: 'operateur',
};

export const PERMISSIONS = {
  VIEW_DASHBOARD_DG: [ROLES.DG],
  VIEW_DASHBOARD_DAF: [ROLES.DG, ROLES.DAF],
  VIEW_DASHBOARD_CDT: [ROLES.DG, ROLES.CDT, ROLES.CHEF_CHANTIER],
  MANAGE_CHANTIERS: [ROLES.DG, ROLES.CDT],
  VIEW_CHANTIERS: [ROLES.DG, ROLES.DAF, ROLES.CDT, ROLES.CHEF_CHANTIER],
  CREATE_RAPPORT: [ROLES.CHEF_CHANTIER, ROLES.CDT, ROLES.OPERATEUR],
  VALIDATE_RAPPORT: [ROLES.CDT, ROLES.DG],
  MANAGE_STOCK: [ROLES.MAGASINIER, ROLES.CDT],
  MANAGE_ACHATS: [ROLES.DAF, ROLES.DG],
  VIEW_FINANCE: [ROLES.DG, ROLES.DAF],
  MANAGE_HSE: [ROLES.CDT, ROLES.DG],
  MANAGE_ENGINS: [ROLES.CDT, ROLES.DG],
};

export function hasPermission(userRole, permission) {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(userRole);
}

export function canAccess(userRole, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
}
