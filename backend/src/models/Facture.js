const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUTS = ['en_attente', 'partiellement_payee', 'payee', 'en_retard', 'annulee'];

const Facture = sequelize.define('Facture', {
  id:                { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // chantier_id, fournisseur_id, commande_id, createur_id → FK
  numero:            { type: DataTypes.STRING(50), unique: true, allowNull: false },
  montant_ht:        { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  taux_tva:          { type: DataTypes.DECIMAL(5, 2), defaultValue: 19.25 },
  montant_tva:       { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  montant_ttc:       { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  montant_encaisse:  { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
  date_emission:     { type: DataTypes.DATEONLY, allowNull: false },
  date_echeance:     { type: DataTypes.DATEONLY },
  date_paiement:     { type: DataTypes.DATEONLY },
  status:            { type: DataTypes.ENUM(...STATUTS), defaultValue: 'en_attente' },
  notes:             { type: DataTypes.TEXT },
}, {
  tableName: 'factures',
});

module.exports = Facture;
