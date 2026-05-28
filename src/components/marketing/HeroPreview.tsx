"use client";

import { CheckCircle2, FileText, MessageSquare, Ruler } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Premium glass-morphism preview card with dramatic lighting
 */
export function HeroPreview() {
  return (
    <div className="relative">
      {/* Ambient glow behind card */}
      <div 
        className="absolute -inset-10 opacity-60 blur-3xl"
        style={{ 
          background: "radial-gradient(ellipse at center, rgba(245,166,35,0.15) 0%, transparent 70%)" 
        }}
      />
      
      {/* Corner decorations */}
      <CornerMark className="absolute -left-3 -top-3" />
      <CornerMark className="absolute -right-3 -top-3 rotate-90" />
      <CornerMark className="absolute -bottom-3 -left-3 -rotate-90" />
      <CornerMark className="absolute -bottom-3 -right-3 rotate-180" />

      {/* Main card */}
      <div className="relative card-elevated rounded-2xl p-6 sm:p-8 shine">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-graphite pb-5">
          <div className="flex items-center gap-3">
            <span className="caption text-dim">PRJ–202605–0042</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1">
              <span className="size-2 rounded-full bg-gold pulse-dot" />
              <span className="text-xs font-medium text-gold">À qualifier</span>
            </span>
          </div>
          <span className="caption hidden sm:inline text-dim">RÉV. 03 · 24.05.2026</span>
        </div>

        {/* Project title */}
        <h3 className="display mt-6 text-2xl sm:text-3xl text-paper">
          Réfection plancher R+1
        </h3>
        <p className="mt-2 text-sm text-silver">
          Immeuble haussmannien · Paris 11
        </p>

        {/* Blueprint surface */}
        <div className="relative mt-6 overflow-hidden rounded-xl border border-graphite bg-obsidian">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-dots opacity-50" />
          
          {/* Simplified blueprint SVG */}
          <svg
            viewBox="0 0 400 200"
            className="relative h-auto w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#71717a" />
              </linearGradient>
            </defs>
            
            {/* Main walls */}
            <rect
              x="40"
              y="30"
              width="320"
              height="140"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              rx="2"
            />
            
            {/* Interior divisions */}
            <line x1="40" y1="100" x2="200" y2="100" stroke="#71717a" strokeWidth="1" />
            <line x1="200" y1="30" x2="200" y2="170" stroke="#71717a" strokeWidth="1" />
            <line x1="200" y1="130" x2="360" y2="130" stroke="#71717a" strokeWidth="1" />

            {/* Dimension lines */}
            <g stroke="#525252" strokeWidth="0.5" strokeDasharray="3,3">
              <line x1="40" y1="18" x2="200" y2="18" />
              <line x1="40" y1="15" x2="40" y2="21" />
              <line x1="200" y1="15" x2="200" y2="21" />
            </g>
            <text
              x="120"
              y="13"
              fontSize="8"
              fill="#71717a"
              fontFamily="monospace"
              textAnchor="middle"
            >
              4.20 m
            </text>

            {/* Annotation with gold accent */}
            <circle 
              cx="280" 
              cy="70" 
              r="12" 
              fill="none" 
              stroke="#f5a623" 
              strokeWidth="1.5" 
            />
            <line x1="280" y1="82" x2="280" y2="100" stroke="#f5a623" strokeWidth="1" />
            <text
              x="280"
              y="112"
              fontSize="7"
              fill="#f5a623"
              fontFamily="monospace"
              textAnchor="middle"
            >
              VOIR NOTE #3
            </text>

            {/* Door arcs */}
            <path 
              d="M 110 100 A 16 16 0 0 1 126 116" 
              fill="none" 
              stroke="#71717a" 
              strokeWidth="0.8" 
            />
            <path 
              d="M 290 130 A 16 16 0 0 1 274 146" 
              fill="none" 
              stroke="#71717a" 
              strokeWidth="0.8" 
            />
          </svg>
        </div>

        {/* Activity timeline */}
        <div className="mt-6 space-y-3">
          <ActivityRow
            icon={<MessageSquare className="size-3.5" />}
            who="Chef de projet"
            what="Brief reçu, qualification en cours"
            when="il y a 2 min"
            highlight
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

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-graphite pt-5">
          <span className="caption text-dim">CONFIDENTIEL · NDA REQUIS</span>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald">
            <CheckCircle2 className="size-4" />
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
  highlight = false,
}: {
  icon: React.ReactNode;
  who: string;
  what: string;
  when: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-lg border p-3 transition-colors",
      highlight 
        ? "border-gold/20 bg-gold/5" 
        : "border-transparent hover:border-graphite hover:bg-obsidian/50"
    )}>
      <span className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full",
        highlight ? "bg-gold/20 text-gold" : "bg-slate text-silver"
      )}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-paper">
          <span className="font-medium">{who}</span>
          <span className="text-silver"> — {what}</span>
        </p>
        <p className="caption mt-1 text-dim">{when}</p>
      </div>
    </div>
  );
}

function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn("size-4 text-gold/30", className)}
    >
      <path d="M0 0 L16 0 L16 2 L2 2 L2 16 L0 16 Z" fill="currentColor" />
    </svg>
  );
}
