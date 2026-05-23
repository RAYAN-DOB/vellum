import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <a
          className="group flex min-w-0 items-center gap-3 text-slate-950"
          href={routes.public.home}
          aria-label="Retour a l'accueil"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white shadow-sm">
            PW
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold tracking-normal">
              PlanWork
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Secure project ops
            </span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 lg:flex"
        >
          {publicNavigation.map((item) => (
            <a
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button asChild className="shrink-0">
          <a href={routes.workspace.newRequest}>Creer une demande</a>
        </Button>
      </Container>
    </header>
  );
}
