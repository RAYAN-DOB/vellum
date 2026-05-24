import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { defaultRouteForRole, getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Mot de passe oublié",
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();
  if (user) redirect(defaultRouteForRole(user.profile.role));

  return (
    <AuthShell
      eyebrow="Mot de passe"
      title="Réinitialisez l'accès."
      subtitle="Indiquez l'email associé à votre compte Vellum. Si une correspondance existe, un lien vous est envoyé pour définir un nouveau mot de passe."
      footer={
        <span>
          Pour des raisons de sécurité, nous ne confirmons jamais l&apos;existence
          d&apos;un compte par email — la même réponse vous est renvoyée quoi qu&apos;il
          arrive.
        </span>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
