// Imports
const assert = require('assert');
const { setupDB, clearDB, closeDB } = require('./config.test');
const authService = require('../src/services/auth.service');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('Authentication and User Management', () => {
    // Configuration de la base de données de test
    before(async () => {
        await setupDB();
    });

    // Nettoyage après chaque test
    afterEach(async () => {
        await clearDB();
    });

    // Fermeture de la base de données
    after(async () => {
        await closeDB();
    });

    // Données de test pour les utilisateurs
    const testUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!'
    };

    // Tests pour l'enregistrement (register)
    describe('register', () => {
        it('devrait créer un nouvel utilisateur', async () => {
            const result = await authService.register(testUser);

            // Vérification des données retournées
            assert(result.token, 'Un token JWT devrait être généré');
            assert.strictEqual(result.user.name, testUser.name);
            assert.strictEqual(result.user.email, testUser.email);
            assert(!result.user.password, 'Le mot de passe ne doit pas être renvoyé');

            // Vérifions que le token est valide
            const decodedToken = jwt.verify(result.token, process.env.JWT_SECRET);
            assert(decodedToken.userId, 'Le token devrait contenir l\'ID utilisateur');
        });

        it('devrait empêcher la création d\'un utilisateur avec un email déjà utilisé', async () => {
            // Premier enregistrement
            await authService.register(testUser);

            // Tentative avec le même email
            await assert.rejects(
                async () => {
                    await authService.register(testUser);
                },
                error => {
                    assert(error.message.includes('déjà utilisé'));
                    return true;
                }
            );
        });
    });

    // Tests pour la connexion (login)
    describe('login', () => {
        beforeEach(async () => {
            // Création d'un utilisateur avant chaque test de connexion
            await authService.register(testUser);
        });

        it('devrait connecter un utilisateur existant', async () => {
            const result = await authService.login(testUser.email, testUser.password);
            assert(result.token, 'Un token JWT devrait être généré');
            assert.strictEqual(result.user.email, testUser.email);
        });

        it('devrait refuser la connexion avec un mauvais mot de passe', async () => {
            await assert.rejects(
                async () => {
                    await authService.login(testUser.email, 'mauvaisMotDePasse');
                },
                error => {
                    assert(error.message.includes('incorrect'));
                    return true;
                }
            );
        });

        it('devrait refuser la connexion avec un email inconnu', async () => {
            await assert.rejects(
                async () => {
                    await authService.login('inconnu@example.com', testUser.password);
                },
                error => {
                    assert(error.message.includes('incorrect'));
                    return true;
                }
            );
        });
    });

    // Tests pour la mise à jour d'utilisateur (updateUser)
    describe('updateUser', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.register(testUser);
            userId = result.user.id;
        });

        it('devrait mettre à jour les informations de base', async () => {
            const updateData = { name: 'John Updated' };
            const updated = await authService.updateUser(userId, updateData);
            assert.strictEqual(updated.name, updateData.name);
            assert.strictEqual(updated.email, testUser.email);
        });

        it('devrait protéger le mot de passe lors des mises à jour', async () => {
            const updateData = { password: 'NewPassword123' };
            const updated = await authService.updateUser(userId, updateData);
            
            // Vérifions que l'ancien mot de passe fonctionne toujours
            const loginResult = await authService.login(testUser.email, testUser.password);
            assert(loginResult.token, 'La connexion devrait fonctionner avec l\'ancien mot de passe');
        });
    });

    // Tests pour la suppression d'utilisateur (deleteUser)
    describe('deleteUser', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.register(testUser);
            userId = result.user.id;
        });

        it('devrait supprimer un utilisateur', async () => {
            await authService.deleteUser(userId);

            // Vérifions que l'utilisateur n'existe plus
            await assert.rejects(
                async () => {
                    await authService.login(testUser.email, testUser.password);
                },
                error => {
                    assert(error.message.includes('incorrect'));
                    return true;
                }
            );
        });

        it('devrait échouer pour un ID inexistant', async () => {
            await assert.rejects(
                async () => {
                    await authService.deleteUser('507f1f77bcf86cd799439011');
                },
                error => {
                    assert(error.message.includes('non trouvé'));
                    return true;
                }
            );
        });
    });

    // Tests pour la récupération du profil (getProfile)
    describe('getProfile', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.register(testUser);
            userId = result.user.id;
        });

        it('devrait retourner le profil utilisateur', async () => {
            const profile = await authService.getProfile(userId);
            assert.strictEqual(profile.email, testUser.email);
            assert.strictEqual(profile.name, testUser.name);
            assert(!profile.password, 'Le mot de passe ne doit pas être inclus');
        });
    });
});