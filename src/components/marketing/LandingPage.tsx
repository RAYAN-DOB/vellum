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
import { BorderBeam } from "@/components/ui/BorderBeam";
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

const metrics = [
  { value: "4", label: "espaces metier", detail: "client, chef de projet, dessinateur, admin" },
  { value: "0", label: "fichier sensible", detail: "aucun document reel stocke dans cette V1" },
  { value: "1", label: "suivi central", detail: "demandes, statuts et livrables reunis" },
] as const;

const clientProblems = [
  "Les demandes arrivent par email, message ou fichier joint, puis se perdent hors du projet.",
  "Le client ne sait pas toujours si un plan est a cadrer, en production, en correction ou a valider.",
  "Les versions, retours et livrables se melangent quand aucun espace unique ne porte l'historique.",
] as const;

const solutionPoints = [
  {
    icon: FolderKanban,
    title: "Une demande claire des le depart",
    description:
      "Nom du projet, type de besoin, priorite, formats attendus, delai et niveau de confidentialite sont poses au meme endroit.",
  },
  {
    icon: MessageSquareText,
    title: "Un suivi lisible par role",
    description:
      "Client, chef de projet, dessinateur et admin voient la meme base metier, adaptee a leur responsabilite.",
  },
  {
    icon: LockKeyhole,
    title: "Une base prete pour la securite",
    description:
      "La V1 montre le modele cible, tout en restant honnete : les vrais controles serveur arriveront en V2.",
  },
] as const;

const useCases = [
  {
    icon: FileText,
    title: "Plans PDF a corriger",
    description:
      "Transformer une correction floue en demande priorisee, suivie et rattachee au bon projet.",
  },
  {
    icon: PenTool,
    title: "Croquis a formaliser",
    description:
      "Clarifier l'attendu avant production pour eviter les allers-retours improductifs.",
  },
  {
    icon: Layers3,
    title: "DWG et versions techniques",
    description:
      "Preparer un futur suivi des versions sans exposer de fichier technique reel dans cette V1.",
  },
  {
    icon: FileCheck2,
    title: "Livrables a valider",
    description:
      "Distinguer brouillon, revue, corrections et validation finale dans un parcours comprehensible.",
  },
] as const;

const securityPrinciples = [
  "Aucun vrai DWG, PDF ou plan client dans la V1",
  "Les futurs acces fichiers devront etre controles cote serveur",
  "Les droits seront rattaches au projet, au role et a l'organisation",
  "NDA, confidentialite et journalisation sont prevus dans le modele",
] as const;

const processSteps = [
  {
    step: "01",
    title: "Qualifier la demande",
    description:
      "Le besoin est formule proprement avant toute production ou transmission de fichier reel.",
  },
  {
    step: "02",
    title: "Structurer le suivi",
    description:
      "Le chef de projet clarifie, priorise et prepare l'assignation au bon intervenant.",
  },
  {
    step: "03",
    title: "Produire et corriger",
    description:
      "Le dessinateur dispose du contexte utile et les retours restent associes a la demande.",
  },
  {
    step: "04",
    title: "Valider le livrable",
    description:
      "Le livrable garde un statut clair : en revue, a corriger, valide ou archive plus tard.",
  },
] as const;

const nextSteps = [
  { label: "Tester le parcours demande", icon: ClipboardCheck },
  { label: "Voir les espaces par role", icon: UserRoundCheck },
  { label: "Lire le modele de confidentialite", icon: Sparkles },
] as const;

function HeroVisual() {
  return (
    <div className="technical-grid-dark relative min-h-[420px] overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-2xl shadow-slate-950/40">
      <BorderBeam className="opacity-80" />
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
            le controle de vos projets techniques.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Une V1 front statique pour montrer comment centraliser les demandes
            DWG, PDF, croquis et livrables, sans stocker de fichier sensible et
            sans promettre une securite serveur qui n&apos;existe pas encore.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 bg-white text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.12)] hover:bg-blue-50"
            >
              <a href={routes.workspace.newRequest}>
                Creer une demande demo
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10"
              variant="outline"
            >
              <a href="#security">Comprendre la confidentialite</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
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
            title="Un plan technique ne se gere pas comme une simple piece jointe."
            description="La valeur de la plateforme est de remettre chaque demande dans son contexte : projet, priorite, role, statut, livrable attendu et niveau de confidentialite."
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
          title="Une premiere experience complete pour comprendre le futur produit."
          description="Cette V1 ne remplace pas une production securisee. Elle presente le parcours, les roles, la logique projet et les decisions de confidentialite a valider avant la V2."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {solutionPoints.map((point) => {
            const Icon = point.icon;

            return (
              <Card interactive key={point.title}>
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
          title="Les cas d'usage sont concrets, meme si les donnees restent fictives."
          description="Plans PDF, croquis, reprises DWG et livrables : la V1 montre comment les demandes seront suivies, sans ouvrir de flux d'upload reel."
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
              La confidentialite est traitee comme un sujet d&apos;architecture, pas
              comme un simple badge.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Les ecrans montrent l&apos;intention produit, mais aucun fichier reel
              n&apos;est accepte dans cette V1. La V2 devra ajouter authentification,
              permissions serveur, stockage prive et journalisation.
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
          title="Un parcours lisible pour une decision en moins de deux minutes."
          description="Un associe ou un client doit comprendre rapidement ce que la plateforme apporte : moins de dispersion, plus de suivi, des roles clairs et une securite a construire correctement."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {processSteps.map((step) => (
            <Card interactive className="shadow-none hover:bg-white" key={step.step}>
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
        <div className="technical-grid-dark relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/10 sm:p-10 lg:p-12">
          <BorderBeam className="opacity-60" />
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Badge className="bg-white/10 text-blue-100 ring-white/15" tone="blue">
                Prochaine etape
              </Badge>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
                La V1 est prete pour une demo produit claire, pas pour une mise
                en production.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Elle permet de valider le positionnement, les ecrans et le
                vocabulaire metier. La prochaine etape doit porter sur les vrais
                comptes, permissions serveur et fichiers prives.
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
