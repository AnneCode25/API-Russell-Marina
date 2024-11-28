//Import
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    // Numéro du catway réservé
    catwayNumber: {
        type: Number,
        required: [true, 'Un numéro de catway est requis'],
        validate: {
            validator: Number.isInteger,
            message: 'Le numéro de catway doit être un nombre entier'
        }
    },

    // Nom du client qui réserve
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis'],
        trim: true
    },

    // Nom du bateau
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis'],
        trim: true
    },

    // Date de début de réservation
    checkIn: {
        type: Date,
        required: [true, 'La date de début est requise'],
        validate: {
            validator: function(value) {
                return value >= new Date(); // Vérifie que la date n'est pas dans le passé
            },
            message: 'La date de début ne peut pas être dans le passé'
        }
    },

    // Date de fin de réservation
    checkOut: {
        type: Date,
        required: [true, 'La date de fin est requise'],
        validate: {
            validator: function(value) {
                return value > this.checkIn; // Vérifie que la date de fin est après la date de début
            },
            message: 'La date de fin doit être après la date de début'
        }
    }
}, {
    timestamps: true
});

// Index composé pour optimiser les recherches de disponibilité
reservationSchema.index({ catwayNumber: 1, checkIn: 1, checkOut: 1 });

// Méthode statique pour vérifier la disponibilité d'un catway
reservationSchema.statics.checkAvailability = async function(catwayNumber, checkIn, checkOut) {
    const overlappingReservations = await this.find({
        catwayNumber,
        $or: [
            // Vérifie s'il y a des réservations qui se chevauchent
            { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
        ]
    });
    return overlappingReservations.length === 0;
};

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;