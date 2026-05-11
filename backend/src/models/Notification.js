const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TYPES = [
  'rapport_soumis', 'rapport_valide', 'rapport_rejete',
  'achat_cree', 'achat_valide_cdt', 'achat_approuve_daf', 'achat_livre', 'achat_rejete',
  'incident_declare', 'incident_resolu',
  'stock_alerte',
  'engin_panne',
  'facture_impayee',
  'budget_depasse',
];

const Notification = sequelize.define('Notification', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // user_id → FK (destinataire)
  type:    { type: DataTypes.ENUM(...TYPES), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  lu:      { type: DataTypes.BOOLEAN, defaultValue: false },
  lu_at:   { type: DataTypes.DATE },
  link:    { type: DataTypes.STRING(255) },
  data:    { type: DataTypes.JSON },
}, {
  tableName: 'notifications',
});

module.exports = Notification;
