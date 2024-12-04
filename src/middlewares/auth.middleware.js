const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé.' });
            }

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