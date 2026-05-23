import {
  ArrowUpRight,
  CheckCircle2,
  CircuitBoard,
  FileArchive,
  FileText,
  Layers3,
  MessageSquareText,
  Paperclip,
  Ruler,
  SendHorizontal,
  ShieldCheck,
  SquareDashedMousePointer,
} from "lucide-react";

const floatingFiles = [
  {
    label: "Plan DWG",
    detail: "RDC + cotations",
    meta: "V2",
    icon: Ruler,
    className:
      "left-0 top-24 rotate-[-5deg] bg-[#f8f4ea] text-[#161512] shadow-[0_28px_90px_rgba(0,0,0,0.28)]",
  },
  {
    label: "PDF annote",
    detail: "Corrections client",
    meta: "12 notes",
    icon: FileText,
    className:
      "right-0 top-8 rotate-[4deg] bg-[#171613] text-[#f8f4ea] ring-[#f8f4ea]/14 shadow-[0_30px_95px_rgba(0,0,0,0.42)]",
  },
  {
    label: "Schema elec",
    detail: "Tableau + prises",
    meta: "A qualifier",
    icon: CircuitBoard,
    className:
      "right-10 bottom-12 rotate-[-3deg] bg-[#221f19] text-[#f8f4ea] ring-[#f8f4ea]/12 shadow-[0_26px_80px_rgba(0,0,0,0.36)]",
  },
] as const;

const preparedDocs = [
  { label: "Croquis client", value: "JPEG", tone: "text-[#f3d59d]" },
  { label: "Plan existant", value: "DWG", tone: "text-emerald-200" },
  { label: "Schema plomberie", value: "PDF", tone: "text-[#f8f4ea]" },
] as const;

const messages = [
  {
    author: "Client",
    text: "Je veux reprendre le PDF et ajouter les attentes electriques sur la zone accueil.",
    align: "start",
  },
  {
    author: "Equipe",
    text: "Recu. Joignez le DWG, le PDF annote et les photos du site. On prepare une synthese avant qualification.",
    align: "end",
  },
] as const;

const steps = ["Depot", "Qualification", "Apercu", "Validation"] as const;

