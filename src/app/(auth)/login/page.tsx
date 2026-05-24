import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

type SearchParams = Promise<{ redirect?: string }>;

export const metadata = {
  title: "Connexion — Vellum",
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
      eyebrow="Connexion"
      title="Reprenez le fil."
      subtitle="Accédez à votre espace client, à la file de qualification chef de projet, à votre table de dessin ou à la console d'administration."
      footer={
        <span>
          Vos accès sont nominatifs et journalisés. Si vous avez perdu votre
          mot de passe, contactez votre administrateur Vellum.
        </span>
      }
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
