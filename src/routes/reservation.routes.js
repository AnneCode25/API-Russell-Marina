const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// Protection de base
router.use(authMiddleware);
// Route pour toutes les réservations
router.get('/all', authMiddleware, reservationController.getAllReservationsGlobal);
// Routes admin uniquement
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);
router.get('/:id', reservationController.getReservationById);
router.delete('/:id', reservationController.deleteReservation);
module.exports = router;