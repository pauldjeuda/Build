const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockArticle = sequelize.define('StockArticle', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  reference:     { type: DataTypes.STRING(50) },
  designation:   { type: DataTypes.STRING(200), allowNull: false },
  categorie:     { type: DataTypes.STRING(100) },
  unite:         { type: DataTypes.STRING(20), defaultValue: 'unité' },
  stock:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  stock_min:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  prix_unitaire: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  localisation:  { type: DataTypes.STRING(200) },
  valeur: {
    type: DataTypes.VIRTUAL,
    get() { return parseFloat(this.stock || 0) * parseFloat(this.prix_unitaire || 0); },
  },
}, {
  tableName: 'stock_articles',
});

module.exports = StockArticle;
