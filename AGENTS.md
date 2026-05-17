<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Objectif du projet

Ce projet est une plateforme web B2B pour gerer des demandes liees a des plans techniques, fichiers DWG, PDF, croquis, documents projet et livrables techniques.

L'objectif est de construire une base simple, propre et evolutive avant d'ajouter des fonctionnalites sensibles. Le produit doit pouvoir evoluer vers une plateforme avec espaces dedies, gestion stricte des permissions, confidentialite forte et cloisonnement par projet.

# Stack actuelle

- Next.js 16.2.6 avec App Router dans `src/app`.
- React 19.2.4 et React DOM 19.2.4.
- TypeScript avec configuration stricte.
- Tailwind CSS 4.
- ESLint 9 avec `eslint-config-next`.
- `lucide-react` pour les icones.
- `framer-motion` installe, a utiliser seulement si une interaction le justifie.
- `clsx` et `tailwind-merge` pour composer les classes CSS.

# Vision long terme

La vision long terme inclut :

- comptes utilisateurs ;
- roles ;
- permissions ;
- fichiers sensibles ;
- projets ;
- briefs ;
- livrables ;
- corrections ;
- notation ;
- dashboards ;
- espace admin ;
- espace chef de projet ;
- espace dessinateur ;
- espace client ;
- confidentialite ;
- NDA ;
- cloisonnement strict des projets.

# Perimetre MVP

Le MVP doit rester simple, mais preparer correctement l'avenir.

Le MVP doit prevoir :

- pages publiques ;
- structure propre ;
- design system ;
- dashboards simples ;
- creation de demande ;
- espace chef de projet ;
- espace dessinateur ;
- espace admin simple ;
- securite des permissions anticipee.

Au MVP, utiliser uniquement des donnees mockees et des objets fictifs. Les ecrans peuvent simuler les parcours, mais ne doivent pas pretendre fournir une securite reelle ou un stockage sensible reel.

# Exclusions MVP

Ne pas ajouter dans le MVP :

- paiement ;
- Stripe ;
- escrow ;
- abonnement ;
- matching automatique IA ;
- visio native ;
- application mobile ;
- marketplace ouverte ;
- systeme d'encheres ;
- auth reelle maintenant ;
- upload reel de fichiers sensibles maintenant.

# Regles securite fichiers sensibles

- Ne jamais mettre de fichiers sensibles dans `public/`.
- Ne jamais exposer des fichiers ou donnees projet sans controle serveur.
- Ne pas creer de fausse securite uniquement cote front.
- Utiliser uniquement des donnees mockees au MVP.
- Ne jamais commiter de vrais DWG, PDF client, plans, croquis ou documents confidentiels.
- Ne jamais ajouter de documents projet reels, meme pour tester l'interface.
- Les exemples de fichiers doivent etre fictifs et clairement non sensibles.
- Les futurs fichiers devront etre controles par serveur, permissions, journalisation et URLs non publiques.

# Regles roles et permissions

- Ne pas disperser les verifications de role partout dans les pages.
- Centraliser plus tard la logique de permissions dans `src/lib/permissions`.
- Prevoir un modele conceptuel `can(actor, action, resource)`.
- Differencier role global, role projet, assignation et etat de la ressource.
- Les restrictions UI ne suffisent jamais : toute action serveur future devra refaire ses controles.
- Les espaces client, chef de projet, dessinateur et admin doivent partager les memes objets metier lorsque c'est possible.
- Eviter de dupliquer l'application par role ; privilegier des vues specialisees sur un modele commun.

# Structure cible recommandee

Ne pas creer toute cette structure d'un coup. Elle sert de direction.

```txt
src/
  app/                 routes Next uniquement
  components/          UI reutilisable et composants metier
  lib/                 logique applicative, permissions, mock data, utils
  types/               types metier partages
  docs/                decisions produit, securite, roles, MVP
```

Structure de routes cible possible :

```txt
src/app/
  (public)/            pages publiques
  (workspace)/         dashboard et espaces operationnels
  (admin)/             administration simple
```

Structure `components/` cible possible :

```txt
src/components/
  ui/                  composants primitifs
  layout/              shells, headers, sidebars
  marketing/           sections publiques
  dashboard/           widgets et vues de synthese
  forms/               formulaires metier
  domain/              composants metier projet/demande/livrable
```

Structure `lib/`, `types/` et `docs/` cible possible :

```txt
src/lib/
  permissions.ts
  mock-data.ts
  routes.ts
  utils.ts

src/types/
  roles.ts
  permissions.ts
  project.ts
  request.ts
  deliverable.ts

docs/
  mvp.md
  architecture.md
  roles-permissions.md
  security-files.md
```

# Regles de developpement pour Codex

- Ne pas recreer le projet.
- Ne pas modifier `package.json` sans demande explicite.
- Ne pas ajouter de dependance sans justification forte.
- Lire les docs locales Next dans `node_modules/next/dist/docs/` avant toute modification qui touche Next.js, notamment routing, layouts, metadata, Server Components, Client Components, actions, route handlers, cache, proxy ou auth.
- Tenir compte de Next.js 16.2.6 : ne pas supposer les conventions d'anciennes versions.
- Garder les changements petits et coherents.
- Ne pas melanger refonte UI, architecture, permissions et donnees dans un seul changement.
- Preferer les Server Components par defaut ; ajouter `"use client"` uniquement pour les composants interactifs qui en ont besoin.
- Ne pas mettre de logique sensible dans des composants client.
- Ne pas creer de page, dossier ou API hors perimetre demande.
- Les prochaines taches doivent etre petites, testees et commitees quand l'utilisateur le demande.

# Commandes utiles

- `npm run dev` : demarrer le serveur de developpement.
- `npm run lint` : lancer ESLint.
- `npm run build` : verifier la compilation de production.
- `git status --short --branch` : verifier l'etat Git.

# Definition d'une tache terminee

Une tache est terminee quand :

- le perimetre demande est respecte ;
- aucun fichier hors perimetre n'a ete modifie ;
- les donnees sensibles reelles sont absentes ;
- les conventions Next locales ont ete respectees ;
- les controles pertinents ont ete lances ou les limites de verification sont signalees ;
- l'etat Git est compris ;
- les changements sont suffisamment petits pour etre relus facilement ;
- un commit peut etre fait proprement si l'utilisateur le demande.
