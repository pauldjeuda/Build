const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// §23 — Workflow Achat multi-étapes :
// CDC crée (en_attente) → CDT valide besoin (valide_cdt) → DAF valide budget (approuve)
// → GST réceptionne (livre) | Rejet possible à n'importe quelle étape
const STATUTS = ['en_attente', 'valide_cdt', 'approuve', 'rejete', 'livre'];

const AchatDemande = sequelize.define('AchatDemande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING(30), unique: true },
  // chantier_id, demandeur_id, validateur_cdt_id, validateur_daf_id, receptionnaire_id → FK
  article: { type: DataTypes.STRING(255), allowNull: false },
  montant: { type: DataTypes.DECIMAL(15, 2), allowNull: false, validate: { min: 0 } },
  justification: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM(...STATUTS), defaultValue: 'en_attente' },
  // Horodatages workflow
  valide_cdt_at: { type: DataTypes.DATE },
  approuve_at: { type: DataTypes.DATE },
  rejete_at: { type: DataTypes.DATE },
  livre_at: { type: DataTypes.DATE },
  motif_rejet: { type: DataTypes.TEXT },
}, {
  tableName: 'achat_demandes',
  hooks: {
    beforeCreate: async (demande) => {
      const count = await AchatDemande.count();
      const year = new Date().getFullYear();
      demande.reference = `DA-${year}-${String(count + 1).padStart(3, '0')}`;
    },
  },
});

module.exports = AchatDemande;
