import { ArrowLeft, CheckCircle2, Download, Layers3, MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockDataNotice } from "@/lib/mock-data";
import { routes } from "@/lib/routes";
import type { ProjectFile } from "@/types/file";
import type { Project } from "@/types/project";

type DocumentReviewViewerProps = {
  file: ProjectFile;
  project: Project;
};

export function DocumentReviewViewer({ file, project }: DocumentReviewViewerProps) {
  return (
    <div className="grid gap-6">
      <Card tone="dark" className="rounded-[32px]">
        <CardHeader>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-[#d7c6a4]"
            href={`${routes.client.projects}/${project.id}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour projet
          </a>
          <CardTitle className="text-3xl text-[#f7f3ea]">{file.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="drawing-line relative min-h-[560px] overflow-hidden rounded-[28px] border border-[#f7f3ea]/12 bg-[#090908] p-6">
            <div className="absolute left-10 top-10 h-64 w-96 border border-[#f7f3ea]/20" />
            <div className="absolute left-20 top-24 h-32 w-48 border border-[#d7c6a4]/45" />
            <div className="absolute left-36 top-44 h-px w-72 bg-emerald-200/70" />
            <div className="absolute right-12 top-16 rounded-full border border-[#e4c887]/45 bg-[#d7c6a4]/10 px-4 py-2 text-xs font-semibold text-[#ead9b9]">
              Annotation A1
            </div>
            <div className="absolute bottom-12 left-12 rounded-[24px] border border-[#f7f3ea]/12 bg-[#f7f3ea]/6 p-4 text-sm leading-6 text-[#cfc6b5]">
              Apercu technique fictif : calques, reperes et zones de correction.
            </div>
          </div>

          <div className="grid content-start gap-4">
            {["Calque existant", "Annotations client", "Version V2", "A valider"].map((layer, index) => (
              <div
                className="flex items-center justify-between rounded-full border border-[#f7f3ea]/12 bg-[#f7f3ea]/6 px-4 py-3 text-sm text-[#f7f3ea]"
                key={layer}
              >
                <span className="flex items-center gap-2">
                  <Layers3 className="size-4 text-[#d7c6a4]" aria-hidden="true" />
                  {layer}
                </span>
                <span className={index < 3 ? "size-2 rounded-full bg-emerald-200" : "size-2 rounded-full bg-[#d7c6a4]"} />
              </div>
            ))}
            <Button className="rounded-full bg-[#f7f3ea] text-[#171613] hover:bg-white">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Valider apercu
            </Button>
            <Button
              className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <MessageSquareText className="size-4" aria-hidden="true" />
              Demander correction
            </Button>
            <Button
              className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <Download className="size-4" aria-hidden="true" />
              Telechargement fictif
            </Button>
            <p className="text-xs leading-5 text-[#9f9788]">{mockDataNotice}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
