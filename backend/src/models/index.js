const sequelize       = require('../config/database');
const User            = require('./User');
const Chantier        = require('./Chantier');
const Rapport         = require('./Rapport');
const StockArticle    = require('./StockArticle');
const StockMouvement  = require('./StockMouvement');
const AchatDemande    = require('./AchatDemande');
const AchatCommande   = require('./AchatCommande');
const Fournisseur     = require('./Fournisseur');
const Depense         = require('./Depense');
const Facture         = require('./Facture');
const Engin           = require('./Engin');
const EnginMaintenance= require('./EnginMaintenance');
const EnginCarnet     = require('./EnginCarnet');
const Incident        = require('./Incident');
const ActionCorrective= require('./ActionCorrective');
const Inspection      = require('./Inspection');
const Notification    = require('./Notification');

// ─── Chantier ───────────────────────────────────────────────────────────────
Chantier.belongsTo(User, { as: 'chef',       foreignKey: 'chef_id'       });
Chantier.belongsTo(User, { as: 'conducteur', foreignKey: 'conducteur_id' });
User.hasMany(Chantier, { as: 'chantiersChef',       foreignKey: 'chef_id'       });
User.hasMany(Chantier, { as: 'chantiersConducteur', foreignKey: 'conducteur_id' });

// ─── Rapport §22 : CDC crée → CDT valide ────────────────────────────────────
Rapport.belongsTo(Chantier, { foreignKey: 'chantier_id', onDelete: 'CASCADE' });
Rapport.belongsTo(User,     { as: 'auteur',     foreignKey: 'auteur_id'     });
Rapport.belongsTo(User,     { as: 'validateur', foreignKey: 'validateur_id' });
Chantier.hasMany(Rapport, { foreignKey: 'chantier_id' });

// ─── Stock ───────────────────────────────────────────────────────────────────
StockMouvement.belongsTo(StockArticle, { foreignKey: 'article_id', onDelete: 'CASCADE' });
StockMouvement.belongsTo(Chantier,     { as: 'chantierSource',      foreignKey: 'chantier_id'             });
StockMouvement.belongsTo(Chantier,     { as: 'chantierDest',        foreignKey: 'chantier_destination_id' });
StockMouvement.belongsTo(User,         { as: 'createur',            foreignKey: 'createur_id'             });
StockArticle.hasMany(StockMouvement, { foreignKey: 'article_id' });

// ─── Achats §23 — workflow 4 étapes ─────────────────────────────────────────
AchatDemande.belongsTo(Chantier, { foreignKey: 'chantier_id' });
AchatDemande.belongsTo(User, { as: 'demandeur',      foreignKey: 'demandeur_id'      });
AchatDemande.belongsTo(User, { as: 'validateurCdt',  foreignKey: 'validateur_cdt_id' });
AchatDemande.belongsTo(User, { as: 'validateurDaf',  foreignKey: 'validateur_daf_id' });
AchatDemande.belongsTo(User, { as: 'receptionnaire', foreignKey: 'receptionnaire_id' });
Chantier.hasMany(AchatDemande, { foreignKey: 'chantier_id' });

AchatCommande.belongsTo(AchatDemande, { foreignKey: 'demande_id'     });
AchatCommande.belongsTo(Fournisseur,  { foreignKey: 'fournisseur_id' });
AchatCommande.belongsTo(Chantier,     { foreignKey: 'chantier_id'    });
AchatCommande.belongsTo(User, { as: 'createur', foreignKey: 'createur_id' });
AchatDemande.hasOne(AchatCommande, { foreignKey: 'demande_id' });
Fournisseur.hasMany(AchatCommande, { foreignKey: 'fournisseur_id' });

// ─── Finance ─────────────────────────────────────────────────────────────────
Depense.belongsTo(Chantier, { foreignKey: 'chantier_id' });
Depense.belongsTo(User, { as: 'createur', foreignKey: 'createur_id' });
Chantier.hasMany(Depense, { foreignKey: 'chantier_id' });

Facture.belongsTo(Chantier,    { foreignKey: 'chantier_id'    });
Facture.belongsTo(Fournisseur, { foreignKey: 'fournisseur_id' });
Facture.belongsTo(AchatCommande, { foreignKey: 'commande_id'  });
Facture.belongsTo(User, { as: 'createur', foreignKey: 'createur_id' });
Chantier.hasMany(Facture, { foreignKey: 'chantier_id' });

// ─── Engins ──────────────────────────────────────────────────────────────────
Engin.belongsTo(Chantier, { as: 'chantierActuel', foreignKey: 'chantier_id'     });
Engin.belongsTo(User,     { as: 'responsable',    foreignKey: 'responsable_id'   });
Chantier.hasMany(Engin, { foreignKey: 'chantier_id' });

EnginMaintenance.belongsTo(Engin, { foreignKey: 'engin_id', onDelete: 'CASCADE' });
EnginMaintenance.belongsTo(User, { as: 'createur', foreignKey: 'createur_id' });
Engin.hasMany(EnginMaintenance, { as: 'maintenances', foreignKey: 'engin_id' });

EnginCarnet.belongsTo(Engin,    { foreignKey: 'engin_id', onDelete: 'CASCADE' });
EnginCarnet.belongsTo(Chantier, { foreignKey: 'chantier_id' });
EnginCarnet.belongsTo(User, { as: 'auteur', foreignKey: 'auteur_id' });
Engin.hasMany(EnginCarnet, { as: 'carnets', foreignKey: 'engin_id' });

// ─── HSE §24 : CDC déclare → HSE gère ───────────────────────────────────────
Incident.belongsTo(Chantier, { foreignKey: 'chantier_id' });
Incident.belongsTo(User, { as: 'declarePar', foreignKey: 'declare_par_id' });
Incident.belongsTo(User, { as: 'gerePar',    foreignKey: 'gere_par_id'    });
Chantier.hasMany(Incident, { foreignKey: 'chantier_id' });

ActionCorrective.belongsTo(Incident, { foreignKey: 'incident_id', onDelete: 'CASCADE' });
ActionCorrective.belongsTo(User, { as: 'responsable', foreignKey: 'responsable_id' });
ActionCorrective.belongsTo(User, { as: 'createur',    foreignKey: 'createur_id'    });
Incident.hasMany(ActionCorrective, { as: 'actions', foreignKey: 'incident_id' });

Inspection.belongsTo(Chantier, { foreignKey: 'chantier_id' });
Inspection.belongsTo(User, { as: 'inspecteur', foreignKey: 'inspecteur_id' });
Chantier.hasMany(Inspection, { foreignKey: 'chantier_id' });

// ─── Notifications ───────────────────────────────────────────────────────────
Notification.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Notification, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize: require('sequelize'),
  User, Chantier, Rapport,
  StockArticle, StockMouvement,
  AchatDemande, AchatCommande, Fournisseur,
  Depense, Facture,
  Engin, EnginMaintenance, EnginCarnet,
  Incident, ActionCorrective, Inspection,
  Notification,
};
