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
  client: { eyebrow: "Espace client", tagline: "Dépôt · Suivi · Validation" },
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
 * Premium dark shell for all role-specific interfaces
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
    <div className="min-h-screen bg-abyss text-paper">
      {/* Top bar — glass morphism with glow */}
      <header className="relative z-30 border-b border-graphite bg-obsidian/80 backdrop-blur-xl">
        {/* Subtle top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Vellum — accueil"
          >
            <VellumLogo size="sm" tone="gold" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base text-paper">Vellum</span>
              <span className="caption mt-1 hidden text-dim sm:block">
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

      <Container className="grid min-w-0 gap-8 py-8 lg:grid-cols-[260px_1fr] lg:gap-10 lg:py-10">
        {/* Side navigation */}
        <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start">
          <p className="caption mb-4 hidden text-gold lg:block">{meta.eyebrow}</p>
          <nav
            aria-label={`Navigation ${meta.eyebrow.toLowerCase()}`}
            className="grid grid-cols-2 gap-2 lg:grid-cols-1"
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
                    "group relative flex min-w-0 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all overflow-hidden",
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : item.emphasis
                        ? "bg-slate/50 text-paper border border-graphite hover:border-gold/30 hover:bg-gold/5"
                        : "border border-transparent text-silver hover:border-graphite hover:bg-slate/30 hover:text-paper",
                  )}
                >
                  {/* Hover glow */}
                  {!isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  )}
                  
                  {item.icon ? (
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 relative transition-colors",
                        isActive ? "text-gold" : "text-dim group-hover:text-silver"
                      )}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 shrink-0 rounded-full relative",
                        isActive ? "bg-gold" : "bg-dim",
                      )}
                    />
                  )}
                  <span className="truncate relative">{item.label}</span>
                  
                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gold rounded-r-full" />
                  )}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          <header className="border-b border-graphite pb-8">
            <p className="caption text-gold">{eyebrow ?? meta.eyebrow}</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-3xl">
                <h1 className="display text-[clamp(2rem,4.5vw,3.25rem)] text-paper">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-4 text-base leading-relaxed text-silver">
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
