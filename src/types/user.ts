import type { Role } from "./roles";

export type UserStatus = "invited" | "active" | "disabled";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  status: UserStatus;
  ndaAccepted: boolean;
  createdAt: string;
};

export type UserSummary = Pick<User, "id" | "name" | "role">;
