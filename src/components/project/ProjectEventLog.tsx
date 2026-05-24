import { CheckCircle2 } from "lucide-react";

import type { ProjectEventItem } from "@/components/project/project-detail-types";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ProjectEventLog({ events }: { events: ProjectEventItem[] }) {
  return (
    <section className="rounded-[4px] border border-line bg-paper p-5">
      <p className="caption">Activité</p>
      <h3 className="mt-1 font-display text-xl text-ink">Journal du dossier</h3>

      {events.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-mute">
          Aucun événement enregistré pour le moment.
        </p>
      ) : (
        <ol className="mt-5 space-y-4">
          {events.slice(0, 8).map((event) => (
            <li key={event.id} className="flex gap-3 text-sm">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-moss"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-ink">
                  {event.label ?? event.event_type}
                </p>
                {event.description ? (
                  <p className="mt-1 text-xs leading-5 text-graphite">
                    {event.description}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-mute">
                  {formatDateTime(event.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
