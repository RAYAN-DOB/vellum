# Product Vision

PlanWork est une plateforme B2B pour deposer, cadrer, suivre et piloter des demandes liees a des plans techniques : DWG, PDF, croquis, schemas electriques, plomberie, photos de site, notes projet, corrections et livrables.

La V1.5 reste une demonstration front statique. Elle sert a vendre la vision produit : un client depose un projet dans un cockpit/chat pleine page, l'equipe qualifie, un architecte ou dessinateur travaille, puis le client suit l'avancement.

## Promesse

- Remplacer les demandes dispersees par un dossier projet clair.
- Structurer le besoin client avant production.
- Donner a chaque role une vue adaptee : client, manager, architecte, admin.
- Preparer une V2 avec comptes, stockage prive, permissions serveur, NDA et audit.

## Limites V1.5

- Pas de backend.
- Pas d'authentification reelle.
- Pas d'API.
- Pas d'upload reel.
- Pas de base de donnees.
- Pas de paiement.
- Pas de securite serveur active.

```mermaid
flowchart TD
  Client["Client"] --> Chat["Cockpit chat depot projet"]
  Chat --> MockDocs["Documents fictifs"]
  Chat --> Summary["Synthese exploitable"]
  Summary --> Manager["Manager qualifie"]
  Manager --> Architect["Architecte / dessinateur"]
  Architect --> Preview["Apercu / version de travail"]
  Preview --> ClientReview["Client suit et valide"]
  ClientReview --> Quote["Devis futur V2"]
  Quote --> SecureDelivery["Livraison securisee V2"]
```
