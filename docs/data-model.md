# Data Model

Le modele V1.5 est fictif, stocke dans `src/lib/mock-data.ts`. Il prepare les objets necessaires a la V2 sans stockage reel.

```mermaid
classDiagram
  class User {
    id
    name
    role
    organizationId
    ndaAccepted
  }
  class Project {
    id
    reference
    clientId
    managerId
    drafterIds
    status
    confidentiality
  }
  class ProjectRequest {
    id
    projectId
    createdById
    type
    priority
    expectedFormats
    status
  }
  class ProjectFile {
    id
    projectId
    type
    status
    confidentiality
    isMockOnly
  }
  class Message {
    id
    projectId
    authorRole
    kind
    isMockOnly
  }
  class Deliverable {
    id
    projectId
    requestId
    format
    status
    isSensitive
  }
  User "1" --> "*" Project
  Project "1" --> "*" ProjectRequest
  Project "1" --> "*" ProjectFile
  Project "1" --> "*" Message
  ProjectRequest "1" --> "*" Deliverable
```

## Notes V2

- Ajouter base de donnees.
- Ajouter stockage prive.
- Relier chaque fichier a un projet, une organisation, un role et un journal d'acces.
- Refuser toute exposition client sans controle serveur.
