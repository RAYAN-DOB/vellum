"use client";

import dynamic from "next/dynamic";

/** Paper-card placeholder shown while the (heavy) three.js maquette loads. */
function MaquetteFallback() {
  return (
    <div className="maquette-stage" aria-hidden="true">
      <div className="maquette-loading">
        <span />
      </div>
    </div>
  );
}

/**
 * Lazy boundary for the 3D maquette. three.js is heavy, so it loads client-only
 * (ssr:false) after hydration, with a matching paper-card fallback so the hero
 * layout never shifts.
 */
const LazyMaquette = dynamic(
  () =>
    import("@/components/three/VellumHeroMaquette").then(
      (m) => m.VellumHeroMaquette,
    ),
  { ssr: false, loading: () => <MaquetteFallback /> },
);

export function HeroMaquette() {
  return <LazyMaquette />;
}
