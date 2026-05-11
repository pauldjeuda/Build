const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const STATUTS   = ['en_attente', 'en_cours', 'termine', 'annule'];
const PRIORITES = ['basse', 'moyenne', 'haute', 'critique'];

const ActionCorrective = sequelize.define('ActionCorrective', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // incident_id, responsable_id, createur_id → FK
  description:  { type: DataTypes.TEXT, allowNull: false },
  echeance:     { type: DataTypes.DATEONLY, allowNull: false },
  priorite:     { type: DataTypes.ENUM(...PRIORITES), defaultValue: 'moyenne' },
  status:       { type: DataTypes.ENUM(...STATUTS), defaultValue: 'en_attente' },
  commentaire:  { type: DataTypes.TEXT },
  termine_at:   { type: DataTypes.DATE },
}, {
  tableName: 'actions_correctives',
});

module.exports = ActionCorrective;
