import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

type SearchParams = Promise<{ redirect?: string }>;

export const metadata = {
  title: "Connexion — PlanWork",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (user) redirect(defaultRouteForRole(user.profile.role));

  const params = await searchParams;
  const redirectTo = params.redirect;

  return (
    <AuthShell
      eyebrow="Espace privé"
      title="Reprenez la main sur vos projets techniques."
      subtitle="Connectez-vous pour accéder à votre cockpit client, à la file de qualification chef de projet, à votre table de dessin ou à la console d'administration."
      footer={
        <span>
          Vos accès sont nominatifs et journalisés. Si vous avez perdu votre
          mot de passe, contactez votre administrateur PlanWork.
        </span>
      }
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
