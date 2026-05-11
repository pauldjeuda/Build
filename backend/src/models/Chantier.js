const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// §35 — États Système Chantier : Brouillon → Actif → Suspendu → Terminé
const STATUTS = ['brouillon', 'actif', 'en_cours', 'suspendu', 'en_retard', 'termine'];

const Chantier = sequelize.define('Chantier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  localisation: { type: DataTypes.STRING(255), allowNull: false },
  status: {
    type: DataTypes.ENUM(...STATUTS),
    defaultValue: 'brouillon',
  },
  avancement: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: { min: 0 },
  },
  depenses: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  date_debut: { type: DataTypes.DATEONLY, allowNull: false },
  date_fin: { type: DataTypes.DATEONLY, allowNull: false },
  // chef_id → FK vers User (CDC)
  // conducteur_id → FK vers User (CDT)
}, {
  tableName: 'chantiers',
});

module.exports = Chantier;
