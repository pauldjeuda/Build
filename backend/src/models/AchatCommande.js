const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUTS = ['en_cours', 'livre', 'annule'];

const AchatCommande = sequelize.define('AchatCommande', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference: { type: DataTypes.STRING(30), unique: true },
  // demande_id, fournisseur_id, chantier_id, createur_id → FK
  article: { type: DataTypes.STRING(255), allowNull: false },
  montant: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  date_commande: { type: DataTypes.DATEONLY, allowNull: false },
  date_livraison_prevue: { type: DataTypes.DATEONLY },
  date_livraison_reelle: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.ENUM(...STATUTS), defaultValue: 'en_cours' },
  notes: { type: DataTypes.TEXT },
}, {
  tableName: 'achat_commandes',
  hooks: {
    beforeCreate: async (cmd) => {
      const count = await AchatCommande.count();
      const year = new Date().getFullYear();
      cmd.reference = `BC-${year}-${String(count + 1).padStart(3, '0')}`;
    },
  },
});

module.exports = AchatCommande;
