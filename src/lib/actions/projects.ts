"use server";

import { revalidatePath } from "next/cache";

import { requireUser, requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ProjectConfidentiality,
  ProjectPriority,
  ProjectStatus,
} from "@/types/database";

const VALID_CONFIDENTIALITY = new Set<ProjectConfidentiality>([
  "standard",
  "nda_required",
  "restricted",
]);
const VALID_STATUS = new Set<ProjectStatus>([
  "draft",
  "intake",
  "qualified",
  "assigned",
  "in_progress",
  "review",
  "delivered",
  "archived",
  "cancelled",
]);
const VALID_PRIORITY = new Set<ProjectPriority>([
  "low",
  "normal",
  "high",
  "urgent",
]);

type ActionState = { error?: string; success?: string; projectId?: string };

/**
 * Client-side project deposit: creates a project and an intake event,
 * then notifies all managers.
 */
export async function createProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const projectType = String(formData.get("project_type") ?? "").trim() || null;
  const confidentialityRaw = String(
    formData.get("confidentiality") ?? "standard",
  );
  const priorityRaw = String(formData.get("priority") ?? "normal");

  if (!title || title.length < 4) {
    return { error: "Le titre du projet doit contenir au moins 4 caractères." };
  }

  const confidentiality = VALID_CONFIDENTIALITY.has(
    confidentialityRaw as ProjectConfidentiality,
  )
    ? (confidentialityRaw as ProjectConfidentiality)
    : "standard";

  const priority = VALID_PRIORITY.has(priorityRaw as ProjectPriority)
    ? (priorityRaw as ProjectPriority)
    : "normal";

  const supabase = await createSupabaseServerClient();

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      client_id: user.id,
      title,
      description: description || null,
      project_type: projectType,
      status: "intake",
      priority,
      confidentiality,
    })
    .select("id, reference")
    .single();

  if (error || !project) {
    return { error: error?.message ?? "Création du projet impossible." };
  }

  await supabase.from("project_events").insert({
    project_id: project.id,
    actor_id: user.id,
    event_type: "project.created",
    label: "Projet déposé",
    description: "Le client a déposé sa demande sur la plateforme.",
  });

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action: "project.create",
    target_type: "project",
    target_id: project.id,
    metadata: { reference: project.reference, title },
  });

  // Notify managers — best-effort, RLS allows them to read these notifications.
  const { data: managers } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "manager")
    .eq("is_active", true);

  if (managers && managers.length > 0) {
    await supabase.from("notifications").insert(
      managers.map((m) => ({
        user_id: m.id,
        project_id: project.id,
        title: "Nouveau projet à qualifier",
        body: title,
        link: `/chef-projet?focus=${project.id}`,
      })),
    );
  }

  revalidatePath("/client/projets");
  revalidatePath("/chef-projet");
  return {
    success: "Projet créé.",
    projectId: project.id,
  };
}

export async function sendProjectMessageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const projectId = String(formData.get("project_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!projectId) return { error: "Projet introuvable." };
  if (!body) return { error: "Le message ne peut pas être vide." };

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("project_messages").insert({
    project_id: projectId,
    sender_id: user.id,
    body,
    message_type: "message",
  });

  if (error) return { error: error.message };

  await supabase.from("project_events").insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: "message.sent",
    label: "Message envoyé",
  });

  revalidatePath(`/client/projets/${projectId}`);
  revalidatePath(`/chef-projet/projets/${projectId}`);
  revalidatePath(`/dessinateur/projets/${projectId}`);
  return { success: "Message envoyé." };
}

export async function updateProjectStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["manager", "architect", "admin"]);
  const projectId = String(formData.get("project_id") ?? "");
  const statusRaw = String(formData.get("status") ?? "");

  if (!projectId || !VALID_STATUS.has(statusRaw as ProjectStatus)) {
    return { error: "Statut invalide." };
  }

  const supabase = await createSupabaseServerClient();

  const { data: project, error } = await supabase
    .from("projects")
    .update({ status: statusRaw as ProjectStatus })
    .eq("id", projectId)
    .select("id, client_id, title")
    .single();

  if (error || !project) return { error: error?.message ?? "Mise à jour impossible." };

  await supabase.from("project_events").insert({
    project_id: project.id,
    actor_id: user.id,
    event_type: "status.changed",
    label: `Statut → ${statusRaw}`,
  });

  await supabase.from("notifications").insert({
    user_id: project.client_id,
    project_id: project.id,
    title: "Mise à jour de votre projet",
    body: `Statut : ${statusRaw}`,
    link: `/client/projets/${project.id}`,
  });

  revalidatePath(`/chef-projet`);
  revalidatePath(`/client/projets/${project.id}`);
  return { success: "Statut mis à jour." };
}

export async function assignProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireRole(["manager", "admin"]);
  const projectId = String(formData.get("project_id") ?? "");
  const architectId = String(formData.get("architect_id") ?? "");

  if (!projectId || !architectId) {
    return { error: "Paramètres manquants." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("projects")
    .update({
      architect_id: architectId,
      manager_id: user.id,
      status: "assigned",
    })
    .eq("id", projectId);

  if (error) return { error: error.message };

  await supabase.from("project_events").insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: "project.assigned",
    label: "Architecte assigné",
  });

  await supabase.from("notifications").insert({
    user_id: architectId,
    project_id: projectId,
    title: "Nouveau projet à prendre en charge",
    body: "Le chef de projet vous a assigné un nouveau projet.",
    link: `/dessinateur/projets/${projectId}`,
  });

  revalidatePath("/chef-projet");
  revalidatePath("/dessinateur");
  return { success: "Architecte assigné." };
}
