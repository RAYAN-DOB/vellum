import { Container } from "@/components/layout/Container";
import { publicNavigation, routes } from "@/lib/routes";

export function Footer() {
  return (
    <footer className="drawing-line border-t border-[#34312b] bg-[#171613] text-[#f7f3ea]">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-normal">PlanWork</p>
          <p className="mt-3 text-sm leading-6 text-[#cfc6b5]">
            V1 de demonstration pour cadrer, suivre et presenter des demandes
            de plans techniques, reprises DWG/PDF, corrections et livrables.
          </p>
          <p className="mt-4 text-xs leading-5 text-[#8b8374]">
            Donnees fictives uniquement. Aucun fichier client reel, DWG, PDF,
            croquis ou document confidentiel n&apos;est stocke dans cette version.
          </p>
        </div>

        <nav
          aria-label="Navigation secondaire"
          className="flex flex-wrap gap-x-4 gap-y-3 md:justify-end"
        >
          <a
            className="text-sm font-medium text-[#cfc6b5] hover:text-[#f7f3ea]"
            href={routes.public.home}
          >
            Accueil
          </a>
          {publicNavigation.map((item) => (
            <a
              className="text-sm font-medium text-[#cfc6b5] hover:text-[#f7f3ea]"
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
