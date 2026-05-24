import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Créer un compte — PlanWork",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(defaultRouteForRole(user.profile.role));

  return (
    <AuthShell
      eyebrow="Nouveau client"
      title="Ouvrez votre cockpit client en 60 secondes."
      subtitle="Créez un compte client pour déposer un projet, suivre la qualification, échanger avec le chef de projet et valider vos livrables."
      footer={
        <span>
          Les comptes architecte, chef de projet et administrateur sont créés
          par votre administrateur PlanWork — l'inscription publique est
          réservée aux clients.
        </span>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
