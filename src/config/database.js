const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        // On utilise directement l'URI depuis les variables d'environnement
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        
        // Si la connexion réussit, on affiche un message
        console.log('✅ Connecté à MongoDB avec succès');
        
        return connection;
    } catch (error) {
        // Si la connexion échoue, on affiche l'erreur
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;