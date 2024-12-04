const express = require('express');
const router = express.Router({ mergeParams: true }); // Important pour accéder aux paramètres du parent
const reservationController = require('../controllers/reservation.controller');

// Routes des réservations
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);
router.get('/:id', reservationController.getReservationById);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;