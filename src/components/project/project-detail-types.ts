import type {
  ProjectConfidentiality,
  ProjectDocumentRow,
  ProjectEventRow,
  ProjectMessageRow,
  ProjectStatus,
} from "@/types/database";

export type ProjectLite = {
  id: string;
  reference: string | null;
  title: string;
  description: string | null;
  status: ProjectStatus;
  confidentiality: ProjectConfidentiality;
  expected_delivery_date: string | null;
  created_at: string;
  updated_at: string;
  client_id?: string;
  manager_id?: string | null;
  architect_id?: string | null;
  client: { full_name: string | null; email?: string | null } | null;
  manager: { full_name: string | null; email?: string | null } | null;
  architect: { full_name: string | null; email?: string | null } | null;
};

export type ProjectMessageWithSender = ProjectMessageRow & {
  sender: { id: string; full_name: string | null; role: string } | null;
};

export type ProjectDocumentWithUploader = ProjectDocumentRow & {
  uploader: { id: string; full_name: string | null; role: string } | null;
};

export type ProjectEventItem = ProjectEventRow;
