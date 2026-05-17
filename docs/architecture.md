# Architecture

Ce projet garde une separation simple entre les routes Next.js, les composants reutilisables, la logique applicative, les types metier et les decisions de documentation.

## `src/app/`

Contient uniquement les routes, layouts et fichiers lies a Next.js App Router. Les pages doivent rester fines et deleguer les composants, donnees mockees et regles metier aux dossiers dedies.

## `src/components/`

Regroupe les composants React reutilisables. Les sous-dossiers separent les primitives UI, les elements de layout, les sections publiques, les widgets de dashboard, les formulaires et les composants metier.

## `src/lib/`

Contiendra la logique applicative partagee : permissions, donnees mockees, routes internes, utilitaires et fonctions non liees directement au rendu React.

## `src/types/`

Contiendra les types TypeScript partages pour les roles, permissions, projets, demandes, livrables et autres objets metier communs.

## `docs/`

Regroupe les notes de cadrage du MVP, les decisions d'architecture, les regles de securite et le modele cible des roles et permissions.

