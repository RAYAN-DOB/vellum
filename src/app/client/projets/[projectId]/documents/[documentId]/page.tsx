import { ArrowLeft, FileText } from "lucide-react";
import { notFound } from "next/navigation";

import { ClientShell } from "@/components/shells/ClientShell";
import { DocumentDownloadButton } from "@/components/files/DocumentDownloadButton";
import { DocumentInlinePreview } from "@/components/files/DocumentInlinePreview";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import type { ProjectDocumentRow } from "@/types/database";

export const dynamic = "force-dynamic";

type DocumentWithProject = ProjectDocumentRow & {
  project: {
    id: string;
    reference: string | null;
    title: string;
  } | null;
};

export default async function ClientDocumentReviewPage({
  params,
}: {
  params: Promise<{ documentId: string; projectId: string }>;
}) {
  await requireRole(["client", "manager", "admin", "architect"]);
  const { documentId, projectId } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: document } = await supabase
    .from("project_documents")
    .select("*, project:projects(id, title, reference)")
    .eq("id", documentId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!document) notFound();
  const documentWithProject = document as unknown as DocumentWithProject;

  return (
    <ClientShell
      activeHref={routes.client.projects}
      eyebrow="Document projet"
      title={documentWithProject.file_name}
      description={`Aperçu du document associé au projet ${
        documentWithProject.project?.title ?? ""
      }.`}
    >
      <a
        href={`/client/projets/${projectId}`}
        className="inline-flex items-center gap-1 text-sm text-[#6b665a] hover:text-[#171613]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Retour au projet
      </a>

      <section className="mt-6 rounded-[6px] border border-[#d8d0bf] bg-white/95 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileText className="size-6 text-[#8a7a5f]" aria-hidden />
            <div>
              <p className="font-medium text-[#171613]">
                {documentWithProject.file_name}
              </p>
              <p className="text-xs text-[#6b665a]">
                {documentWithProject.file_type ?? "Type inconnu"} ·{" "}
                {documentWithProject.file_size
                  ? `${(documentWithProject.file_size / 1024 / 1024).toFixed(2)} MB`
                  : "Taille inconnue"}
              </p>
            </div>
          </div>
          <DocumentDownloadButton path={documentWithProject.file_path} />
        </div>

        <div className="mt-6">
          <DocumentInlinePreview
            fileName={documentWithProject.file_name}
            fileSize={documentWithProject.file_size}
            fileType={documentWithProject.file_type}
            path={documentWithProject.file_path}
          />
        </div>
      </section>
    </ClientShell>
  );
}
