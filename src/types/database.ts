/**
 * Hand-written database types for the Supabase schema declared in
 * supabase/migrations. Keep in sync with the SQL.
 *
 * Each table exposes Row / Insert / Update shapes.
 */

export type AppRole = "client" | "architect" | "manager" | "admin";

export type ProjectStatus =
  | "draft"
  | "intake"
  | "qualified"
  | "assigned"
  | "in_progress"
  | "review"
  | "delivered"
  | "archived"
  | "cancelled";

export type ProjectPriority = "low" | "normal" | "high" | "urgent";
export type ProjectConfidentiality = "standard" | "nda_required" | "restricted";
export type ProjectMessageKind =
  | "message"
  | "system"
  | "status_change"
  | "assignment"
  | "quote"
  | "file";
export type QuoteStatus = "draft" | "sent" | "accepted" | "refused" | "expired";
export type DeliverableStatus = "draft" | "review" | "published" | "archived";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type ProfileRow = Timestamps & {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
};

export type ProjectRow = Timestamps & {
  id: string;
  reference: string | null;
  client_id: string;
  manager_id: string | null;
  architect_id: string | null;
  title: string;
  description: string | null;
  project_type: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  confidentiality: ProjectConfidentiality;
  expected_delivery_date: string | null;
  metadata: Record<string, unknown>;
};

export type ProjectDocumentRow = {
  id: string;
  project_id: string;
  uploaded_by: string | null;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  document_category: string | null;
  created_at: string;
};

export type ProjectMessageRow = {
  id: string;
  project_id: string;
  sender_id: string | null;
  body: string;
  message_type: ProjectMessageKind;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ProjectEventRow = {
  id: string;
  project_id: string;
  actor_id: string | null;
  event_type: string;
  label: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type QuoteRow = Timestamps & {
  id: string;
  project_id: string;
  created_by: string | null;
  reference: string | null;
  status: QuoteStatus;
  total_amount: number;
  currency: string;
  notes: string | null;
  valid_until: string | null;
};

export type QuoteItemRow = {
  id: string;
  quote_id: string;
  label: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  position: number;
};

export type DeliverableRow = Timestamps & {
  id: string;
  project_id: string;
  uploaded_by: string | null;
  title: string;
  description: string | null;
  file_path: string | null;
  status: DeliverableStatus;
  version: number;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export type AuditLogRow = {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AppPolicyRow = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  value: unknown;
  updated_by: string | null;
  updated_at: string;
};

export type RoleRow = {
  id: string;
  name: AppRole;
  label: string;
  description: string | null;
  created_at: string;
};

export type PermissionRow = {
  id: string;
  key: string;
  label: string;
  description: string | null;
  category: string | null;
  created_at: string;
};

export type RolePermissionRow = {
  role_id: string;
  permission_id: string;
};

/* -------------------------------------------------------------------------- */
/*  Supabase typed schema                                                     */
/* -------------------------------------------------------------------------- */

type TableShape<R, I = Omit<R, "created_at" | "updated_at">, U = Partial<I>> = {
  Row: R;
  Insert: I;
  Update: U;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape<ProfileRow>;
      roles: TableShape<RoleRow>;
      permissions: TableShape<PermissionRow>;
      role_permissions: TableShape<RolePermissionRow>;
      projects: TableShape<ProjectRow>;
      project_documents: TableShape<ProjectDocumentRow>;
      project_messages: TableShape<ProjectMessageRow>;
      project_events: TableShape<ProjectEventRow>;
      quotes: TableShape<QuoteRow>;
      quote_items: TableShape<QuoteItemRow>;
      deliverables: TableShape<DeliverableRow>;
      notifications: TableShape<NotificationRow>;
      audit_logs: TableShape<AuditLogRow>;
      app_policies: TableShape<AppPolicyRow>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_manager_or_admin: { Args: Record<string, never>; Returns: boolean };
      current_role: { Args: Record<string, never>; Returns: AppRole };
      can_access_project: { Args: { p_project_id: string }; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      project_status: ProjectStatus;
      project_priority: ProjectPriority;
      project_confidentiality: ProjectConfidentiality;
      project_message_kind: ProjectMessageKind;
      quote_status: QuoteStatus;
      deliverable_status: DeliverableStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
