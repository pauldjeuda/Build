const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TYPES   = ['preventive', 'corrective', 'vidange', 'revision', 'reparation', 'controle', 'autre'];
const STATUTS = ['planifie', 'en_cours', 'termine', 'annule'];

const EnginMaintenance = sequelize.define('EnginMaintenance', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // engin_id, createur_id → FK
  type:            { type: DataTypes.ENUM(...TYPES), allowNull: false },
  description:     { type: DataTypes.TEXT },
  date_debut:      { type: DataTypes.DATEONLY, allowNull: false },
  date_fin_prevue: { type: DataTypes.DATEONLY },
  date_fin_reelle: { type: DataTypes.DATEONLY },
  cout:            { type: DataTypes.DECIMAL(12, 2) },
  cout_reel:       { type: DataTypes.DECIMAL(12, 2) },
  prestataire:     { type: DataTypes.STRING(200) },
  status:          { type: DataTypes.ENUM(...STATUTS), defaultValue: 'planifie' },
  observations:    { type: DataTypes.TEXT },
}, {
  tableName: 'engin_maintenances',
});

module.exports = EnginMaintenance;
