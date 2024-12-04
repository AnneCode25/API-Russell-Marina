const express = require('express');
const router = express.Router({ mergeParams: true }); // Important pour accéder aux paramètres du parent

// Importation future des contrôleurs
// const reservationController = require('../controllers/reservation.controller');

// GET /catways/:catwayId/reservations - Liste toutes les réservations d'un catway
router.get('/', (req, res) => {
    res.json({ 
        message: `Liste des réservations pour le catway ${req.params.catwayId} - À implémenter` 
    });
});

// GET /catways/:catwayId/reservations/:id - Obtient une réservation spécifique
router.get('/:id', (req, res) => {
    res.json({ 
        message: `Détails de la réservation ${req.params.id} du catway ${req.params.catwayId} - À implémenter` 
    });
});

// POST /catways/:catwayId/reservations - Crée une nouvelle réservation
router.post('/', (req, res) => {
    res.json({ 
        message: `Création d'une réservation pour le catway ${req.params.catwayId} - À implémenter` 
    });
});

// DELETE /catways/:catwayId/reservations/:id - Supprime une réservation
router.delete('/:id', (req, res) => {
    res.json({ 
        message: `Suppression de la réservation ${req.params.id} du catway ${req.params.catwayId} - À implémenter` 
    });
});

module.exports = router;