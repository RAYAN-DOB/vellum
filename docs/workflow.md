# Workflow

## Cycle de vie projet

```mermaid
stateDiagram-v2
  [*] --> Depot
  Depot --> Qualification
  Qualification --> Assignation
  Assignation --> Production
  Production --> Apercu
  Apercu --> ValidationClient
  ValidationClient --> DevisFutur
  DevisFutur --> LivraisonSecuriseeV2
  ValidationClient --> Corrections
  Corrections --> Production
```

## Sequence cible

```mermaid
sequenceDiagram
  participant C as Client
  participant App as PlanWork V1/V2
  participant M as Manager
  participant A as Architecte
  C->>App: Depose projet dans le cockpit chat
  App->>M: Cree une synthese a qualifier
  M->>A: Assigne selon charge et competence
  A->>C: Pose une question dans l'app
  A->>M: Transmet un apercu
  M->>C: Demande validation
  C->>App: Valide l'orientation
  App->>C: Devis et paiement en V2
```

## Statuts V1.5 representes

- Brouillon : le client prepare le brief.
- Envoye : la demande est transmise a l'equipe en simulation.
- A qualifier : le manager doit verifier scope, formats et priorite.
- En analyse manager : l'equipe clarifie le cadrage.
- Assigne : un architecte / dessinateur prend le relais.
- En production : les documents sont analyses et un apercu est prepare.
- Question client : une precision est attendue.
- Apercu transmis : le client peut valider ou demander correction.
- Devis a valider : devis mocke, paiement prevu en V2.
- Paiement futur : etape visible mais inactive.
- Livrables prets : livraison finale prevue dans un espace securise V2.

La source de verite front est `src/lib/workflow.ts`. Elle decrit le label, le responsable, la prochaine action et la tonalite visuelle de chaque statut.

## Permissions cible

```mermaid
flowchart TD
  Action["Action utilisateur"] --> Auth["Auth serveur V2"]
  Auth --> Role["Role global"]
  Role --> ProjectRole["Role dans le projet"]
  ProjectRole --> Resource["Ressource demandee"]
  Resource --> NDA["NDA / confidentialite"]
  NDA --> Decision{"Autorise ?"}
  Decision -->|Oui| Audit["Journaliser puis servir"]
  Decision -->|Non| Deny["Refuser"]
```
