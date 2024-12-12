//Imports
const Catway = require('../models/catway.model');
const Reservation = require('../models/reservation.model');


/**
 * Service de gestion des catways
 * @class CatwayService
 */
class CatwayService {
    
    /**
     * Récupère tous les catways
     * @returns {Promise<Array>} Liste de tous les catways
     */
    async getAllCatways() {
        return await Catway.find();
    }

    /**
     * Crée un nouveau catway
     * @param {Object} catwayData - Données du catway à créer
     * @param {number} catwayData.catwayNumber - Numéro du catway
     * @param {string} catwayData.type - Type de catway ('long' ou 'short')
     * @param {string} catwayData.catwayState - État du catway
     * @returns {Promise<Object>} Catway créé
     */
    async createCatway(catwayData) {
        const newCatway = new Catway(catwayData);
        return await newCatway.save();
    }

    /**
     * Récupère un catway par son ID
     * @param {string} id - ID du catway
     * @returns {Promise<Object>} Catway trouvé
     * @throws {Error} Si le catway n'est pas trouvé
     */
    async getCatwayById(id) {
        const catway = await Catway.findById(id);
        if (!catway) {
            throw new Error('Catway non trouvé');
        }
        return catway;
    }

    /**
     * Met à jour un catway
     * @param {string} id - ID du catway
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Promise<Object>} Catway mis à jour
     * @throws {Error} Si le catway n'est pas trouvé
     */
    async updateCatway(id, updateData) {
        const updatedCatway = await Catway.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedCatway) {
            throw new Error('Catway non trouvé');
        }
        return updatedCatway;
    }

    /**
     * Supprime un catway
     * @param {string} id - ID du catway
     * @returns {Promise<Object>} Catway supprimé
     * @throws {Error} Si le catway a des réservations actives
     * @throws {Error} Si le catway n'est pas trouvé
     */
    async deleteCatway(id) {
        // Vérification de l'existence du catway
        const catway = await Catway.findById(id);
        if (!catway) {
            throw new Error('Catway non trouvé');
        }

        // Vérification des réservations actives
        const activeReservations = await Reservation.find({
            catwayNumber: catway.catwayNumber,
            checkOut: { $gte: new Date() }
        });

        if (activeReservations.length > 0) {
            throw new Error('Impossible de supprimer ce catway car il possède des réservations actives ou à venir');
        }

        // Suppression du catway
        return await Catway.findByIdAndDelete(id);
    }
}

module.exports = new CatwayService();