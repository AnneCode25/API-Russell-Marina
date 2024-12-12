// Imports
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/:id', authMiddleware, authController.updateUser);
router.delete('/:id', authMiddleware, authController.deleteUser);
router.get('/', authMiddleware, async (req, res) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    
module.exports = router;