import { ArrowRight, ShieldOff } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { defaultRouteForRole, getCurrentUser, roleLabels } from "@/lib/auth";

type SearchParams = Promise<{ reason?: string }>;

export const metadata = {
  title: "Accès refusé",
};

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const { reason } = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-60"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="Vellum — retour à l'accueil"
        >
          <VellumLogo size="sm" tone="ink" />
          <span className="font-display text-lg leading-none">Vellum</span>
        </a>
        <a
          href="/"
          className="caption text-mute transition-colors hover:text-ink"
        >
          ← Accueil
        </a>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-start justify-center px-6 lg:px-10">
        <span
          aria-hidden="true"
          className="inline-flex size-12 items-center justify-center rounded-full border border-line-strong bg-vellum/60"
        >
          <ShieldOff className="size-5 text-graphite" />
        </span>

        <p className="caption mt-8">
          {reason === "inactive" ? "Compte désactivé" : "Accès refusé"}
        </p>

        <h1 className="display mt-4 text-[clamp(2.5rem,5vw,4.25rem)] text-ink">
          Cette zone n&apos;est pas
          <br />
          <span className="italic">accessible ici.</span>
        </h1>

        <p className="mt-6 max-w-xl text-[16px] leading-[1.7] text-graphite">
          {reason === "inactive"
            ? "Votre accès a été suspendu. Contactez l'équipe Vellum pour le rétablir."
            : "Cette section n'est pas accessible depuis votre espace. Revenez à votre espace, ou changez de compte si vous en avez plusieurs."}
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          {user ? (
            <>
              <a
                href={defaultRouteForRole(user.profile.role)}
                className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition hover:bg-iron-hover"
              >
                Aller à mon espace {roleLabels[user.profile.role]}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <SignOutButton variant="outline" />
            </>
          ) : (
            <a
              href="/login"
              className="group inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition hover:bg-iron-hover"
            >
              Se connecter
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
