import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileArchive,
  FileText,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PenTool,
  Ruler,
  ShieldCheck,
  UserRoundCheck,
  Workflow,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { DrawingBoardPreview } from "@/components/marketing/DrawingBoardPreview";
import { ArchitecturalGridBackground } from "@/components/ui/ArchitecturalGridBackground";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { mockDataNotice } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

const evidence = [
  { value: "7", label: "formats prepares", detail: "DWG, PDF, croquis, schemas, photos, notes" },
  { value: "4", label: "espaces metier", detail: "client, manager, architecte, admin" },
  { value: "0", label: "fichier reel", detail: "V1 front mockee, aucun document sensible" },
] as const;

const problems = [
  "Les plans arrivent dans des fils email, sans statut clair ni contexte de production.",
  "Les corrections et versions ne sont pas reliees a une demande, un responsable et une prochaine action.",
  "Les documents sensibles exigent un vrai modele d'acces : projet, role, NDA et audit en V2.",
] as const;

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Depot projet par chat",
    description:
      "Le client decrit son besoin dans un espace pleine page, puis la plateforme structure le dossier.",
  },
  {
    icon: FileArchive,
    title: "Documents techniques centralises",
    description:
      "DWG, PDF, croquis, schemas elec/plomberie, photos et notes sont representes en mock pour cadrer le futur upload.",
  },
  {
    icon: Workflow,
    title: "Qualification et production",
    description:
      "Le manager qualifie, l'architecte prepare un apercu, le client suit l'avancement et valide l'orientation.",
  },
] as const;

const useCases = [
  { icon: FileText, label: "Correction de plans PDF" },
  { icon: PenTool, label: "Croquis a formaliser" },
  { icon: Ruler, label: "Reprise DWG / cotations" },
  { icon: Layers3, label: "Versions et calques" },
] as const;

const process = [
  ["01", "Deposer", "Le client raconte le besoin et prepare ses documents fictifs."],
  ["02", "Qualifier", "Le manager clarifie scope, priorite, delai et niveau de confidentialite."],
  ["03", "Produire", "L'architecte travaille sur un apercu ou une version de travail."],
  ["04", "Valider", "Le client suit, commente et valide avant devis ou livraison future."],
] as const;

