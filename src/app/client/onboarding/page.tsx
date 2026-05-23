import { AppShell } from "@/components/layout/AppShell";
import { ClientOnboardingFlow } from "@/components/onboarding/ClientOnboardingFlow";
import { routes } from "@/lib/routes";

export default function ClientOnboardingPage() {
  return (
    <AppShell
      activeHref={routes.roles.clientOnboarding}
      description="Parcours mocke pour preparer le premier depot : profil, besoin, documents disponibles, urgence et resume."
      eyebrow="Espace client"
      title="Onboarding client"
    >
      <ClientOnboardingFlow />
    </AppShell>
  );
}
