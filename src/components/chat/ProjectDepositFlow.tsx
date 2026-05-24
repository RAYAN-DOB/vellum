"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileText,
  Loader2,
  MessageSquareText,
  Paperclip,
  Route,
  Send,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { mockDataNotice } from "@/lib/mock-data";
import { routes } from "@/lib/routes";
import { roleHandoffSteps } from "@/lib/workflow";

const documentChips = [
  "DWG",
  "PDF",
  "Croquis",
  "Schema electrique",
  "Schema plomberie",
  "Photo de site",
  "Note",
  "Correction",
  "Livrable attendu",
] as const;

const transitionSteps = [
  "Analyse de la demande",
  "Structuration des documents",
  "Transmission au manager",
  "Creation du projet",
  "Ouverture du cockpit projet",
] as const;

const defaultText =
  "J'ai un plan PDF a reprendre, des arrivees electriques a ajouter, des cotes a corriger et je veux un DWG propre avec apercu.";

export function ProjectDepositFlow() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(["PDF", "DWG", "Correction"]);
  const [text, setText] = useState(defaultText);
  const [mockFileCount, setMockFileCount] = useState(3);
  const [structured, setStructured] = useState(false);
  const [sending, setSending] = useState(false);

  const summary = useMemo(() => {
    const hasElectric = text.toLowerCase().includes("elect");

    return [
      {
        label: "Besoin detecte",
        value: hasElectric
          ? "Reprise PDF avec attentes electriques"
          : "Reprise de plan technique",
      },
      {
        label: "Documents prepares",
        value: `${selected.length} types + ${mockFileCount} fichiers fictifs`,
      },
      {
        label: "Routage propose",
        value: "Manager qualification -> architecte DWG",
      },
    ];
  }, [mockFileCount, selected.length, text]);

  function toggleChip(chip: string) {
    setSelected((current) =>
      current.includes(chip)
        ? current.filter((item) => item !== chip)
        : [...current, chip],
    );
  }

  function sendRequest() {
    setStructured(true);
    setSending(true);
    window.setTimeout(() => {
      router.push(`${routes.client.projects}/project-demo-001`);
    }, 2100);
  }

  return (
    <div className="cinematic-hero relative min-h-screen overflow-hidden bg-[#070706] text-[#f8f4ea]">
      <div className="absolute inset-0 drawing-line opacity-50" />
      <div className="absolute left-1/2 top-40 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f8f4ea]/45 to-transparent shadow-[0_0_90px_rgba(248,244,234,0.28)]" />
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <a
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 px-4 text-sm font-medium text-[#d9d0bf] transition hover:bg-[#f8f4ea]/10 hover:text-white"
          href={routes.client.home}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Espace client
        </a>
        <span className="hidden rounded-full border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c6a4] sm:inline-flex">
          Simulation V1
        </span>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <section className="mx-auto w-full max-w-4xl">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] text-[#f8f4ea] sm:text-6xl">
              Decrivez votre projet comme vous l&apos;expliqueriez a un expert.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#cfc6b5]">
              Ajoutez vos plans, croquis, photos ou schemas. L&apos;equipe recoit
              une demande structuree, prete a etre qualifiee.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[34px] border border-[#f8f4ea]/14 bg-[#11100e]/90 p-3 shadow-[0_38px_140px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04] backdrop-blur-xl">
            <div className="rounded-[26px] border border-[#f8f4ea]/10 bg-[#f8f4ea]/[0.045]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f8f4ea]/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-[#f8f4ea] text-[#171613]">
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Capture projet</p>
                    <p className="text-xs text-[#9f9788]">
                      Aucun fichier reel n&apos;est transmis
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-[#e4c887]/30 bg-[#d7c6a4]/10 px-3 py-1.5 text-xs font-medium text-[#ead9b9]">
                  Simulation V1
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <textarea
                  aria-label="Decrire le projet"
                  className="min-h-[170px] w-full resize-none rounded-[24px] border border-[#f8f4ea]/10 bg-[#080807]/80 p-5 text-base leading-8 text-[#f8f4ea] outline-none transition placeholder:text-[#7d7465] focus:border-[#d7c6a4]/55 focus:ring-4 focus:ring-[#d7c6a4]/10 sm:min-h-[210px]"
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Exemple : j'ai un plan PDF d'un local a reprendre, je veux ajouter les arrivees electriques, corriger les cotes et obtenir une version DWG propre."
                  value={text}
                />

                <div className="mt-4 rounded-[24px] border border-[#f8f4ea]/10 bg-[#080807]/70 p-4 lg:hidden">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MessageSquareText className="size-4 text-[#d7c6a4]" aria-hidden="true" />
                    Fil equipe visible
                  </div>
                  <div className="mt-3 grid gap-2 text-sm leading-6">
                    <div className="rounded-[18px] bg-[#11100e] p-3 text-[#efe7d8]">
                      Client : voici mon besoin, mes plans et les corrections.
                    </div>
                    <div className="rounded-[18px] bg-[#f8f4ea] p-3 text-[#171613]">
                      Equipe : la demande arrive structuree pour qualification.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {documentChips.map((chip) => {
                    const active = selected.includes(chip);

                    return (
                      <button
                        className={
                          active
                            ? "rounded-full bg-[#f8f4ea] px-3 py-2 text-xs font-semibold text-[#171613]"
                            : "rounded-full border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 px-3 py-2 text-xs font-semibold text-[#cfc6b5] transition hover:bg-[#f8f4ea]/10 hover:text-white"
                        }
                        key={chip}
                        onClick={() => toggleChip(chip)}
                        type="button"
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-12 rounded-full border-[#f8f4ea]/16 bg-[#f8f4ea]/8 text-[#f8f4ea] hover:bg-[#f8f4ea]/12"
                    onClick={() => setMockFileCount((count) => count + 1)}
                    variant="outline"
                  >
                    <Paperclip className="size-4" aria-hidden="true" />
                    Joindre un document fictif
                  </Button>
                  <Button
                    className="h-12 rounded-full bg-[#f8f4ea] text-[#171613] hover:bg-white"
                    onClick={() => setStructured(true)}
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                    Structurer la demande
                  </Button>
                  <Button
                    className="h-12 rounded-full bg-emerald-100 text-[#171613] hover:bg-emerald-50"
                    onClick={sendRequest}
                  >
                    <Send className="size-4" aria-hidden="true" />
                    Envoyer a l&apos;equipe
                  </Button>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    { label: "Plan PDF", detail: "fictif", icon: FileText },
                    { label: "DWG source", detail: "mock", icon: FileArchive },
                    { label: "Croquis client", detail: "note", icon: Paperclip },
                  ].map(({ label, detail, icon: Icon }) => (
                    <div
                      className="rounded-[22px] border border-[#f8f4ea]/10 bg-[#080807]/70 p-4"
                      key={label}
                    >
                      <Icon className="size-4 text-[#d7c6a4]" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-xs text-[#9f9788]">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-6 text-[#9f9788]">
            {mockDataNotice}
          </p>
        </section>

        <aside className="grid content-start gap-4">
          <div className="hidden rounded-[28px] border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 p-5 backdrop-blur lg:block">
            <div className="flex items-center gap-3">
              <MessageSquareText className="size-5 text-[#d7c6a4]" aria-hidden="true" />
              <p className="font-semibold">Fil equipe visible</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-[20px] bg-[#080807] p-4 text-sm leading-6 text-[#efe7d8]">
                Client : voici mon besoin, mes plans et les corrections attendues.
              </div>
              <div className="rounded-[20px] bg-[#f8f4ea] p-4 text-sm leading-6 text-[#171613]">
                Equipe : nous recevons une demande structuree, prete a qualifier.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <Route className="size-5 text-[#d7c6a4]" aria-hidden="true" />
              <p className="font-semibold">Routage mocke</p>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9f9788]">
              Transmission manager
            </p>
            <div className="mt-4 grid gap-3">
              {roleHandoffSteps.map((step, index) => (
                <div className="flex gap-3" key={`${step.role}-${step.label}`}>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f8f4ea]/10 text-xs text-[#d7c6a4]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="mt-1 text-xs leading-5 text-[#a9a191]">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#f8f4ea]/12 bg-[#f8f4ea]/6 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">Synthese generee</p>
              {structured ? (
                <CheckCircle2 className="size-5 text-emerald-200" aria-hidden="true" />
              ) : (
                <span className="size-2 rounded-full bg-[#d7c6a4]" />
              )}
            </div>
            <div className="mt-4 grid gap-3">
              {summary.map((item) => (
                <div
                  className="rounded-[18px] border border-[#f8f4ea]/10 bg-[#080807]/70 p-3"
                  key={item.label}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[#9f9788]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <div className="fixed inset-x-4 bottom-4 z-40 flex gap-2 rounded-full border border-[#f8f4ea]/14 bg-[#090908]/92 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:hidden">
        <Button
          className="h-11 flex-1 rounded-full border-[#f8f4ea]/16 bg-[#f8f4ea]/8 text-[#f8f4ea] hover:bg-[#f8f4ea]/12"
          onClick={() => setStructured(true)}
          variant="outline"
        >
          Structurer
        </Button>
        <Button
          className="h-11 flex-1 rounded-full bg-[#f8f4ea] text-[#171613] hover:bg-white"
          onClick={sendRequest}
        >
          <Send className="size-4" aria-hidden="true" />
          Envoyer
        </Button>
      </div>

      {sending ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/82 p-4 backdrop-blur-xl">
          <div className="w-full max-w-xl rounded-[34px] border border-[#f8f4ea]/14 bg-[#11100e] p-6 text-[#f8f4ea] shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
            <div className="flex items-center gap-3">
              <Loader2 className="size-5 animate-spin text-[#d7c6a4]" aria-hidden="true" />
              <p className="text-lg font-semibold">Transmission a l&apos;equipe</p>
            </div>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#f8f4ea]/50 to-transparent" />
            <div className="mt-6 grid gap-3">
              {transitionSteps.map((step, index) => (
                <div
                  className="flex items-center gap-3 rounded-[18px] border border-[#f8f4ea]/10 bg-[#f8f4ea]/6 p-3 text-sm"
                  key={step}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#f8f4ea] text-xs font-semibold text-[#171613]">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <a
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#f8f4ea] px-5 text-sm font-semibold text-[#171613]"
              href={`${routes.client.projects}/project-demo-001`}
            >
              Voir le projet
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
