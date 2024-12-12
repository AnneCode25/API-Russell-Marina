//Imports
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware d'authentification vérifiant le JWT
 * @async
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne middleware
 * @returns {Promise<void>}
 * @throws {Error} Si le token est invalide ou manquant
 */
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Vérifier si le token est présent dans les headers
        const authHeader = req.headers.authorization;
       
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        }
        // 2.. Extraire le token
        const token = authHeader.split(' ')[1];
        try {
            // 3. Vérifier et décoder le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 4. Vérifier si l'utilisateur existe
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé.' });
            }
            // 5. Ajouter l'utilisateur à la requête pour une utilisation ultérieure
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token invalide ou expiré.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
    }
};
module.exports = authMiddleware;