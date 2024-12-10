// routes/reservation.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Protection de base
router.use(authMiddleware);

// Routes simplifiées
router.get('/all', authMiddleware, reservationController.getAllReservationsGlobal);
router.post('/', reservationController.createReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;