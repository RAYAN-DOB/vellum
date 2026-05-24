"use client";

import { FileArchive, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { DocumentDownloadButton } from "@/components/files/DocumentDownloadButton";
import { getSignedDocumentUrl } from "@/lib/client/upload";

type DocumentInlinePreviewProps = {
  path: string;
  fileName: string;
  fileType: string | null;
  fileSize: number | null;
};

function formatBytes(size: number | null) {
  if (!size) return "Taille inconnue";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function previewKind(fileName: string, fileType: string | null) {
  const lower = fileName.toLowerCase();
  if (fileType === "application/pdf" || lower.endsWith(".pdf")) return "pdf";
  if (fileType?.startsWith("image/")) return "image";
  if (lower.endsWith(".dwg") || lower.endsWith(".dxf")) return "cad";
  return "file";
}

export function DocumentInlinePreview({
  path,
  fileName,
  fileType,
  fileSize,
}: DocumentInlinePreviewProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const kind = useMemo(() => previewKind(fileName, fileType), [fileName, fileType]);

  useEffect(() => {
    let alive = true;

    getSignedDocumentUrl(path, "project-documents", 180).then((url) => {
      if (alive) {
        setSignedUrl(url);
        setLoading(false);
      }
    });

    return () => {
      alive = false;
    };
  }, [path]);

  if (loading) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-[4px] border border-line bg-vellum/35 text-sm text-mute">
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
        Préparation de l'aperçu signé...
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className="rounded-[4px] border border-line bg-vellum/35 p-8 text-center">
        <FileText className="mx-auto size-8 text-mute" aria-hidden="true" />
        <p className="mt-4 font-display text-2xl text-ink">
          Aperçu indisponible
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mute">
          Le document existe, mais l'URL signée n'a pas pu être générée pour
          cette session.
        </p>
      </div>
    );
  }

  if (kind === "pdf") {
    return (
      <iframe
        className="min-h-[36rem] w-full rounded-[4px] border border-line bg-white"
        src={signedUrl}
        title={`Aperçu PDF ${fileName}`}
      />
    );
  }

  if (kind === "image") {
    return (
      <div className="rounded-[4px] border border-line bg-vellum/35 p-3">
        <Image
          alt={`Aperçu ${fileName}`}
          className="max-h-[42rem] w-full rounded-[3px] object-contain"
          height={900}
          src={signedUrl}
          unoptimized
          width={1200}
        />
      </div>
    );
  }

  const Icon = kind === "cad" ? FileArchive : FileText;

  return (
    <div className="grid min-h-[28rem] place-items-center rounded-[4px] border border-line bg-vellum/35 p-8">
      <div className="max-w-md text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-line-strong bg-paper">
          <Icon className="size-7 text-graphite" aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-3xl text-ink">
          {kind === "cad" ? "Fichier CAD" : "Document"}
        </p>
        <p className="mt-2 text-sm leading-6 text-mute">
          {kind === "cad"
            ? "Les fichiers DWG/DXF ne sont pas prévisualisés dans le navigateur. Téléchargez le fichier et ouvrez-le dans votre outil métier."
            : "Ce format n'a pas encore de prévisualisation inline."}
        </p>
        <dl className="mt-6 grid gap-px overflow-hidden rounded-[3px] border border-line bg-line text-left">
          <div className="bg-paper p-3">
            <dt className="caption">Nom</dt>
            <dd className="mt-1 break-all text-sm text-ink">{fileName}</dd>
          </div>
          <div className="bg-paper p-3">
            <dt className="caption">Type</dt>
            <dd className="mt-1 text-sm text-ink">{fileType ?? "Inconnu"}</dd>
          </div>
          <div className="bg-paper p-3">
            <dt className="caption">Taille</dt>
            <dd className="mt-1 text-sm text-ink">{formatBytes(fileSize)}</dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-center">
          <DocumentDownloadButton path={path} />
        </div>
      </div>
    </div>
  );
}
