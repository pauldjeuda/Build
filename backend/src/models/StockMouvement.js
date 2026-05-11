const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TYPES = ['entree', 'sortie', 'transfert', 'inventaire'];

const StockMouvement = sequelize.define('StockMouvement', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // article_id, chantier_id (source), chantier_destination_id (dest), createur_id → FK
  type:         { type: DataTypes.ENUM(...TYPES), allowNull: false },
  quantite:     { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0.01 } },
  stock_avant:  { type: DataTypes.DECIMAL(10, 2) },
  stock_apres:  { type: DataTypes.DECIMAL(10, 2) },
  motif:        { type: DataTypes.TEXT },
  reference_doc:{ type: DataTypes.STRING(100) },
}, {
  tableName: 'stock_mouvements',
});

module.exports = StockMouvement;
