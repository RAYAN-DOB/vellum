import { AlertTriangle, Clock3, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { mockHistory } from "@/lib/mock-data";

type DetailField = {
  label: string;
  value: ReactNode;
};

type DetailPageProps = {
  title: string;
  description: string;
  status?: Parameters<typeof StatusBadge>[0]["value"];
  fields: DetailField[];
  historyType: keyof typeof mockHistory;
};

export function DetailPage({
  title,
  description,
  status,
  fields,
  historyType,
}: DetailPageProps) {
  const history = mockHistory[historyType];

  return (
    <div className="grid gap-6">
      <Card className="bg-neutral-950 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-blue-200">
                Detail mocke
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                {title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300">
                {description}
              </p>
            </div>
            {status ? <StatusBadge value={status} /> : null}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>
              Donnees fictives utilisees pour presenter le parcours V1.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
                key={field.label}
              >
                <p className="text-xs font-semibold uppercase tracking-normal text-neutral-500">
                  {field.label}
                </p>
                <div className="mt-2 text-sm font-medium text-neutral-950">
                  {field.value}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique fictif</CardTitle>
            <CardDescription>
              Exemple d&apos;audit trail futur, sans backend ni journal reel.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {history.map((item) => (
              <div className="flex gap-3" key={`${item.date}-${item.label}`}>
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <Clock3 className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    {item.label}
                  </p>
                  <p className="text-xs text-neutral-500">{item.date}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="flex gap-3 p-5">
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Permissions non securisees au MVP
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              Cette page affiche une intention produit. Aucun controle serveur,
              aucune auth et aucun cloisonnement reel ne sont actifs.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex gap-3 p-5">
          <ShieldCheck
            className="mt-0.5 size-5 shrink-0 text-blue-700"
            aria-hidden="true"
          />
          <p className="text-sm leading-6 text-neutral-600">
            La V1 prepare les objets metier. Les futurs acces aux fichiers
            devront etre verifies cote serveur selon role, projet, organisation,
            NDA et statut de ressource.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
