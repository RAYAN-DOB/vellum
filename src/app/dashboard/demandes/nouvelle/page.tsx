import { NewRequestForm } from "@/components/forms/NewRequestForm";
import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/lib/routes";

export default function NewRequestPage() {
  return (
    <AppShell
      activeHref={routes.workspace.newRequest}
      description="Formulaire de demo pour structurer un besoin technique avant tout upload reel : contexte, formats attendus, priorite, delai et confidentialite."
      title="Creer une demande demo"
    >
      <NewRequestForm />
    </AppShell>
  );
}
