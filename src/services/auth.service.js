
//Import 
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Service de gestion de l'authentification et des utilisateurs
 * @class AuthService
 */
class AuthService {
    
    /**
     * Enregistre un nouvel utilisateur dans le système
     * @param {Object} userData - Données de l'utilisateur à créer
     * @param {string} userData.name - Nom de l'utilisateur
     * @param {string} userData.email - Email de l'utilisateur
     * @param {string} userData.password - Mot de passe de l'utilisateur
     * @returns {Promise<{token: string, user: Object}>} Token JWT et données utilisateur
     * @throws {Error} Si l'email est déjà utilisé
     */
    async register(userData) {
        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé.');
        }

        // Création du nouvel utilisateur
        const user = new User(userData);
        await user.save();

        // Génération du token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }

    /**
     * Authentifie un utilisateur
     * @param {string} email - Email de l'utilisateur
     * @param {string} password - Mot de passe de l'utilisateur
     * @returns {Promise<{token: string, user: Object}>} Token JWT et données utilisateur
     * @throws {Error} Si les identifiants sont incorrects
     */
    async login(email, password) {
        // Recherche de l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        // Vérification du mot de passe
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error('Email ou mot de passe incorrect.');
        }

        // Génération du token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }

    /**
     * Met à jour les informations d'un utilisateur
     * @param {string} userId - ID de l'utilisateur à mettre à jour
     * @param {Object} updates - Nouvelles données
     * @returns {Promise<Object>} Utilisateur mis à jour
     * @throws {Error} Si l'utilisateur n'est pas trouvé
     */
    async updateUser(userId, updates) {
        // Suppression du mot de passe des mises à jour pour sécurité
        delete updates.password;

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        return user;
    }

    /**
     * Supprime un utilisateur
     * @param {string} userId - ID de l'utilisateur à supprimer
     * @returns {Promise<Object>} Utilisateur supprimé
     * @throws {Error} Si l'utilisateur n'est pas trouvé
     */
    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }

    /**
     * Récupère le profil d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Données du profil utilisateur
     * @throws {Error} Si l'utilisateur n'est pas trouvé
     */
    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }

    /**
     * Génère un token JWT pour l'utilisateur
     * @private
     * @param {string} userId - ID de l'utilisateur
     * @returns {string} Token JWT généré
     */
    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }
}

module.exports = new AuthService();