# HackTrack

HackTrack est une application web permettant aux utilisateurs de consulter, rejoindre ou créer des équipes pour participer à des hackathons. Cette interface utilisateur est construite avec **React.js** et communique avec une API REST sécurisée.

## Fonctionnalités

- Affichage de la liste des hackathons avec pagination
- Affichage des 3 prochains hackathons sur la page d'accueil
- Authentification des utilisateurs (inscription, connexion via JWT)
- Création et adhésion à des équipes
- Accès conditionnel aux fonctionnalités selon l'état de connexion
- Navigation fluide entre les pages grâce à React Router

## Installation

### Étapes

1. Clonez le dépôt :

   ```bash
   git clone <https://github.com/hellodamien/hacktrack-api>
   cd hacktrack
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm start
   ```

L'application sera disponible à l'adresse `http://localhost:5173/`

## Structure du projet

```
hacktrack-frontend/
├── public/
│   └── vite.svg
├── src/
    ├── assets/             # Logo de l'application
│   ├── components/         # Navbar, Backbutton.
│   ├── context/            # AuthContext pour la gestion utilisateur
│   ├── pages/              # Pages principales (Home, Login, Register, Hackathons, TeamPage, HackathonsDetail)
│   ├── services/           # Fonctions fetch vers l'API
│   ├── App.js              # Définition des routes
│   └── main.jsx           # Entrée de l'application React
├── package.json            # Dépendances et scripts
└── README.md               # Documentation du projet
```

## Technologies utilisées

- **React** : Framework JS pour initialiser le projet
- **React Router** : Pour la navigation
- **Bootstrap** : Pour la mise en forme rapide et réactive
- **Zod + React Hook Form** : pour la gestion et la validation des formulaires
- **Context API** : pour la gestion de l'authentification
- **Fetch API** : Appels aux endpoints backend

## Authentification

- Authentification via **JWT** (token stocké dans le `localStorage`)
- Utilisation du `Context` pour vérifier la session utilisateur
- Les routes sensibles sont protégées selon l'état de connexion

## Aperçu de la page d'accueil

- Affiche uniquement les **3 hackathons à venir** (triés par date)
- Accès rapide à la liste complète des hackathons

## Licence

Ce projet est sous licence MIT.
