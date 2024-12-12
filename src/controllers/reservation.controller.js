//Imports
const reservationService = require('../services/reservation.service');

/**
 * Contrôleur gérant les réservations
 * @namespace ReservationController
 */
const reservationController = {

    /**
     * Récupère toutes les réservations
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
    getAllReservationsGlobal: async (req, res) => {
        try {
            const reservations = await reservationService.getAllReservations();
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Récupère les réservations d'un catway
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} req.params - Paramètres de la requête
     * @param {string} req.params.catwayId - ID du catway
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
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