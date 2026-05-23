import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Gauge,
  MessageSquareText,
  ReceiptText,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockProjectFiles, mockRequests, mockTeamCapacity } from "@/lib/mock-data";
import { routes } from "@/lib/routes";

export function ManagerAssignmentBoard() {
  const selected = mockRequests[0];
  const selectedFiles = mockProjectFiles.filter((file) => file.projectId === selected.projectId);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]">
      <Card className="rounded-[30px] xl:col-span-2 2xl:col-span-1">
        <CardHeader>
          <CardTitle>Demandes entrantes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockRequests.map((request) => (
            <article
              className="rounded-[22px] border border-[#d8d0bf] bg-[#f8f5ed]/85 p-4"
              key={request.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#171613]">{request.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6b665a]">
                    {request.summary}
                  </p>
                </div>
                <StatusBadge value={request.priority} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {request.expectedFormats.map((format) => (
                  <span
                    className="rounded-full border border-[#d8d0bf] bg-[#fbfaf6] px-2.5 py-1 text-xs font-medium text-[#6b665a]"
                    key={format}
                  >
                    {format}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card tone="dark" className="rounded-[30px]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4]">
                Inspecteur manager
              </p>
              <CardTitle className="mt-2 text-2xl text-[#f7f3ea]">
                {selected.title}
              </CardTitle>
            </div>
            <StatusBadge value={selected.status} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "Urgence", value: selected.priority === "urgent" ? "Urgente" : "Normale", icon: Gauge },
              { label: "Delai", value: selected.desiredDueDate ?? "A cadrer", icon: CalendarDays },
              { label: "Pieces", value: `${selectedFiles.length} mock`, icon: FileText },
            ].map(({ label, value, icon: Icon }) => (
              <div className="rounded-[22px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/6 p-4" key={label}>
                <Icon className="size-4 text-[#d7c6a4]" aria-hidden="true" />
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#9f9788]">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#f7f3ea]">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-[#f7f3ea]/10 bg-[#0f0f0d]/76 p-5">
            <p className="text-sm font-semibold text-[#f7f3ea]">
              Synthese automatique mockee
            </p>
            <p className="mt-3 text-sm leading-7 text-[#cfc6b5]">
              Reprise de plan a qualifier : confirmer formats finaux, perimetre
              des corrections, niveau de confidentialite et besoin d&apos;apercu
              avant devis.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Preparer un devis", icon: ReceiptText, href: routes.roles.projectManagerQuotes },
              { label: "Assigner architecte", icon: UserPlus },
              { label: "Demander precision", icon: MessageSquareText },
              { label: "Marquer prioritaire", icon: ClipboardCheck },
            ].map(({ label, icon: Icon, href }) =>
              href ? (
                <Button asChild className="rounded-full bg-[#f7f3ea] text-[#171613] hover:bg-white" key={label}>
                  <a href={href}>
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </a>
                </Button>
              ) : (
                <Button
                  className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
                  key={label}
                  variant="outline"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Button>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[30px]">
        <CardHeader>
          <CardTitle>Disponibilite architectes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockTeamCapacity.map((person) => (
            <div
              className="rounded-[22px] border border-[#d8d0bf] bg-[#fbfaf6] p-4"
              key={person.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#171613] text-[#f7f3ea]">
                  <UsersRound className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#171613]">{person.name}</p>
                  <p className="text-sm text-[#6b665a]">{person.roleLabel}</p>
                  <p className="mt-2 text-xs leading-5 text-[#8a7a5f]">
                    {person.skills.join(" / ")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-sm text-[#6b665a]">
                <span>{person.loadLabel}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
