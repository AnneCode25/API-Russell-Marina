const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

// Protection de base
router.use(authMiddleware);

// Routes admin uniquement
router.get('/', isAdmin, reservationController.getAllReservations);
router.post('/', isAdmin, reservationController.createReservation);
router.get('/:id', isAdmin, reservationController.getReservationById);
router.delete('/:id', isAdmin, reservationController.deleteReservation);

module.exports = router;