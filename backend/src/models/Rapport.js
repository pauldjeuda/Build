const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// §35 — États Rapport : Brouillon → Soumis → Validé → Rejeté
// §22 — Workflow : CDC crée/soumet → CDT valide ou rejette
const STATUTS = ['brouillon', 'soumis', 'valide', 'rejete'];
const METEOS  = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluie légère', 'Pluie forte', 'Orageux'];

const Rapport = sequelize.define('Rapport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // chantier_id, auteur_id, validateur_id → FK
  date: { type: DataTypes.DATEONLY, allowNull: false },
  meteo: { type: DataTypes.ENUM(...METEOS), allowNull: false },
  effectif: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
  travaux: { type: DataTypes.TEXT, allowNull: false },
  quantites: { type: DataTypes.TEXT },
  observations: { type: DataTypes.TEXT },
  nb_incidents: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM(...STATUTS), defaultValue: 'brouillon' },
  valide_at: { type: DataTypes.DATE },
  rejete_at: { type: DataTypes.DATE },
  motif_rejet: { type: DataTypes.TEXT },
}, {
  tableName: 'rapports',
});

module.exports = Rapport;
