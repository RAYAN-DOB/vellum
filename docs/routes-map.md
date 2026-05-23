# Routes Map

## Routes principales

- `/` : landing publique.
- `/dashboard` : pilotage global mocke.
- `/dashboard/demandes/nouvelle` : chat depot projet.
- `/dashboard/demandes/[requestId]` : detail demande.
- `/dashboard/projets/[projectId]` : detail projet.
- `/dashboard/livrables/[deliverableId]` : detail livrable.
- `/dashboard/permissions` : matrice permissions.
- `/client` : espace client.
- `/client/nouveau-projet` : nouveau projet via chat.
- `/client/projets` : projets client.
- `/client/projets/[projectId]` : detail projet client.
- `/chef-projet` : espace manager.
- `/dessinateur` : espace architecte.
- `/admin` : espace admin.

```mermaid
flowchart TD
  Home["/"] --> NewProject["/client/nouveau-projet"]
  Home --> Dashboard["/dashboard"]
  Dashboard --> RequestNew["/dashboard/demandes/nouvelle"]
  Dashboard --> RequestDetail["/dashboard/demandes/[requestId]"]
  Dashboard --> ProjectDetail["/dashboard/projets/[projectId]"]
  Dashboard --> DeliverableDetail["/dashboard/livrables/[deliverableId]"]
  Dashboard --> Permissions["/dashboard/permissions"]
  Dashboard --> Client["/client"]
  Client --> ClientProjects["/client/projets"]
  ClientProjects --> ClientProjectDetail["/client/projets/[projectId]"]
  Dashboard --> Manager["/chef-projet"]
  Dashboard --> Architect["/dessinateur"]
  Dashboard --> Admin["/admin"]
```

```mermaid
flowchart LR
  Public["Public landing"] --> CTA["Tester le chat projet"]
  CTA --> ClientNew["Client nouveau projet"]
  ClientNew --> ClientProjects["Mes projets"]
  ClientProjects --> ClientDetail["Detail projet client"]
  ClientDetail --> DashboardDetail["Details dashboard"]
```
