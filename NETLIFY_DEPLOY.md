# Déployer sur Netlify

Le fichier `netlify.toml` configure le site Vite et l’API de réservation en Netlify Function. Aucun serveur Express permanent n’est nécessaire.

## 1. Importer le projet

Publier le projet dans un dépôt Git, puis importer ce dépôt depuis Netlify (« Add new project » / « Import an existing project »).
Conserver la racine du dépôt comme répertoire de base, et inclure le dossier `patches`, `pnpm-lock.yaml` et `netlify/functions` dans le dépôt.

Les réglages sont déjà dans `netlify.toml` :

| Réglage | Valeur |
| --- | --- |
| Version Node.js | 22 |
| Gestionnaire | pnpm 10.34.5, fixé dans package.json |
| Build command | `pnpm run build:netlify` |
| Publish directory | `dist/public` |
| Functions directory | `netlify/functions` |

Utiliser l’import Git pour déployer ensemble le site et la fonction. Un simple glisser-déposer de `dist/public` ne publie pas l’API.

## 2. Activer les e-mails

Dans les variables d’environnement du projet Netlify, ajouter les valeurs suivantes, disponibles pour les **Functions** (ou tous les scopes si cette distinction n’est pas proposée) et le contexte de production :

- `RESEND_API_KEY` : clé du service d’envoi Resend.
- `BOOKING_EMAIL_FROM` : adresse d’expédition appartenant à un domaine vérifié dans Resend.
- `BOOKING_EMAIL_TO` : adresse du coach qui reçoit les demandes.

Ne pas mettre ces valeurs dans le dépôt ni les préfixer par `VITE_`. Les secrets des Functions se configurent dans Netlify, pas dans `netlify.toml`. Redéployer après modification.
Sans cette configuration, le site s’affiche mais le formulaire indique que les réservations sont indisponibles. Il n’affiche pas de faux succès.

## 3. Images

La photo principale fournie est déjà dans `client/public` et sera déployée automatiquement.
Les deux autres images (salle et fond des produits) utilisent encore le stockage Manus. Pour les conserver, configurer `BUILT_IN_FORGE_API_URL` et `BUILT_IN_FORGE_API_KEY` dans les variables des Functions. Ces valeurs ne sont pas présentes dans le projet actuel.

Pour supprimer cette dépendance, récupérer les deux images, les placer dans `client/public/images/`, puis remplacer `img.gym` et `img.products` dans `client/src/pages/Home.tsx` par leurs chemins publics (`/images/...`). Sans ces fichiers ou les identifiants Manus, ces deux images restent indisponibles.

Les statistiques sont facultatives. Configurer `VITE_ANALYTICS_ENDPOINT` et `VITE_ANALYTICS_WEBSITE_ID` au scope Builds uniquement si vous utilisez ce service.

## 4. Vérifier après déploiement

- Vérifier la page d’accueil, les liens Instagram/TikTok et les images.
- Envoyer une demande de visite test ; vérifier sa réception dans la boîte du coach, y compris les indésirables.
- Vérifier que « Répondre » dans l’e-mail cible le client.
- Le créneau reste une demande à confirmer par le coach, pas une disponibilité automatiquement bloquée.

La route `/api/bookings` est redirigée vers la fonction avant la règle de navigation React. Les routes API inconnues renvoient une erreur JSON.
La limite de cinq demandes par quinze minutes utilise l’IP de connexion fournie par Netlify et reste en mémoire **par instance** ; elle ne constitue pas une limite globale persistante entre toutes les instances serverless.

## Vérifications locales

`pnpm check`, `pnpm test`, puis `NETLIFY=true pnpm run build:netlify`.
Pour tester avec le routage Netlify complet, installer Netlify CLI et lancer `netlify dev` à la racine ; le site sera accessible sur le port 8888. Les variables locales vont dans `.env` (non versionné).

Références :
- https://docs.netlify.com/build/frameworks/framework-setup-guides/express/
- https://docs.netlify.com/build/functions/configuration/
- https://docs.netlify.com/build/configure-builds/manage-dependencies/
