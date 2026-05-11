require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, Chantier, StockArticle, Engin, Fournisseur, Incident } = require('../models');

const USERS = [
  { name: 'Directeur Général',  email: 'dg@buildpro.cm',  role: 'dg',  password: 'password123' },
  { name: 'Aminata Diallo',     email: 'daf@buildpro.cm', role: 'daf', password: 'password123' },
  { name: 'Jean-Marc Mbarga',   email: 'cdt@buildpro.cm', role: 'cdt', password: 'password123' },
  { name: 'Paul Ngono',         email: 'cdc@buildpro.cm', role: 'cdc', password: 'password123' },
  { name: 'Serge Atangana',     email: 'gst@buildpro.cm', role: 'gst', password: 'password123' },
  { name: 'Alice Tchouateu',    email: 'log@buildpro.cm', role: 'log', password: 'password123' },
  { name: 'Bertrand Mfou',      email: 'hse@buildpro.cm', role: 'hse', password: 'password123' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✓ Base de données synchronisée');

    // ─── Users ─────────────────────────────────────────────────────────
    const users = await User.bulkCreate(USERS, { individualHooks: true });
    const byRole = Object.fromEntries(users.map((u) => [u.role, u]));
    console.log(`✓ ${users.length} utilisateurs créés`);

    // ─── Chantiers ──────────────────────────────────────────────────────
    const chantiers = await Chantier.bulkCreate([
      {
        nom: 'Construction Immeuble R+5 Bastos',
        description: 'Immeuble résidentiel de 5 étages en zone Bastos',
        localisation: 'Yaoundé, Bastos',
        budget: 450000000,
        depenses: 127500000,
        date_debut: '2024-01-15',
        date_fin: '2025-06-30',
        status: 'en_cours',
        chef_id: byRole['cdc'].id,
        conducteur_id: byRole['cdt'].id,
      },
      {
        nom: 'Réhabilitation Route N3 Tronçon Yaoundé-Bafoussam',
        description: 'Travaux de réhabilitation et élargissement',
        localisation: 'Centre-Sud, Cameroun',
        budget: 2800000000,
        depenses: 980000000,
        date_debut: '2023-06-01',
        date_fin: '2025-12-31',
        status: 'en_cours',
        chef_id: byRole['cdc'].id,
        conducteur_id: byRole['cdt'].id,
      },
      {
        nom: 'Complexe Industriel Douala Port',
        description: 'Construction entrepôts et bureaux portuaires',
        localisation: 'Douala, Zone Portuaire',
        budget: 890000000,
        depenses: 0,
        date_debut: '2025-03-01',
        date_fin: '2026-08-31',
        status: 'brouillon',
        chef_id: byRole['cdc'].id,
        conducteur_id: byRole['cdt'].id,
      },
    ]);
    console.log(`✓ ${chantiers.length} chantiers créés`);

    // ─── Fournisseurs ───────────────────────────────────────────────────
    const fournisseurs = await Fournisseur.bulkCreate([
      { nom: 'CIMENCAM', categorie: 'materiaux', contact: '+237 222 000 001', email: 'contact@cimencam.cm', ville: 'Douala' },
      { nom: 'SOACAM', categorie: 'materiaux', contact: '+237 233 000 002', email: 'achats@soacam.cm', ville: 'Yaoundé' },
      { nom: 'AGRO-METAL', categorie: 'quincaillerie', contact: '+237 677 000 003', email: 'info@agrometal.cm', ville: 'Bafoussam' },
      { nom: 'TRACTAFRIC', categorie: 'engins', contact: '+237 222 000 004', email: 'maintenance@tractafric.cm', ville: 'Douala' },
    ]);
    console.log(`✓ ${fournisseurs.length} fournisseurs créés`);

    // ─── Stock ──────────────────────────────────────────────────────────
    const articles = await StockArticle.bulkCreate([
      { designation: 'Ciment CEM II 42.5', reference: 'CIM-001', categorie: 'materiaux', unite: 'sac', stock: 850, stock_min: 200, prix_unitaire: 7500, localisation: 'Entrepôt A' },
      { designation: 'Fer à béton Ø12mm', reference: 'FER-012', categorie: 'materiaux', unite: 'barre', stock: 1200, stock_min: 300, prix_unitaire: 4800, localisation: 'Entrepôt A' },
      { designation: 'Sable de rivière', reference: 'SAB-001', categorie: 'granulats', unite: 'm³', stock: 45, stock_min: 50, prix_unitaire: 18000, localisation: 'Parc extérieur' },
      { designation: 'Gravier concassé 15/25', reference: 'GRV-015', categorie: 'granulats', unite: 'm³', stock: 8, stock_min: 30, prix_unitaire: 22000, localisation: 'Parc extérieur' },
      { designation: 'Parpaing creux 15x20x40', reference: 'PAR-015', categorie: 'materiaux', unite: 'unité', stock: 4200, stock_min: 1000, prix_unitaire: 450, localisation: 'Entrepôt B' },
      { designation: 'Gasoil', reference: 'GAZ-001', categorie: 'carburant', unite: 'litre', stock: 3200, stock_min: 500, prix_unitaire: 730, localisation: 'Cuve principale' },
    ]);
    console.log(`✓ ${articles.length} articles stock créés`);

    // ─── Engins ─────────────────────────────────────────────────────────
    await Engin.bulkCreate([
      { immatriculation: 'CE-4521-CM', type: 'pelleteuse', marque: 'CAT', modele: '320', annee: 2020, status: 'operationnel', chantier_id: chantiers[0].id, responsable_id: byRole['log'].id },
      { immatriculation: 'CE-3217-CM', type: 'bulldozer', marque: 'Komatsu', modele: 'D65', annee: 2019, status: 'maintenance', chantier_id: chantiers[1].id, responsable_id: byRole['log'].id },
      { immatriculation: 'CE-8845-CM', type: 'camion-benne', marque: 'Mercedes', modele: 'Actros', annee: 2021, status: 'operationnel', chantier_id: chantiers[0].id, responsable_id: byRole['log'].id },
      { immatriculation: 'CE-1122-CM', type: 'grue', marque: 'Liebherr', modele: 'LTM 1100', annee: 2018, status: 'disponible', responsable_id: byRole['log'].id },
    ]);
    console.log('✓ 4 engins créés');

    // ─── Incident ───────────────────────────────────────────────────────
    await Incident.create({
      chantier_id: chantiers[0].id,
      date_incident: '2025-03-12',
      heure_incident: '10:30',
      type: 'accident',
      gravite: 'leger',
      lieu: 'Zone de coffrage niveau R+2',
      description: 'Chute d\'un outil lors du coffrage. Blessure légère à la main droite.',
      declare_par_id: byRole['cdc'].id,
      status: 'ouvert',
    });
    console.log('✓ 1 incident créé');

    console.log('\n✅ Seed terminé avec succès !');
    console.log('\nComptes disponibles (mot de passe : password123) :');
    USERS.forEach((u) => console.log(`  ${u.role.toUpperCase().padEnd(4)} → ${u.email}`));

  } catch (err) {
    console.error('✗ Erreur seed :', err);
  } finally {
    await sequelize.close();
  }
}

seed();
