import Image from "next/image";
import {
  CheckCircle2,
  Cuboid,
  FileArchive,
  FileCheck2,
  FileText,
  MessageSquareText,
} from "lucide-react";

const cards = [
  { label: "PDF", detail: "plans reçus", icon: FileText },
  { label: "DWG", detail: "fichiers natifs", icon: FileArchive },
  { label: "Aperçu 3D", detail: "maquette", icon: Cuboid },
  { label: "Corrections", detail: "à valider", icon: MessageSquareText },
  { label: "Livrable", detail: "final", icon: FileCheck2 },
] as const;

const layers = [
  {
    label: "Plan reçu",
    src: "/technical-plans/vellum-plan-architecture.svg",
  },
  {
    label: "Électricité",
    src: "/technical-plans/vellum-plan-electricity.svg",
  },
  {
    label: "Plomberie",
    src: "/technical-plans/vellum-plan-plumbing.svg",
  },
  {
    label: "Correction",
    src: "/technical-plans/vellum-plan-revision.svg",
  },
] as const;

export function VellumPlanShowcase() {
  return (
    <div className="vellum-plan-showcase group relative mx-auto w-full max-w-[680px]">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[10px] bg-[radial-gradient(circle_at_70%_12%,rgba(159,79,56,0.14),transparent_34%),linear-gradient(135deg,rgba(251,250,246,0.8),rgba(241,234,223,0.24))]"
      />

      <div className="relative overflow-hidden rounded-[8px] border border-[#d8d0bf] bg-ink shadow-[0_34px_90px_rgba(21,20,16,0.22)]">
        <div className="relative aspect-[16/11] min-h-[360px] sm:min-h-[500px]">
          <Image
            src="/marketing/vellum-plan-hero-3d.png"
            alt="Plan technique Vellum avec calques électricité, plomberie et aperçu 3D"
            fill
            priority
            sizes="(min-width: 1024px) 680px, 92vw"
            className="plan-hero-art object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,246,0.20),transparent_36%),linear-gradient(180deg,rgba(251,250,246,0.08),rgba(21,20,16,0.18)_88%),radial-gradient(circle_at_50%_50%,transparent_52%,rgba(21,20,16,0.24))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
            style={{
              backgroundImage:
                "linear-gradient(rgba(251,250,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,250,246,0.8) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="annotation-pin absolute left-4 top-4 rounded-full border border-paper/20 bg-[#151410]/68 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper shadow-[0_12px_28px_rgba(21,20,16,0.24)] backdrop-blur sm:left-6 sm:top-6">
            calques actifs
          </div>
          <div className="annotation-pin annotation-pin-delay absolute right-4 top-[52%] rounded-full border border-[#9f4f38]/30 bg-[#fbfaf6]/88 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7b3828] shadow-[0_12px_28px_rgba(21,20,16,0.14)] backdrop-blur sm:right-6">
            à vérifier
          </div>

          <div className="absolute inset-x-3 bottom-3 z-20 grid grid-cols-5 gap-1.5 sm:inset-x-5 sm:bottom-5 sm:gap-2">
            {cards.map(({ label, detail, icon: Icon }, index) => (
              <div
                key={label}
                className="plan-mini-card flex min-w-0 flex-col items-center gap-1 rounded-[5px] border border-[#fbfaf6]/18 bg-[#151410]/64 px-1.5 py-2 text-center text-paper shadow-[0_14px_30px_rgba(21,20,16,0.18)] backdrop-blur sm:flex-row sm:gap-2 sm:px-3 sm:text-left"
                style={{ animationDelay: `${index * 160}ms` }}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-[#fbfaf6]/92 text-[#7b3828] sm:size-8">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block max-w-full truncate text-[10px] font-semibold sm:text-[12px]">
                    {label}
                  </span>
                  <span className="hidden truncate text-[10px] text-paper/62 sm:block">
                    {detail}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-3 -mt-4 grid gap-2 rounded-[6px] border border-line bg-paper/90 p-3 shadow-[0_18px_48px_rgba(21,20,16,0.11)] backdrop-blur sm:mx-6 sm:-mt-6 sm:grid-cols-4">
        {layers.map((layer, index) => (
          <div
            key={layer.label}
            className="flex min-w-0 items-center gap-2 rounded-[4px] bg-vellum/55 p-2"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[3px] border border-line bg-paper">
              <Image
                src={layer.src}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-ink">
                {layer.label}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-mute">
                <CheckCircle2
                  className="size-3 shrink-0 text-moss"
                  aria-hidden="true"
                />
                Étape {index + 1}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
