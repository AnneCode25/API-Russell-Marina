// test/auth.test.js
const assert = require('assert');
const { setupDB, clearDB, closeDB } = require('./config.test');
const authService = require('../src/services/auth.service');
const User = require('../src/models/user.model');

describe('Auth Service', () => {
    before(async () => {
        await setupDB();
    });

    afterEach(async () => {
        await clearDB();
    });

    after(async () => {
        await closeDB();
    });

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
    };

    describe('register', () => {
        it('devrait créer un nouvel utilisateur avec succès', async () => {
            const result = await authService.register(testUser);
            assert(result.token, 'Le token devrait être généré');
            assert.strictEqual(result.user.name, testUser.name);
            assert.strictEqual(result.user.email, testUser.email);
            assert(!result.user.password, 'Le mot de passe ne devrait pas être renvoyé');
        });

        it('devrait échouer si l\'email existe déjà', async () => {
            await authService.register(testUser);
            
            await assert.rejects(
                async () => {
                    await authService.register(testUser);
                },
                (error) => {
                    assert(error.message.includes('déjà utilisé'));
                    return true;
                }
            );
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await authService.register(testUser);
        });

        it('devrait connecter un utilisateur avec succès', async () => {
            const result = await authService.login(testUser.email, testUser.password);
            assert(result.token, 'Le token devrait être généré');
            assert.strictEqual(result.user.email, testUser.email);
        });

        it('devrait échouer avec un mauvais mot de passe', async () => {
            await assert.rejects(
                async () => {
                    await authService.login(testUser.email, 'mauvaisMotDePasse');
                },
                (error) => {
                    assert(error.message.includes('incorrect'));
                    return true;
                }
            );
        });

        it('devrait échouer avec un email inexistant', async () => {
            await assert.rejects(
                async () => {
                    await authService.login('inexistant@example.com', testUser.password);
                },
                (error) => {
                    assert(error.message.includes('incorrect'));
                    return true;
                }
            );
        });
    });

    describe('updateUser', () => {
        let userId;

        beforeEach(async () => {
            const result = await authService.register(testUser);
            userId = result.user.id;
        });

        it('devrait mettre à jour les informations de l\'utilisateur', async () => {
            const updateData = { name: 'Updated Name' };
            const updatedUser = await authService.updateUser(userId, updateData);
            assert.strictEqual(updatedUser.name, updateData.name);
        });

        it('ne devrait pas permettre la mise à jour du mot de passe via cette méthode', async () => {
            const updateData = { password: 'NewPassword123!' };
            const updatedUser = await authService.updateUser(userId, updateData);
            assert(!updatedUser.password, 'Le mot de passe ne devrait pas être modifié');
        });
    });
});