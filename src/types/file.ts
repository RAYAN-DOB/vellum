import type { ProjectConfidentiality } from "./project";

export type ProjectFileType =
  | "dwg"
  | "pdf"
  | "sketch"
  | "electrical_schema"
  | "plumbing_schema"
  | "site_photo"
  | "project_note";

export type ProjectFileStatus =
  | "mock_ready"
  | "needs_context"
  | "review_only"
  | "not_uploaded";

export type ProjectFile = {
  id: string;
  projectId: string;
  name: string;
  type: ProjectFileType;
  status: ProjectFileStatus;
  confidentiality: ProjectConfidentiality;
  sizeLabel: string;
  description: string;
  isMockOnly: true;
};
