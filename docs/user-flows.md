# User Flows

## Parcours client

```mermaid
journey
  title Depot et suivi d'un projet technique
  section Decouverte
    Comprend la promesse sur la landing: 4: Client
    Lance le cockpit de depot: 5: Client
  section Depot
    Decrit le besoin dans le chat: 5: Client
    Prepare les documents fictifs: 4: Client
    Consulte la synthese: 4: Client
  section Suivi
    Suit le statut du projet: 4: Client
    Repond aux questions: 4: Client
    Valide un apercu futur: 3: Client
```

## Parcours intake V1.5

```mermaid
flowchart TD
  Start["/client/nouveau-projet"] --> Capture["Capture box Lazy-inspired"]
  Capture --> Chips["Types documents fictifs"]
  Capture --> Summary["Synthese projet mockee"]
  Summary --> Send["Envoyer a l'equipe"]
  Send --> Transition["Transition analyse / transmission"]
  Transition --> Project["/client/projets/project-demo-001"]
```

## Parcours demo complet

```mermaid
flowchart LR
  Client["Client depose"] --> Manager["Manager qualifie"]
  Manager --> Quote["Devis mocke"]
  Manager --> Architect["Architecte produit"]
  Architect --> Viewer["Viewer document"]
  Viewer --> ClientReview["Client valide / corrige"]
  ClientReview --> Delivery["Livrables V2"]
```

## Parcours manager

```mermaid
flowchart TD
  Incoming["Demande entrante"] --> Qualify["Qualification"]
  Qualify --> Scope["Scope / formats / priorite"]
  Scope --> Capacity["Lecture charge equipe"]
  Capacity --> Assign["Assignation mockee"]
  Assign --> Quote["Devis futur"]
```

## Parcours architecte

```mermaid
flowchart TD
  Assigned["Projet assigne"] --> ReadDocs["Analyse documents mockes"]
  ReadDocs --> Questions["Questions client"]
  Questions --> Preview["Apercu a preparer"]
  Preview --> Version["Version / livrable fictif"]
  Version --> Review["Retour manager / client"]
```
