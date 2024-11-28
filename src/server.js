// On charge d'abord les variables d'environnement
require('dotenv').config();

const express = require('express');
const connectDatabase = require('./config/database');

const app = express();

// Configuration de base d'Express
app.use(express.json());

// Route simple pour tester
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API du Port de Plaisance Russell' });
});

// On connecte d'abord la base de données, puis on démarre le serveur
const startServer = async () => {
    try {
        // Connexion à la base de données
        await connectDatabase();
        
        // Démarrage du serveur
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`✅ Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error.message);
        process.exit(1);
    }
};

startServer();