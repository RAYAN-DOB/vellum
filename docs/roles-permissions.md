# Roles And Permissions

La V1.5 affiche un modele cible. Elle ne securise rien cote serveur.

## Roles

- Client : depose un projet, suit ses projets, repond aux questions.
- Manager : qualifie, assigne, prepare le devis.
- Architecte : produit, pose des questions, transmet un apercu.
- Admin : gouvernance, roles, activite, configuration future.

```mermaid
flowchart TD
  Admin["Admin"] --> Manager["Manager"]
  Manager --> Architect["Architecte / dessinateur"]
  Client["Client"] --> Manager
  Architect --> Client
```

```mermaid
flowchart TD
  Role["Role global"] --> ProjectRole["Role projet"]
  ProjectRole --> Assignment["Assignation"]
  Assignment --> ResourceState["Etat ressource"]
  ResourceState --> Permission["can(actor, action, resource)"]
  NDA["NDA"] --> Permission
  Org["Organisation"] --> Permission
```

## Actions futures

| Role | Projet | Documents | Messages | Devis |
| --- | --- | --- | --- | --- |
| Client | Ses projets | Fichiers autorises | Lire/repondre | Voir apres validation |
| Manager | Projets assignes | Qualifier | Coordonner | Preparer |
| Architecte | Projets assignes | Lire selon droits | Poser questions | Non |
| Admin | Gouvernance | Selon politique | Audit | Configurer |
