//Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma Mongoose pour les utilisateurs
 * @typedef {Object} UserSchema
 * @property {string} name - Nom de l'utilisateur
 * @property {string} email - Email unique de l'utilisateur
 * @property {string} password - Mot de passe hashé
 * @property {Date} createdAt - Date de création
 * @property {Date} updatedAt - Date de dernière modification
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Un nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Un email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
    },
    password: {
        type: String,
        required: [true, 'Un mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});
// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
    // Ne hash le mot de passe que s'il a été modifié ou est nouveau
    if (!this.isModified('password')) return next();
   
    try {
        // Génère un salt et hash le mot de passe
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Compare le mot de passe fourni avec le hash stocké
 * @param {string} candidatePassword - Mot de passe à vérifier
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};
const User = mongoose.model('User', userSchema);
module.exports = User;