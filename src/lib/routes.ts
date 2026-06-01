/**
 * Vellum — Centralised route map.
 *
 * Four role-based apps live under the same domain, behind a single auth.
 * Always reference these instead of hard-coding paths.
 */
export const routes = {
  public: {
    home: "/",
    deposit: "/deposer-un-projet",
    services: "/services",
    security: "/securite-confidentialite",
    contact: "/contact",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    legal: "/mentions-legales",
    privacy: "/confidentialite",
    terms: "/conditions",
  },
  client: {
    home: "/client",
    newProject: "/client/nouveau-projet",
    projects: "/client/projets",
    project: (id: string) => `/client/projets/${id}`,
    messages: "/client/messages",
    documents: "/client/documents",
    quotes: "/client/devis",
    deliverables: "/client/livrables",
    settings: "/client/parametres",
    onboarding: "/client/onboarding",
  },
  studio: {
    home: "/studio",
    projects: "/studio/projets",
    project: (id: string) => `/studio/projets/${id}`,
    documents: "/studio/documents",
    tasks: "/studio/taches",
    deliverables: "/studio/livrables",
    planning: "/studio/planning",
    messages: "/studio/messages",
    settings: "/studio/parametres",
  },
  manager: {
    home: "/manager",
    requests: "/manager/demandes",
    projects: "/manager/projets",
    project: (id: string) => `/manager/projets/${id}`,
    assignments: "/manager/assignations",
    quotes: "/manager/devis",
    team: "/manager/equipe",
    messages: "/manager/messages",
    reporting: "/manager/reporting",
  },
  admin: {
    home: "/admin",
    users: "/admin/users",
    roles: "/admin/roles",
    permissions: "/admin/permissions",
    policies: "/admin/policies",
    projects: "/admin/projects",
    audit: "/admin/audit",
    settings: "/admin/settings",
  },
} as const;

/** Top public navigation (used on landing + footer). */
export const publicNavigation = [
  { label: "Produit", href: "#produit" },
  { label: "Workflow", href: "#workflow" },
  { label: "Sécurité", href: "#securite" },
  { label: "Déposer", href: routes.public.deposit },
] as const;

/** Client app — minimal, guided. */
export const clientNavigation = [
  { label: "Vue d'ensemble", href: routes.client.home },
  { label: "Nouveau dépôt", href: routes.client.newProject, emphasis: true },
  { label: "Mes projets", href: routes.client.projects },
  { label: "Documents", href: routes.client.documents },
  { label: "Devis", href: routes.client.quotes },
  { label: "Livrables", href: routes.client.deliverables },
  { label: "Messages", href: routes.client.messages },
  { label: "Paramètres", href: routes.client.settings },
] as const;

/** Studio app — production focus. */
export const studioNavigation = [
  { label: "Atelier", href: routes.studio.home },
  { label: "Projets assignés", href: routes.studio.projects },
  { label: "Documents", href: routes.studio.documents },
  { label: "Tâches", href: routes.studio.tasks },
  { label: "Livrables", href: routes.studio.deliverables },
  { label: "Planning", href: routes.studio.planning },
  { label: "Messages", href: routes.studio.messages },
  { label: "Paramètres", href: routes.studio.settings },
] as const;

/** Manager app — pilot cockpit. */
export const managerNavigation = [
  { label: "Cockpit", href: routes.manager.home },
  { label: "Demandes entrantes", href: routes.manager.requests },
  { label: "Projets", href: routes.manager.projects },
  { label: "Assignations", href: routes.manager.assignments },
  { label: "Devis", href: routes.manager.quotes },
  { label: "Équipe", href: routes.manager.team },
  { label: "Messages", href: routes.manager.messages },
  { label: "Reporting", href: routes.manager.reporting },
] as const;

/** Admin app — full control. */
export const adminNavigation = [
  { label: "Tableau admin", href: routes.admin.home },
  { label: "Utilisateurs", href: routes.admin.users },
  { label: "Rôles", href: routes.admin.roles },
  { label: "Permissions", href: routes.admin.permissions },
  { label: "Politiques", href: routes.admin.policies },
  { label: "Projets (global)", href: routes.admin.projects },
  { label: "Audit", href: routes.admin.audit },
  { label: "Paramètres", href: routes.admin.settings },
] as const;
