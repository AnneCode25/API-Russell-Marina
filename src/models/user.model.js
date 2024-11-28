//Imports
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma utilisateur
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
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
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

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;