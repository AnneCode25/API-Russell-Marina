const express = require('express');
const catwayRoutes = require('./catway.routes');
const authRoutes = require('./auth.routes');

// Création du routeur principal
const router = express.Router();

// Configuration des routes d'authentification
router.use('/auth', authRoutes);

// Configuration des routes principales
router.use('/catways', catwayRoutes);

// Message de bienvenue sur la route racine
router.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API du Port de Plaisance Russell',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: '/api/auth/register',
                login: '/api/auth/login',
                profile: '/api/auth/profile'
            },
            catways: '/api/catways',
            reservations: '/api/catways/:catwayId/reservations'
        }
    });
});

module.exports = router;