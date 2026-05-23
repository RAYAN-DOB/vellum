import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileSearch,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockDeliverables, mockProjectFiles, mockProjects } from "@/lib/mock-data";

const productionTasks = [
  "Analyser le PDF annote",
  "Verifier les cotes critiques",
  "Preparer apercu client",
  "Lister questions avant devis",
] as const;

export function ArchitectWorkloadPanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card tone="dark" className="rounded-[32px]">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
            Production
          </p>
          <CardTitle className="text-2xl text-[#f7f3ea]">
            Atelier architecte / dessinateur
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockProjects.slice(0, 3).map((project, index) => (
            <article
              className="rounded-[24px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/6 p-4"
              key={project.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a9a191]">
                    {project.reference}
                  </p>
                  <p className="mt-1 font-semibold text-[#f7f3ea]">{project.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[#cfc6b5]">
                    {project.description}
                  </p>
                </div>
                <Badge tone={index === 0 ? "green" : "blue"}>{project.status}</Badge>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Checklist production</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {productionTasks.map((task, index) => (
              <div
                className="rounded-[22px] border border-[#d8d0bf] bg-[#fbfaf6] p-4"
                key={task}
              >
                <CheckCircle2
                  className={index < 2 ? "size-5 text-emerald-700" : "size-5 text-[#8a7a5f]"}
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm font-semibold text-[#171613]">{task}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Questions client",
              detail: "Clarifier annotations, priorites et formats finaux.",
              icon: MessageSquareText,
            },
            {
              title: "Apercu a transmettre",
              detail: "Validation d'orientation avant devis.",
              icon: Eye,
            },
            {
              title: "Livrables",
              detail: `${mockDeliverables.length} elements fictifs, ${mockProjectFiles.length} documents.`,
              icon: PackageCheck,
            },
          ].map(({ title, detail, icon: Icon }) => (
            <Card className="rounded-[28px]" key={title}>
              <CardContent className="p-5">
                <Icon className="size-5 text-[#7b6b4f]" aria-hidden="true" />
                <p className="mt-3 font-semibold text-[#171613]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#6b665a]">{detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle>Planning mocke</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Aujourd'hui", "Analyse documents et questions client"],
              ["Demain", "Apercu de principe"],
              ["J+3", "Retour manager et ajustements"],
            ].map(([date, label]) => (
              <div className="flex items-center justify-between rounded-full border border-[#d8d0bf] bg-[#f8f5ed] px-4 py-3" key={date}>
                <span className="flex items-center gap-2 text-sm font-semibold text-[#171613]">
                  <CalendarDays className="size-4 text-[#7b6b4f]" aria-hidden="true" />
                  {date}
                </span>
                <span className="text-sm text-[#6b665a]">{label}</span>
              </div>
            ))}
            <Button className="rounded-full" variant="outline">
              <FileSearch className="size-4" aria-hidden="true" />
              Marquer document analyse
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
