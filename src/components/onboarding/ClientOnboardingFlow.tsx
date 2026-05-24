import { ArrowRight, Building2, CheckCircle2, Clock, FileText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { routes } from "@/lib/routes";

const steps = [
  {
    title: "Type de client",
    icon: UserRound,
    choices: ["Particulier", "Entreprise", "Bureau d'etudes", "Architecte", "Collectivite"],
  },
  {
    title: "Type de besoin",
    icon: Building2,
    choices: ["Reprise plan", "Creation DWG", "Correction", "Schema electrique", "Livrable technique"],
  },
  {
    title: "Documents disponibles",
    icon: FileText,
    choices: ["PDF", "DWG", "Croquis", "Photo", "Note"],
  },
  {
    title: "Urgence",
    icon: Clock,
    choices: ["Standard", "Prioritaire", "A planifier"],
  },
] as const;

export function ClientOnboardingFlow() {
  return (
    <div className="grid gap-6">
      <Card tone="dark" className="rounded-[32px]">
        <CardHeader>
          <CardTitle className="max-w-3xl text-3xl leading-tight text-[#f7f3ea]">
            Configurer le premier depot sans creer de vraie auth.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-2xl text-sm leading-7 text-[#cfc6b5]">
            Ce parcours aide le client a comprendre quels documents preparer et
            comment formuler sa premiere demande. Tout reste mocke.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card className="rounded-[30px]" key={step.title}>
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <CardTitle>
                  {index + 1}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {step.choices.map((choice, choiceIndex) => (
                  <span
                    className={
                      choiceIndex === 0
                        ? "rounded-full bg-[#171613] px-3 py-2 text-xs font-semibold text-[#f7f3ea]"
                        : "rounded-full border border-[#d8d0bf] bg-[#fbfaf6] px-3 py-2 text-xs font-semibold text-[#6b665a]"
                    }
                    key={choice}
                  >
                    {choice}
                  </span>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-[32px]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-700" aria-hidden="true" />
            <p className="text-sm font-semibold text-[#171613]">
              Resume pret : client entreprise, reprise plan, PDF + DWG, priorite standard.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <a href={routes.client.newProject}>
              Deposer mon premier projet
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
