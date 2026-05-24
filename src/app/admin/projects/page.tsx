import { Folder } from "lucide-react";

import { AdminShell } from "@/components/shells/AdminShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireRole } from "@/lib/auth";
import { listProjectsForManager } from "@/lib/projects";
import { projectStatusLabels } from "@/lib/project-display";
import { routes } from "@/lib/routes";

export const metadata = { title: "Projets (global)" };

export default async function AdminProjectsPage() {
  await requireRole("admin");
  const projects = await listProjectsForManager();

  return (
    <AdminShell
      activeHref={routes.admin.projects}
      title="Tous les projets — vue admin"
      description="Visibilité complète sur les dossiers, toutes phases et tous rôles confondus. Aucun filtre RLS pour l'admin."
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={Folder}
          caption="Aucun projet"
          title="La base de projets est vide."
          description="Dès qu'un client dépose un projet, il apparaîtra ici. Vous voyez tout — c'est le privilège admin."
        />
      ) : (
        <div className="overflow-hidden rounded-[3px] border border-line">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-vellum/40">
              <tr className="border-b border-line text-left text-mute">
                <th className="px-4 py-3 caption">Référence</th>
                <th className="px-4 py-3 caption">Titre</th>
                <th className="px-4 py-3 caption">Statut</th>
                <th className="px-4 py-3 caption">Client</th>
                <th className="px-4 py-3 caption">Dessinateur</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line/60 transition-colors hover:bg-vellum/30"
                >
                  <td className="px-4 py-3 font-mono text-[12px] text-mute">
                    {p.reference ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-4 py-3 text-graphite">
                    {projectStatusLabels[p.status]}
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    {p.client?.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    {p.architect?.full_name ?? "non assigné"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
