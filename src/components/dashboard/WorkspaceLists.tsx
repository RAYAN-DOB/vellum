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
        <CardTitle>Demandes mockees</CardTitle>
        <CardDescription>
          Suivi statique des demandes, sans fichier source ni stockage reel.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockRequests.map((request) => (
          <article
            className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
            key={request.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  {request.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  {request.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={request.status} />
                <StatusBadge value={request.priority} />
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-neutral-500 sm:grid-cols-3">
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
        <CardTitle>Projets mockes</CardTitle>
        <CardDescription>
          Projets fictifs pour tester le cloisonnement futur par projet.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockProjects.map((project) => (
          <article
            className="rounded-md border border-neutral-200 bg-white p-4"
            key={project.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-blue-700">
                  {project.reference}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-neutral-950">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {project.description}
                </p>
              </div>
              <StatusBadge value={project.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">
              <span>{confidentialityLabels[project.confidentiality]}</span>
              <span>Client : {userName(project.clientId)}</span>
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
        <CardTitle>Livrables mockes</CardTitle>
        <CardDescription>
          Noms fictifs uniquement, sans fichiers presents dans public/.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockDeliverables.map((deliverable) => (
          <article
            className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
            key={deliverable.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-950">
                  {deliverable.title}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {deliverable.mockFileName}
                </p>
              </div>
              <StatusBadge value={deliverable.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">
              <span>Format : {deliverable.format.toUpperCase()}</span>
              <span>Soumis par : {userName(deliverable.submittedById)}</span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
