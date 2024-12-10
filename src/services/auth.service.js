// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthService {
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

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }

    async getProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    }

    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }
}

module.exports = new AuthService();