const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CATEGORIES = ['materiaux', 'main_oeuvre', 'engins', 'transport', 'carburant', 'divers'];

const Depense = sequelize.define('Depense', {
  id:               { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // chantier_id, createur_id → FK
  categorie:        { type: DataTypes.ENUM(...CATEGORIES), allowNull: false },
  montant:          { type: DataTypes.DECIMAL(15, 2), allowNull: false, validate: { min: 0 } },
  description:      { type: DataTypes.TEXT, allowNull: false },
  date:             { type: DataTypes.DATEONLY, allowNull: false },
  reference_commande: { type: DataTypes.STRING(100) },
}, {
  tableName: 'depenses',
});

module.exports = Depense;