function FloatingFileCard({
  file,
}: {
  file: (typeof floatingFiles)[number];
}) {
  const Icon = file.icon;

  return (
    <div
      className={`hero-float absolute hidden w-48 rounded-[24px] border border-white/10 p-4 ring-1 sm:block ${file.className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border border-current/12 bg-current/5">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-current/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">
          {file.meta}
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold">{file.label}</p>
      <p className="mt-1 text-xs leading-5 opacity-60">{file.detail}</p>
    </div>
  );
}

export function HeroProjectCockpitMockup() {
  return (
    <div className="relative mx-auto min-h-[590px] w-full max-w-[760px] lg:min-h-[660px]">
      <div className="absolute inset-x-10 top-4 h-px bg-gradient-to-r from-transparent via-[#f8f4ea]/28 to-transparent" />
      <div className="absolute left-[12%] right-[8%] top-14 h-[520px] rounded-[42px] border border-[#f8f4ea]/8 bg-[#f8f4ea]/[0.025] blur-[0.2px]" />

      {floatingFiles.map((file) => (
        <FloatingFileCard file={file} key={file.label} />
      ))}

      <div className="relative z-10 mx-auto pt-8 sm:px-8 sm:pt-16 lg:pt-20">
        <div className="rounded-[36px] border border-[#f8f4ea]/14 bg-[#0b0b09]/88 p-3 shadow-[0_45px_140px_rgba(0,0,0,0.52)] ring-1 ring-white/[0.04] backdrop-blur-2xl">
          <div className="rounded-[28px] border border-[#f8f4ea]/10 bg-[#171613]">
            <div className="flex items-center justify-between gap-4 border-b border-[#f8f4ea]/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f8f4ea] text-[#171613]">
                  <SquareDashedMousePointer className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#f8f4ea]">
                    PlanWork cockpit
                  </p>
                  <p className="text-xs text-[#9f9788]">Projet mocke / V1 front</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-200/18 bg-emerald-200/7 px-3 py-1.5 text-xs font-medium text-emerald-100 sm:flex">
                <span className="size-1.5 rounded-full bg-emerald-200" />
                A qualifier
              </div>
            </div>

            <div className="grid gap-3 p-3 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="order-2 rounded-[24px] border border-[#f8f4ea]/10 bg-[#f8f4ea]/[0.045] p-4 lg:order-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#9f9788]">
                      Dossier prepare
                    </p>
                    <h3 className="mt-3 text-xl font-semibold leading-tight text-[#f8f4ea]">
                      Reprise accueil cabinet
                    </h3>
                  </div>
                  <Layers3 className="size-5 text-[#d7c6a4]" aria-hidden="true" />
                </div>

                <div className="mt-5 space-y-3">
                  {preparedDocs.map((doc) => (
                    <div
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#f8f4ea]/9 bg-[#0f0f0d]/72 px-3 py-3"
                      key={doc.label}
                    >
                      <span className="flex items-center gap-3 text-sm text-[#e8dfcf]">
                        <FileArchive className="size-4 text-[#a59b8a]" aria-hidden="true" />
                        {doc.label}
                      </span>
                      <span className={`font-mono text-xs ${doc.tone}`}>{doc.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[22px] border border-[#f8f4ea]/10 bg-[#090908] p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#d7c6a4]">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Confidentialite cible
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[#a7a092]">
                    Les fichiers sont fictifs en V1. Le cloisonnement serveur,
                    l&apos;audit et les URLs privees arrivent en V2.
                  </p>
                </div>
              </div>

              <div className="order-1 rounded-[24px] border border-[#f8f4ea]/10 bg-[#f8f4ea]/[0.065] p-4 lg:order-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#f8f4ea]/10 text-[#f8f4ea]">
                      <MessageSquareText className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#f8f4ea]">
                        Chat projet
                      </p>
                      <p className="text-xs text-[#9f9788]">Brief, pieces, synthese</p>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-[#d7c6a4]" aria-hidden="true" />
                </div>

                <div className="mt-5 space-y-3">
                  {messages.map((message) => (
                    <div
                      className={`flex ${
                        message.align === "end" ? "justify-end" : "justify-start"
                      }`}
                      key={message.text}
                    >
                      <div
                        className={`max-w-[86%] rounded-[22px] px-4 py-3 ${
                          message.align === "end"
                            ? "bg-[#f8f4ea] text-[#171613]"
                            : "border border-[#f8f4ea]/10 bg-[#0f0f0d] text-[#efe7d8]"
                        }`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60">
                          {message.author}
                        </p>
                        <p className="mt-1 text-sm leading-6">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[24px] border border-[#d7c6a4]/20 bg-[#d7c6a4]/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#f8f4ea]">
                    <CheckCircle2 className="size-4 text-emerald-200" aria-hidden="true" />
                    Synthese mockee
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#d9cfbd]">
                    Besoin detecte : reprise PDF, ajout reseaux electriques,
                    verification des cotes et apercu avant devis.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full border border-[#f8f4ea]/12 bg-[#080807] px-3 py-2">
                  <Paperclip className="size-4 shrink-0 text-[#9f9788]" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-xs text-[#9f9788]">
                    Ajouter DWG, PDF, croquis ou note projet
                  </span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f8f4ea] text-[#171613]">
                    <SendHorizontal className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2 border-t border-[#f8f4ea]/10 p-3 sm:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  className="rounded-2xl border border-[#f8f4ea]/9 bg-[#0f0f0d]/74 px-3 py-3"
                  key={step}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        index < 2 ? "bg-emerald-200" : "bg-[#d7c6a4]/55"
                      }`}
                    />
                    <span className="text-xs font-medium text-[#f8f4ea]">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
