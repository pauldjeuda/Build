const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// §24 — Workflow : CDC déclare (ouvert) → HSE prend en charge (en_cours) → HSE clôture (cloture)
const STATUTS  = ['ouvert', 'en_cours', 'resolu', 'cloture'];
const GRAVITES = ['leger', 'moyen', 'grave', 'critique'];
const TYPES    = ['accident', 'presque_accident', 'incident_materiel', 'incident_environnemental', 'maladie_pro'];

const Incident = sequelize.define('Incident', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // chantier_id, declare_par_id (CDC), gere_par_id (HSE) → FK
  type:               { type: DataTypes.ENUM(...TYPES), allowNull: false },
  gravite:            { type: DataTypes.ENUM(...GRAVITES), allowNull: false },
  description:        { type: DataTypes.TEXT, allowNull: false },
  date_incident:      { type: DataTypes.DATEONLY, allowNull: false },
  heure_incident:     { type: DataTypes.STRING(10) },
  lieu:               { type: DataTypes.STRING(255) },
  victimes:           { type: DataTypes.TEXT },
  temoins:            { type: DataTypes.TEXT },
  status:             { type: DataTypes.ENUM(...STATUTS), defaultValue: 'ouvert' },
  mesures_immediates: { type: DataTypes.TEXT },
  prise_en_charge_at: { type: DataTypes.DATE },
  cause_racine:       { type: DataTypes.TEXT },
  rapport_final:      { type: DataTypes.TEXT },
  cloture_at:         { type: DataTypes.DATE },
}, {
  tableName: 'incidents',
});

module.exports = Incident;
