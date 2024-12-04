const Catway = require('../models/catway.model');

// Ce contrôleur contient toutes les méthodes pour gérer les catways
const catwayController = {
    // Obtenir la liste de tous les catways
    getAllCatways: async (req, res) => {
        try {
            const catways = await Catway.find();
            res.status(200).json(catways);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Créer un nouveau catway
    createCatway: async (req, res) => {
        try {
            // Création d'un nouveau catway avec les données de la requête
            const newCatway = new Catway(req.body);
            
            // Sauvegarde dans la base de données
            const savedCatway = await newCatway.save();
            
            // Réponse avec le catway créé
            res.status(201).json(savedCatway);
        } catch (error) {
            // En cas d'erreur de validation ou autre
            res.status(400).json({ message: error.message });
        }
    },

    // Obtenir un catway spécifique par son ID
    getCatwayById: async (req, res) => {
        try {
            const catway = await Catway.findById(req.params.id);
            if (!catway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.status(200).json(catway);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Mettre à jour un catway
    updateCatway: async (req, res) => {
        try {
            const updatedCatway = await Catway.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedCatway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.status(200).json(updatedCatway);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Supprimer un catway
    deleteCatway: async (req, res) => {
        try {
            const deletedCatway = await Catway.findByIdAndDelete(req.params.id);
            if (!deletedCatway) {
                return res.status(404).json({ message: 'Catway non trouvé' });
            }
            res.status(200).json({ message: 'Catway supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = catwayController;