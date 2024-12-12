# Documentation de l'API du Port Russell

## Vue d'ensemble

L'API du Port Russell permet la gestion des catways (appontements) et des réservations pour un port de plaisance. Cette API RESTful offre des fonctionnalités complètes pour gérer les emplacements de bateaux et leur occupation.

### Authentification
L'API utilise l'authentification JWT (JSON Web Token). Un token doit être inclus dans le header `Authorization` de chaque requête sous la forme : `Bearer <token>`.

### Format des réponses
Toutes les réponses sont au format JSON avec les codes HTTP standards :
- 200 : Succès
- 201 : Création réussie
- 400 : Erreur de requête
- 401 : Non autorisé
- 404 : Ressource non trouvée
- 500 : Erreur serveur

## Tutoriel

### 1. Connexion à l'API
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### 2. Gestion des catways
#### Création d'un catway
```javascript
POST /api/catways
{
  "catwayNumber": "A12",
  "type": "long",
  "catwayState": "Bon état"
}
```

#### Modification d'un catway
```javascript
PUT /api/catways/:id
{
  "catwayState": "Nécessite réparation"
}
```

### 3. Gestion des réservations
#### Création d'une réservation
```javascript
POST /api/catways/:id/reservations
{
  "clientName": "Jean Dupont",
  "boatName": "Le Petit Prince",
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-15"
}
```

## Exemples

### Lister tous les catways
```javascript
GET /api/catways

Réponse :
{
  "catways": [
    {
      "id": "1",
      "catwayNumber": "A12",
      "type": "long",
      "catwayState": "Bon état"
    }
  ]
}
```

### Obtenir les réservations d'un catway
```javascript
GET /api/catways/1/reservations

Réponse :
{
  "reservations": [
    {
      "id": "1",
      "clientName": "Jean Dupont",
      "boatName": "Le Petit Prince",
      "checkIn": "2024-06-01",
      "checkOut": "2024-06-15"
    }
  ]
}
```

## Glossaire

- **Catway** : Petit appontement perpendiculaire au ponton principal permettant l'amarrage d'un bateau
- **Type de catway** : 
  - `long` : Pour les bateaux de plus grande taille
  - `short` : Pour les petites embarcations
- **État du catway** : Description de la condition physique de l'infrastructure
- **CheckIn** : Date de début de la réservation
- **CheckOut** : Date de fin de la réservation
- **JWT** : JSON Web Token, utilisé pour l'authentification