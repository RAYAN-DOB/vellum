"use client";

import { Download, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { getSignedDocumentUrl } from "@/lib/client/upload";

type Props = {
  path: string;
  bucket?: "project-documents" | "project-deliverables";
};

export function DocumentDownloadButton({
  path,
  bucket = "project-documents",
}: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const url = await getSignedDocumentUrl(path, bucket, 60);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      onClick={handleClick}
      disabled={pending}
      icon={pending ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
    >
      {pending ? "Préparation…" : "Télécharger"}
    </Button>
  );
}
