import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

type SearchParams = Promise<{ redirect?: string }>;

export const metadata = {
  title: "Créer un compte — Vellum",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (user) redirect(defaultRouteForRole(user.profile.role));
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Inscription"
      title="Créez votre espace de suivi."
      subtitle="Votre espace vous permet de retrouver votre dossier, d'échanger avec le dessinateur, de recevoir les devis, les aperçus et les livrables."
      footer={
        <span>
          Si vous avez commencé un dépôt sans compte, votre brouillon sera
          repris après création de l&apos;espace.
        </span>
      }
    >
      <SignUpForm redirectTo={params.redirect} />
    </AuthShell>
  );
}
