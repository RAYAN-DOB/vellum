# Workflow

## Cycle de vie projet

```mermaid
stateDiagram-v2
  [*] --> Depot
  Depot --> Qualification
  Qualification --> Assignation
  Assignation --> Production
  Production --> Apercu
  Apercu --> Devis
  Devis --> PaiementV2
  PaiementV2 --> LivraisonSecurisee
  LivraisonSecurisee --> [*]
```

## Sequence cible

```mermaid
sequenceDiagram
  participant C as Client
  participant M as Manager
  participant A as Architecte
  participant S as Systeme V2
  C->>S: Depose projet et documents
  S->>M: Notifie demande entrante
  M->>M: Qualifie besoin et confidentialite
  M->>A: Assigne selon charge et competence
  A->>C: Pose question dans l'app
  C->>A: Repond et complete
  A->>M: Transmet apercu
  M->>C: Demande validation orientation
  C->>M: Valide
  M->>C: Prepare devis futur
```
