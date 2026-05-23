import { CalendarDays, ClipboardCheck, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockRequests, mockTeamCapacity } from "@/lib/mock-data";

export function ManagerAssignmentBoard() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Demandes a qualifier</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockRequests.map((request) => (
            <article
              className="rounded-md border border-slate-200 bg-slate-50/80 p-4"
              key={request.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{request.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {request.summary}
                  </p>
                </div>
                <Badge tone={request.priority === "urgent" ? "red" : "amber"}>
                  {request.priority}
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                <span>Formats : {request.expectedFormats.join(" + ")}</span>
                <span>Delai : {request.desiredDueDate ?? "A confirmer"}</span>
                <span>Action : qualifier puis assigner</span>
              </div>
            </article>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capacite equipe</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockTeamCapacity.map((person) => (
            <div
              className="rounded-md border border-slate-200 bg-white p-4"
              key={person.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  {person.roleLabel.includes("Manager") ? (
                    <ClipboardCheck className="size-5" aria-hidden="true" />
                  ) : (
                    <UsersRound className="size-5" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-slate-950">{person.name}</p>
                  <p className="text-sm text-slate-600">{person.roleLabel}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {person.skills.join(" / ")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <CalendarDays className="size-4" aria-hidden="true" />
                {person.loadLabel}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
