# V2 Roadmap

La V2 doit transformer la demonstration front en produit exploitable, sans sacrifier la confidentialite des fichiers techniques.

```mermaid
flowchart TD
  V15["V1.5 front mockee"] --> Auth["Comptes et auth"]
  Auth --> Data["Base de donnees"]
  Data --> Storage["Stockage prive fichiers"]
  Storage --> Permissions["Permissions serveur"]
  Permissions --> Audit["Audit log"]
  Audit --> Quotes["Devis"]
  Quotes --> Payment["Paiement futur"]
  Payment --> Delivery["Livraison securisee"]
```

## Modules prioritaires

1. Authentification et organisations.
2. Modele projets/demandes/messages/livrables.
3. Stockage fichiers prive avec URLs non publiques.
4. Permissions serveur via `can(actor, action, resource)`.
5. Journal d'audit.
6. Workflow manager -> architecte -> client.
7. Devis puis paiement plus tard.
