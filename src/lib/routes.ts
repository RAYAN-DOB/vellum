export const routes = {
  public: {
    home: "/",
    services: "/services",
    security: "/securite-confidentialite",
    contact: "/contact",
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
  { label: "Solution", href: "#solution" },
  { label: "Services", href: "#services" },
  { label: "Securite", href: "#security" },
  { label: "Process", href: "#process" },
] as const;

export const workspaceNavigation = [
  { label: "Tableau de bord", href: routes.workspace.dashboard },
  { label: "Chat depot projet", href: routes.workspace.newRequest },
] as const;

export const roleNavigation = [
  { label: "Espace client", href: routes.roles.client },
  { label: "Nouveau projet", href: routes.roles.clientNewProject },
  { label: "Projets client", href: routes.roles.clientProjects },
  { label: "Onboarding", href: routes.roles.clientOnboarding },
  { label: "Messages", href: routes.roles.clientMessages },
  { label: "Parametres", href: routes.roles.clientSettings },
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
  { label: "Permissions mockees", href: routes.workspace.permissions },
] as const;
