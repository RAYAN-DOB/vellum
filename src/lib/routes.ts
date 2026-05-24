export const routes = {
  public: {
    home: "/",
    services: "/services",
    security: "/securite-confidentialite",
    contact: "/contact",
    login: "/login",
    register: "/register",
  },
  workspace: {
    dashboard: "/dashboard",
    requests: "/dashboard/demandes",
    newRequest: "/dashboard/demandes/nouvelle",
    projects: "/dashboard/projets",
    deliverables: "/dashboard/livrables",
    permissions: "/dashboard/permissions",
  },
  roles: {
    client: "/client",
    clientMessages: "/client/messages",
    clientNewProject: "/client/nouveau-projet",
    clientOnboarding: "/client/onboarding",
    clientSettings: "/client/parametres",
    clientProjects: "/client/projets",
    projectManager: "/chef-projet",
    projectManagerQuotes: "/chef-projet/devis",
    drafter: "/dessinateur",
    admin: "/admin",
  },
} as const;

export const publicNavigation = [
  { label: "Produit", href: "#produit" },
  { label: "Workflow", href: "#workflow" },
  { label: "Sécurité", href: "#securite" },
  { label: "Tarifs", href: "#tarifs" },
] as const;

export const workspaceNavigation = [
  { label: "Tableau de bord", href: routes.workspace.dashboard },
  { label: "Nouveau dépôt", href: routes.workspace.newRequest },
] as const;

export const roleNavigation = [
  { label: "Espace client", href: routes.roles.client },
  { label: "Nouveau projet", href: routes.roles.clientNewProject },
  { label: "Projets client", href: routes.roles.clientProjects },
  { label: "Onboarding", href: routes.roles.clientOnboarding },
  { label: "Messages", href: routes.roles.clientMessages },
  { label: "Paramètres", href: routes.roles.clientSettings },
  { label: "Chef de projet", href: routes.roles.projectManager },
  { label: "Devis", href: routes.roles.projectManagerQuotes },
  { label: "Dessinateur", href: routes.roles.drafter },
  { label: "Admin", href: routes.roles.admin },
] as const;

export const workspaceSecondaryNavigation = [
  { label: "Demande exemple", href: `${routes.workspace.requests}/request-demo-001` },
  { label: "Projet exemple", href: `${routes.workspace.projects}/project-demo-001` },
  {
    label: "Livrable exemple",
    href: `${routes.workspace.deliverables}/deliverable-demo-001`,
  },
  { label: "Permissions", href: routes.workspace.permissions },
] as const;
