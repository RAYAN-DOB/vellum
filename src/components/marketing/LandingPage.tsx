import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  FolderKanban,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PenTool,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Badge } from "@/components/ui/Badge";
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

const metrics = [
  { value: "4", label: "espaces prevus", detail: "client, chef de projet, dessinateur, admin" },
  { value: "0", label: "fichier sensible public", detail: "aucun document reel dans le MVP" },
  { value: "1", label: "fil projet central", detail: "demandes, echanges et livrables regroupes" },
] as const;

const clientProblems = [
  "Demandes dispersees entre emails, fichiers joints et versions locales.",
  "Manque de visibilite sur l'etat d'un plan, d'une correction ou d'un livrable.",
  "Risque de confusion entre projet, brief, fichier source et version finale.",
] as const;

const solutionPoints = [
  {
    icon: FolderKanban,
    title: "Demandes structurees",
    description:
      "Chaque besoin est rattache a un projet, un statut, un responsable et des livrables attendus.",
  },
  {
    icon: MessageSquareText,
    title: "Echanges contextualises",
    description:
      "Client, chef de projet et dessinateur travaillent autour du meme objet metier.",
  },
  {
    icon: LockKeyhole,
    title: "Base pensee pour le cloisonnement",
    description:
      "La future securite partira des roles, des projets et des droits d'acces, pas de simples vues front.",
  },
] as const;

const useCases = [
  {
    icon: FileText,
    title: "Plans PDF a corriger",
    description:
      "Transformer une annotation ou une demande de reprise en tache claire et suivie.",
  },
  {
    icon: PenTool,
    title: "Croquis a formaliser",
    description:
      "Cadrer le besoin avant production pour limiter les allers-retours inutiles.",
  },
  {
    icon: Layers3,
    title: "DWG et versions techniques",
    description:
      "Preparer un parcours ou chaque version sera rattachee a un projet et a des permissions.",
  },
  {
    icon: FileCheck2,
    title: "Livrables a valider",
    description:
      "Centraliser les statuts, commentaires et validations sans exposer les fichiers sensibles.",
  },
] as const;

const securityPrinciples = [
  "Aucun fichier sensible dans public/",
  "Acces futurs controles cote serveur",
  "Droits rattaches aux projets et roles",
  "NDA et confidentialite integres au modele",
] as const;

const processSteps = [
  {
    step: "01",
    title: "Qualifier la demande",
    description:
      "Le client decrit le besoin, le contexte projet et les livrables attendus.",
  },
  {
    step: "02",
    title: "Structurer le suivi",
    description:
      "Le chef de projet priorise, clarifie et assigne la demande au bon intervenant.",
  },
  {
    step: "03",
    title: "Produire et corriger",
    description:
      "Le dessinateur avance avec un historique clair des retours et statuts.",
  },
  {
    step: "04",
    title: "Valider le livrable",
    description:
      "Les versions finales restent rattachees au projet et aux droits d'acces prevus.",
  },
] as const;

const nextSteps = [
  { label: "Creation de demande", icon: ClipboardCheck },
  { label: "Roles futurs", icon: UserRoundCheck },
  { label: "Confidentialite projet", icon: Sparkles },
] as const;

