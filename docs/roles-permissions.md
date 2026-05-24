# Rôles & permissions — PlanWork

Quatre rôles, une seule plateforme, des permissions configurables.

## Rôles

| Rôle           | Slug DB     | URL d'arrivée    |
| -------------- | ----------- | ---------------- |
| Client         | `client`    | `/client`        |
| Architecte     | `architect` | `/dessinateur`   |
| Chef de projet | `manager`   | `/chef-projet`   |
| Administrateur | `admin`     | `/admin`         |

L'inscription publique (`/register`) ne crée que des comptes `client`. Les
trois autres rôles sont créés par l'admin via `/admin/users` (action
`inviteUserAction` qui utilise la service-role key).

## Permissions

Tableau lisible — la source de vérité est la table `public.permissions`
(populée par `supabase/seed.sql`).

| Clé                         | Description                                | Catégorie     |
| --------------------------- | ------------------------------------------ | ------------- |
| `projects.read.own`         | Voir ses projets                           | projects      |
| `projects.read.assigned`    | Voir les projets assignés                  | projects      |
| `projects.read.all`         | Voir tous les projets                      | projects      |
| `projects.create`           | Créer un projet                            | projects      |
| `projects.update`           | Modifier un projet                         | projects      |
| `projects.update.status`    | Changer le statut                          | projects      |
| `projects.assign`           | Assigner un architecte                     | projects      |
| `documents.upload`          | Téléverser un document                     | documents     |
| `documents.read.assigned`   | Lire les docs des projets assignés         | documents     |
| `documents.read.all`        | Lire tous les documents                    | documents     |
| `messages.send`             | Envoyer un message projet                  | messages      |
| `quotes.read`               | Voir les devis                             | quotes        |
| `quotes.create`             | Créer un devis                             | quotes        |
| `quotes.update`             | Modifier un devis                          | quotes        |
| `quotes.approve`            | Accepter / refuser un devis                | quotes        |
| `deliverables.read`         | Lire les livrables                         | deliverables  |
| `deliverables.upload`       | Téléverser un livrable                     | deliverables  |
| `deliverables.publish`      | Publier un livrable                        | deliverables  |
| `users.read`                | Lire la liste des utilisateurs             | admin         |
| `users.manage`              | Créer / désactiver des utilisateurs        | admin         |
| `roles.manage`              | Gérer les rôles                            | admin         |
| `permissions.manage`        | Gérer le catalogue de permissions          | admin         |
| `policies.manage`           | Gérer les politiques applicatives (GPO)    | admin         |
| `audit.read`                | Consulter les audit logs                   | admin         |
| `admin.full_access`         | Override complet                           | admin         |

## Matrice par défaut

Définie dans `supabase/seed.sql` — éditable depuis `/admin/roles` (qui écrit
dans `public.role_permissions`).

| Permission                  | client | architect | manager | admin |
| --------------------------- | :----: | :-------: | :-----: | :---: |
| `projects.read.own`         |   ✓    |           |         |   ✓   |
| `projects.read.assigned`    |        |     ✓     |         |   ✓   |
| `projects.read.all`         |        |           |    ✓    |   ✓   |
| `projects.create`           |   ✓    |           |         |   ✓   |
| `projects.update`           |        |           |    ✓    |   ✓   |
| `projects.update.status`    |        |     ✓     |    ✓    |   ✓   |
| `projects.assign`           |        |           |    ✓    |   ✓   |
| `documents.upload`          |   ✓    |     ✓     |    ✓    |   ✓   |
| `documents.read.assigned`   |        |     ✓     |         |   ✓   |
| `documents.read.all`        |        |           |    ✓    |   ✓   |
| `messages.send`             |   ✓    |     ✓     |    ✓    |   ✓   |
| `quotes.read`               |   ✓    |           |    ✓    |   ✓   |
| `quotes.create`             |        |           |    ✓    |   ✓   |
| `quotes.update`             |        |           |    ✓    |   ✓   |
| `quotes.approve`            |   ✓    |           |         |   ✓   |
| `deliverables.read`         |   ✓    |     ✓     |    ✓    |   ✓   |
| `deliverables.upload`       |        |     ✓     |    ✓    |   ✓   |
| `deliverables.publish`      |        |           |    ✓    |   ✓   |
| `users.read`                |        |           |    ✓    |   ✓   |
| `users.manage`              |        |           |         |   ✓   |
| `roles.manage`              |        |           |         |   ✓   |
| `policies.manage`           |        |           |         |   ✓   |
| `audit.read`                |        |           |         |   ✓   |

## Helpers TypeScript

```ts
import { requireUser, requireRole, hasPermission } from "@/lib/auth";

// Server Component / Server Action:
const user = await requireRole("admin");          // redirects to /unauthorized
const canCreate = await hasPermission("projects.create");
```

`requireUser` redirige vers `/login`.
`requireRole` redirige vers `/unauthorized?reason=role`.
`hasPermission` consulte `role_permissions` et renvoie toujours `true` pour les admins.

## Où vivent les vérifications

| Couche                 | But                                                     |
| ---------------------- | ------------------------------------------------------- |
| `middleware.ts`        | Rejet précoce des non-authentifiés ; redirect par rôle  |
| Page (`requireRole`)   | Défense en profondeur — RBAC au niveau page             |
| Server Action          | Re-vérifie rôle / ownership à chaque mutation           |
| **RLS Postgres**       | **Frontière de sécurité canonique** — même avec un cookie forgé, les requêtes renvoient zéro ligne |
