import { NewRequestForm } from "@/components/forms/NewRequestForm";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function NewRequestPage() {
  return (
    <AppShell
      activeHref={routes.workspace.newRequest}
      description="Parcours front statique pour cadrer une demande technique sans upload reel, sans backend et sans donnee sensible."
      title="Nouvelle demande"
    >
      <NewRequestForm />
    </AppShell>
  );
}
