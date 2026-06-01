import type { ComponentType, ReactNode, SVGProps } from "react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { CommandPalette } from "@/components/command/CommandPalette";
import { Container } from "@/components/layout/Container";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  emphasis?: boolean;
};

type ShellAccent = "client" | "studio" | "manager" | "admin";

const accentMap: Record<ShellAccent, { eyebrow: string; tagline: string }> = {
  client: { eyebrow: "Espace client", tagline: "Plans · Suivi · Livrables" },
  studio: { eyebrow: "Atelier", tagline: "Production · Livrables" },
  manager: { eyebrow: "Chef de projet", tagline: "Cockpit · Pilotage" },
  admin: { eyebrow: "Administration", tagline: "Contrôle · Audit" },
};

type BaseShellProps = {
  accent: ShellAccent;
  navigation: ReadonlyArray<NavItem>;
  activeHref: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Shared chrome for every role-specific shell.
 * Each role app wraps this with its own navigation array + accent + content.
 */
export function BaseShell({
  accent,
  navigation,
  activeHref,
  eyebrow,
  title,
  description,
  actions,
  children,
}: BaseShellProps) {
  const meta = accentMap[accent];

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top bar — dark ink, identity + role switcher slot */}
      <header className="relative z-30 border-b border-line-strong/40 bg-ink text-paper">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Vellum — accueil"
          >
            <VellumLogo size="sm" tone="paper" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base text-paper">Vellum</span>
              <span className="caption mt-1 hidden text-paper/55 sm:block">
                {meta.tagline}
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <CommandPalette />
            <NotificationBell />
            <UserMenu />
          </div>
        </Container>
      </header>

      <Container className="grid min-w-0 gap-8 py-8 lg:grid-cols-[240px_1fr] lg:gap-10 lg:py-10">
        {/* Side navigation */}
        <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <p className="caption mb-3 hidden lg:block">{meta.eyebrow}</p>
          <nav
            aria-label={`Navigation ${meta.eyebrow.toLowerCase()}`}
            className="grid grid-cols-2 gap-1.5 lg:grid-cols-1"
          >
            {navigation.map((item) => {
              const isActive =
                activeHref === item.href ||
                (item.href !== "/" && activeHref.startsWith(item.href + "/"));
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-[3px] border px-3 py-2 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-ink bg-ink text-paper"
                      : item.emphasis
                        ? "border-line-strong bg-vellum/60 text-ink hover:border-ink hover:bg-vellum"
                        : "border-transparent text-graphite hover:border-line-strong hover:bg-vellum/40 hover:text-ink",
                  )}
                >
                  {item.icon ? (
                    <item.icon
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1 shrink-0 rounded-full",
                        isActive ? "bg-paper" : "bg-mute",
                      )}
                    />
                  )}
                  <span className="truncate">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <header className="border-b border-line pb-8">
            <p className="caption">{eyebrow ?? meta.eyebrow}</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-3xl">
                <h1 className="display text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-4 text-[15px] leading-[1.65] text-graphite">
                    {description}
                  </p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
              ) : null}
            </div>
          </header>

          <div className="pt-10">{children}</div>
        </main>
      </Container>
    </div>
  );
}
