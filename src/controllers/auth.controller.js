const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
    // Inscription
    register: async (req, res) => {
        try {
            const { email } = req.body;
            const existingUser = await User.findOne({ email });
            
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
                    email: user.email,
                    role: user.role
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
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtenir le profil
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Mettre à jour un utilisateur
    updateUser: async (req, res) => {
        try {
            const updates = req.body;
            delete updates.password;
            
            const user = await User.findByIdAndUpdate(
                req.params.id,
                updates,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }

            res.json({
                message: 'Utilisateur mis à jour avec succès',
                user
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Supprimer un utilisateur
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }

            res.json({ message: 'Utilisateur supprimé avec succès' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Créer un admin (accessible uniquement aux admins)
    registerAdmin: async (req, res) => {
        try {
            const { email } = req.body;
            const existingUser = await User.findOne({ email });
            
            if (existingUser) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }

            const user = new User({
                ...req.body,
                role: 'admin'
            });

            await user.save();

            res.status(201).json({
                message: 'Administrateur créé avec succès',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = authController;