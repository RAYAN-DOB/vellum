import { ArrowLeft, FileText } from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { DocumentDownloadButton } from "@/components/files/DocumentDownloadButton";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

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

  return (
    <AppShell
      activeHref={routes.roles.clientProjects}
      eyebrow="Document projet"
      title={document.file_name}
      description={`Aperçu du document associé au projet ${
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).project?.title ?? ""
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
              <p className="font-medium text-[#171613]">{document.file_name}</p>
              <p className="text-xs text-[#6b665a]">
                {document.file_type ?? "Type inconnu"} ·{" "}
                {document.file_size
                  ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB`
                  : "Taille inconnue"}
              </p>
            </div>
          </div>
          <DocumentDownloadButton path={document.file_path} />
        </div>

        <p className="mt-6 rounded-[4px] border border-dashed border-[#d8d0bf] bg-[#fbfaf6] p-4 text-xs leading-5 text-[#6b665a]">
          Le viewer intégré (calques, annotations, comparateur de versions)
          arrive dans une prochaine itération. En attendant, utilisez le
          téléchargement ci-dessus pour ouvrir le document dans votre outil
          habituel.
        </p>
      </section>
    </AppShell>
  );
}
