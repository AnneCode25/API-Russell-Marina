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
module.exports = router;