/**
 * Point d'entrée principal de l'application
 * Configure et démarre le serveur Express avec toutes ses dépendances
 * @module Server
 */

// Chargement des variables d'environnement en premier
require('dotenv').config();

// Imports des dépendances
const express = require('express');
const path = require('path');

// Imports de nos modules
const connectDatabase = require('./src/config/database');
const routes = require('./src/routes');
const documentationRoutes = require('./src/routes/documentation.routes');

// Création de l'application Express
const app = express();

// Configuration du moteur de vue EJS
app.set('view engine', 'ejs');
// Les vues sont maintenant dans src/views
app.set('views', path.join(__dirname, 'src/views'));

// Configuration des fichiers statiques avec gestion explicite des types MIME
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        // Définition explicite des types MIME pour éviter les erreurs de chargement
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Middleware pour parser le JSON
app.use(express.json());

// En développement, on logue toutes les requêtes pour faciliter le débogage
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`📑 ${req.method} ${req.url}`);
        next();
    });
}

// Montage des routes API
app.use('/api', routes);

// Routes des pages
app.get('/', (req, res) => {
    res.render('pages/home');
});

app.use('/documentation', documentationRoutes);

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

app.get('/users', (req, res) => {
    res.render('pages/users');
});

/**
 * Démarre le serveur Express et initialise la connexion à la base de données
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
    try {
        // Connexion à la base de données
        await connectDatabase();
        
        // Démarrage du serveur
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('\n=== Configuration du serveur ===');
            console.log(`✅ Serveur démarré sur le port ${PORT}`);
            console.log(`📁 Fichiers statiques : ${path.join(__dirname, 'public')}`);
            console.log(`📑 Vues : ${path.join(__dirname, 'src/views')}`);
            console.log('===============================\n');
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error.message);
        process.exit(1);
    }
};

// Démarrage du serveur
startServer();