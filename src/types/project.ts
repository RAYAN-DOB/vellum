export type ProjectStatus =
  | "draft"
  | "intake"
  | "in_progress"
  | "review"
  | "delivered"
  | "archived";

export type ProjectConfidentiality = "standard" | "nda_required" | "restricted";

export type Project = {
  id: string;
  reference: string;
  name: string;
  description: string;
  organizationId: string;
  clientId: string;
  projectManagerId?: string;
  drafterIds: string[];
  status: ProjectStatus;
  confidentiality: ProjectConfidentiality;
  createdAt: string;
  updatedAt: string;
};

export type ProjectSummary = Pick<
  Project,
  "id" | "reference" | "name" | "status" | "confidentiality"
>;
