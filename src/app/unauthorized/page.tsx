import { ShieldAlert } from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { defaultRouteForRole, getCurrentUser, roleLabels } from "@/lib/auth";

type SearchParams = Promise<{ reason?: string }>;

export const metadata = {
  title: "Accès refusé — PlanWork",
};

export default async function UnauthorizedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const { reason } = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070706] text-[#f7f3ea]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,244,234,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(248,244,234,0.2) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full border border-[#d7c6a4]/40 bg-[#1c1a16]">
          <ShieldAlert className="size-6 text-[#d7c6a4]" aria-hidden />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7c6a4]">
          Accès refusé
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Cette zone est réservée à un autre rôle.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#cfc6b5] sm:text-base">
          {reason === "inactive"
            ? "Votre compte a été désactivé. Contactez un administrateur PlanWork pour rétablir l'accès."
            : "Votre rôle ne donne pas accès à cette section. Revenez à votre espace ou changez de compte."}
        </p>

        {user ? (
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={defaultRouteForRole(user.profile.role)}
              className="inline-flex h-11 items-center justify-center rounded-[3px] bg-[#f7f3ea] px-5 text-sm font-semibold text-[#171613] hover:bg-white"
            >
              Aller à mon espace {roleLabels[user.profile.role]}
            </a>
            <SignOutButton variant="ghost-light" />
          </div>
        ) : (
          <a
            href="/login"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-[3px] bg-[#f7f3ea] px-5 text-sm font-semibold text-[#171613] hover:bg-white"
          >
            Se connecter
          </a>
        )}
      </main>
    </div>
  );
}
