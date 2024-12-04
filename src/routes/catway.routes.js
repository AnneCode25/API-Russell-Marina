const express = require('express');
const router = express.Router();
const catwayController = require('../controllers/catway.controller');
const reservationRoutes = require('./reservation.routes');

// Routes des catways maintenant connectées au contrôleur
router.get('/', catwayController.getAllCatways);
router.post('/', catwayController.createCatway);
router.get('/:id', catwayController.getCatwayById);
router.put('/:id', catwayController.updateCatway);
router.delete('/:id', catwayController.deleteCatway);

// On garde les routes de réservation
router.use('/:catwayId/reservations', reservationRoutes);

module.exports = router;