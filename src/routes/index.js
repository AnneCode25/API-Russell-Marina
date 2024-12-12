//Imports
const express = require('express');
const catwayRoutes = require('./catway.routes');
const authRoutes = require('./auth.routes');
const reservationRoutes = require('./reservation.routes');
const userRoutes = require('./user.routes');

// Création du routeur principal
const router = express.Router();

// Configuration des routes d'authentification
router.use('/auth', authRoutes);

// Configuration des routes principales
router.use('/catways', catwayRoutes);
router.use('/reservations', reservationRoutes);
router.use('/users', userRoutes);

module.exports = router;