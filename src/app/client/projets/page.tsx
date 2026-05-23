import { ClientProjectList } from "@/components/project/ClientProjectList";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function ClientProjectsPage() {
  return (
    <AppShell
      activeHref={routes.roles.clientProjects}
      description="Vue client des projets de demonstration : statuts, documents prepares, prochaines actions et contact manager."
      eyebrow="Espace client"
      title="Mes projets"
    >
      <ClientProjectList />
    </AppShell>
  );
}
