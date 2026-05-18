import { Container } from "@/components/layout/Container";
import { publicNavigation, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="technical-grid-dark border-t border-slate-800 bg-slate-950 text-white">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-normal">PlanWork</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Socle MVP pour piloter des demandes de plans techniques, livrables
            et corrections avec une attention forte portee a la confidentialite
            et au cloisonnement futur des projets.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Donnees fictives uniquement. Aucun fichier client reel, DWG, PDF,
            croquis ou document confidentiel n&apos;est stocke dans cette version.
          </p>
        </div>

        <nav
          aria-label="Navigation secondaire"
          className="flex flex-wrap gap-x-4 gap-y-3 md:justify-end"
        >
          <a
            className="text-sm font-medium text-slate-300 hover:text-white"
            href={routes.public.home}
          >
            Accueil
          </a>
          {publicNavigation.map((item) => (
            <a
              className="text-sm font-medium text-slate-300 hover:text-white"
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
