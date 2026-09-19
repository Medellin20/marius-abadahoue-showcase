# Réservations de visites coaching

Le bouton « Réserver une visite » mène au formulaire. L’API POST /api/bookings valide les informations et transmet un e-mail à l’équipe via Resend. Le client propose un créneau ; le coach le confirme directement. Le bouton Répondre de l’e-mail cible l’adresse du client.

## Configuration

Node.js 22 ou plus récent. Installer les dépendances avec le gestionnaire du projet.
Copier `.env.example` vers `.env`, puis renseigner :

- `RESEND_API_KEY` : clé API Resend autorisée à envoyer des e-mails.
- `BOOKING_EMAIL_FROM` : adresse d’expédition sur un domaine vérifié dans Resend.
- `BOOKING_EMAIL_TO` : adresse du coach recevant les demandes.

Documentation du service : https://resend.com/docs/api-reference/emails/send-email

Développement : `npm run dev` (Vite charge le fichier `.env` côté serveur).
Production : `npm run build`, puis `NODE_ENV=production node --env-file=.env dist/index.js`, ou injecter les variables via l’hébergeur et lancer `npm start`.
Sur Netlify, le serveur est remplacé par une Function : suivre [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md). Un hébergement statique seul ne prend pas en charge l’envoi.

## Vérification

Exécuter `npm run check` et `npx vitest run server/bookings.test.ts`.
Après configuration, envoyer une demande de test depuis le formulaire et vérifier sa réception dans la boîte du coach (et les indésirables). Cette étape envoie un véritable e-mail.

Le succès indique l’acceptation par le service d’envoi ; la livraison finale peut être vérifiée dans Resend. En cas de configuration absente ou d’échec du prestataire, aucun succès n’est affiché. Le formulaire conserve ses champs pour réessayer.

Les données ne sont pas stockées dans une base ni journalisées par cette API. Elles sont transmises au prestataire d’envoi et à la boîte du coach. Le consentement est obligatoire. La limitation de cinq tentatives par adresse IP sur quinze minutes est en mémoire, par processus. En cas de plusieurs instances, prévoir une limitation partagée au niveau de l’hébergeur. Le serveur ne fait pas confiance aux en-têtes IP transmis par le client ; derrière un proxy, configurer les protections réseau adaptées à l’hébergement.
