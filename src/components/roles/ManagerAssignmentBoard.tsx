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
              className="rounded-[3px] border border-[#d8d0bf] bg-[#f8f5ed]/80 p-4"
              key={request.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#171613]">{request.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#6b665a]">
                    {request.summary}
                  </p>
                </div>
                <Badge tone={request.priority === "urgent" ? "red" : "amber"}>
                  {request.priority}
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-xs text-[#8a7a5f] sm:grid-cols-3">
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
              className="rounded-[3px] border border-[#d8d0bf] bg-[#fbfaf6] p-4"
              key={person.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-[3px] bg-[#171613] text-[#f7f3ea]">
                  {person.roleLabel.includes("Manager") ? (
                    <ClipboardCheck className="size-5" aria-hidden="true" />
                  ) : (
                    <UsersRound className="size-5" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="font-semibold text-[#171613]">{person.name}</p>
                  <p className="text-sm text-[#6b665a]">{person.roleLabel}</p>
                  <p className="mt-2 text-xs text-[#8a7a5f]">
                    {person.skills.join(" / ")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-[#6b665a]">
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
