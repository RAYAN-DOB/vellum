"use client";

import { useEffect, useMemo, useState } from "react";

import { VellumModelCanvas } from "@/components/three/VellumModelCanvas";
import {
  layerDefaults,
  type DetailLayer,
  type FloorKey,
} from "@/lib/vellumHeroData";

type AutoSceneStep = {
  floor: FloorKey;
  label: string;
  caption: string;
  layers: Partial<Record<DetailLayer, boolean>>;
};

/**
 * The hero maquette narrates the Vellum process while it turns: a sketch
 * becomes a dimensioned DWG base, floors separate, the roof lifts, then the
 * technical layers appear for the devis. Loops on its own.
 */
const autoScene: AutoSceneStep[] = [
  {
    floor: "rdc",
    label: "Plan RDC",
    caption: "Le croquis devient une base DWG cotée.",
    layers: { electrical: false, plumbing: false, dimensions: true, annotations: false },
  },
  {
    floor: "etage",
    label: "Étage 1",
    caption: "Les niveaux se séparent et révèlent les pièces.",
    layers: { electrical: false, plumbing: false, dimensions: true, annotations: false },
  },
  {
    floor: "toiture",
    label: "Toiture",
    caption: "La toiture se soulève avec ses repères.",
    layers: { electrical: false, plumbing: false, dimensions: true, annotations: false },
  },
  {
    floor: "etage",
    label: "Réseaux",
    caption: "Les calques techniques apparaissent pour le devis.",
    layers: { electrical: true, plumbing: true, dimensions: true, annotations: false },
  },
];

const sceneStepDuration = 5200;

export function VellumHeroMaquette() {
  const [stepIndex, setStepIndex] = useState(1);
  const step = autoScene[stepIndex];

  useEffect(() => {
    let frame = 0;
    let lastIndex = -1;
    const start = performance.now();

    const tick = (time: number) => {
      const nextIndex =
        (1 + Math.floor((time - start) / sceneStepDuration)) % autoScene.length;
      if (nextIndex !== lastIndex) {
        lastIndex = nextIndex;
        setStepIndex(nextIndex);
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const layers = useMemo<Record<DetailLayer, boolean>>(
    () => ({ ...layerDefaults, ...step.layers }),
    [step.layers],
  );

  return (
    <div className="maquette-stage">
      <VellumModelCanvas
        selectedFloor={step.floor}
        layers={layers}
        showCornerLabel={false}
        embedMode
      />
    </div>
  );
}
