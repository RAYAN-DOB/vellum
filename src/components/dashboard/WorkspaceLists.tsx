import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  mockDeliverables,
  mockProjects,
  mockRequests,
  mockUsers,
} from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const confidentialityLabels = {
  nda_required: "NDA requis",
  restricted: "Restreint",
  standard: "Standard",
} as const;

const requestTypeLabels = {
  deliverable_revision: "Revision livrable",
  dwg_creation: "Creation DWG",
  pdf_correction: "Correction PDF",
  project_brief: "Brief projet",
  technical_redraw: "Reprise technique",
} as const;

function userName(userId: string) {
  return mockUsers.find((user) => user.id === userId)?.name ?? "Utilisateur demo";
}

export function RequestList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demandes techniques</CardTitle>
        <CardDescription>
          Exemples de besoins a cadrer, assigner ou valider. Aucun fichier source
          reel n&apos;est stocke.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockRequests.map((request) => (
          <article
            className="group rounded-[3px] border border-[#d8d0bf] bg-[#f8f5ed]/80 p-4 transition hover:border-[#b9aa8f] hover:bg-[#fbfaf6]"
            key={request.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <a
                  className="text-sm font-semibold text-[#171613] hover:text-[#7b6b4f]"
                  href={`${routes.workspace.requests}/${request.id}`}
                >
                  {request.title}
                </a>
                <p className="mt-1 text-sm leading-6 text-[#6b665a]">
                  {request.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={request.status} />
                <StatusBadge value={request.priority} />
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] px-3 py-2 text-xs text-[#8a7a5f] sm:grid-cols-3">
              <span>{requestTypeLabels[request.type]}</span>
              <span>{request.expectedFormats.join(" + ")}</span>
              <span>Demandeur : {userName(request.createdById)}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProjectList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets suivis</CardTitle>
        <CardDescription>
          Dossiers demo qui montrent comment les demandes seront cloisonnees par
          projet en V2.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockProjects.map((project) => (
          <article
            className="group rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] p-4 transition hover:border-[#b9aa8f]"
            key={project.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a5f]">
                  {project.reference}
                </p>
                <a
                  className="mt-1 block text-sm font-semibold text-[#171613] hover:text-[#7b6b4f]"
                  href={`${routes.workspace.projects}/${project.id}`}
                >
                  {project.name}
                </a>
                <p className="mt-2 text-sm leading-6 text-[#6b665a]">
                  {project.description}
                </p>
              </div>
              <StatusBadge value={project.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#8a7a5f]">
              <span className="rounded-[3px] bg-[#eee8dc] px-2 py-1">
                {confidentialityLabels[project.confidentiality]}
              </span>
              <span className="rounded-[3px] bg-[#eee8dc] px-2 py-1">
                Client : {userName(project.clientId)}
              </span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DeliverableList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Livrables et versions</CardTitle>
        <CardDescription>
          Noms de fichiers fictifs uniquement, pour illustrer le futur suivi de
          version sans upload reel.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockDeliverables.map((deliverable) => (
          <article
            className="group rounded-[3px] border border-[#d8d0bf] bg-[#f8f5ed]/80 p-4 transition hover:border-[#b9aa8f] hover:bg-[#fbfaf6]"
            key={deliverable.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <a
                  className="text-sm font-semibold text-[#171613] hover:text-[#7b6b4f]"
                  href={`${routes.workspace.deliverables}/${deliverable.id}`}
                >
                  {deliverable.title}
                </a>
                <p className="mt-1 text-sm text-[#6b665a]">
                  {deliverable.mockFileName}
                </p>
              </div>
              <StatusBadge value={deliverable.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#8a7a5f]">
              <span className="rounded-[3px] bg-[#fbfaf6] px-2 py-1 ring-1 ring-[#d8d0bf]">
                Format : {deliverable.format.toUpperCase()}
              </span>
              <span className="rounded-[3px] bg-[#fbfaf6] px-2 py-1 ring-1 ring-[#d8d0bf]">
                Soumis par : {userName(deliverable.submittedById)}
              </span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
