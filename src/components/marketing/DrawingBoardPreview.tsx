import { FileText, Layers3, Ruler, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

export function DrawingBoardPreview() {
  return (
    <div className="drawing-line relative min-h-[430px] overflow-hidden rounded-[6px] border border-[#4b473d] bg-[#191813] p-5 text-[#f7f3ea] shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
      <div className="absolute left-6 right-6 top-6 flex items-center justify-between border-b border-[#f7f3ea]/10 pb-4 text-[11px] uppercase tracking-[0.2em] text-[#a9a191]">
        <span>PLAN-OPS / DEMO</span>
        <span>V1 front mockee</span>
      </div>

      <div className="absolute left-8 top-24 h-44 w-64 rounded-[3px] border border-[#f7f3ea]/18 bg-[#f7f3ea]/5 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#a9a191]">
              Dossier client
            </p>
            <p className="mt-2 text-lg font-semibold text-[#f7f3ea]">
              Reprise plan PDF
            </p>
          </div>
          <Badge tone="amber">Cadrage</Badge>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-px w-full bg-[#f7f3ea]/30" />
          <div className="h-px w-8/12 bg-[#f7f3ea]/20" />
          <div className="h-px w-10/12 bg-[#f7f3ea]/16" />
        </div>
      </div>

      <div className="absolute right-8 top-24 w-52 rounded-[3px] border border-[#f7f3ea]/16 bg-[#f7f3ea]/6 p-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#a9a191]">
          <Layers3 className="size-4" aria-hidden="true" />
          Calques
        </div>
        <div className="mt-4 space-y-3 text-sm">
          {["Client", "Manager", "Architecte"].map((item, index) => (
            <div className="flex items-center justify-between gap-3" key={item}>
              <span className="text-[#e8e0d0]">{item}</span>
              <span
                className={
                  index === 0
                    ? "h-px w-16 bg-emerald-300"
                    : index === 1
                      ? "h-px w-16 bg-[#d7c6a4]"
                      : "h-px w-16 bg-[#f7f3ea]/35"
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-8 right-8 rounded-[3px] border border-[#f7f3ea]/14 bg-[#0f0f0d]/72 p-4 backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Brief", icon: FileText },
            { label: "Cotes", icon: Ruler },
            { label: "Acces", icon: ShieldCheck },
            { label: "Versions", icon: Layers3 },
          ].map(({ label, icon: Icon }) => (
            <div className="rounded-[3px] border border-[#f7f3ea]/10 p-3" key={label}>
              <Icon className="size-4 text-[#d7c6a4]" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-[#f7f3ea]">{label}</p>
              <div className="mt-2 h-px w-full bg-[#f7f3ea]/18" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-20 bottom-20 h-40 w-40 rounded-full border border-[#f7f3ea]/10" />
      <div className="absolute bottom-24 right-16 h-24 w-px rotate-45 bg-[#d7c6a4]/35" />
    </div>
  );
}
