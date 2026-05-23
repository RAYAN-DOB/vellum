import { ArrowRight, MessageSquareText, PhoneCall } from "lucide-react";

import { DocumentPreviewCard } from "@/components/files/DocumentPreviewCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { mockProjectFiles, mockProjects, mockRequests } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const confidentialityLabel = {
  standard: "Standard",
  nda_required: "NDA requis",
  restricted: "Restreint",
} as const;

export function ClientProjectList() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {mockProjects.map((project) => {
          const requestCount = mockRequests.filter(
            (request) => request.projectId === project.id,
          ).length;

          return (
            <Card interactive key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                      {project.reference}
                    </p>
                    <CardTitle className="mt-2">{project.name}</CardTitle>
                  </div>
                  <Badge tone={project.confidentiality === "restricted" ? "amber" : "neutral"}>
                    {confidentialityLabel[project.confidentiality]}
                  </Badge>
                </div>
                <StatusBadge value={project.status} />
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[3px] bg-[#eee8dc] p-3">
                    <p className="text-xs text-[#8a7a5f]">Demandes</p>
                    <p className="mt-1 font-semibold text-[#171613]">{requestCount}</p>
                  </div>
                  <div className="rounded-[3px] bg-[#eee8dc] p-3">
                    <p className="text-xs text-[#8a7a5f]">Documents</p>
                    <p className="mt-1 font-semibold text-[#171613]">
                      {
                        mockProjectFiles.filter((file) => file.projectId === project.id)
                          .length
                      }
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="sm">
                    <a href={`${routes.roles.clientProjects}/${project.id}`}>
                      Ouvrir
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquareText className="size-4" aria-hidden="true" />
                    Completer
                  </Button>
                  <Button size="sm" variant="ghost">
                    <PhoneCall className="size-4" aria-hidden="true" />
                    Manager
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Documents prepares</CardTitle>
          <CardDescription>
            Cartes fictives pour presenter le futur espace de fichiers projet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {mockProjectFiles.map((file) => (
            <DocumentPreviewCard file={file} key={file.id} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
