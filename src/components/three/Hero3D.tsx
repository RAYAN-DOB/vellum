"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const Hero3DScene = dynamic(() => import("@/components/three/Hero3DScene"), {
  ssr: false,
  loading: () => <Glow />,
});

function Glow() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 58% 40%, rgba(15,118,110,0.12), transparent 60%)",
      }}
    />
  );
}

/**
 * Hero3D — the moving 3D header. Loads the WebGL scene client-only (ssr:false)
 * with an emerald-glow fallback; under reduced motion it shows the glow alone.
 */
export function Hero3D() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-[44px]"
        style={{
          background:
            "radial-gradient(circle at 55% 42%, rgba(15,118,110,0.12), rgba(14,116,144,0.06) 40%, transparent 66%)",
        }}
      />
      {reduce ? <Glow /> : <Hero3DScene />}
    </div>
  );
}
