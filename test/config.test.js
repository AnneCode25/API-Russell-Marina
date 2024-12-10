// test/config.test.js
require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

// Fonctions de configuration pour notre base de données de test
exports.setupDB = async () => {
    // Crée une instance de MongoDB en mémoire pour les tests
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
};

exports.clearDB = async () => {
    // Nettoie toutes les collections après chaque test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

exports.closeDB = async () => {
    // Ferme proprement les connexions après tous les tests
    await mongoose.disconnect();
    await mongod.stop();
};