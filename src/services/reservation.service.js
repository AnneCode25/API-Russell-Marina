// src/services/reservation.service.js
const Reservation = require('../models/reservation.model');
const Catway = require('../models/catway.model');

class ReservationService {
    async getAllReservations() {
        return await Reservation.find().sort({ checkIn: -1 });
    }

    async getReservationsByCatwayId(catwayId) {
        // Récupération du catway
        const catway = await Catway.findById(catwayId);
        if (!catway) {
            throw new Error('Catway non trouvé');
        }

        // Récupération des réservations
        return await Reservation.find({
            catwayNumber: catway.catwayNumber
        }).sort({ checkIn: -1 });
    }

    async createReservation(reservationData) {
        const { checkIn, checkOut, catwayNumber } = reservationData;

        // Vérification de la disponibilité
        const isAvailable = await Reservation.checkAvailability(
            catwayNumber,
            new Date(checkIn),
            new Date(checkOut)
        );

        if (!isAvailable) {
            throw new Error('Le catway n\'est pas disponible pour ces dates');
        }

        const newReservation = new Reservation(reservationData);
        return await newReservation.save();
    }

    async deleteReservation(id) {
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
            throw new Error('Réservation non trouvée');
        }
        return reservation;
    }
}

module.exports = new ReservationService();