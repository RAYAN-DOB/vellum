import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";
import { ESTIMATOR_KINDS, estimate, formatEuro } from "@/lib/estimator";
import { InstantEstimate } from "@/components/marketing/InstantEstimate";
import { MotionSection } from "@/components/marketing/MotionSection";
import { AtelierFilmHero } from "@/components/marketing/AtelierFilmHero";
import { AvantApres } from "@/components/marketing/AvantApres";
import { Faq } from "@/components/marketing/Faq";
import { SecurityBlock } from "@/components/marketing/SecurityBlock";
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
          <AvantApres />
        </MotionSection>
        <MotionSection>
          <InstantEstimate />
        </MotionSection>
        <MotionSection>
          <Deliverables />
        </MotionSection>
        <MotionSection>
          <Guarantee />
        </MotionSection>
        <MotionSection>
          <SecurityBlock />
        </MotionSection>
        <MotionSection>
          <Faq />
        </MotionSection>
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

function PaperTooth() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03] mix-blend-multiply"
    >
      <filter id="paper-tooth">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-tooth)" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      {/* substrate: paper tooth + a single fine grid masked toward the fold */}
      <PaperTooth />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />
      {/* construction datum lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-ink/[0.05] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[54%] h-px bg-ink/[0.04]"
      />
      {/* faint pine datum cross, top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-7 top-28 hidden size-9 opacity-70 lg:block"
      >
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-pine/45" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-pine/45" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-32 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-10 lg:pb-28 lg:pt-40">
        <div className="max-w-2xl">
          <span className="caption inline-flex items-center border-l-2 border-pine pl-2.5 text-pine-active">
            Cabinet d&apos;études · Dessin technique
          </span>

          <h1 className="display mt-6 text-balance text-[clamp(2.4rem,4.6vw,3.9rem)] leading-[1.04] text-ink">
            D&apos;un croquis brut au plan technique,{" "}
            <span className="italic text-graphite">
              tracé par un dessinateur.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[17px] leading-[1.65] text-graphite">
            Déposez un croquis, une photo ou un cahier des charges. Un
            dessinateur professionnel met votre projet au propre — plans 2D
            cotés, schémas techniques, aperçus 3D — livrés en PDF et DWG, avec un
            devis clair avant tout paiement et des corrections suivies jusqu&apos;à
            validation.
          </p>
          <p className="mt-4 max-w-xl text-[13px] leading-[1.5] text-mute">
            Pour rénovateurs, artisans, agences, bureaux d&apos;études et
            porteurs de projet qui ont besoin de plans propres, vite.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={routes.public.deposit}
              className="group relative inline-flex h-12 cursor-pointer items-center gap-2 overflow-hidden rounded-[2px] bg-ink pl-6 pr-5 text-[14px] font-medium text-paper transition hover:bg-graphite"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-[3px] bg-pine"
              />
              Déposer un projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#avant-apres"
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-[2px] border border-line-strong bg-paper/60 px-5 text-[14px] font-medium text-graphite transition hover:border-graphite hover:text-ink"
            >
              Voir un exemple de livrable
            </a>
          </div>

          <ul className="mt-10 grid gap-2.5 border-t border-line pt-7 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2.5 text-[13px] font-medium text-graphite"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-pine"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-w-0">
          <AtelierFilmHero />
        </div>
      </div>
    </section>
  );
}

function Deliverables() {
  const items = ESTIMATOR_KINDS.map((k, idx) => {
    const e = estimate(k.value, "standard", "semaine");
    return {
      label: k.label,
      hint: k.hint,
      low: e.low,
      high: e.high,
      days: e.days,
      ref: `LIV-0${idx + 1}`,
    };
  });

  return (
    <section
      id="prestations"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-24"
    >
      <CartoucheHeader
        eyebrow="§03 · Prestations"
        meta="Fourchettes indicatives · EUR"
        title="Ce qu'un dessinateur réalise pour vous."
        description="Quelques livrables courants et leur fourchette indicative. Le tarif exact est confirmé au devis, après lecture de vos fichiers."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="lift sheet-flat group relative overflow-hidden rounded-[4px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid-paper opacity-[0.22]"
            />
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <span className="caption text-soft">{it.ref}</span>
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-[1px] bg-line-strong transition-colors group-hover:bg-pine"
                />
              </div>
              <h3 className="mt-3 font-display text-xl leading-tight text-ink">
                {it.label}
              </h3>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-mute">
                {it.hint}
              </p>
              <div className="mt-5 flex items-end justify-between border-t border-line pt-3">
                <span className="font-mono text-[15px] text-ink">
                  {formatEuro(it.low)} – {formatEuro(it.high)}
                </span>
                <span className="caption">~ {it.days} j</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Guarantee() {
  const clauses = [
    {
      ref: "G-01",
      title: "Devis clair avant tout paiement",
      body: "Vous ne réglez l'acompte qu'après avoir accepté un devis détaillé. Le devis ne vous engage pas.",
    },
    {
      ref: "G-02",
      title: "Corrections suivies jusqu'à validation",
      body: "Des allers-retours sont prévus : le dessinateur ajuste jusqu'à ce que le plan vous convienne.",
    },
    {
      ref: "G-03",
      title: "Livraison PDF + DWG",
      body: "Vos plans sont livrés prêts à l'emploi, en PDF et en fichiers natifs DWG.",
    },
    {
      ref: "G-04",
      title: "Fichiers sources réexploitables",
      body: "Vous repartez avec des fichiers exploitables par n'importe quel bureau d'études.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <CartoucheHeader
        eyebrow="§04 · Engagements"
        meta="Sans paiement avant devis"
        title="Des engagements clairs, comme dans un vrai cabinet."
      />
      <div className="mt-10 overflow-hidden rounded-[4px] border border-line">
        {clauses.map((c) => (
          <div
            key={c.ref}
            className="flex items-start gap-4 border-b border-line bg-paper p-5 last:border-b-0 sm:gap-6 sm:p-6"
          >
            <span className="caption w-12 shrink-0 pt-0.5 text-soft">
              {c.ref}
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-ink">{c.title}</h3>
              <p className="mt-1 text-[13px] leading-[1.55] text-mute">
                {c.body}
              </p>
            </div>
            <Check className="mt-0.5 size-4 shrink-0 text-pine" aria-hidden="true" />
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
      tag: "Croquis",
      title: "Déposez votre besoin",
      body: "Un croquis, une photo, un plan existant ou un simple cahier des charges. Le compte n'est demandé qu'au moment d'envoyer.",
    },
    {
      n: "02",
      tag: "Tracé",
      title: "Un dessinateur dessine",
      body: "Il vous pose les bonnes questions, prépare un devis clair, puis réalise vos plans. Vous suivez chaque correction jusqu'à validation.",
    },
    {
      n: "03",
      tag: "Livraison",
      title: "Recevez vos fichiers",
      body: "Plans 2D cotés, schémas techniques et aperçus 3D — livrés en PDF et DWG, prêts à l'emploi.",
    },
  ];

  return (
    <section
      id="procede"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-24"
    >
      <CartoucheHeader
        eyebrow="§01 · Le procédé"
        meta="Un dessinateur, pas un algorithme"
        title="Du croquis au plan livré, en trois temps."
      />
      <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="bg-paper p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] text-pine">{s.n}</span>
              <span className="caption text-soft">{s.tag}</span>
            </div>
            <h3 className="display mt-4 text-2xl text-ink">{s.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-graphite">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* connector — a single emerald datum slides along a drawn hairline (no glow) */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-8 hidden h-px max-w-3xl bg-line sm:block"
      >
        <span className="animate-flow absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-pine" />
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink text-paper">
      {/* the closing dimension — a single pine cotation across the top edge */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-pine/45" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-28">
        <div>
          <span className="caption text-paper/45">§07 · Dernière planche</span>
          <h2 className="display mt-5 text-[clamp(2.2rem,5.2vw,3.8rem)]">
            Déposez votre croquis. Repartez avec un plan technique.
            <br />
            <span className="italic text-paper/80">
              Vellum vous livre le plan.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-paper/70">
            Décrivez votre besoin, joignez un croquis ou une photo. Un
            dessinateur s&apos;occupe du reste — le compte n&apos;est demandé
            qu&apos;au moment d&apos;envoyer le dossier.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:flex-col lg:items-stretch">
          <span className="caption text-paper/45">
            Devis sous 48 h · Réponse 24 h
          </span>
          <Link
            href={routes.public.deposit}
            className="group relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[2px] bg-paper px-7 text-[14px] font-medium text-ink transition hover:bg-vellum"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-[3px] bg-pine"
            />
            Déposer un projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href={routes.public.login}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-paper/20 px-7 text-[14px] font-medium text-paper transition hover:border-paper/50"
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
