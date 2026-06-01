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
  const params = await searchParams;
  const redirectTo =
    params.redirect?.startsWith("/") && !params.redirect.startsWith("//")
      ? params.redirect
      : undefined;
  const user = await getCurrentUser();
  if (user) redirect(redirectTo ?? defaultRouteForRole(user.profile.role));

  return (
    <AuthShell
      eyebrow="Connexion"
      title="Retrouvez vos projets."
      subtitle="Connectez-vous pour suivre vos demandes, répondre aux messages et récupérer vos livrables."
      footer={
        <span>
          Votre espace rassemble les demandes en cours, les devis, les aperçus,
          les corrections et les fichiers finaux.
        </span>
      }
    >
      <SignInForm redirectTo={redirectTo} />
    </AuthShell>
  );
}
