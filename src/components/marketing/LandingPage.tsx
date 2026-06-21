import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";
import { Spotlight } from "@/components/atelier/Spotlight";
import { ESTIMATOR_KINDS, estimate, formatEuro } from "@/lib/estimator";
import { InstantEstimate } from "@/components/marketing/InstantEstimate";
import { MotionSection } from "@/components/marketing/MotionSection";
import { Hero3D } from "@/components/three/Hero3D";
import { ProductDemoFilm } from "@/components/marketing/ProductDemoFilm";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { SecurityBlock } from "@/components/marketing/SecurityBlock";
import { WorkflowStrip } from "@/components/marketing/WorkflowStrip";
import { routes } from "@/lib/routes";

const proofPoints = [
  "Réalisés par un dessinateur",
  "Devis clair avant de payer",
  "Corrections suivies jusqu'à validation",
  "Fichiers PDF & DWG livrés",
  "Devis sous 48 h · réponse 24 h",
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PublicHeader />

      <main>
        <Hero />
        <MotionSection>
          <HowItWorks />
        </MotionSection>
        <MotionSection>
          <InstantEstimate />
        </MotionSection>
        <MotionSection>
          <Deliverables />
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
          <Guarantee />
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
            Vos plans réalisés par un dessinateur
          </span>

          <h1 className="display mt-5 text-balance text-[clamp(2.5rem,4.7vw,4rem)] text-ink">
            Un dessinateur réalise
            <br />
            vos plans techniques.
            <br />
            <span className="italic text-graphite">
              À partir d&apos;un simple croquis.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.65] text-graphite">
            Déposez un croquis, une photo ou un cahier des charges. Un
            dessinateur professionnel produit vos plans 2D, schémas techniques
            et aperçus 3D — devis clair, corrections suivies, fichiers livrés.
          </p>
          <p className="mt-4 max-w-xl text-[13px] leading-[1.5] text-mute">
            Pour rénovateurs, artisans, agences, bureaux d&apos;études et
            porteurs de projet qui ont besoin de plans propres, vite.
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

function Deliverables() {
  const items = ESTIMATOR_KINDS.map((k) => {
    const e = estimate(k.value, "standard", "semaine");
    return { label: k.label, hint: k.hint, low: e.low, high: e.high, days: e.days };
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
      <CartoucheHeader
        eyebrow="Prestations"
        meta="Fourchettes indicatives · EUR"
        title="Ce qu'un dessinateur réalise pour vous."
        description="Quelques livrables courants et leur fourchette de prix indicative. Le tarif exact est confirmé au devis, après lecture de vos fichiers."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Spotlight
            key={it.label}
            className="lift rounded-[4px] border border-line bg-paper hover:border-line-strong"
          >
            <div className="p-5">
              <h3 className="font-display text-xl leading-tight text-ink">
                {it.label}
              </h3>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-mute">
                {it.hint}
              </p>
              <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
                <span className="font-mono text-[15px] text-ink">
                  {formatEuro(it.low)} – {formatEuro(it.high)}
                </span>
                <span className="caption">~ {it.days} j</span>
              </div>
            </div>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}

function Guarantee() {
  const items = [
    {
      icon: FileCheck2,
      title: "Devis clair avant de payer",
      body: "Vous ne réglez l'acompte qu'après avoir accepté un devis détaillé.",
    },
    {
      icon: RefreshCw,
      title: "Corrections incluses",
      body: "Des allers-retours sont prévus jusqu'à la validation de vos plans.",
    },
    {
      icon: ShieldCheck,
      title: "Sans engagement",
      body: "Le devis ne vous engage pas. S'il ne vous convient pas, vous ne payez rien.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="bg-paper p-6">
            <it.icon className="size-5 text-pine" aria-hidden="true" />
            <h3 className="mt-3 font-medium text-ink">{it.title}</h3>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-mute">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Déposez votre besoin",
      body: "Un croquis, une photo, un plan existant ou un simple cahier des charges. Le compte n'est demandé qu'au moment d'envoyer.",
    },
    {
      n: "02",
      title: "Un dessinateur dessine",
      body: "Il vous pose les bonnes questions, prépare un devis clair, puis réalise vos plans. Vous suivez chaque correction jusqu'à validation.",
    },
    {
      n: "03",
      title: "Recevez vos fichiers",
      body: "Plans 2D, schémas techniques et aperçus 3D — livrés en PDF et DWG, prêts à l'emploi.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
      <CartoucheHeader
        eyebrow="Comment ça marche"
        meta="Vellum · 3 étapes"
        title="Du croquis au plan livré, en trois temps."
      />
      <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="bg-paper p-6 sm:p-7">
            <span className="font-mono text-[13px] text-pine">{s.n}</span>
            <h3 className="display mt-3 text-2xl text-ink">{s.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-graphite">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    "Reprise de plans",
    "Corrections DWG / PDF",
    "Schémas électriques",
    "Schémas plomberie",
    "Mise au propre de croquis",
    "Plans techniques 2D",
    "Aperçus 3D & axonométrie",
    "Maquettes d'avancement",
    "Dossiers de livraison",
  ] as const;

  return (
    <section className="border-y border-line bg-vellum/55">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-10">
        <div className="mask-fade-x overflow-hidden">
          <div className="animate-marquee flex items-center gap-x-10 whitespace-nowrap">
            {[...items, ...items].map((item, index) => (
              <span
                key={index}
                className="caption shrink-0 text-graphite/65"
              >
                {item}
              </span>
            ))}
          </div>
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
