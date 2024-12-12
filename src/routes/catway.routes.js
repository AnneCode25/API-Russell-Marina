const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catway.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const reservationRoutes = require('./reservation.routes');
// Appliquer l'authentification à toutes les routes
router.use(authMiddleware);
// Routes accessibles à tous les utilisateurs authentifiés
router.get('/', catwayController.getAllCatways);
router.get('/:id', catwayController.getCatwayById);
router.post('/', catwayController.createCatway);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);
// Routes des réservations (en sous-ressource)
router.use('/:catwayId/reservations', reservationRoutes);
module.exports = router;