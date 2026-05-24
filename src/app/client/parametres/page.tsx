import { ClientShell } from "@/components/shells/ClientShell";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { requireUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Paramètres — Vellum",
};

export default async function ClientSettingsRoute() {
  const user = await requireUser();

  return (
    <ClientShell
      activeHref={routes.client.settings}
      eyebrow="Paramètres"
      title="Votre profil Vellum"
      description="Mettez à jour vos informations personnelles. Seul un administrateur peut modifier votre rôle ou désactiver votre compte."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-5 sm:p-6">
          <ProfileSettingsForm profile={user.profile} />
        </section>

        <aside className="space-y-3">
          <div className="rounded-[6px] border border-[#d8d0bf] bg-[#f8f5ed] p-4 text-xs leading-5 text-[#6b665a]">
            Vos accès sont journalisés. Toute modification de rôle ou
            désactivation passe par un administrateur Vellum.
          </div>
          <div className="rounded-[6px] border border-[#d8d0bf] bg-white/95 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8a7a5f]">
              Session
            </p>
            <p className="mt-2 text-sm text-[#171613]">{user.email}</p>
            <div className="mt-3">
              <SignOutButton />
            </div>
          </div>
        </aside>
      </div>
    </ClientShell>
  );
}
