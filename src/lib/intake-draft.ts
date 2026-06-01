export const PUBLIC_PROJECT_DRAFT_KEY = "vellum_public_project_draft";

export type PublicDraftFile = {
  name: string;
  size: number;
  type: string;
};

export type PublicProjectDraft = {
  projectType: string;
  title?: string;
  description: string;
  deliverable: string;
  deadline: string;
  urgency: "normal" | "high" | "urgent";
  notes: string;
  needs3d: boolean;
  workMode: "correction" | "creation";
  contactName: string;
  email: string;
  phone?: string;
  company?: string;
  files: PublicDraftFile[];
  createdAt: string;
};
