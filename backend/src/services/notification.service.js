const { Notification, User } = require('../models');

/**
 * §34 — Créer une notification pour un ou plusieurs utilisateurs.
 * Les rôles destinataires sont déterminés par le type d'événement.
 */
async function notify({ type, message, link = null, data = null, userIds = [], roles = [] }) {
  let targetIds = [...userIds];

  if (roles.length > 0) {
    const users = await User.findAll({
      where: { role: roles, is_active: true },
      attributes: ['id'],
    });
    targetIds = [...new Set([...targetIds, ...users.map((u) => u.id)])];
  }

  if (targetIds.length === 0) return;

  await Notification.bulkCreate(
    targetIds.map((user_id) => ({ user_id, type, message, link, data }))
  );
}

// Helpers métier — §34 liste des événements à notifier
const events = {
  rapportSoumis: (rapport) =>
    notify({
      type: 'rapport_soumis',
      message: `Rapport du ${rapport.date} soumis pour ${rapport.chantierNom} — validation requise`,
      link: `/rapports`,
      roles: ['cdt'],
    }),

  rapportValide: (rapport, auteurId) =>
    notify({
      type: 'rapport_valide',
      message: `Votre rapport du ${rapport.date} a été validé`,
      link: `/rapports`,
      userIds: [auteurId],
    }),

  rapportRejete: (rapport, auteurId) =>
    notify({
      type: 'rapport_rejete',
      message: `Votre rapport du ${rapport.date} a été rejeté — ${rapport.motif_rejet || 'voir détails'}`,
      link: `/rapports`,
      userIds: [auteurId],
    }),

  achatCreee: (demande) =>
    notify({
      type: 'achat_cree',
      message: `Nouvelle demande d'achat ${demande.reference} — validation CDT requise`,
      link: `/achats/demandes`,
      roles: ['cdt'],
    }),

  achatValideCdt: (demande) =>
    notify({
      type: 'achat_valide_cdt',
      message: `Demande ${demande.reference} validée CDT — approbation budget DAF requise`,
      link: `/achats/demandes`,
      roles: ['daf'],
    }),

  achatApprouveDAF: (demande) =>
    notify({
      type: 'achat_approuve_daf',
      message: `Budget approuvé pour ${demande.reference} — prête à réceptionner`,
      link: `/achats/demandes`,
      roles: ['gst'],
    }),

  incidentDeclare: (incident) =>
    notify({
      type: 'incident_declare',
      message: `Incident ${incident.gravite} déclaré sur ${incident.chantierNom}`,
      link: `/hse/incidents`,
      roles: ['hse', 'cdt'],
    }),

  stockAlerte: (article) =>
    notify({
      type: 'stock_alerte',
      message: `Stock faible : ${article.designation} — ${article.stock} ${article.unite} restants`,
      link: `/stock/alertes`,
      roles: ['gst', 'cdt'],
    }),
};

module.exports = { notify, events };