function HeroVisual() {
  return (
    <div className="technical-grid-dark relative min-h-[420px] overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-2xl shadow-slate-950/40">
      <div className="absolute inset-x-6 top-6 flex items-center justify-between border-b border-white/10 pb-4 text-xs text-slate-400">
        <span>DEMO-PLAN-001</span>
        <span>Confidentiel - MVP</span>
      </div>

      <div className="absolute left-8 right-8 top-24 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-slate-400">Demande</p>
              <p className="mt-1 text-lg font-semibold text-white">
                Correction plan PDF fictif
              </p>
            </div>
            <Badge tone="amber">En cours</Badge>
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-3 w-11/12 rounded-full bg-white/20" />
            <div className="h-3 w-8/12 rounded-full bg-white/15" />
            <div className="h-3 w-10/12 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
          <p className="text-xs uppercase text-slate-400">Acces</p>
          <div className="mt-4 space-y-3">
            {["Client", "Chef de projet", "Dessinateur"].map((role) => (
              <div className="flex items-center justify-between gap-3" key={role}>
                <span className="text-sm text-slate-200">{role}</span>
                <span className="size-2 rounded-full bg-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 rounded-md border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-3">
          {["Brief", "Production", "Validation"].map((item, index) => (
            <div key={item}>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-white text-xs font-semibold text-slate-950">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-white">{item}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-blue-300"
                  style={{ width: `${90 - index * 24}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="technical-grid-dark relative overflow-hidden bg-slate-950 text-white">
      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-14 2xl:py-20">
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-white/10 text-blue-100 ring-white/15" tone="blue">
            Plateforme B2B pour projets techniques
          </Badge>
          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-normal text-white sm:text-5xl lg:text-4xl 2xl:text-5xl">
            Pilotez vos demandes de plans, livrables et corrections sans perdre
            le controle.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Une base MVP sobre et evolutive pour structurer les demandes DWG,
            PDF, croquis et documents projet, avec une attention forte portee a
            la confidentialite et aux futures permissions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.12)] transition hover:bg-blue-50"
              href={routes.workspace.newRequest}
            >
              Demander un cadrage
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              href="#security"
            >
              Voir l&apos;approche securite
            </a>
          </div>

          <div className="mt-10 hidden gap-4 2xl:grid 2xl:grid-cols-3">
            {metrics.map((metric) => (
              <div
                className="border-l border-white/15 pl-4"
                key={`${metric.value}-${metric.label}`}
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {metric.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionTitle
            eyebrow="Probleme client"
            title="Les projets techniques se compliquent quand les demandes vivent hors contexte."
            description="Le MVP pose les fondations d'un espace commun ou les informations utiles ne sont plus separees du projet, du statut et des acteurs responsables."
          />

          <div className="grid gap-4">
            {clientProblems.map((problem) => (
              <Card className="border-slate-200 bg-slate-50/80 shadow-none" key={problem}>
                <CardContent className="flex gap-4 p-5">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-blue-700"
                    aria-hidden="true"
                  />
                  <p className="text-base leading-7 text-slate-700">{problem}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="technical-grid bg-slate-100 py-20" id="solution">
      <Container>
        <SectionTitle
          eyebrow="Solution"
          title="Un socle operationnel pour organiser les demandes avant d'ajouter les couches sensibles."
          description="La plateforme commence par les objets metier essentiels : projet, demande, acteur, statut et livrable. La securite reelle viendra ensuite cote serveur, sur cette structure."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {solutionPoints.map((point) => {
            const Icon = point.icon;

            return (
              <Card className="transition hover:-translate-y-0.5 hover:border-blue-200" key={point.title}>
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <CardTitle>{point.title}</CardTitle>
                  <CardDescription>{point.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="bg-white py-20" id="services">
      <Container>
        <SectionTitle
          eyebrow="Services et cas d'usage"
          title="Une interface pensee pour les fichiers et livrables techniques."
          description="Le MVP ne stocke aucun document sensible reel. Il prepare les parcours qui permettront plus tard de gerer les fichiers avec controle serveur."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <Card
                className="group overflow-hidden shadow-sm transition-colors hover:border-blue-200"
                key={useCase.title}
              >
                <CardHeader className="flex-row gap-4 space-y-0">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {useCase.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="technical-grid-dark bg-slate-950 py-20 text-white" id="security">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Badge className="bg-white/10 text-blue-100 ring-white/15" tone="blue">
              Securite et confidentialite
            </Badge>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-white sm:text-4xl">
              Pas de promesse de fausse securite : le MVP prepare les bons
              garde-fous.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Les restrictions visuelles ne suffisent jamais. Les futurs acces
              aux fichiers devront etre controles cote serveur, rattaches au
              projet, au role et a l&apos;organisation.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {securityPrinciples.map((principle) => (
                <div className="flex gap-3" key={principle}>
                  <ShieldCheck
                    className="mt-0.5 size-5 shrink-0 text-blue-300"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-slate-200">{principle}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-md border border-blue-300/20 bg-blue-300/10 p-4">
              <p className="text-sm leading-6 text-blue-50">{mockDataNotice}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="technical-grid bg-slate-100 py-20" id="process">
      <Container>
        <SectionTitle
          eyebrow="Process"
          title="Un parcours simple pour rendre chaque demande lisible."
          description="La premiere version garde le produit concentre sur le suivi et la clarte, sans paiement, matching automatique, marketplace ou upload sensible."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {processSteps.map((step) => (
            <Card className="shadow-none transition hover:border-blue-200 hover:bg-white" key={step.step}>
              <CardHeader>
                <span className="text-sm font-semibold text-blue-700">
                  {step.step}
                </span>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
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
    <section className="bg-white py-20" id="contact">
      <Container>
        <div className="technical-grid-dark overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/10 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Badge className="bg-white/10 text-blue-100 ring-white/15" tone="blue">
                Prochaine etape
              </Badge>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
                Construire ensuite les pages publiques detaillees ou le premier
                parcours de demande.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                La V1 montre deja le parcours public, le workspace et les vues
                metier. La suite consiste a securiser l&apos;architecture serveur
                avant tout traitement de fichiers reels.
              </p>
            </div>

            <div className="grid gap-3">
              {nextSteps.map(({ label, icon: Icon }) => (
                <div
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4"
                  key={label}
                >
                  <Icon className="size-5 text-blue-300" aria-hidden="true" />
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <PublicHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <UseCasesSection />
        <SecuritySection />
        <ProcessSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
