import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Créer un compte — Vellum",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(defaultRouteForRole(user.profile.role));

  return (
    <AuthShell
      eyebrow="Inscription"
      title="Ouvrez votre dossier."
      subtitle="En 60 secondes : un compte client pour déposer un projet, suivre la qualification, échanger avec le chef de projet et valider vos livrables."
      footer={
        <span>
          Les comptes dessinateur, chef de projet et administrateur sont créés
          par votre administrateur Vellum — l&apos;inscription publique est
          réservée aux clients.
        </span>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
