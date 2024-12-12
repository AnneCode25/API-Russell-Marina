//Imports
const authService = require('../services/auth.service');

/**
 * Contrôleur gérant l'authentification et les utilisateurs
 * @namespace AuthController
 */
const authController = {

    /**
     * Enregistre un nouvel utilisateur
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} req.body - Corps de la requête
     * @param {string} req.body.name - Nom de l'utilisateur
     * @param {string} req.body.email - Email de l'utilisateur
     * @param {string} req.body.password - Mot de passe de l'utilisateur
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
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

    /**
     * Authentifie un utilisateur existant
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} req.body - Corps de la requête
     * @param {string} req.body.email - Email de l'utilisateur
     * @param {string} req.body.password - Mot de passe de l'utilisateur
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
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

    /**
     * Met à jour un utilisateur
     * @async
     * @param {Object} req - Requête Express
     * @param {Object} req.params - Paramètres de la requête
     * @param {string} req.params.id - ID de l'utilisateur
     * @param {Object} res - Réponse Express
     * @returns {Promise<void>}
     */
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