import { ClientShell } from "@/components/shells/ClientShell";
import { ClientOnboardingFlow } from "@/components/onboarding/ClientOnboardingFlow";
import { routes } from "@/lib/routes";

export default function ClientOnboardingPage() {
  return (
    <ClientShell
      activeHref={routes.client.onboarding}
      description="Préparez votre premier dépôt en quelques étapes : votre profil, votre besoin, les documents disponibles, le niveau d'urgence et un récapitulatif."
      eyebrow="Bienvenue"
      title="Prise en main"
    >
      <ClientOnboardingFlow />
    </ClientShell>
  );
}
