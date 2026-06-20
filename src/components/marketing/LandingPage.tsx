import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { InstantEstimate } from "@/components/marketing/InstantEstimate";
import { MotionSection } from "@/components/marketing/MotionSection";
import { Hero3D } from "@/components/three/Hero3D";
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
        <MotionSection>
          <InstantEstimate />
        </MotionSection>
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
          <span className="inline-flex items-center gap-2 rounded-full border border-pine/30 bg-pine-tint px-3 py-1 text-[12px] font-medium text-pine-active">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-pine" />
            Plans techniques · Schémas · Rendus 3D
          </span>

          <h1 className="display mt-5 text-balance text-[clamp(2.5rem,4.7vw,4rem)] text-ink">
            De votre croquis
            <br />
            au plan professionnel.
            <br />
            <span className="italic text-graphite">2D, 3D, livré.</span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.65] text-graphite">
            Un dessinateur réalise vos plans techniques, schémas et aperçus 3D à
            partir d&apos;un simple croquis, d&apos;une photo ou d&apos;un cahier
            des charges. Devis clair, corrections suivies, fichiers livrés.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={routes.public.deposit}
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-pine to-canard px-6 text-[14px] font-medium text-paper shadow-[0_10px_30px_-8px_rgba(15,118,110,0.5)] transition hover:shadow-[0_16px_40px_-8px_rgba(15,118,110,0.65)] hover:brightness-105"
            >
              Déposer un projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
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
          <Hero3D />
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
            Un croquis suffit pour commencer.
            <br />
            <span className="italic">Vellum vous livre le plan.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-paper/70">
            Décrivez votre besoin, joignez un croquis ou une photo. Un
            dessinateur s&apos;occupe du reste — le compte n&apos;est demandé
            qu&apos;au moment d&apos;envoyer le dossier.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:flex-col lg:items-stretch">
          <Link
            href={routes.public.deposit}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-sienna px-7 text-[14px] font-medium text-paper transition hover:bg-sienna-dark"
          >
            Déposer un projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href={routes.public.login}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-paper/20 px-7 text-[14px] font-medium text-paper transition hover:border-paper/50"
          >
            Retrouver mes projets
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
