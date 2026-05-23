import type { Role } from "./roles";

export type ProjectMessageKind =
  | "client_question"
  | "manager_reply"
  | "architect_question"
  | "system_note";

export type ProjectMessage = {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: Role | "system";
  kind: ProjectMessageKind;
  body: string;
  timestamp: string;
  isMockOnly: true;
};
