//Imports
const catwayService = require('../services/catway.service');

/**
 * Contrôleur gérant les catways
 * @namespace CatwayController
 */
const catwayController = {

    /**
     * Récupère tous les catways
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
    getAllCatways: async (req, res) => {
        try {
            const catways = await catwayService.getAllCatways();
            res.status(200).json(catways);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Crée un nouveau catway
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} req.body - Données du catway
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
    createCatway: async (req, res) => {
        try {
            const savedCatway = await catwayService.createCatway(req.body);
            res.status(201).json(savedCatway);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Obtenir un catway par son ID
    getCatwayById: async (req, res) => {
        try {
            const catway = await catwayService.getCatwayById(req.params.id);
            res.status(200).json(catway);
        } catch (error) {
            if (error.message === 'Catway non trouvé') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    },

    // Mettre à jour un catway
    updateCatway: async (req, res) => {
        try {
            const updatedCatway = await catwayService.updateCatway(req.params.id, req.body);
            res.status(200).json(updatedCatway);
        } catch (error) {
            if (error.message === 'Catway non trouvé') {
                res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    },

    // Supprimer un catway
    deleteCatway: async (req, res) => {
        try {
            await catwayService.deleteCatway(req.params.id);
            res.status(200).json({ message: 'Catway supprimé avec succès' });
        } catch (error) {
            if (error.message === 'Catway non trouvé') {
                res.status(404).json({ message: error.message });
            } else if (error.message.includes('réservations actives')) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }
};

module.exports = catwayController;