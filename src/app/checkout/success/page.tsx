import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { routes } from "@/lib/routes";

export const metadata = { title: "Paiement confirmé" };

export default function CheckoutSuccessPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5"
          aria-label="Vellum — accueil"
        >
          <VellumLogo size="sm" tone="ink" withWordmark />
        </Link>

        <div className="mt-8 rounded-[4px] border border-line-strong bg-paper p-8 shadow-[var(--shadow-e2)]">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-pine/40 bg-pine-tint">
            <CheckCircle2 className="size-6 text-pine" aria-hidden="true" />
          </span>
          <p className="caption mt-6">Paiement confirmé</p>
          <h1 className="mt-2 font-display text-3xl text-ink">
            Votre projet est lancé.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-6 text-graphite">
            Le dessinateur peut démarrer la production. Vous serez prévenu à
            chaque étape : aperçu, corrections, livraison.
          </p>

          <div className="mt-6 rounded-[3px] border border-line bg-vellum/30 p-4 text-left">
            <p className="caption">Prochaine étape</p>
            <p className="mt-1.5 text-[13px] leading-6 text-graphite">
              Suivez l&apos;avancement et échangez avec le dessinateur depuis
              votre espace projet.
            </p>
          </div>

          <Link
            href={routes.client.home}
            className="group mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pine px-6 text-[14px] font-medium text-paper transition hover:bg-pine-hover"
          >
            Suivre mon projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
