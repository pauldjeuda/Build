const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TYPES   = ['periodique', 'inopinee', 'pre_demarrage', 'suivi_incident'];
const STATUTS = ['planifie', 'realise', 'conforme', 'non_conforme'];

const Inspection = sequelize.define('Inspection', {
  id:                   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // chantier_id, inspecteur_id (HSE) → FK
  date_inspection:      { type: DataTypes.DATEONLY, allowNull: false },
  type:                 { type: DataTypes.ENUM(...TYPES), allowNull: false },
  observations:         { type: DataTypes.TEXT },
  points_conformes:     { type: DataTypes.JSON, defaultValue: [] },
  points_non_conformes: { type: DataTypes.JSON, defaultValue: [] },
  status:               { type: DataTypes.ENUM(...STATUTS), defaultValue: 'realise' },
}, {
  tableName: 'inspections',
});

module.exports = Inspection;
