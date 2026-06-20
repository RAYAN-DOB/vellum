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
          "radial-gradient(circle at 58% 40%, rgba(16,185,129,0.22), transparent 60%)",
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
        className="pointer-events-none absolute -inset-12 rounded-[48px]"
        style={{
          background:
            "radial-gradient(circle at 55% 42%, rgba(16,185,129,0.30), rgba(14,116,144,0.14) 38%, transparent 66%)",
        }}
      />
      {reduce ? <Glow /> : <Hero3DScene />}
    </div>
  );
}
