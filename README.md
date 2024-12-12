# API Port de Plaisance Russell

API de gestion des catways et des réservations pour le port de plaisance Russell. Cette application permet la gestion complète des emplacements de bateaux et de leurs réservations avec un système d'authentification sécurisé.

## Prérequis

- Node.js (v22.11.0)
- npm (10.9.0)

### Dépendances principales :
- express: ^4.21.1
- mongoose: ^8.8.3
- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.0.2
- ejs: ^3.1.10

### Dépendances de développement :
- mocha: ^10.8.2
- nodemon: ^3.1.7

## Installation

1. Cloner le repository
```bash
git clone [votre-url-repository]
cd russell-marina-api
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Le fichier `.env` est déjà inclus dans le repository..

## Scripts disponibles

```bash
# Démarrer en mode développement avec nodemon
npm run dev

# Démarrer en mode production
npm start

# Lancer les tests
npm test
```

## Structure du projet

```
├── public/
│   └── js/               # Scripts clients
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Contrôleurs
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API
│   ├── services/       # Services métier
│   └── views/          # Vues EJS
└── test/               # Tests
```

## API Documentation

Une documentation complète de l'API est disponible à l'adresse `/documentation` une fois l'application lancée.

## Base de données

L'application utilise MongoDB comme base de données. Les principales collections sont :
- Users (Utilisateurs)
- Catways (Emplacements)
- Reservations (Réservations)

## Tests

Les tests sont écrits avec Mocha. Pour les exécuter :
```bash
npm test
```

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amélioration`)
3. Commit les changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amélioration`)
5. Ouvrir une Pull Request

## Auteur

Anne Villette
