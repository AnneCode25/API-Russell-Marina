const Reservation = require('../models/reservation.model');
const Catway = require('../models/catway.model');

const reservationController = {
    // Obtenir toutes les réservations d'un catway spécifique
    getAllReservations: async (req, res) => {
        try {
            // Vérifie d'abord si le catway existe
            const catwayId = req.params.catwayId;
            const catway = await Catway.findById(catwayId);
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            // Récupère toutes les réservations pour ce catway
            const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Créer une nouvelle réservation
    createReservation: async (req, res) => {
        try {
            // Vérifie si le catway existe
            const catwayId = req.params.catwayId;
            const catway = await Catway.findById(catwayId);
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }

            // Vérifie la disponibilité
            const { checkIn, checkOut } = req.body;
            const isAvailable = await Reservation.checkAvailability(
                catway.catwayNumber,
                new Date(checkIn),
                new Date(checkOut)
            );

            if (!isAvailable) {
                return res.status(400).json({ 
                    message: 'Le catway n\'est pas disponible pour ces dates' 
                });
            }

            // Crée la réservation
            const newReservation = new Reservation({
                ...req.body,
                catwayNumber: catway.catwayNumber
            });
            const savedReservation = await newReservation.save();
            res.status(201).json(savedReservation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Obtenir une réservation spécifique
    getReservationById: async (req, res) => {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.status(200).json(reservation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Supprimer une réservation
    deleteReservation: async (req, res) => {
        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }

            await Reservation.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Réservation supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = reservationController;