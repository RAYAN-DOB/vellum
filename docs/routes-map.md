# Routes Map

## Routes principales

- `/` : landing publique premium.
- `/client` : portail client.
- `/client/nouveau-projet` : cockpit chat de depot projet.
- `/client/projets` : liste des projets client.
- `/client/projets/[projectId]` : detail projet cote client.
- `/dashboard` : command center global mocke.
- `/dashboard/demandes/nouvelle` : alias du parcours nouveau projet.
- `/dashboard/demandes/[requestId]` : detail demande.
- `/dashboard/projets/[projectId]` : detail projet.
- `/dashboard/livrables/[deliverableId]` : detail livrable.
- `/dashboard/permissions` : matrice de permissions cible.
- `/chef-projet`, `/dessinateur`, `/admin` : espaces role.

```mermaid
flowchart TD
  Home["/"] --> NewProject["/client/nouveau-projet"]
  Home --> Client["/client"]
  Client --> ClientProjects["/client/projets"]
  ClientProjects --> ClientProjectDetail["/client/projets/[projectId]"]
  NewProject --> ClientProjects
  Dashboard["/dashboard"] --> RequestDetail["/dashboard/demandes/[requestId]"]
  Dashboard --> ProjectDetail["/dashboard/projets/[projectId]"]
  Dashboard --> DeliverableDetail["/dashboard/livrables/[deliverableId]"]
  Dashboard --> Permissions["/dashboard/permissions"]
  Dashboard --> Manager["/chef-projet"]
  Dashboard --> Architect["/dessinateur"]
  Dashboard --> Admin["/admin"]
```

```mermaid
flowchart LR
  PublicHeader["Header public"] --> Home["Landing"]
  Home --> CTA["Deposer un projet"]
  CTA --> Chat["Cockpit chat"]
  AppShell["Navigation interne"] --> Workspace["Dashboard"]
  AppShell --> Roles["Espaces roles"]
  AppShell --> Matrix["Permissions"]
```
