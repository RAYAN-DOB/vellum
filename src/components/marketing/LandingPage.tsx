import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { HeroPreview } from "@/components/marketing/HeroPreview";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { RolesGrid } from "@/components/marketing/RolesGrid";
import { SecurityBlock } from "@/components/marketing/SecurityBlock";
import { WorkflowStrip } from "@/components/marketing/WorkflowStrip";
import { routes } from "@/lib/routes";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicHeader />

      <main>
        <Hero />
        <PartnersStrip />
        <ProductShowcase />
        <WorkflowStrip />
        <RolesGrid />
        <SecurityBlock />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Hero — editorial, serif, paper-grid
   ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Calque background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper-dense opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-28 lg:pt-44">
        <div className="max-w-2xl">
          <div className="caption flex items-center gap-2.5">
            <span className="inline-block h-px w-8 bg-mute" />
            Bureau de dépôt · Projets techniques
          </div>

          <h1 className="display mt-7 text-[clamp(2.75rem,7vw,5.5rem)] text-ink">
            Le calque commun
            <br />
            de vos plans
            <br />
            <span className="italic text-graphite">techniques.</span>
          </h1>

          <p className="mt-8 max-w-xl text-[17px] leading-[1.65] text-graphite">
            Vellum centralise vos DWG, PDF, croquis et schémas dans un seul fil.
            Client, chef de projet et dessinateur travaillent sur la même
            référence — chaque révision tracée, chaque livrable validé.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={routes.public.register}
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-paper transition hover:bg-iron-hover"
            >
              Déposer votre premier projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#workflow"
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper px-6 text-[14px] font-medium text-ink transition hover:border-ink"
            >
              Voir le workflow
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
            <Stat value="DWG · PDF" label="Formats natifs" />
            <Stat value="4 rôles" label="Cloisonnés par projet" />
            <Stat value="RLS" label="Sécurité Postgres" />
          </dl>
        </div>

        <div className="relative">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl leading-none text-ink">{value}</dt>
      <dd className="caption mt-2">{label}</dd>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Partners strip — credibility ribbon
   ────────────────────────────────────────────────────────────────────────── */

function PartnersStrip() {
  const partners = [
    "Atelier Lambert",
    "BTP Conseil",
    "Studio Régent",
    "Plomb & Cie",
    "Cabinet Mercier",
    "Arches Bureau",
  ] as const;

  return (
    <section className="border-b border-line bg-vellum/40">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <p className="caption text-center">
          Utilisé par les bureaux d&apos;études et cabinets d&apos;architecture
        </p>
        <div className="mask-fade-x mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((name) => (
            <span
              key={name}
              className="font-display text-xl text-graphite/60 transition-colors hover:text-graphite"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Final CTA — wide, decisive
   ────────────────────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-28">
        <div>
          <p className="caption text-paper/55">Démarrer aujourd&apos;hui</p>
          <h2 className="display mt-5 text-[clamp(2.25rem,5.5vw,4rem)]">
            Un dépôt propre.
            <br />
            <span className="italic">Un livrable signé.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-paper/70">
            Créez un compte client en moins d&apos;une minute. Les autres rôles
            (chef de projet, dessinateur, admin) sont provisionnés par votre
            administrateur Vellum.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:flex-col lg:items-stretch">
          <a
            href={routes.public.register}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-paper px-7 text-[14px] font-medium text-ink transition hover:bg-white"
          >
            Créer un compte client
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href={routes.public.login}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-paper/20 px-7 text-[14px] font-medium text-paper transition hover:border-paper/50"
          >
            Se connecter
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
