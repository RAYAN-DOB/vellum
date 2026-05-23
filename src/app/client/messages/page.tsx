import { AppShell } from "@/components/layout/AppShell";
import { ProjectInbox } from "@/components/messages/ProjectInbox";
import { routes } from "@/lib/routes";

export default function ClientMessagesPage() {
  return (
    <AppShell
      activeHref={routes.roles.clientMessages}
      description="Inbox projet mockee pour suivre les questions manager, retours architecte, pieces fictives et demandes de precision."
      eyebrow="Espace client"
      title="Messages projet"
    >
      <ProjectInbox />
    </AppShell>
  );
}
