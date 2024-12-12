//Imports
const mongoose = require('mongoose');


/**
 * Schéma Mongoose pour les catways
 * @typedef {Object} CatwaySchema
 * @property {number} catwayNumber - Numéro unique du catway
 * @property {string} type - Type de catway ('long' ou 'short')
 * @property {string} catwayState - État actuel du catway
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de dernière modification
 */
const catwaySchema = new mongoose.Schema({
    // Numéro du pont (identifiant unique du catway)
    catwayNumber: {
        type: Number,
        required: [true, 'Un numéro de catway est requis'],
        unique: true,
        validate: {
            validator: Number.isInteger,
            message: 'Le numéro de catway doit être un nombre entier'
        }
    },
    // Type de catway (long ou short uniquement)
    type: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: {
            values: ['long', 'short'],
            message: 'Le type doit être soit "long" soit "short"'
        },
        lowercase: true // Convertit automatiquement en minuscules
    },
    // Description de l'état du catway
    catwayState: {
        type: String,
        required: [true, "Une description de l'état est requise"],
        trim: true,
        default: 'Bon état' // État par défaut
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt
});
// Index pour optimiser les recherches par numéro
catwaySchema.index({ catwayNumber: 1 });
const Catway = mongoose.model('Catway', catwaySchema);
module.exports = Catway;