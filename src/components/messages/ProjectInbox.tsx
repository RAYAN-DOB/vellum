import { FileText, MessageSquareText, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockProjectMessages, mockProjects } from "@/lib/mock-data";

export function ProjectInbox() {
  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="rounded-[32px]">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {mockProjects.map((project, index) => (
            <button
              className="rounded-[22px] border border-[#d8d0bf] bg-[#f8f5ed] p-4 text-left transition hover:bg-white"
              key={project.id}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#171613]">{project.reference}</p>
                {index === 0 ? (
                  <span className="rounded-full bg-[#171613] px-2 py-1 text-[10px] font-semibold text-[#f7f3ea]">
                    non lu
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#6b665a]">{project.name}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card tone="dark" className="rounded-[32px]">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-[#f7f3ea]">Fil DEMO-PLAN-001</CardTitle>
            <div className="flex gap-2">
              {["Non lu", "Urgent", "Projet", "Devis"].map((filter) => (
                <span
                  className="rounded-full border border-[#f7f3ea]/12 bg-[#f7f3ea]/6 px-3 py-1.5 text-xs text-[#cfc6b5]"
                  key={filter}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {mockProjectMessages.map((message) => (
            <article
              className="rounded-[24px] border border-[#f7f3ea]/10 bg-[#f7f3ea]/6 p-4"
              key={message.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f7f3ea]/10 text-[#d7c6a4]">
                  <MessageSquareText className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-[#f7f3ea]">{message.authorName}</p>
                  <p className="mt-2 text-sm leading-6 text-[#cfc6b5]">{message.body}</p>
                  <p className="mt-2 text-xs text-[#8f8777]">{message.timestamp}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="rounded-full border border-[#f7f3ea]/12 bg-[#080807] px-4 py-3 text-sm text-[#8f8777]">
            Rediger une reponse mockee...
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-[#f7f3ea] text-[#171613] hover:bg-white">
              <MessageSquareText className="size-4" aria-hidden="true" />
              Envoyer mock
            </Button>
            <Button
              className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <FileText className="size-4" aria-hidden="true" />
              Ajouter piece fictive
            </Button>
            <Button
              className="rounded-full border-[#f7f3ea]/18 bg-[#f7f3ea]/6 text-[#f7f3ea] hover:bg-[#f7f3ea]/10"
              variant="outline"
            >
              <Search className="size-4" aria-hidden="true" />
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
