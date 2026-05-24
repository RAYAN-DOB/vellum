import { CheckCircle2, FileText, MessageSquare, Ruler } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Editorial mock of the project detail surface — drafted, calm, no fake data
 * pretending to be alive (no fake numbers, no fake faces).
 */
export function HeroPreview() {
  return (
    <div className="relative">
      {/* Crosshair corner marks — drafting cue */}
      <CornerMark className="absolute -left-3 -top-3" />
      <CornerMark className="absolute -right-3 -top-3 rotate-90" />
      <CornerMark className="absolute -bottom-3 -left-3 -rotate-90" />
      <CornerMark className="absolute -bottom-3 -right-3 rotate-180" />

      <div className="sheet relative rounded-[4px] p-5 sm:p-6">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="caption text-mute">PRJ–202605–0042</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-vellum/60 px-2.5 py-1 text-[11px] font-medium text-graphite">
              <span className="size-1.5 rounded-full bg-amber" />
              À qualifier
            </span>
          </div>
          <span className="caption hidden sm:inline">RÉV. 03 · 24.05.2026</span>
        </div>

        {/* Project title */}
        <h3 className="display mt-5 text-2xl text-ink sm:text-[28px]">
          Réfection plancher R+1
        </h3>
        <p className="mt-1.5 text-sm text-mute">
          Immeuble haussmannien · Paris 11
        </p>

        {/* Drafting surface */}
        <div className="relative mt-6 overflow-hidden rounded-[3px] border border-line bg-vellum">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid-paper opacity-80"
          />
          {/* Simplified plan SVG */}
          <svg
            viewBox="0 0 400 220"
            className="relative h-auto w-full"
            aria-hidden="true"
          >
            {/* Walls */}
            <rect
              x="40"
              y="30"
              width="320"
              height="160"
              fill="none"
              stroke="#2b2a26"
              strokeWidth="1.5"
            />
            <line x1="40" y1="110" x2="220" y2="110" stroke="#2b2a26" strokeWidth="1" />
            <line x1="220" y1="30" x2="220" y2="190" stroke="#2b2a26" strokeWidth="1" />
            <line x1="220" y1="140" x2="360" y2="140" stroke="#2b2a26" strokeWidth="1" />

            {/* Dimension lines */}
            <g stroke="#6b6960" strokeWidth="0.5">
              <line x1="40" y1="15" x2="220" y2="15" />
              <line x1="40" y1="12" x2="40" y2="18" />
              <line x1="220" y1="12" x2="220" y2="18" />
            </g>
            <text
              x="130"
              y="11"
              fontSize="7"
              fill="#6b6960"
              fontFamily="var(--font-jetbrains-mono), monospace"
              textAnchor="middle"
            >
              4.20 m
            </text>

            {/* Annotation circle */}
            <circle cx="290" cy="80" r="14" fill="none" stroke="#b6543a" strokeWidth="1.2" strokeDasharray="2,2" />
            <line x1="290" y1="94" x2="290" y2="110" stroke="#b6543a" strokeWidth="0.8" />
            <text
              x="290"
              y="120"
              fontSize="7"
              fill="#b6543a"
              fontFamily="var(--font-jetbrains-mono), monospace"
              textAnchor="middle"
            >
              VOIR NOTE #3
            </text>

            {/* Door swings */}
            <path d="M 120 110 A 18 18 0 0 1 138 128" fill="none" stroke="#2b2a26" strokeWidth="0.8" />
            <path d="M 300 140 A 18 18 0 0 1 282 158" fill="none" stroke="#2b2a26" strokeWidth="0.8" />
          </svg>
        </div>

        {/* Activity rows */}
        <div className="mt-5 space-y-2.5">
          <ActivityRow
            icon={<MessageSquare className="size-3.5" />}
            who="Chef de projet"
            what="Brief reçu, qualification en cours"
            when="il y a 2 min"
          />
          <ActivityRow
            icon={<FileText className="size-3.5" />}
            who="Client"
            what="3 PDF déposés · 1 schéma plomberie"
            when="il y a 18 min"
          />
          <ActivityRow
            icon={<Ruler className="size-3.5" />}
            who="Système"
            what="Référence projet générée"
            when="il y a 24 min"
          />
        </div>

        {/* Footer signature */}
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="caption">CONFIDENTIEL · NDA REQUIS</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-moss">
            <CheckCircle2 className="size-3.5" />
            Synchronisé
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  icon,
  who,
  what,
  when,
}: {
  icon: React.ReactNode;
  who: string;
  what: string;
  when: string;
}) {
  return (
    <div className="flex items-start gap-3 border-l-2 border-line pl-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-vellum/50 text-mute">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-ink">
          <span className="font-medium">{who}</span>
          <span className="text-mute"> — {what}</span>
        </p>
        <p className="caption mt-0.5">{when}</p>
      </div>
    </div>
  );
}

function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("size-4 text-line-strong", className)}
    >
      <path d="M0 0 L16 0 L16 1 L1 1 L1 16 L0 16 Z" fill="currentColor" />
    </svg>
  );
}
