import type { Role } from "./roles";

export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "comment"
  | "assign"
  | "review"
  | "download"
  | "admin";

export type PermissionResourceType =
  | "dashboard"
  | "project"
  | "request"
  | "deliverable"
  | "file"
  | "user";

export type PermissionActor = {
  id: string;
  role: Role;
  organizationId: string;
  projectIds?: string[];
  assignedProjectIds?: string[];
};

export type PermissionResource = {
  type: PermissionResourceType;
  id?: string;
  organizationId?: string;
  projectId?: string;
  ownerId?: string;
  assignedUserId?: string;
  isSensitive?: boolean;
  status?: string;
};

export type PermissionDecision = {
  allowed: boolean;
  reason: string;
};
