"use client";

import {
  FileArchive,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  ScanSearch,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { DocumentDownloadButton } from "@/components/files/DocumentDownloadButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadProjectDocumentsClient } from "@/lib/client/upload";
import type { ProjectDocumentWithUploader } from "@/components/project/project-detail-types";

function formatBytes(size: number | null): string {
  if (!size) return "Taille inconnue";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function iconForDocument(document: ProjectDocumentWithUploader) {
  const name = document.file_name.toLowerCase();
  const type = document.file_type ?? "";
  if (name.endsWith(".dwg") || name.endsWith(".dxf")) return FileArchive;
  if (type.startsWith("image/")) return ImageIcon;
  return FileText;
}

function viewerHref(
  role: string,
  projectId: string,
  documentId: string,
): string | null {
  if (role === "client" || role === "manager" || role === "admin") {
    return `/client/projets/${projectId}/documents/${documentId}`;
  }
  return null;
}

export function ProjectDocumentList({
  projectId,
  documents,
  canUpload,
  currentUserRole,
}: {
  projectId: string;
  documents: ProjectDocumentWithUploader[];
  canUpload: boolean;
  currentUserRole: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(documents);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();

  useEffect(() => {
    const channel = supabase
      .channel(`project-documents:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_documents",
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          if (payload.eventType === "DELETE") {
            const old = payload.old as { id?: string };
            if (old.id) {
              setItems((current) => current.filter((item) => item.id !== old.id));
            }
            return;
          }

          const next = payload.new as ProjectDocumentWithUploader;
          if (!next.id) return;

          const { data } = await supabase
            .from("project_documents")
            .select(
              "*, uploader:profiles!project_documents_uploaded_by_fkey(id, full_name, role)",
            )
            .eq("id", next.id)
            .maybeSingle();

          const hydrated = (data ?? next) as ProjectDocumentWithUploader;
          setItems((current) =>
            [hydrated, ...current.filter((item) => item.id !== hydrated.id)]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              ),
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [projectId, supabase]);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    startUpload(async () => {
      setFeedback(
        `Téléversement de ${files.length} fichier${files.length > 1 ? "s" : ""}...`,
      );
      const result = await uploadProjectDocumentsClient(projectId, files, "source");
      setFeedback(
        result.failed > 0
          ? `${result.uploaded} fichier(s) ajouté(s), ${result.failed} échec(s).`
          : `${result.uploaded} fichier${result.uploaded > 1 ? "s" : ""} ajouté${result.uploaded > 1 ? "s" : ""}.`,
      );
    });
  }

  return (
    <section id="documents" className="rounded-[4px] border border-line bg-paper p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="caption">Documents</p>
          <h3 className="mt-1 font-display text-2xl text-ink">
            Pièces projet ({items.length})
          </h3>
        </div>
        {canUpload ? (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              variant="outline"
              size="sm"
              icon={
                uploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Paperclip className="size-3.5" />
                )
              }
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Ajouter
            </Button>
          </div>
        ) : null}
      </header>

      {feedback ? <p className="mt-3 text-xs text-mute">{feedback}</p> : null}

      {items.length === 0 ? (
        <EmptyState
          icon={Paperclip}
          title="Aucune pièce jointe"
          description="Ajoutez PDF, DWG, croquis ou photo de site pour donner à l'équipe de dessin assez de contexte."
          className="mt-4"
        />
      ) : (
        <ul className="mt-4 grid gap-2">
          {items.map((document) => {
            const Icon = iconForDocument(document);
            const href = viewerHref(currentUserRole, projectId, document.id);
            return (
              <li
                key={document.id}
                className="grid gap-3 rounded-[3px] border border-line bg-vellum/25 p-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[3px] border border-line bg-paper">
                    <Icon className="size-5 text-graphite" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {document.file_name}
                    </p>
                    <p className="mt-1 text-xs text-mute">
                      {formatBytes(document.file_size)} ·{" "}
                      {document.uploader?.full_name ?? "Équipe Vellum"} ·{" "}
                      {formatDate(document.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {href ? (
                    <a
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[3px] border border-line-strong bg-paper px-3 text-xs font-medium text-ink transition hover:border-ink"
                      href={href}
                    >
                      <ScanSearch className="size-3.5" aria-hidden="true" />
                      Voir
                    </a>
                  ) : null}
                  <DocumentDownloadButton path={document.file_path} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
