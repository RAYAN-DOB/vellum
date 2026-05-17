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
  },
  roles: {
    client: "/client",
    projectManager: "/chef-projet",
    drafter: "/dessinateur",
    admin: "/admin",
  },
} as const;

export const publicNavigation = [
  { label: "Services", href: routes.public.services },
  { label: "Securite", href: routes.public.security },
  { label: "Contact", href: routes.public.contact },
] as const;

export const workspaceNavigation = [
  { label: "Tableau de bord", href: routes.workspace.dashboard },
  { label: "Demandes", href: routes.workspace.requests },
  { label: "Projets", href: routes.workspace.projects },
  { label: "Livrables", href: routes.workspace.deliverables },
] as const;
