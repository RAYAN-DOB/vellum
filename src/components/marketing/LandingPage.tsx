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
import { Pill, type PillTone } from "@/components/atelier/Pill";
import { Spotlight } from "@/components/atelier/Spotlight";
import { ESTIMATOR_KINDS, estimate, formatEuro } from "@/lib/estimator";
import { InstantEstimate } from "@/components/marketing/InstantEstimate";
import { MotionSection } from "@/components/marketing/MotionSection";
import { MovingGradient } from "@/components/marketing/MovingGradient";
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
        <DarkPromiseBand />
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

const heroPills: {
  label: string;
  tone: PillTone;
  dot?: boolean;
  mono?: boolean;
  icon?: boolean;
  pos: string;
  delay: string;
}[] = [
  { label: "Croquis reçu", tone: "pine", dot: true, pos: "left-0 top-10", delay: "0s" },
  { label: "Plan en cours", tone: "cyan", dot: true, pos: "right-0 top-24", delay: "1.1s" },
  { label: "Devis clair", tone: "pine", pos: "left-0 top-1/2", delay: "0.6s" },
  { label: "PDF + DWG", tone: "petrol", mono: true, pos: "right-1 top-[46%]", delay: "1.7s" },
  { label: "2 révisions incluses", tone: "neutral", pos: "left-8 bottom-16", delay: "0.9s" },
  { label: "Paiement sécurisé", tone: "cyan", icon: true, pos: "right-2 bottom-4", delay: "2.2s" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* Neo-Atelier dynamic light field — soft emerald/cyan blobs drifting on paper */}
      <MovingGradient variant="light" grain={false} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-24 lg:pt-40">
        <div className="max-w-2xl">
          <Pill tone="pine" dot active>
            Vos plans réalisés par un dessinateur
          </Pill>

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

          <div className="relative mt-9 flex flex-wrap items-center gap-3">
            {/* breathing halo behind the primary CTA */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 top-1/2 size-44 -translate-y-1/2 rounded-full blur-2xl [animation:breathe_5s_ease-in-out_infinite]"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--pine) 42%, transparent), color-mix(in srgb, var(--cyan) 26%, transparent) 45%, transparent 70%)",
              }}
            />
            <Link
              href={routes.public.deposit}
              className="cta-premium group relative inline-flex h-12 cursor-pointer items-center gap-2 rounded-full px-6 text-[14px] font-medium text-paper"
            >
              Déposer un projet
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href="#estimer"
              className="group inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-paper/60 px-6 text-[14px] font-medium text-graphite backdrop-blur-[2px] transition hover:border-pine/50 hover:text-ink"
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
                  className="size-1.5 shrink-0 rounded-full bg-pine"
                />
                {point}
              </li>
            ))}
          </ul>

          {/* compact pill strip — replaces the desktop-only floating pills below lg */}
          <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
            <Pill tone="pine" dot size="sm">
              Croquis reçu
            </Pill>
            <Pill tone="cyan" dot size="sm">
              Plan en cours
            </Pill>
            <Pill tone="petrol" mono size="sm">
              PDF + DWG
            </Pill>
          </div>
        </div>

        <div className="relative min-w-0">
          <Hero3D />

          {/* scanner line gliding over the 3D */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 overflow-hidden rounded-[28px]"
          >
            <span className="scanner-line" />
          </div>

          {/* floating explanatory pills (desktop) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
            {heroPills.map((p) => (
              <div
                key={p.label}
                className={`float-y absolute ${p.pos}`}
                style={{ animationDelay: p.delay }}
              >
                <Pill
                  tone={p.tone}
                  dot={p.dot}
                  mono={p.mono}
                  icon={p.icon ? <ShieldCheck /> : undefined}
                  className="shadow-[0_10px_26px_-14px_rgba(22,25,26,0.5)]"
                >
                  {p.label}
                </Pill>
              </div>
            ))}
          </div>
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
    <section
      id="prestations"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10 lg:py-20"
    >
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
      title: "Vous validez le devis avant de payer",
      body: "Vous ne réglez l'acompte qu'après avoir accepté un devis détaillé. Rien n'est lancé sans votre accord.",
    },
    {
      icon: RefreshCw,
      title: "Corrections suivies jusqu'à validation",
      body: "Vous pilotez les retours : le dessinateur ajuste jusqu'à ce que le plan vous convienne.",
    },
    {
      icon: ShieldCheck,
      title: "Vous gardez la main",
      body: "Le devis ne vous engage pas. Vous décidez, à chaque étape, de continuer ou non.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        <Pill tone="pine" icon={<ShieldCheck />}>
          Sans engagement
        </Pill>
        <Pill tone="cyan" icon={<FileCheck2 />}>
          Devis clair avant de payer
        </Pill>
        <Pill tone="petrol" icon={<RefreshCw />}>
          Corrections incluses
        </Pill>
      </div>
      <div className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="group/g relative bg-paper p-6 transition-colors hover:bg-vellum/30"
          >
            <it.icon className="size-5 text-pine" aria-hidden="true" />
            <h3 className="mt-3 font-medium text-ink">{it.title}</h3>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-mute">
              {it.body}
            </p>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-0 bg-[image:var(--gradient-pine-cyan)] transition-all duration-300 group-hover/g:w-full"
            />
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
      body: "Plans 2D, schémas techniques et aperçus 3D — livrés en PDF et DWG, prêts à l'emploi.",
    },
  ];

  return (
    <section
      id="procede"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10 lg:py-20"
    >
      <CartoucheHeader
        eyebrow="Comment ça marche"
        meta="Vellum · 3 étapes"
        title="Du croquis au plan livré, en trois temps."
      />
      <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative bg-paper p-6 transition-colors hover:bg-vellum/30 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] text-pine">{s.n}</span>
              <Pill tone="cyan" size="sm">
                {s.tag}
              </Pill>
            </div>
            <h3 className="display mt-4 text-2xl text-ink">{s.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-graphite">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* Flow connector — an emerald light travels from step 1 to 3 */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-8 hidden h-px max-w-3xl bg-line sm:block"
      >
        <span className="animate-flow absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pine shadow-[0_0_8px_var(--pine)]" />
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

const promisePills: { label: string; tone: PillTone }[] = [
  { label: "Un seul interlocuteur", tone: "cyan" },
  { label: "Devis avant paiement", tone: "pine" },
  { label: "Corrections suivies", tone: "pine" },
  { label: "PDF + DWG", tone: "petrol" },
];

function DarkPromiseBand() {
  return (
    <section className="relative overflow-hidden border-y border-line text-paper">
      {/* dark cinematic moving gradient */}
      <MovingGradient variant="dark" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <span className="caption text-[color-mix(in_srgb,var(--cyan)_55%,var(--paper))]">
          Pourquoi Vellum
        </span>
        <h2 className="display mt-4 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] text-paper">
          Des plans techniques propres,{" "}
          <span className="text-gradient italic">sans gérer de prestataire.</span>
        </h2>
        <p className="mt-5 max-w-xl text-[15px] leading-[1.7] text-paper/85">
          Vous décrivez votre besoin, un dessinateur professionnel exécute, vous
          validez. Un seul interlocuteur, un devis clair avant tout paiement, des
          corrections suivies jusqu&apos;au livrable.
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {promisePills.map((p) => (
            <Pill key={p.label} tone={p.tone} dot dark>
              {p.label}
            </Pill>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line text-paper">
      {/* dark cinematic moving gradient — emerald / cyan / petrol on black */}
      <MovingGradient variant="dark" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(250,249,245,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,245,0.5) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10 lg:py-28">
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            <Pill tone="cyan" dot dark>
              Croquis → plan
            </Pill>
            <Pill tone="pine" dot dark>
              Devis avant paiement
            </Pill>
          </div>
          <h2 className="display text-[clamp(2.25rem,5.5vw,4rem)]">
            Un croquis suffit pour commencer.
            <br />
            <span className="text-gradient italic">
              Vellum vous livre le plan.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-[1.7] text-paper/85">
            Décrivez votre besoin, joignez un croquis ou une photo. Un
            dessinateur s&apos;occupe du reste — le compte n&apos;est demandé
            qu&apos;au moment d&apos;envoyer le dossier.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:flex-col lg:items-stretch">
          <Link
            href={routes.public.deposit}
            className="cta-premium group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-7 text-[14px] font-semibold text-paper"
          >
            Déposer un projet
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href={routes.public.login}
            className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-paper/40 bg-white/5 px-7 text-[14px] font-medium text-paper backdrop-blur-sm transition hover:border-paper/60 hover:bg-white/10"
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