function HeroSection() {
  return (
    <ArchitecturalGridBackground className="border-b border-[#34312b]">
      <Container className="grid gap-12 py-14 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-20">
        <div className="max-w-3xl">
          <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/18">
            Architectural project cockpit
          </Badge>
          <h1 className="mt-7 text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-[#f7f3ea] sm:text-6xl lg:text-5xl xl:text-6xl">
            Un espace premium pour deposer, cadrer et suivre vos plans
            techniques.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#cfc6b5] sm:text-lg">
            PlanWork transforme une demande floue en dossier lisible : chat de
            depot, documents techniques mockes, suivi manager, production
            architecte et validation client.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 bg-[#f7f3ea] text-[#171613] hover:bg-white">
              <a href={routes.roles.clientNewProject}>
                Entrer dans le cockpit
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              className="h-12 border-[#f7f3ea]/18 bg-[#f7f3ea]/5 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <a href="#security">Voir les limites V1</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {evidence.map((item) => (
              <div className="border-l border-[#f7f3ea]/14 pl-4" key={item.label}>
                <p className="text-3xl font-semibold text-[#f7f3ea]">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-[#e7dece]">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-[#9d9485]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <DrawingBoardPreview />
      </Container>
    </ArchitecturalGridBackground>
  );
}

function ProblemSection() {
  return (
    <section className="bg-[#f4f1ea] py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionTitle
            eyebrow="Constat"
            title="Un projet de plans ne doit pas vivre dans une boite mail."
            description="Le client doit voir ou en est son dossier, l'equipe doit comprendre quoi produire, et les futurs fichiers sensibles devront rester strictement cloisonnes."
          />
          <div className="grid gap-3">
            {problems.map((problem) => (
              <Card className="bg-[#fbfaf6]/88 shadow-none" key={problem}>
                <CardContent className="flex gap-4 p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#7b6b4f]" />
                  <p className="text-base leading-7 text-[#4f4a40]">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CapabilitySection() {
  return (
    <section className="bg-[#fbfaf6] py-20" id="solution">
      <Container>
        <SectionTitle
          eyebrow="Produit"
          title="Le coeur de la V1 devient un cockpit de depot projet."
          description="La demonstration montre le parcours futur sans faire semblant : pas d'upload reel, pas de backend, pas de securite serveur active."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <Card interactive className="bg-[#f8f5ed]" key={title}>
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-[3px] border border-[#d8d0bf] bg-[#171613] text-[#f7f3ea]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function UseCaseSection() {
  return (
    <section className="paper-grid bg-[#f4f1ea] py-20" id="services">
      <Container>
        <SectionTitle
          eyebrow="Prestations"
          title="Une interface pensee pour vendre des prestations de plans."
          description="La DA doit inspirer confiance a des clients qui confient des documents techniques : sobriete, precision, statut clair et parcours lisible."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map(({ icon: Icon, label }) => (
            <Card className="bg-[#fbfaf6]/90 shadow-none" interactive key={label}>
              <CardContent className="p-5">
                <Icon className="size-5 text-[#7b6b4f]" aria-hidden="true" />
                <p className="mt-5 text-lg font-semibold text-[#171613]">{label}</p>
                <div className="mt-5 h-px w-full bg-[#d8d0bf]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function SecuritySection() {
  return (
    <ArchitecturalGridBackground className="py-20" id="security">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/18">
              Confidentialite cible
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold leading-tight text-[#f7f3ea] sm:text-4xl">
              La V1 presente la logique. La securite reelle viendra du serveur
              en V2.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#cfc6b5]">
              Aucun fichier sensible n&apos;est stocke. Les ecrans simulent un futur
              modele avec comptes, permissions par role, stockage prive, NDA et
              journalisation.
            </p>
          </div>
          <Card tone="dark" className="bg-[#f7f3ea]/6">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              {[
                "Aucun vrai DWG, PDF ou plan client",
                "Documents fictifs uniquement",
                "Permissions serveur prevues en V2",
                "Cloisonnement projet a construire",
              ].map((item) => (
                <div className="flex gap-3" key={item}>
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-[#e7dece]">{item}</p>
                </div>
              ))}
              <div className="sm:col-span-2 rounded-[3px] border border-[#e4c887]/35 bg-[#d7c6a4]/10 p-4">
                <p className="text-sm leading-6 text-[#ead9b9]">{mockDataNotice}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </ArchitecturalGridBackground>
  );
}

function ProcessSection() {
  return (
    <section className="bg-[#fbfaf6] py-20" id="process">
      <Container>
        <SectionTitle
          eyebrow="Parcours"
          title="Le cycle projet est visible avant d'exister en backend."
          description="Le client depose, le manager qualifie, l'architecte produit, puis le client suit et valide. Tout reste simule dans cette V1."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {process.map(([step, title, description]) => (
            <Card className="shadow-none" key={step}>
              <CardHeader>
                <span className="font-mono text-sm text-[#8a7a5f]">{step}</span>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="bg-[#f4f1ea] py-20">
      <Container>
        <ArchitecturalGridBackground className="rounded-[6px] border border-[#34312b] p-8 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Badge className="bg-[#f7f3ea]/10 text-[#d7c6a4] ring-[#f7f3ea]/18">
                Demo associes
              </Badge>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-[#f7f3ea] sm:text-4xl">
                Une V1 visuelle pour valider le positionnement avant la V2
                technique.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#cfc6b5]">
                La suite doit transformer cette vision en vraie application :
                comptes, stockage prive, permissions serveur, audit et workflow
                production.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { label: "Tester le chat depot", icon: ClipboardCheck, href: routes.roles.clientNewProject },
                { label: "Voir les espaces roles", icon: UserRoundCheck, href: routes.roles.client },
                { label: "Lire la matrice permissions", icon: LockKeyhole, href: routes.workspace.permissions },
              ].map(({ label, icon: Icon, href }) => (
                <a
                  className="flex items-center justify-between gap-3 rounded-[3px] border border-[#f7f3ea]/12 bg-[#f7f3ea]/6 p-4 text-sm font-medium text-[#f7f3ea] transition hover:bg-[#f7f3ea]/10"
                  href={href}
                  key={label}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-5 text-[#d7c6a4]" aria-hidden="true" />
                    {label}
                  </span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </ArchitecturalGridBackground>
      </Container>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#171613]">
      <PublicHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <CapabilitySection />
        <UseCaseSection />
        <SecuritySection />
        <ProcessSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
