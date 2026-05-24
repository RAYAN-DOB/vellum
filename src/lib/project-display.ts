/**
 * Pure display data for projects — safe to import from both Server and
 * Client Components.
 */

import type {
  ProfileRow,
  ProjectConfidentiality,
  ProjectPriority,
  ProjectRow,
  ProjectStatus,
} from "@/types/database";

export type ProjectListItem = ProjectRow & {
  client: Pick<ProfileRow, "id" | "full_name" | "email" | "company"> | null;
  manager: Pick<ProfileRow, "id" | "full_name" | "email"> | null;
  architect: Pick<ProfileRow, "id" | "full_name" | "email"> | null;
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  draft: "Brouillon",
  intake: "À qualifier",
  qualified: "Qualifié",
  assigned: "Assigné",
  in_progress: "En production",
  review: "À valider",
  delivered: "Livré",
  archived: "Archivé",
  cancelled: "Annulé",
};

export const projectStatusTone: Record<
  ProjectStatus,
  "neutral" | "amber" | "green" | "blue" | "red" | "violet"
> = {
  draft: "neutral",
  intake: "amber",
  qualified: "blue",
  assigned: "violet",
  in_progress: "violet",
  review: "amber",
  delivered: "green",
  archived: "neutral",
  cancelled: "red",
};

export const confidentialityLabels: Record<ProjectConfidentiality, string> = {
  standard: "Standard",
  nda_required: "NDA requis",
  restricted: "Restreint",
};

export const priorityLabels: Record<ProjectPriority, string> = {
  low: "Faible",
  normal: "Standard",
  high: "Élevée",
  urgent: "Urgente",
};
