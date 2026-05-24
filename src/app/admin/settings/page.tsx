import {
  AtSign,
  Bell,
  Building2,
  Globe,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { AdminShell } from "@/components/shells/AdminShell";
import { requireRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export const metadata = { title: "Paramètres" };

type AppPolicy = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  value: unknown;
};

const SETTINGS_GROUPS = [
  {
    icon: Building2,
    title: "Identité commerciale",
    description: "Nom affiché, logo, signature légale dans les emails.",
    policies: ["branding.product_name", "branding.legal_name"],
  },
  {
    icon: AtSign,
    title: "E-mails transactionnels",
    description:
      "Adresse d'expédition, templates de confirmation, invitations utilisateur.",
    policies: ["email.sender", "email.reply_to"],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Types d'événements qui déclenchent une notification client.",
    policies: ["notifications.client.events", "notifications.team.events"],
  },
  {
    icon: ShieldCheck,
    title: "Sécurité",
    description: "Politique de mot de passe, MFA, durée de session.",
    policies: ["security.password_min_length", "security.mfa_required"],
  },
  {
    icon: Globe,
    title: "Intégrations",
    description: "Webhooks, exports, API publique.",
    policies: ["integrations.webhooks", "integrations.api_enabled"],
  },
  {
    icon: Palette,
    title: "Apparence",
    description: "Thème, langue par défaut, fuseau horaire.",
    policies: ["appearance.locale", "appearance.timezone"],
  },
] as const;

export default async function AdminSettingsPage() {
  await requireRole("admin");

  const supabase = await createSupabaseServerClient();
  const { data: policiesData } = await supabase
    .from("app_policies")
    .select("id, key, name, description, value");

  const policies = (policiesData ?? []) as AppPolicy[];
  const byKey = new Map(policies.map((p) => [p.key, p]));

  return (
    <AdminShell
      activeHref={routes.admin.settings}
      title="Paramètres globaux"
      description="Configuration de la plateforme Vellum. Les valeurs courantes proviennent de la table app_policies. L'édition s'effectue via la console Politiques applicatives."
    >
      <div className="space-y-12">
        <section className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SETTINGS_GROUPS.map((group) => {
            const found = group.policies
              .map((k) => byKey.get(k))
              .filter((p): p is AppPolicy => Boolean(p));
            return (
              <article
                key={group.title}
                className="flex flex-col gap-4 bg-paper p-6"
              >
                <div className="flex items-start justify-between">
                  <group.icon
                    className="size-5 text-graphite"
                    aria-hidden="true"
                  />
                  <span className="caption">
                    {found.length} / {group.policies.length}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg leading-tight text-ink">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-mute">
                    {group.description}
                  </p>
                </div>
                {found.length > 0 ? (
                  <dl className="mt-2 space-y-2 border-t border-line pt-3">
                    {found.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <dt className="caption truncate text-[10px]">
                          {p.name}
                        </dt>
                        <dd className="truncate font-mono text-[11px] text-ink">
                          {formatValue(p.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-2 text-[12px] italic text-soft">
                    Non configuré
                  </p>
                )}
              </article>
            );
          })}
        </section>

        <section className="rounded-[4px] border border-line bg-vellum/40 p-6">
          <p className="caption">Édition</p>
          <p className="mt-3 text-[14px] leading-[1.65] text-graphite">
            L&apos;édition des paramètres s&apos;effectue dans la console
            Politiques applicatives. Chaque modification est journalisée dans
            l&apos;audit log avec l&apos;identité de l&apos;administrateur.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={routes.admin.policies}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition hover:bg-iron-hover"
            >
              Ouvrir Politiques applicatives
            </a>
            <a
              href={routes.admin.audit}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 text-[13px] font-medium text-graphite transition hover:border-ink hover:text-ink"
            >
              Voir l&apos;audit log
            </a>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "actif" : "inactif";
  if (typeof value === "number") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "—";
  }
}
