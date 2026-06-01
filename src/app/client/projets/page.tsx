import { FilePlus2, FolderKanban, ShieldCheck } from "lucide-react";

import { ClientShell } from "@/components/shells/ClientShell";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireRole } from "@/lib/auth";
import {
  confidentialityLabels,
  listProjectsForClient,
  projectStatusLabels,
  projectStatusTone,
} from "@/lib/projects";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Mes projets — Vellum",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function ClientProjectsPage() {
  const user = await requireRole(["client", "manager", "admin"]);
  const projects = await listProjectsForClient(user.id);

  return (
    <ClientShell
      activeHref={routes.client.projects}
      eyebrow="Dossiers projet"
      title="Vos projets"
      description="Tous vos dossiers déposés, en correction ou livrés. Cliquez pour ouvrir le détail."
      actions={
        <Button asChild icon={<FilePlus2 className="size-4" />}>
          <a href={routes.client.newProject}>Nouveau dépôt</a>
        </Button>
      }
    >
      {projects.length === 0 ? (
        <div className="rounded-[4px] border border-dashed border-line-strong bg-paper/70 p-10 text-center">
          <FolderKanban
            className="mx-auto size-8 text-mute"
            aria-hidden
          />
          <p className="mt-3 text-sm font-medium text-ink">
            Aucun projet pour le moment
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-mute">
            Démarrez votre premier projet en quelques minutes.
          </p>
          <div className="mt-4">
            <Button asChild icon={<FilePlus2 className="size-4" />}>
              <a href={routes.client.newProject}>Déposer un projet</a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[4px] border border-line-strong bg-paper/95">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-vellum/60 text-left text-xs uppercase tracking-[0.18em] text-mute">
              <tr>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Confidentialité</th>
                <th className="px-4 py-3 font-medium">Mis à jour</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {projects.map((project) => (
                <tr key={project.id} className="transition hover:bg-vellum/40">
                  <td className="px-4 py-3 align-top font-mono text-xs text-mute">
                    {project.reference}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <a
                      className="font-medium text-ink hover:underline"
                      href={`/client/projets/${project.id}`}
                    >
                      {project.title}
                    </a>
                    {project.description ? (
                      <p className="mt-1 line-clamp-1 text-xs text-mute">
                        {project.description}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusPill tone={projectStatusTone[project.status]}>
                      {projectStatusLabels[project.status]}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusPill
                      tone={
                        project.confidentiality === "restricted"
                          ? "red"
                          : project.confidentiality === "nda_required"
                            ? "amber"
                            : "neutral"
                      }
                    >
                      <ShieldCheck className="size-3" aria-hidden />
                      {confidentialityLabels[project.confidentiality]}
                    </StatusPill>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-mute">
                    {formatDate(project.updated_at)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <a
                      className="text-xs font-medium text-ink hover:underline"
                      href={`/client/projets/${project.id}`}
                    >
                      Ouvrir →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ClientShell>
  );
}
