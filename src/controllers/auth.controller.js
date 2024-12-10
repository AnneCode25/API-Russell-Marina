const authService = require('../services/auth.service');

const authController = {
    // Création d'un utilisateur
    register: async (req, res) => {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                ...result
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Connexion
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json({
                message: 'Connexion réussie',
                ...result
            });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    },

    // Modification d'un utilisateur
    updateUser: async (req, res) => {
        try {
            const user = await authService.updateUser(req.params.id, req.body);
            res.json({
                message: 'Utilisateur mis à jour avec succès',
                user
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Suppression d'un utilisateur
    deleteUser: async (req, res) => {
        try {
            await authService.deleteUser(req.params.id);
            res.json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    // Obtenir le profil utilisateur courant
    getProfile: async (req, res) => {
        try {
            const user = await authService.getProfile(req.user._id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
module.exports = authController;