require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✓ Connexion DB établie');

    // En dev, sync sans force pour ne pas perdre les données
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✓ Modèles synchronisés');
    }

    app.listen(PORT, () => {
      console.log(`✓ Serveur démarré sur le port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (err) {
    console.error('✗ Erreur démarrage serveur :', err);
    process.exit(1);
  }
}

start();
