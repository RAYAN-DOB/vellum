import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ded7c8] bg-[#f4f1ea]/88 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <a
          className="group flex min-w-0 items-center gap-3 text-[#171613]"
          href={routes.public.home}
          aria-label="Retour a l'accueil"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[3px] border border-[#3c3932] bg-[#171613] text-sm font-semibold text-[#f7f3ea] shadow-sm">
            PW
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold tracking-normal">
              PlanWork
            </span>
            <span className="hidden text-xs text-[#7a7467] sm:block">
              Drawing office cockpit
            </span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 lg:flex"
        >
          {publicNavigation.map((item) => (
            <a
              className="rounded-[3px] px-3 py-2 text-sm font-medium text-[#5e594d] transition-colors hover:bg-[#e7dfd0] hover:text-[#171613]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button asChild className="shrink-0">
          <a href={routes.roles.clientNewProject}>Deposer un projet</a>
        </Button>
      </Container>
    </header>
  );
}
