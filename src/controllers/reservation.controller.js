// controllers/reservation.controller.js
const Reservation = require('../models/reservation.model');
const Catway = require('../models/catway.model');

const reservationController = {
    getAllReservationsGlobal: async (req, res) => {
        try {
            const reservations = await Reservation.find().sort({ checkIn: -1 });
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getReservationsByCatwayId: async (req, res) => {
        try {
            // Récupérer d'abord le catway pour avoir son numéro
            const catway = await Catway.findById(req.params.catwayId);
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            
            // Utiliser le numéro du catway pour trouver les réservations
            const reservations = await Reservation.find({
                catwayNumber: catway.catwayNumber
            }).sort({ checkIn: -1 });
            
            res.status(200).json(reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createReservation: async (req, res) => {
        try {
            const { checkIn, checkOut, catwayNumber } = req.body;
            
            // Vérification de la disponibilité
            const isAvailable = await Reservation.checkAvailability(
                catwayNumber,
                new Date(checkIn),
                new Date(checkOut)
            );

            if (!isAvailable) {
                return res.status(400).json({
                    message: 'Le catway n\'est pas disponible pour ces dates'
                });
            }

            const newReservation = new Reservation(req.body);
            const savedReservation = await newReservation.save();
            res.status(201).json(savedReservation);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteReservation: async (req, res) => {
        try {
            const reservation = await Reservation.findByIdAndDelete(req.params.id);
            if (!reservation) {
                return res.status(404).json({ message: 'Réservation non trouvée' });
            }
            res.status(200).json({ message: 'Réservation supprimée avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = reservationController;