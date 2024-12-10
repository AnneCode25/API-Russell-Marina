const reservationService = require('../services/reservation.service');

const reservationController = {
    getAllReservationsGlobal: async (req, res) => {
        try {
            const reservations = await reservationService.getAllReservations();
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getReservationsByCatwayId: async (req, res) => {
        try {
            const reservations = await reservationService.getReservationsByCatwayId(req.params.catwayId);
            res.status(200).json(reservations);
        } catch (error) {
            if (error.message === 'Catway non trouvé') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    },

    createReservation: async (req, res) => {
        try {
            const savedReservation = await reservationService.createReservation(req.body);
            res.status(201).json(savedReservation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteReservation: async (req, res) => {
        try {
            await reservationService.deleteReservation(req.params.id);
            res.status(200).json({ message: 'Réservation supprimée avec succès' });
        } catch (error) {
            if (error.message === 'Réservation non trouvée') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }
};

module.exports = reservationController;