import { VellumLogo } from "@/components/brand/VellumLogo";
import { publicNavigation, routes } from "@/lib/routes";

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Conditions", href: "/conditions" },
] as const;

const productLinks = [
  { label: "Déposer un projet", href: routes.public.deposit },
  { label: "Connexion", href: routes.public.login },
  { label: "Créer un compte", href: routes.public.register },
  { label: "Workflow", href: "#workflow" },
  { label: "Sécurité", href: "#securite" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-10">
        <div className="max-w-sm">
          <a
            href={routes.public.home}
            className="inline-flex items-center gap-2.5"
            aria-label="Vellum — accueil"
          >
            <VellumLogo size="sm" tone="ink" />
            <span className="font-display text-xl text-ink">Vellum</span>
          </a>
          <p className="mt-5 text-[14px] leading-[1.65] text-mute">
            Le bureau de dépôt des projets techniques. Ajoutez vos plans,
            échangez avec un dessinateur, validez les aperçus et récupérez vos
            livrables.
          </p>
        </div>

        <FooterColumn title="Produit" links={[...productLinks]} />
        <FooterColumn title="Navigation" links={[...publicNavigation]} />
        <FooterColumn title="Légal" links={[...legalLinks]} />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-[12px] text-mute sm:flex-row sm:items-center lg:px-10">
          <p>© {year} Vellum. Tous droits réservés.</p>
          <p className="caption">Plans · Corrections · Livrables</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="caption">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="draft-link text-[14px] text-graphite transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
