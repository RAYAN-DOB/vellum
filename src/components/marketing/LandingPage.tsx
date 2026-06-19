import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LivingBlueprintHero } from "@/components/marketing/LivingBlueprintHero";
import { MotionSection } from "@/components/marketing/MotionSection";
import { ProductDemoFilm } from "@/components/marketing/ProductDemoFilm";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { SecurityBlock } from "@/components/marketing/SecurityBlock";
import { WorkflowStrip } from "@/components/marketing/WorkflowStrip";
import { routes } from "@/lib/routes";

const proofPoints = [
  "PDF · DWG · Croquis",
  "Plans 2D & aperçus 3D",
  "Devis & livrables",
  "Suivi avec dessinateur",
  "Corrections et validation",
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicHeader />

      <main>
        <Hero />
        <ProductDemoFilm />
        <TrustStrip />
        <MotionSection>
          <ProductShowcase />
        </MotionSection>
        <MotionSection>
          <WorkflowStrip />
        </MotionSection>
        <MotionSection>
          <SecurityBlock />
        </MotionSection>
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper-dense opacity-45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-paper via-paper/80 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-24 lg:pt-40">
        <div className="max-w-2xl">
          <h1 className="display text-balance text-[clamp(2.5rem,4.7vw,4rem)] text-ink">
            Déposez vos plans.
            <br />
            Suivez chaque correction
            <br />
            <span className="italic text-graphite">jusqu&apos;au livrable.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.65] text-graphite">
            Ajoutez vos PDF, DWG, croquis ou photos. Un dessinateur analyse
            votre demande, vous pose les bonnes questions, prépare les aperçus
            et vous livre les fichiers finaux.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={routes.public.deposit}
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-sienna px-6 text-[14px] font-medium text-paper transition hover:bg-sienna-dark"
            >
              Déposer un projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#demo"
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper/70 px-6 text-[14px] font-medium text-graphite transition hover:border-graphite hover:bg-vellum/70 hover:text-ink"
            >
              Voir comment ça marche
            </a>
          </div>

          <ul className="mt-10 grid gap-2 border-t border-line pt-7 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-[13px] font-medium text-graphite"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-sienna"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-w-0">
          <LivingBlueprintHero />
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    "Reprise de plans",
    "Corrections DWG/PDF",
    "Schémas techniques",
    "Maquettes d'avancement",
    "Livrables finaux",
  ] as const;

  return (
    <section className="border-b border-line bg-vellum/55">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mask-fade-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item) => (
            <span
              key={item}
              className="font-display text-xl text-graphite/72 transition-colors hover:text-graphite"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-24">
        <div>
          <h2 className="display text-[clamp(2.25rem,5.5vw,4rem)]">
            Commencez par vos plans.
            <br />
            <span className="italic">Vellum organise la suite.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-paper/70">
            Décrivez votre besoin maintenant. Votre espace client sera demandé
            seulement au moment d&apos;envoyer le dossier et de suivre les
            échanges.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:flex-col lg:items-stretch">
          <a
            href={routes.public.deposit}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-sienna px-7 text-[14px] font-medium text-paper transition hover:bg-sienna-dark"
          >
            Déposer un projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href={routes.public.login}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-paper/20 px-7 text-[14px] font-medium text-paper transition hover:border-paper/50"
          >
            Retrouver mes projets
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
