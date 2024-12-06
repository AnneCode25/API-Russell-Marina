// On charge d'abord les variables d'environnement
require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDatabase = require('./config/database');
const routes = require('./routes');
const app = express();
// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware pour parser le JSON
// Configuration de base d'Express
app.use(express.json());
// Montage des routes avec un préfixe /api
app.use('/api', routes);
// Route simple pour tester
app.get('/', (req, res) => {
    res.render('pages/home');
});
app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard');
});
app.get('/catways', (req, res) => {
    res.render('pages/catways');
});
app.get('/reservations', (req, res) => {
    res.render('pages/reservations');
});
app.get('/catway', (req, res) => {
    res.render('pages/catway-details');
});
app.get('/reservation', (req, res) => {
    res.render('pages/reservation-details');
});
// On connecte d'abord la base de données, puis on démarre le serveur
const startServer = async () => {
    try {
        // Connexion à la base de données
        await connectDatabase();
       
        // Démarrage du serveur
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('✅ Serveur démarré sur le port ${PORT}');
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error.message);
        process.exit(1);
    }
};
startServer();