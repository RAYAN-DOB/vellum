import { AppShell } from "@/components/layout/AppShell";
import { QuoteBuilderMock } from "@/components/roles/QuoteBuilderMock";
import { routes } from "@/lib/routes";

export default function ProjectManagerQuotesPage() {
  return (
    <AppShell
      activeHref={routes.roles.projectManagerQuotes}
      description="Constructeur de devis front-only pour presenter la future validation commerciale, sans paiement ni facture reelle."
      eyebrow="Manager"
      title="Devis mocke"
    >
      <QuoteBuilderMock />
    </AppShell>
  );
}
