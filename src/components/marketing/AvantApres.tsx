"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { CartoucheHeader } from "@/components/atelier/CartoucheHeader";

const PLAN = "/technical-plans/vellum-plan-architecture.svg";

const THUMBS = [
  { src: "/technical-plans/vellum-plan-architecture.svg", label: "Architecture", ref: "PL-2D" },
  { src: "/technical-plans/vellum-plan-electricity.svg", label: "Électricité", ref: "SCH-ELEC" },
  { src: "/technical-plans/vellum-plan-plumbing.svg", label: "Plomberie", ref: "SCH-PLB" },
] as const;

/** Loose hand-drawn client croquis (the "before") — graphite, wobbled. */
function CroquisSheet() {
  return (
    <svg viewBox="0 0 1400 900" aria-hidden="true" className="h-full w-full p-6">
      <defs>
        <filter id="ap-sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={9} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={9} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g
        filter="url(#ap-sketch)"
        stroke="var(--graphite)"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.72}
      >
        <path d="M300 200 H1040 V690 H300 Z" />
        <path d="M670 195 V695" />
        <path d="M670 455 H1045" />
        <path d="M295 455 H670" />
        {/* a door swing scribble */}
        <path d="M670 560 q-70 0 -70 -70" />
        {/* a window mark + a couple of measurement scribbles */}
        <path d="M430 198 H560" />
        <path d="M300 730 H1040" strokeWidth={2.5} />
        <path d="M250 200 V690" strokeWidth={2.5} />
      </g>
      <text x={470} y={350} fill="var(--mute)" style={{ fontFamily: "var(--font-playfair), serif", fontSize: 34, fontStyle: "italic" }}>
        séjour ~20m²
      </text>
      <text x={770} y={330} fill="var(--mute)" style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontStyle: "italic" }}>
        chambre
      </text>
      <text x={770} y={600} fill="var(--mute)" style={{ fontFamily: "var(--font-playfair), serif", fontSize: 26, fontStyle: "italic" }}>
        sdb
      </text>
    </svg>
  );
}

export function AvantApres() {
  const [pos, setPos] = useState(46);
  const ref = useRef<HTMLDivElement>(null);

  function setFromClientX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(96, Math.max(4, p)));
  }

  return (
    <section
      id="avant-apres"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10 lg:py-24"
    >
      <CartoucheHeader
        eyebrow="§02 · Avant / Après"
        meta="Entrée client → livrable"
        title="Le même projet, mis au propre."
        description="À gauche, le croquis tel que vous le déposez. À droite, le plan technique coté que le dessinateur vous livre. Glissez la poignée pour comparer."
      />

      <div
        ref={ref}
        className="sheet relative mt-10 aspect-[16/10] touch-none select-none overflow-hidden rounded-[6px]"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromClientX(e.clientX);
        }}
      >
        {/* before — croquis (full) */}
        <div className="absolute inset-0 bg-paper">
          <div aria-hidden="true" className="absolute inset-0 grid-paper opacity-40" />
          <CroquisSheet />
          <span className="caption absolute left-4 top-4 text-mute">
            Entrée client · croquis
          </span>
        </div>

        {/* after — plan (clipped from the handle) */}
        <div
          className="absolute inset-0 bg-paper"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <Image
            src={PLAN}
            alt="Plan technique coté livré par Vellum à partir du croquis client"
            fill
            sizes="(min-width: 1024px) 1100px, 92vw"
            className="object-contain p-4"
          />
          <span className="caption absolute right-4 top-4 text-pine">
            Livrable Vellum · plan coté
          </span>
        </div>

        {/* handle — a cotation line + datum grip */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparer le croquis et le plan livré"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(4, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(96, p + 4));
          }}
          className="absolute inset-y-0 z-10 -ml-4 w-8 cursor-ew-resize focus-visible:outline-none"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-ink/70" />
          <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-paper shadow-[var(--shadow-e2)]">
            <span className="size-2 rounded-full bg-pine" />
          </span>
        </div>
      </div>

      {/* range strip — proof of breadth */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {THUMBS.map((t) => (
          <div
            key={t.ref}
            className="sheet-flat relative overflow-hidden rounded-[4px]"
          >
            <div className="relative aspect-[16/11] bg-paper">
              <Image
                src={t.src}
                alt={`Exemple Vellum — ${t.label}`}
                fill
                sizes="(min-width: 1024px) 360px, 30vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between border-t border-line px-3 py-2">
              <span className="text-[12px] font-medium text-ink">{t.label}</span>
              <span className="caption text-soft">{t.ref}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
