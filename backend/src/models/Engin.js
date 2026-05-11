const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUTS = ['disponible', 'operationnel', 'maintenance', 'en_panne'];
const TYPES   = ['pelleteuse', 'bulldozer', 'camion-benne', 'grue', 'compacteur', 'malaxeur', 'niveleuse', 'autre'];

const Engin = sequelize.define('Engin', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  immatriculation: { type: DataTypes.STRING(50),  unique: true, allowNull: false },
  type:            { type: DataTypes.ENUM(...TYPES), allowNull: false },
  marque:          { type: DataTypes.STRING(100) },
  modele:          { type: DataTypes.STRING(100) },
  annee:           { type: DataTypes.INTEGER },
  status:          { type: DataTypes.ENUM(...STATUTS), defaultValue: 'disponible' },
  heures_total:    { type: DataTypes.DECIMAL(10, 1), defaultValue: 0 },
  prochaine_maintenance: { type: DataTypes.DATEONLY },
  date_mise_en_service:  { type: DataTypes.DATEONLY },
  // chantier_id, responsable_id → FK
}, {
  tableName: 'engins',
});

module.exports = Engin;
