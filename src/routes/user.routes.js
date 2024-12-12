// Imports
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const User = require('../models/user.model');

// Obtenir tous les utilisateurs
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Modifier un utilisateur
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        delete updates.password; // On ne modifie pas le mot de passe par cette route

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
});

// Supprimer un utilisateur
router.delete('/:id', authMiddleware, async (req, res) => {
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
});

module.exports = router;