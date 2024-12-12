// Imports
const assert = require('assert');
const { setupDB, clearDB, closeDB } = require('./config.test');
const reservationService = require('../src/services/reservation.service');
const Catway = require('../src/models/catway.model');
const Reservation = require('../src/models/reservation.model');

describe('Reservation Service', () => {
    // Configuration initiale de la base de données
    before(async () => {
        await setupDB();
    });

    // Nettoyage après chaque test
    afterEach(async () => {
        await clearDB();
    });

    // Fermeture finale de la base de données
    after(async () => {
        await closeDB();
    });

    // Données de test réutilisables
    const testCatway = {
        catwayNumber: 1,
        type: 'long',
        catwayState: 'Bon état'
    };

    // Fonction utilitaire pour créer des dates de test
    const createTestDates = () => {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 1); // Date de début: demain
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 3); // Date de fin: dans 3 jours
        return { checkIn, checkOut };
    };

    describe('getAllReservations', () => {
        it('devrait retourner un tableau vide quand il n\'y a pas de réservations', async () => {
            const reservations = await reservationService.getAllReservations();
            assert.strictEqual(Array.isArray(reservations), true);
            assert.strictEqual(reservations.length, 0);
        });

        it('devrait retourner toutes les réservations existantes', async () => {
            // Création d'un catway et d'une réservation pour le test
            const catway = await new Catway(testCatway).save();
            const { checkIn, checkOut } = createTestDates();
            
            await new Reservation({
                catwayNumber: catway.catwayNumber,
                clientName: 'Test Client',
                boatName: 'Test Boat',
                checkIn,
                checkOut
            }).save();

            const reservations = await reservationService.getAllReservations();
            assert.strictEqual(reservations.length, 1);
            assert.strictEqual(reservations[0].clientName, 'Test Client');
        });
    });

    describe('createReservation', () => {
        it('devrait créer une nouvelle réservation avec succès', async () => {
            const catway = await new Catway(testCatway).save();
            const { checkIn, checkOut } = createTestDates();
            
            const reservationData = {
                catwayNumber: catway.catwayNumber,
                clientName: 'Test Client',
                boatName: 'Test Boat',
                checkIn,
                checkOut
            };

            const reservation = await reservationService.createReservation(reservationData);
            assert.strictEqual(reservation.catwayNumber, catway.catwayNumber);
            assert.strictEqual(reservation.clientName, 'Test Client');
            assert.strictEqual(reservation.boatName, 'Test Boat');
        });

        it('devrait échouer si les dates se chevauchent avec une réservation existante', async () => {
            const catway = await new Catway(testCatway).save();
            const { checkIn, checkOut } = createTestDates();
            
            // Première réservation
            await reservationService.createReservation({
                catwayNumber: catway.catwayNumber,
                clientName: 'Client 1',
                boatName: 'Boat 1',
                checkIn,
                checkOut
            });

            // Tentative de réservation aux mêmes dates
            await assert.rejects(
                async () => {
                    await reservationService.createReservation({
                        catwayNumber: catway.catwayNumber,
                        clientName: 'Client 2',
                        boatName: 'Boat 2',
                        checkIn,
                        checkOut
                    });
                },
                (error) => {
                    assert(error.message.includes('n\'est pas disponible'));
                    return true;
                }
            );
        });
    });

    describe('deleteReservation', () => {
        it('devrait supprimer une réservation existante', async () => {
            const catway = await new Catway(testCatway).save();
            const { checkIn, checkOut } = createTestDates();
            
            const reservation = await new Reservation({
                catwayNumber: catway.catwayNumber,
                clientName: 'Test Client',
                boatName: 'Test Boat',
                checkIn,
                checkOut
            }).save();

            await reservationService.deleteReservation(reservation._id);
            const found = await Reservation.findById(reservation._id);
            assert.strictEqual(found, null);
        });

        it('devrait échouer pour un ID inexistant', async () => {
            await assert.rejects(
                async () => {
                    await reservationService.deleteReservation('507f1f77bcf86cd799439011');
                },
                (error) => {
                    assert.strictEqual(error.message, 'Réservation non trouvée');
                    return true;
                }
            );
        });
    });
});