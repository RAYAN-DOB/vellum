import { VellumLogo } from "@/components/brand/VellumLogo";
import { publicNavigation, routes } from "@/lib/routes";

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "Conditions", href: "/conditions" },
] as const;

const productLinks = [
  { label: "Connexion", href: routes.public.login },
  { label: "Créer un compte", href: routes.public.register },
  { label: "Workflow", href: "#workflow" },
  { label: "Sécurité", href: "#securite" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-graphite bg-void">
      {/* Subtle top glow */}
      <div 
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />
      
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:px-10">
        {/* Brand column */}
        <div className="max-w-sm">
          <a
            href={routes.public.home}
            className="inline-flex items-center gap-3 group"
            aria-label="Vellum — accueil"
          >
            <VellumLogo size="sm" tone="gold" />
            <span className="font-display text-xl text-paper">Vellum</span>
          </a>
          <p className="mt-6 text-sm leading-relaxed text-silver">
            Le bureau de dépôt des projets techniques. DWG, PDF, croquis,
            schémas — un seul fil, quatre rôles, une traçabilité native.
          </p>
          
          {/* Social links placeholder */}
          <div className="mt-6 flex items-center gap-3">
            <SocialIcon label="Twitter" />
            <SocialIcon label="LinkedIn" />
            <SocialIcon label="GitHub" />
          </div>
        </div>

        <FooterColumn title="Produit" links={[...productLinks]} />
        <FooterColumn title="Navigation" links={[...publicNavigation]} />
        <FooterColumn title="Légal" links={[...legalLinks]} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-graphite">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center lg:px-10">
          <p className="text-xs text-dim">© {year} Vellum. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="caption text-dim">v1</span>
            <span className="h-3 w-px bg-graphite" />
            <span className="text-xs text-dim">Built with Next.js & Supabase</span>
          </div>
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
      <p className="caption text-gold">{title}</p>
      <ul className="mt-6 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-silver transition-colors hover:text-paper link-underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex size-9 items-center justify-center rounded-lg border border-graphite bg-obsidian/50 text-silver transition-all hover:border-gold/30 hover:text-gold"
      aria-label={label}
    >
      <span className="text-xs font-medium">{label[0]}</span>
    </a>
  );
}
