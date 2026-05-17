import { Container } from "@/components/layout/Container";
import { publicNavigation, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-950">PlanWork MVP</p>
          <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-600">
            Plateforme de demonstration pour demandes techniques B2B, sans
            document client reel ni stockage sensible.
          </p>
        </div>

        <nav aria-label="Navigation secondaire" className="flex flex-wrap gap-3">
          <a
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950"
            href={routes.public.home}
          >
            Accueil
          </a>
          {publicNavigation.map((item) => (
            <a
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
