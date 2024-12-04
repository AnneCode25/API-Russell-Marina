const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catway.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');
const reservationRoutes = require('./reservation.routes');

// Appliquer l'authentification à toutes les routes
router.use(authMiddleware);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById);

// Routes réservées aux administrateurs
router.post('/', isAdmin, catwayController.createCatway);
router.put('/:id', isAdmin, catwayController.updateCatway);
router.delete('/:id', isAdmin, catwayController.deleteCatway);

// Routes des réservations (en sous-ressource)
router.use('/:catwayId/reservations', reservationRoutes);

module.exports = router;