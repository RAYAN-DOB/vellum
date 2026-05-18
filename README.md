# PlanWork MVP

Plateforme web B2B pour structurer des demandes liees a des plans techniques, DWG, PDF, croquis, documents projet et livrables techniques.

## Objectif V1

La V1 sert de demo front statique et mockee pour valider :

- le positionnement produit ;
- les parcours principaux ;
- les espaces par role ;
- le suivi des demandes, projets et livrables ;
- l'approche future de confidentialite et permissions.

> Important : cette V1 est uniquement front-end, statique et mockee. Elle ne contient pas d'auth reelle, pas de backend, pas d'upload reel, pas de base de donnees et pas de securite serveur.

## Stack

- Next.js 16.2.6 avec App Router dans `src/app`
- React 19.2.4
- TypeScript strict
- Tailwind CSS 4
- ESLint 9
- `lucide-react`
- `clsx` et `tailwind-merge`

## Routes Disponibles

- `/` : landing page publique
- `/dashboard` : dashboard MVP
- `/dashboard/demandes/nouvelle` : creation de demande mockee
- `/dashboard/demandes/[requestId]` : detail demande
- `/dashboard/projets/[projectId]` : detail projet
- `/dashboard/livrables/[deliverableId]` : detail livrable
- `/dashboard/permissions` : matrice de permissions mockee
- `/client` : espace client
- `/chef-projet` : espace chef de projet
- `/dessinateur` : espace dessinateur
- `/admin` : espace admin simple

## Fonctionnalites Presentes

- Landing page responsive et presentable
- Navigation publique et workspace
- Dashboard avec statistiques mockees
- Listes de demandes, projets et livrables fictifs
- Formulaire de nouvelle demande sans upload reel
- Apercu dynamique de la demande cote front
- Vues par role : client, chef de projet, dessinateur, admin
- Pages de detail avec historique fictif
- Matrice de permissions affichee comme non securisee serveur
- Donnees mockees centralisees

## Limites Actuelles

- Pas d'authentification reelle
- Pas de backend
- Pas d'API
- Pas de base de donnees
- Pas d'upload reel
- Pas de stockage de fichiers
- Pas de permissions serveur effectives
- Pas de fichiers sensibles reels
- Pas de paiement, marketplace ou systeme d'encheres

## Prochaines Etapes V2

- Ajouter une authentification reelle
- Modeliser utilisateurs, organisations, projets et roles
- Ajouter une base de donnees
- Implementer les permissions cote serveur
- Preparer un stockage prive pour fichiers sensibles
- Ajouter un upload securise
- Ajouter journalisation et audit log
- Brancher de vrais workflows de statut et validation

## Commandes

Installer les dependances :

```bash
npm install
```

Lancer le projet :

```bash
npm run dev
```

Ouvrir :

```txt
http://localhost:3000
```

Verifier le projet :

```bash
npm run lint
npm run build
```

