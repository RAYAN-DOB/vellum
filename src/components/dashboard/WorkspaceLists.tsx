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
        <CardTitle>Demandes mockees</CardTitle>
        <CardDescription>
          Suivi statique des demandes, sans fichier source ni stockage reel.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockRequests.map((request) => (
          <article
            className="group rounded-md border border-slate-200 bg-slate-50/80 p-4 transition hover:border-blue-200 hover:bg-white"
            key={request.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <a
                  className="text-sm font-semibold text-slate-950 hover:text-blue-700"
                  href={`${routes.workspace.requests}/${request.id}`}
                >
                  {request.title}
                </a>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {request.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={request.status} />
                <StatusBadge value={request.priority} />
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:grid-cols-3">
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
            className="group rounded-md border border-slate-200 bg-white p-4 transition hover:border-blue-200"
            key={project.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-blue-700">
                  {project.reference}
                </p>
                <a
                  className="mt-1 block text-sm font-semibold text-slate-950 hover:text-blue-700"
                  href={`${routes.workspace.projects}/${project.id}`}
                >
                  {project.name}
                </a>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {project.description}
                </p>
              </div>
              <StatusBadge value={project.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-slate-100 px-2 py-1">
                {confidentialityLabels[project.confidentiality]}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-1">
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
        <CardTitle>Livrables mockes</CardTitle>
        <CardDescription>
          Noms fictifs uniquement, sans fichiers presents dans public/.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {mockDeliverables.map((deliverable) => (
          <article
            className="group rounded-md border border-slate-200 bg-slate-50/80 p-4 transition hover:border-blue-200 hover:bg-white"
            key={deliverable.id}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <a
                  className="text-sm font-semibold text-slate-950 hover:text-blue-700"
                  href={`${routes.workspace.deliverables}/${deliverable.id}`}
                >
                  {deliverable.title}
                </a>
                <p className="mt-1 text-sm text-slate-600">
                  {deliverable.mockFileName}
                </p>
              </div>
              <StatusBadge value={deliverable.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-md bg-white px-2 py-1 ring-1 ring-slate-200">
                Format : {deliverable.format.toUpperCase()}
              </span>
              <span className="rounded-md bg-white px-2 py-1 ring-1 ring-slate-200">
                Soumis par : {userName(deliverable.submittedById)}
              </span>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
