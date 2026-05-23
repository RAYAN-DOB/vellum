# Roles And Permissions

La V1.5 affiche une matrice de permissions cible. Elle ne securise rien cote serveur. Les restrictions UI sont seulement pedagogiques.

## Roles

- Client : depose un projet, suit ses dossiers, repond aux questions, valide un apercu futur.
- Manager : qualifie, priorise, assigne, prepare devis et validation.
- Architecte / dessinateur : analyse documents, pose questions, prepare apercus et livrables.
- Admin : gouvernance, roles, permissions, activite et configuration future.

## Surfaces V1.5 par role

- Client : `/client`, `/client/nouveau-projet`, `/client/projets`, `/client/messages`, `/client/parametres`.
- Manager : `/chef-projet`, `/chef-projet/devis`.
- Architecte / dessinateur : `/dessinateur`.
- Admin : `/admin` et `/dashboard/permissions`.

Le switcher de role est un outil de demonstration. Il ne modifie aucun token, aucune session et aucun droit reel.

```mermaid
flowchart TD
  Project["Projet"] --> Client["Client"]
  Project --> Manager["Manager"]
  Project --> Architect["Architecte / dessinateur"]
  Project --> Admin["Admin"]
  Client --> ClientActions["Voir ses projets / completer / valider"]
  Manager --> ManagerActions["Qualifier / assigner / suivre"]
  Architect --> ArchitectActions["Produire / questionner / livrer"]
  Admin --> AdminActions["Gouverner / auditer / configurer"]
```

## Modele cible

```mermaid
flowchart LR
  User["Utilisateur"] --> GlobalRole["Role global"]
  GlobalRole --> Org["Organisation"]
  Org --> ProjectRole["Role dans projet"]
  ProjectRole --> Assignment["Assignation"]
  Assignment --> Resource["Projet / fichier / message / livrable"]
  Resource --> Policy["can(actor, action, resource)"]
  Policy --> Audit["Journalisation V2"]
```

## Regle non negociable

Toute action sensible devra etre verifiee cote serveur en V2 : lecture fichier, upload, telechargement, message, livrable, devis, paiement et administration.
