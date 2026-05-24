import { ClientShell } from "@/components/shells/ClientShell";
import { ClientOnboardingFlow } from "@/components/onboarding/ClientOnboardingFlow";
import { routes } from "@/lib/routes";

export default function ClientOnboardingPage() {
  return (
    <ClientShell
      activeHref={routes.client.onboarding}
      description="Parcours mocke pour preparer le premier depot : profil, besoin, documents disponibles, urgence et resume."
      eyebrow="Espace client"
      title="Onboarding client"
    >
      <ClientOnboardingFlow />
    </ClientShell>
  );
}
