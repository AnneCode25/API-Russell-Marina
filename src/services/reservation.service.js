// Imports
const Reservation = require('../models/reservation.model');
const Catway = require('../models/catway.model');

/**
 * Service de gestion des réservations
 * @class ReservationService
 */
class ReservationService {
    /**
     * Récupère toutes les réservations
     * @returns {Promise<Array>} Liste de toutes les réservations triées par date d'arrivée
     */
    async getAllReservations() {
        return await Reservation.find().sort({ checkIn: -1 });
    }


    /**
     * Récupère les réservations d'un catway spécifique
     * @param {string} catwayId - ID du catway
     * @returns {Promise<Array>} Liste des réservations pour ce catway
     * @throws {Error} Si le catway n'existe pas
     */
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

    /**
     * Crée une nouvelle réservation
     * @param {Object} reservationData - Données de la réservation
     * @param {number} reservationData.catwayNumber - Numéro du catway
     * @param {string} reservationData.clientName - Nom du client
     * @param {string} reservationData.boatName - Nom du bateau
     * @param {Date} reservationData.checkIn - Date d'arrivée
     * @param {Date} reservationData.checkOut - Date de départ
     * @returns {Promise<Object>} Réservation créée
     * @throws {Error} Si le catway n'est pas disponible pour ces dates
     */
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

    /**
     * Supprime une réservation
     * @param {string} id - ID de la réservation
     * @returns {Promise<Object>} Réservation supprimée
     * @throws {Error} Si la réservation n'est pas trouvée
     */
    async deleteReservation(id) {
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
            throw new Error('Réservation non trouvée');
        }
        return reservation;
    }
}

module.exports = new ReservationService();