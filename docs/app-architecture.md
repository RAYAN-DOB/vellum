# App Architecture

La V1.5 est une application Next.js App Router statique. Les donnees viennent de `src/lib/mock-data.ts`. Les routes et composants restent principalement des Server Components.

## Structure

```txt
src/
  app/          routes Next.js
  components/   ui, layout, marketing, chat, project, files, roles, dashboard,
                command, notifications, onboarding, messages, settings, client
  lib/          mock-data, routes, permissions, workflow, utils
  types/        modeles metier partages
docs/           vision produit, UX/UI, architecture, workflows
```

```mermaid
flowchart TD
  Routes["src/app"] --> Shell["AppShell / PublicHeader"]
  Routes --> Landing["Landing publique"]
  Routes --> ClientChat["Client nouveau projet"]
  Routes --> Workspaces["Espaces roles"]
  Routes --> Details["Details projet/demande/livrable"]
  Shell --> UI["ui primitives"]
  UI --> Grid["ArchitecturalGridBackground"]
  UI --> Panels["LayeredPanel / Cards / Badges"]
  Workspaces --> Domain["Composants metier"]
  Domain --> MockData["src/lib/mock-data.ts"]
  MockData --> Types["src/types"]
  MockData --> Permissions["permissions mockees"]
```

## Contraintes

- Aucun secret dans le code.
- Aucun vrai fichier sensible dans `public/`.
- Aucune promesse de securite serveur en V1.
- Toute action serveur future devra refaire les controles de permissions.

## Composants cles V1.5

- `ProjectDepositFlow` : intake sombre Lazy-inspired avec transition d'envoi mockee.
- `ClientCommandCenter` : cockpit client avec actions attendues, projets et documents recents.
- `PremiumProjectDetail` : espace projet client avec workflow, documents, chat, decision et devis.
- `ManagerAssignmentBoard` et `QuoteBuilderMock` : qualification, assignation et devis fictif.
- `ArchitectWorkloadPanel` : atelier de production et checklist architecte.
- `CommandPalette` et `NotificationCenter` : navigation demo rapide, sans backend.
- `DocumentReviewViewer` : viewer plan/PDF/DWG fictif avec calques et validation mockee.
