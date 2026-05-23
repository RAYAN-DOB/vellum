import { Eye, MessageSquareText, PackageCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockDeliverables, mockProjectFiles, mockProjects } from "@/lib/mock-data";

export function ArchitectWorkloadPanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Travail assigne</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockProjects.slice(0, 2).map((project) => (
            <article
              className="rounded-[3px] border border-[#d8d0bf] bg-[#f8f5ed]/80 p-4"
              key={project.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                    {project.reference}
                  </p>
                  <p className="mt-1 font-semibold text-[#171613]">{project.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6b665a]">
                    {project.description}
                  </p>
                </div>
                <Badge tone="blue">{project.status}</Badge>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions, apercus et livrables</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] p-4">
            <MessageSquareText className="size-5 text-[#7b6b4f]" aria-hidden="true" />
            <p className="mt-3 font-semibold text-[#171613]">Questions client</p>
            <p className="mt-1 text-sm text-[#6b665a]">
              Clarifier annotations, priorites et formats finaux.
            </p>
          </div>
          <div className="rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] p-4">
            <Eye className="size-5 text-[#7b6b4f]" aria-hidden="true" />
            <p className="mt-3 font-semibold text-[#171613]">Apercu a transmettre</p>
            <p className="mt-1 text-sm text-[#6b665a]">
              Validation d&apos;orientation avant devis.
            </p>
          </div>
          <div className="rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] p-4">
            <PackageCheck className="size-5 text-[#7b6b4f]" aria-hidden="true" />
            <p className="mt-3 font-semibold text-[#171613]">Livrables</p>
            <p className="mt-1 text-sm text-[#6b665a]">
              {mockDeliverables.length} elements fictifs, {mockProjectFiles.length} documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
