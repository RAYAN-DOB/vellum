import { MessageSquare } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireRole } from "@/lib/auth";
import {
  projectStatusLabels,
  projectStatusTone,
} from "@/lib/project-display";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import type { ProjectStatus } from "@/types/database";

type MessagePreview = {
  id: string;
  body: string;
  created_at: string;
  sender_id: string | null;
  profiles: { full_name: string | null; role: string } | null;
};

type ProjectWithMessages = {
  id: string;
  reference: string | null;
  title: string;
  status: ProjectStatus;
  updated_at: string;
  project_messages: MessagePreview[];
};

export const metadata = {
  title: "Messages projet — Vellum",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ClientMessagesPage() {
  const user = await requireRole(["client", "manager", "admin"]);
  const supabase = await createSupabaseServerClient();

  // For a client: list their own projects and the most recent messages on each.
  const { data } = await supabase
    .from("projects")
    .select(
      "id, reference, title, status, updated_at, project_messages(id, body, created_at, sender_id, profiles:profiles!project_messages_sender_id_fkey(full_name, role))",
    )
    .eq("client_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);
  const projects = (data ?? []) as unknown as ProjectWithMessages[];

  return (
    <AppShell
      activeHref={routes.roles.clientMessages}
      eyebrow="Inbox projet"
      title="Messages"
      description="Suivez toutes les conversations projet en un seul endroit."
    >
      {projects.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-[#d8d0bf] bg-white/70 p-10 text-center">
          <MessageSquare
            className="mx-auto size-8 text-[#8a7a5f]"
            aria-hidden
          />
          <p className="mt-3 text-sm font-medium text-[#171613]">
            Pas encore de message
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-[#6b665a]">
            Dès qu'un de vos projets est ouvert, vous pourrez échanger avec
            l'équipe ici.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => {
            const messages = Array.isArray(p.project_messages)
              ? p.project_messages
              : [];
            const lastMessage = messages
              .slice()
              .sort((a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
              )[0];

            return (
              <li key={p.id}>
                <a
                  href={`/client/projets/${p.id}#messages`}
                  className="flex flex-col gap-2 rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4 transition hover:border-[#171613] hover:shadow-[0_18px_40px_rgba(22,21,18,0.08)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-[#6b665a]">
                      <span className="font-mono">{p.reference}</span>
                      <StatusPill tone={projectStatusTone[p.status]}>
                        {projectStatusLabels[p.status]}
                      </StatusPill>
                    </div>
                    <span className="text-xs text-[#6b665a]">
                      {messages.length} message{messages.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="font-medium text-[#171613]">{p.title}</p>
                  {lastMessage ? (
                    <p className="line-clamp-1 text-sm text-[#3c382f]">
                      <span className="text-[#6b665a]">
                        {lastMessage.profiles?.full_name ?? "Système"}
                        {" — "}
                      </span>
                      {lastMessage.body}
                    </p>
                  ) : (
                    <p className="text-xs text-[#6b665a]">
                      Aucun message — démarrez la conversation.
                    </p>
                  )}
                  {lastMessage ? (
                    <p className="text-xs text-[#8a7a5f]">
                      {formatDateTime(lastMessage.created_at)}
                    </p>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
