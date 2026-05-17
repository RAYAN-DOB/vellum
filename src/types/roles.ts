export const roles = [
  "client",
  "project_manager",
  "drafter",
  "admin",
] as const;

export type Role = (typeof roles)[number];

export type ProjectRole =
  | "project_owner"
  | "project_viewer"
  | "project_manager"
  | "assigned_drafter";

export const roleLabels: Record<Role, string> = {
  client: "Client",
  project_manager: "Chef de projet",
  drafter: "Dessinateur",
  admin: "Administrateur",
};
