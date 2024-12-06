const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const authController = {
    // Création d'un utilisateur
    register: async (req, res) => {
        try {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            const user = new User(req.body);
            await user.save();
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    // Connexion
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
           
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
            }
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.json({
                message: 'Connexion réussie',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Modification d'un utilisateur
    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const updates = req.body;
            delete updates.password; // Empêche la modification du mot de passe par cette route
            const user = await User.findByIdAndUpdate(
                userId,
                updates,
                { new: true, runValidators: true }
            ).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
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
            const userId = req.params.id;
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            res.json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Obtenir le profil utilisateur courant
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
module.exports = authController;