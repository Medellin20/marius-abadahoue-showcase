# Installation et vérifications

Utiliser Node.js 22 et pnpm 10.34.5 (version indiquée dans `package.json`).
Installer avec `pnpm install --frozen-lockfile` afin de respecter les versions et les correctifs de `pnpm-lock.yaml`. Éviter de mélanger npm install et pnpm install.

Vérifications : `pnpm check`, `pnpm test`, `pnpm build`, `pnpm audit`.
Les tests de réservation utilisent un serveur HTTP local et simulent le service d’e-mail.

## Correctifs locaux

- `patches/wouter@3.7.1.patch` : correctif préexistant du routeur, conservé avec sa version exacte.
- `patches/zod@4.6.5.patch` : reformule deux commentaires explicatifs qui contenaient le marqueur d’annotation PURE. Rollup les interprétait à tort comme des annotations d’optimisation. Aucun code exécutable ni annotation effective n’est modifié. Réévaluer ce correctif lors d’une mise à jour de Zod.

## Statistiques facultatives

Laisser `VITE_ANALYTICS_ENDPOINT` et `VITE_ANALYTICS_WEBSITE_ID` vides pour désactiver le chargement du script. Quand les deux sont renseignés avec un endpoint HTTP(S) valide, le site charge le chemin `/umami` sous cet endpoint. Ces variables publiques sont intégrées à la compilation ; reconstruire le site après modification.
