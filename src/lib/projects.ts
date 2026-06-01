import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ProjectStatus,
  ProjectMessageRow,
  ProjectDocumentRow,
  ProjectEventRow,
} from "@/types/database";
import type { ProjectListItem } from "@/lib/project-display";

export type { ProjectListItem };

const PROJECT_RELATIONS = `
  *,
  client:profiles!projects_client_id_fkey(id, full_name, email, company),
  manager:profiles!projects_manager_id_fkey(id, full_name),
  architect:profiles!projects_architect_id_fkey(id, full_name)
`;

export async function listProjectsForClient(clientId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_RELATIONS)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listProjectsForClient", error);
    return [] as ProjectListItem[];
  }
  return (data ?? []) as unknown as ProjectListItem[];
}

export async function listProjectsForArchitect(architectId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_RELATIONS)
    .eq("architect_id", architectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listProjectsForArchitect", error);
    return [] as ProjectListItem[];
  }
  return (data ?? []) as unknown as ProjectListItem[];
}

export async function listProjectsForManager(filters?: {
  status?: ProjectStatus;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("projects")
    .select(PROJECT_RELATIONS)
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) {
    console.error("listProjectsForManager", error);
    return [] as ProjectListItem[];
  }
  return (data ?? []) as unknown as ProjectListItem[];
}

export async function getProjectDetail(projectId: string) {
  const supabase = await createSupabaseServerClient();

  const [{ data: project }, { data: documents }, { data: messages }, { data: events }] =
    await Promise.all([
      supabase.from("projects").select(PROJECT_RELATIONS).eq("id", projectId).maybeSingle(),
      supabase
        .from("project_documents")
        .select("*, uploader:profiles!project_documents_uploaded_by_fkey(id, full_name, role)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
      supabase
        .from("project_messages")
        .select("*, sender:profiles!project_messages_sender_id_fkey(id, full_name, role)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true }),
      supabase
        .from("project_events")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  return {
    project: project as unknown as ProjectListItem | null,
    documents: (documents ?? []) as (ProjectDocumentRow & {
      uploader: { id: string; full_name: string | null; role: string } | null;
    })[],
    messages: (messages ?? []) as (ProjectMessageRow & {
      sender: { id: string; full_name: string | null; role: string } | null;
    })[],
    events: (events ?? []) as ProjectEventRow[],
  };
}

// Re-export display constants for backwards-compat with existing imports.
export {
  projectStatusLabels,
  projectStatusTone,
  confidentialityLabels,
  priorityLabels,
} from "@/lib/project-display";
