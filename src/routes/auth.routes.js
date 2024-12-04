const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées par authentification
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/:id', authMiddleware, authController.updateUser);

// Routes protégées par authentification + admin
router.post('/register-admin', [authMiddleware, isAdmin], authController.registerAdmin);
router.delete('/:id', [authMiddleware, isAdmin], authController.deleteUser);

module.exports = router;