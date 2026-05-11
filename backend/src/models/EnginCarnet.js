const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnginCarnet = sequelize.define('EnginCarnet', {
  id:                  { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // engin_id, auteur_id (CDC), chantier_id → FK
  date:                { type: DataTypes.DATEONLY, allowNull: false },
  heures_travail:      { type: DataTypes.DECIMAL(5, 1) },
  km_parcourus:        { type: DataTypes.DECIMAL(8, 1) },
  carburant_consomme:  { type: DataTypes.DECIMAL(8, 2) },
  observations:        { type: DataTypes.TEXT },
  anomalies:           { type: DataTypes.TEXT },
}, {
  tableName: 'engin_carnets',
});

module.exports = EnginCarnet;
