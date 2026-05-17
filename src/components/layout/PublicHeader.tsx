import { Container } from "@/components/layout/Container";
import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <a
          className="flex min-w-0 flex-col text-neutral-950"
          href={routes.public.home}
        >
          <span className="text-sm font-semibold uppercase tracking-wide">
            PlanWork MVP
          </span>
          <span className="text-xs text-neutral-500">Plans et livrables B2B</span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-1 md:flex"
        >
          {publicNavigation.map((item) => (
            <a
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-neutral-950 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          href={routes.workspace.newRequest}
        >
          Nouvelle demande
        </a>
      </Container>
    </header>
  );
}
