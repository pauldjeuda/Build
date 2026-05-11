const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fournisseur = sequelize.define('Fournisseur', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nom: { type: DataTypes.STRING(200), allowNull: false },
  categorie: { type: DataTypes.STRING(100) },
  contact: { type: DataTypes.STRING(100) },
  email: { type: DataTypes.STRING(150) },
  ville: { type: DataTypes.STRING(100) },
  adresse: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('actif', 'inactif'),
    defaultValue: 'actif',
  },
}, {
  tableName: 'fournisseurs',
});

module.exports = Fournisseur;
