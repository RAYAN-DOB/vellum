export type DeliverableFormat = "dwg" | "pdf" | "zip" | "image" | "other";

export type DeliverableStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved";

export type Deliverable = {
  id: string;
  projectId: string;
  requestId: string;
  title: string;
  format: DeliverableFormat;
  status: DeliverableStatus;
  submittedById: string;
  reviewedById?: string;
  mockFileName: string;
  isSensitive: boolean;
  createdAt: string;
  updatedAt: string;
};
