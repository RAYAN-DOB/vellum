"use client";

/**
 * LivingBlueprintHero — drop-in replacement for the hero right column.
 *
 * Renders the WebGL "plan → volume" scene, but only when it's safe and worth
 * it. The three/fiber Canvas is loaded via `next/dynamic({ ssr: false })`
 * INSIDE this Client Component (per Next 16 lazy-loading guide) so three is
 * never server-rendered.
 *
 * Guard: if the user prefers reduced motion, OR the viewport is < 1024px, OR
 * WebGL is unavailable, we render ONLY the static poster card and never mount
 * the canvas. The poster also serves as the Suspense fallback so the slot never
 * flashes empty and the canvas never owns LCP.
 *
 * Theme: warm paper, ink, sienna — matches the drafting aesthetic.
 */

import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// ssr:false is valid here because this module is a Client Component.
const LivingBlueprintScene = dynamic(
  () => import("./three/LivingBlueprintScene"),
  {
    ssr: false,
    loading: () => <PosterCard />,
  },
);

const POSTER_SRC = "/technical-plans/vellum-plan-architecture.svg";

/** Cheap, side-effect-free WebGL capability probe. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * Static framed paper card showing the existing SVG poster. Used as the
 * Suspense/loading fallback AND as the sole render when the canvas is gated.
 */
function PosterCard() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[8px] border border-line bg-vellum/50">
      {/* faint paper grid under the poster */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-paper opacity-50"
      />
      <Image
        src={POSTER_SRC}
        alt="Plan technique Vellum — aperçu d'architecture"
        fill
        priority
        sizes="(min-width: 1024px) 560px, 90vw"
        className="object-contain p-6 opacity-95"
      />
    </div>
  );
}

export function LivingBlueprintHero() {
  // Until mounted we render the poster (also the SSR/first-paint output).
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mqWidth = window.matchMedia("(min-width: 1024px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Mount the canvas only on capable, large, motion-friendly viewports.
    // (LivingBlueprintScene itself still re-checks reduced-motion for its loop.)
    const evaluate = () =>
      !mqMotion.matches && mqWidth.matches && detectWebGL();

    // Syncing React state from browser-only capability probes (matchMedia /
    // WebGL) is the documented "subscribe to an external system" use of an
    // effect; this single synchronous setState is intentional. The React
    // Compiler heuristic flags it regardless, so we opt out locally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanRender3D(evaluate());

    const onChange = () => setCanRender3D(evaluate());
    mqWidth.addEventListener("change", onChange);
    mqMotion.addEventListener("change", onChange);
    return () => {
      mqWidth.removeEventListener("change", onChange);
      mqMotion.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* faint sienna radial wash behind the frame — the only allowed gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[12px] bg-[radial-gradient(circle_at_72%_14%,rgba(159,79,56,0.12),transparent_38%)]"
      />

      {/* Framed paper card — fills the column, clamped height, min-h ~28rem */}
      <div className="sheet relative aspect-square min-h-[28rem] overflow-hidden rounded-[10px]">
        {/* thin sienna corner tick (top-left) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l border-t border-sienna/70"
        />
        {/* mono caption */}
        <span className="caption absolute right-3 top-3 z-20 text-sienna">
          PLAN → VOLUME
        </span>

        {canRender3D ? (
          <Suspense fallback={<PosterCard />}>
            <LivingBlueprintScene />
          </Suspense>
        ) : (
          <PosterCard />
        )}

        {/* hairline ledger caption, bottom — keeps the technical chrome */}
        <span className="caption absolute bottom-3 left-3 z-20 text-mute">
          VELLUM · MASSING STUDY · FICTION
        </span>
      </div>
    </div>
  );
}

export default LivingBlueprintHero;
