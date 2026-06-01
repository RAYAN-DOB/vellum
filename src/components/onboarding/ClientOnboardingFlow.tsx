import { ArrowRight, Building2, CheckCircle2, Clock, FileText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { routes } from "@/lib/routes";

const steps = [
  {
    title: "Votre profil",
    icon: UserRound,
    choices: ["Particulier", "Entreprise", "Bureau d'études", "Architecte", "Collectivité"],
  },
  {
    title: "Votre besoin",
    icon: Building2,
    choices: ["Reprise de plan", "Création DWG", "Correction", "Schéma électrique", "Livrable technique"],
  },
  {
    title: "Documents disponibles",
    icon: FileText,
    choices: ["PDF", "DWG", "Croquis", "Photo", "Note"],
  },
  {
    title: "Niveau d'urgence",
    icon: Clock,
    choices: ["Standard", "Prioritaire", "À planifier"],
  },
] as const;

export function ClientOnboardingFlow() {
  return (
    <div className="grid gap-6">
      <Card tone="dark" className="rounded-[4px]">
        <CardHeader>
          <CardTitle className="max-w-3xl text-3xl leading-tight text-paper">
            Préparez votre premier dépôt en toute sérénité.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-2xl text-sm leading-7 text-paper/75">
            Ce guide vous aide à savoir quels documents préparer et comment
            formuler votre première demande, étape par étape. Vous gardez la main
            à chaque moment.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card className="rounded-[4px]" key={step.title}>
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-full bg-ink text-paper">
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
                        ? "rounded-full bg-ink px-3 py-2 text-xs font-semibold text-paper"
                        : "rounded-full border border-line-strong bg-paper px-3 py-2 text-xs font-semibold text-mute"
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

      <Card className="rounded-[4px]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-moss" aria-hidden="true" />
            <p className="text-sm font-semibold text-ink">
              Récapitulatif type : entreprise, reprise de plan, PDF + DWG, priorité standard.
            </p>
          </div>
          <Button asChild className="rounded-full">
            <a href={routes.client.newProject}>
              Déposer mon premier projet
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
