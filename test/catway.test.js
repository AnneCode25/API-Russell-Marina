// Imports
const assert = require('assert');
const { setupDB, clearDB, closeDB } = require('./config.test');
const catwayService = require('../src/services/catway.service');
const Catway = require('../src/models/catway.model');
const Reservation = require('../src/models/reservation.model');

// Groupe de tests pour le service Catway
describe('Catway Service', () => {
    // Configuration de la base de données avant tous les tests
    before(async () => {
        await setupDB();
    });

    // Nettoyage de la base après chaque test
    afterEach(async () => {
        await clearDB();
    });

    // Fermeture de la base après tous les tests
    after(async () => {
        await closeDB();
    });

    // Données de test
    const testCatway = {
        catwayNumber: 1,
        type: 'long',
        catwayState: 'Bon état'
    };

    // Tests pour getAllCatways
    describe('getAllCatways', () => {
        it('devrait retourner un tableau vide quand il n\'y a pas de catways', async () => {
            const catways = await catwayService.getAllCatways();
            assert.strictEqual(Array.isArray(catways), true);
            assert.strictEqual(catways.length, 0);
        });

        it('devrait retourner tous les catways existants', async () => {
            await new Catway(testCatway).save();
            const catways = await catwayService.getAllCatways();
            assert.strictEqual(catways.length, 1);
            assert.strictEqual(catways[0].catwayNumber, testCatway.catwayNumber);
        });
    });

    // Tests pour createCatway
    describe('createCatway', () => {
        it('devrait créer un nouveau catway avec succès', async () => {
            const catway = await catwayService.createCatway(testCatway);
            assert.strictEqual(catway.catwayNumber, testCatway.catwayNumber);
            assert.strictEqual(catway.type, testCatway.type);
            assert.strictEqual(catway.catwayState, testCatway.catwayState);
        });

        it('devrait échouer si le numéro de catway existe déjà', async () => {
            await new Catway(testCatway).save();
            
            // On s'attend à ce que cette opération échoue
            await assert.rejects(
                async () => {
                    await catwayService.createCatway(testCatway);
                },
                Error
            );
        });
    });

    // Tests pour deleteCatway
    describe('deleteCatway', () => {
        it('devrait supprimer un catway sans réservations', async () => {
            const catway = await new Catway(testCatway).save();
            await catwayService.deleteCatway(catway._id);
            const found = await Catway.findById(catway._id);
            assert.strictEqual(found, null);
        });

        it('ne devrait pas supprimer un catway avec des réservations actives', async () => {
            const catway = await new Catway(testCatway).save();
            
            // Création de dates futures pour la réservation
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1); // Date de début : demain
            
            const dayAfterTomorrow = new Date();
            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2); // Date de fin : après-demain
            
            // Création d'une réservation active avec des dates futures
            await new Reservation({
                catwayNumber: catway.catwayNumber,
                clientName: 'Test Client',
                boatName: 'Test Boat',
                checkIn: tomorrow,
                checkOut: dayAfterTomorrow
            }).save();
        
            // On s'attend à ce que la suppression échoue
            await assert.rejects(
                async () => {
                    await catwayService.deleteCatway(catway._id);
                },
                (error) => {
                    assert(error.message.includes('réservations actives'));
                    return true;
                }
            );
        });
    });

    // Tests pour updateCatway
    describe('updateCatway', () => {
        it('devrait mettre à jour un catway avec succès', async () => {
            const catway = await new Catway(testCatway).save();
            const updateData = { catwayState: 'Nécessite réparation' };
            
            const updated = await catwayService.updateCatway(catway._id, updateData);
            assert.strictEqual(updated.catwayState, updateData.catwayState);
        });

        it('devrait échouer pour un ID inexistant', async () => {
            await assert.rejects(
                async () => {
                    await catwayService.updateCatway('507f1f77bcf86cd799439011', { catwayState: 'Test' });
                },
                (error) => {
                    assert.strictEqual(error.message, 'Catway non trouvé');
                    return true;
                }
            );
        });
    });
});