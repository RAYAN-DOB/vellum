# Guide Demo V1 - PlanWork MVP

## Pitch Court

PlanWork est une plateforme B2B pour centraliser les demandes liees aux plans techniques, DWG, PDF, croquis, documents projet et livrables.

## Probleme

Les projets techniques sont souvent suivis dans des emails, fichiers joints, messages disperses et versions locales. Cela cree de la confusion sur les statuts, les responsabilites, les livrables attendus et la confidentialite des documents.

## Solution

La plateforme propose un espace structure pour suivre les projets, demandes, livrables, roles et futures permissions. La V1 montre le parcours produit et l'organisation cible, sans manipuler de vrais fichiers sensibles.

## Parcours De Demo Conseille

1. Presenter la landing page et le positionnement.
2. Montrer le dashboard global.
3. Ouvrir le parcours Nouvelle demande.
4. Montrer une demande detaillee avec historique.
5. Montrer un projet detaille.
6. Montrer un livrable detaille.
7. Montrer les vues par role.
8. Terminer par la matrice de permissions mockee.

## Routes A Montrer Dans L'ordre

- `/`
- `/dashboard`
- `/dashboard/demandes/nouvelle`
- `/dashboard/demandes/request-demo-001`
- `/dashboard/projets/project-demo-001`
- `/dashboard/livrables/deliverable-demo-001`
- `/client`
- `/chef-projet`
- `/dessinateur`
- `/admin`
- `/dashboard/permissions`

## Deja Present Dans La V1

- Landing page publique responsive
- Dashboard MVP
- Formulaire de creation de demande mocke
- Apercu de demande cote front
- Listes de projets, demandes et livrables fictifs
- Pages de detail avec historique fictif
- Vues client, chef de projet, dessinateur et admin
- Matrice de permissions mockee
- Donnees fictives centralisees

## Volontairement Mocke

- Donnees utilisateurs
- Projets
- Demandes
- Livrables
- Historique
- Permissions
- Statuts
- Noms de fichiers fictifs

## Limites Actuelles

- Pas d'authentification reelle
- Pas de backend
- Pas d'API
- Pas de base de donnees
- Pas d'upload reel
- Pas de stockage de fichiers
- Pas de securite serveur
- Pas de gestion reelle des permissions
- Aucun vrai DWG, PDF, plan ou document confidentiel

## Roadmap V2

- Authentification
- Comptes utilisateurs et organisations
- Base de donnees
- Permissions serveur
- Stockage prive des fichiers
- Upload securise
- Audit log
- Workflows de validation
- Gestion fine des roles projet

## Phrase De Cadrage

Cette V1 n'est pas une version production : c'est une demo front-end statique et mockee pour valider le produit, le parcours et l'architecture avant d'ajouter backend, authentification, upload et securite serveur.

