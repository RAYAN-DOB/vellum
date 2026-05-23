import {
  FilePlus2,
  Home,
  LayoutDashboard,
  Mail,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { CommandPalette } from "@/components/command/CommandPalette";
import { Container } from "@/components/layout/Container";
import { DemoRoleSwitcher } from "@/components/layout/DemoRoleSwitcher";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { ArchitecturalGridBackground } from "@/components/ui/ArchitecturalGridBackground";
import { cn } from "@/lib/utils";
import {
  roleNavigation,
  routes,
  workspaceNavigation,
  workspaceSecondaryNavigation,
} from "@/lib/routes";

type AppShellProps = {
  activeHref: string;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

const roleIcons = {
  [routes.roles.client]: UserRound,
  [routes.roles.clientMessages]: Mail,
  [routes.roles.clientNewProject]: FilePlus2,
  [routes.roles.clientOnboarding]: UserRound,
  [routes.roles.clientSettings]: SlidersHorizontal,
  [routes.roles.clientProjects]: LayoutDashboard,
  [routes.roles.projectManager]: UsersRound,
  [routes.roles.projectManagerQuotes]: ReceiptText,
  [routes.roles.drafter]: ShieldCheck,
  [routes.roles.admin]: UserCog,
} as const;

const workspaceIcons = {
  [routes.workspace.dashboard]: LayoutDashboard,
  [routes.workspace.newRequest]: FilePlus2,
} as const;

export function AppShell({
  activeHref,
  eyebrow = "Demo V1",
  title,
  description,
  children,
  actions,
}: AppShellProps) {
  return (
    <div className="paper-grid min-h-screen bg-[#f4f1ea] text-[#171613]">
      <header className="border-b border-[#34312b] bg-[#171613] text-[#f7f3ea]">
        <Container className="flex min-h-16 items-center justify-between gap-4">
          <a className="flex items-center gap-3" href={routes.public.home}>
            <span className="flex size-9 items-center justify-center rounded-[3px] border border-[#f7f3ea]/18 bg-[#24221d] text-sm font-semibold text-[#f7f3ea] shadow-[0_0_28px_rgba(215,198,164,0.10)]">
              PW
            </span>
            <span>
              <span className="block text-sm font-semibold">PlanWork</span>
              <span className="hidden text-xs text-[#8f8777] sm:block">
                Architectural project cockpit
              </span>
            </span>
          </a>
          <a
            className="hidden h-10 shrink-0 items-center justify-center gap-2 rounded-[3px] border border-[#f7f3ea]/12 bg-[#f7f3ea]/5 px-4 text-sm font-medium text-[#d9d0bf] transition hover:bg-[#f7f3ea]/10 hover:text-[#f7f3ea] sm:inline-flex"
            href={routes.public.home}
          >
            <Home className="size-4" aria-hidden="true" />
            Accueil public
          </a>
          <div className="flex items-center gap-2">
            <CommandPalette />
            <NotificationCenter />
          </div>
        </Container>
      </header>

      <Container className="grid min-w-0 gap-6 py-6 lg:grid-cols-[260px_1fr] lg:py-8">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <nav
            aria-label="Navigation interne"
            className="min-w-0 overflow-hidden rounded-[4px] border border-[#d8d0bf] bg-[#fbfaf6]/86 p-3 shadow-[0_24px_70px_rgba(22,21,18,0.08)] backdrop-blur"
          >
            <div className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f] lg:block">
              Pilotage
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
              {workspaceNavigation.map((item) => {
                const Icon = workspaceIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex shrink-0 items-center gap-3 rounded-[3px] px-3 py-2 text-sm font-medium transition",
                      activeHref === item.href
                        ? "bg-[#171613] text-[#f7f3ea] shadow-[0_12px_25px_rgba(22,21,18,0.16)]"
                        : "text-[#6b665a] hover:bg-[#eee8dc] hover:text-[#171613]",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-4 hidden px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f] lg:mt-5 lg:block">
              Exemples
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
              {workspaceSecondaryNavigation.map((item) => (
                <a
                  aria-current={activeHref === item.href ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-[3px] px-3 py-2 text-sm font-medium transition",
                    activeHref === item.href
                      ? "bg-[#171613] text-[#f7f3ea] shadow-[0_12px_25px_rgba(22,21,18,0.16)]"
                      : "text-[#6b665a] hover:bg-[#eee8dc] hover:text-[#171613]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-4 hidden px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7a5f] lg:mt-5 lg:block">
              Espaces metier
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
              {roleNavigation.map((item) => {
                const Icon = roleIcons[item.href];

                return (
                  <a
                    aria-current={activeHref === item.href ? "page" : undefined}
                    className={cn(
                      "flex shrink-0 items-center gap-3 rounded-[3px] px-3 py-2 text-sm font-medium transition",
                      activeHref === item.href
                        ? "bg-[#2b2923] text-[#f7f3ea] shadow-[0_12px_25px_rgba(22,21,18,0.18)]"
                        : "text-[#6b665a] hover:bg-[#eee8dc] hover:text-[#171613]",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-5 hidden rounded-[3px] border border-[#e4c887] bg-[#fbf2dd] p-3 text-xs leading-5 text-[#7a5213] lg:block">
              V1 front statique : les vues simulent les futurs roles, sans auth
              ni controle serveur.
            </div>

            <div className="mt-4 hidden lg:block">
              <DemoRoleSwitcher activeHref={activeHref} />
            </div>
          </nav>
        </aside>

        <main className="min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden sm:max-w-full">
          <ArchitecturalGridBackground className="mb-6 rounded-[6px] border border-[#3c3932] p-5 shadow-[0_32px_90px_rgba(22,21,18,0.18)] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-white">
                {title}
              </h1>
              <p className="mt-3 max-w-[20rem] break-words text-sm leading-6 text-[#cfc6b5] sm:max-w-3xl">
                {description}
              </p>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
          </ArchitecturalGridBackground>

          {children}
        </main>
      </Container>
    </div>
  );
}
