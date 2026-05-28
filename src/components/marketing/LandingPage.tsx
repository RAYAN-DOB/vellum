import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-abyss text-paper overflow-hidden">
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
   Hero — Dramatic, dark with glowing accents
   ────────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 grid-subtle" />
      
      {/* Primary glow orb */}
      <div 
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.4) 0%, transparent 70%)" }}
      />
      
      {/* Secondary glow orb */}
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
      />
      
      {/* Gradient overlay from top */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-abyss via-abyss/80 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10 lg:pb-32 lg:pt-40">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          {/* Left content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Sparkles className="size-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">Bureau de dépôt · Projets techniques</span>
            </div>

            <h1 className="display text-[clamp(3rem,8vw,6rem)] leading-[0.9]">
              <span className="text-paper">Le calque</span>
              <br />
              <span className="text-gradient">commun</span>
              <br />
              <span className="italic text-mist">de vos plans.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-silver">
              Vellum centralise vos DWG, PDF, croquis et schémas dans un seul fil.
              Client, chef de projet et dessinateur travaillent sur la même
              référence — chaque révision tracée, chaque livrable validé.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={routes.public.register}
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-gold via-gold to-gold-deep px-8 text-base font-semibold text-void transition-all hover:shadow-[0_0_50px_rgba(245,166,35,0.4)]"
              >
                <span className="relative z-10">Déposer votre premier projet</span>
                <ArrowRight
                  className="relative z-10 size-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
              <a
                href="#workflow"
                className="group inline-flex h-14 items-center gap-2 rounded-full border border-graphite bg-obsidian/50 px-8 text-base font-medium text-paper transition-all hover:border-silver hover:bg-obsidian"
              >
                Voir le workflow
                <span className="ml-1 text-silver group-hover:text-paper transition-colors">↓</span>
              </a>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-graphite pt-8">
              <Stat value="DWG · PDF" label="Formats natifs" />
              <Stat value="4 rôles" label="Cloisonnés" />
              <Stat value="RLS" label="Sécurité Postgres" />
            </div>
          </div>

          {/* Right content - Preview */}
          <div className="relative lg:pl-8">
            <HeroPreview />
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-abyss to-transparent" />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="group">
      <dt className="font-display text-2xl text-paper group-hover:text-gradient-gold transition-colors">{value}</dt>
      <dd className="caption mt-2 text-dim">{label}</dd>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Partners strip — Glass morphism ribbon
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
    <section className="relative border-y border-graphite bg-obsidian/30">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <p className="caption text-center text-dim">
          Utilisé par les bureaux d&apos;études et cabinets d&apos;architecture
        </p>
        <div className="mask-fade-x mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {partners.map((name) => (
            <span
              key={name}
              className="font-display text-xl text-silver/40 transition-colors hover:text-silver"
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
   Final CTA — Dramatic dark with gold accents
   ────────────────────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-graphite">
      {/* Background effects */}
      <div className="absolute inset-0 grid-subtle" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(ellipse, rgba(245,166,35,0.3) 0%, transparent 70%)" }}
      />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <p className="caption text-gold">Démarrer aujourd&apos;hui</p>
          
          <h2 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)]">
            <span className="text-paper">Un dépôt propre.</span>
            <br />
            <span className="italic text-gradient">Un livrable signé.</span>
          </h2>
          
          <p className="mt-8 text-lg leading-relaxed text-silver max-w-xl mx-auto">
            Créez un compte client en moins d&apos;une minute. Les autres rôles
            sont provisionnés par votre administrateur Vellum.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={routes.public.register}
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-gold via-gold to-gold-deep px-8 text-base font-semibold text-void transition-all hover:shadow-[0_0_50px_rgba(245,166,35,0.4)]"
            >
              <span className="relative z-10">Créer un compte client</span>
              <ArrowRight
                className="relative z-10 size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </a>
            <a
              href={routes.public.login}
              className="group inline-flex h-14 items-center gap-2 rounded-full border border-graphite bg-obsidian/50 px-8 text-base font-medium text-paper transition-all hover:border-silver hover:bg-obsidian"
            >
              Se connecter
              <ArrowUpRight
                className="size-5 text-silver transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
