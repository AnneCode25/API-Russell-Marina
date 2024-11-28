//Imports
require('dotenv').config({ path: '.env' });

// Pour déboguer, ajoutons un log pour voir si la variable est bien chargée
console.log('URI MongoDB depuis .env:', process.env.MONGODB_URI);

// Configuration centralisée de l'application
const config = {
    // Configuration du serveur
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },

    // Configuration de la base de données
    database: {
        uri: process.env.MONGODB_URI
    },

    // Configuration JWT pour l'authentification
    jwt: {
        secret: process.env.JWT_SECRET || 'dev_secret_key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
};

// Vérification explicite de l'URI
if (!config.database.uri) {
        throw new Error('MONGODB_URI manquante dans les variables d\'environnement');
    }

module.exports = config;