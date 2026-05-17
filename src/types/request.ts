export type RequestType =
  | "dwg_creation"
  | "pdf_correction"
  | "technical_redraw"
  | "project_brief"
  | "deliverable_revision";

export type RequestPriority = "low" | "normal" | "high" | "urgent";

export type RequestStatus =
  | "draft"
  | "submitted"
  | "qualified"
  | "assigned"
  | "in_progress"
  | "waiting_review"
  | "closed";

export type ProjectRequest = {
  id: string;
  projectId: string;
  createdById: string;
  title: string;
  type: RequestType;
  priority: RequestPriority;
  status: RequestStatus;
  summary: string;
  expectedFormats: string[];
  hasMockAttachments: boolean;
  createdAt: string;
  updatedAt: string;
};
