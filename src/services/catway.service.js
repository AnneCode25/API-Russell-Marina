// src/services/catway.service.js
const Catway = require('../models/catway.model');
const Reservation = require('../models/reservation.model');

class CatwayService {
    async getAllCatways() {
        return await Catway.find();
    }

    async createCatway(catwayData) {
        const newCatway = new Catway(catwayData);
        return await newCatway.save();
    }

    async getCatwayById(id) {
        const catway = await Catway.findById(id);
        if (!catway) {
            throw new Error('Catway non trouvé');
        }
        return catway;
    }

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