"use client";

/**
 * LivingBlueprintScene — the "plan becomes building" WebGL centerpiece.
 *
 * A flat fictional floor plan is drawn as hairlines at y = 0, then the same
 * walls rise into a translucent wireframe massing. A single `progress` value
 * (0..1) drives the extrusion; it auto-plays as a slow breathing loop inside
 * useFrame (no per-frame React state). The camera slowly orbits for a
 * 3/4 axonometric, technical-drawing feel.
 *
 * Theme: ink / paper / sienna only, matte lighting, transparent canvas.
 *
 * Perf + a11y:
 *   - dpr clamped to [1, 1.5]
 *   - geometries disposed on unmount
 *   - render loop paused when offscreen (IntersectionObserver) and frozen at a
 *     static ~60% frame when prefers-reduced-motion is set.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Grid, Line } from "@react-three/drei";
import * as THREE from "three";

import {
  PLAN_HALF_X,
  PLAN_HALF_Z,
  PLAN_WALLS,
  WALL_HEIGHT,
  WALL_THICKNESS,
  type WallSegment,
} from "./blueprintModel";

/* ── Theme palette (kept in sync with globals.css tokens) ──────────────── */
const COLOR = {
  paper: "#fbfaf6",
  ink: "#151410",
  graphite: "#25231f",
  sienna: "#9f4f38",
  line: "#d8d0bf",
  mute: "#746d62",
} as const;

/* A wall precomputed into the values the 3D scene needs. */
type WallBox = {
  /** center of the wall footprint in plan coords */
  cx: number;
  cz: number;
  /** length of the segment (becomes box depth) */
  length: number;
  /** rotation about Y so the box aligns with the segment */
  angle: number;
  /** flat hairline points (slightly lifted off the grid to avoid z-fighting) */
  points: [number, number, number][];
};

function buildWall(seg: WallSegment): WallBox {
  const dx = seg.x2 - seg.x1;
  const dz = seg.z2 - seg.z1;
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const cx = (seg.x1 + seg.x2) / 2;
  const cz = (seg.z1 + seg.z2) / 2;
  return {
    cx,
    cz,
    length,
    angle,
    points: [
      [seg.x1, 0.012, seg.z1],
      [seg.x2, 0.012, seg.z2],
    ],
  };
}

/* ── A single extruded wall: translucent paper face + ink/sienna edges ──── */
function WallMass({
  wall,
  progressRef,
  accent,
}: {
  wall: WallBox;
  progressRef: React.RefObject<number>;
  accent: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // One shared box geometry per wall; anchored so its base sits on y = 0 by
  // offsetting the mesh up by half-height and scaling the group's Y.
  const geometry = useMemo(
    () => new THREE.BoxGeometry(wall.length, WALL_HEIGHT, WALL_THICKNESS),
    [wall.length],
  );

  // Dispose the geometry when this wall unmounts.
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Mutating the object3d transform inside the render loop is the core
  // react-three-fiber pattern (imperative, outside React's render model).
  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // Scale from a sliver (~0) to full height, anchored at the base.
    const p = progressRef.current ?? 0;
    g.scale.y = Math.max(0.001, p);
  });

  return (
    // Position the group at the wall's footprint center & orient along segment.
    <group position={[wall.cx, 0, wall.cz]} rotation={[0, -wall.angle, 0]}>
      {/* scale.y is animated on this inner group, anchored at the base */}
      <group ref={groupRef} scale={[1, 0.001, 1]}>
        <mesh geometry={geometry} position={[0, WALL_HEIGHT / 2, 0]}>
          {/* Near-invisible paper-tinted face: reads like translucent calque */}
          <meshStandardMaterial
            color={COLOR.paper}
            transparent
            opacity={0.05}
            roughness={1}
            metalness={0}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
          {/* Crisp wireframe edges — the technical "ink" of the massing */}
          <Edges
            threshold={1}
            color={accent ? COLOR.sienna : COLOR.ink}
            lineWidth={accent ? 1.1 : 0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Flat plan: hairlines at y = 0, papier-calque tones ─────────────────── */
function FlatPlan({ walls }: { walls: WallBox[] }) {
  return (
    <group>
      {walls.map((wall, i) => (
        <Line
          key={`flat-${i}`}
          points={wall.points}
          // Alternate sienna / ink for a hand-traced, two-pencil feel.
          color={i % 5 === 0 ? COLOR.sienna : COLOR.graphite}
          lineWidth={i % 5 === 0 ? 1.4 : 1}
          transparent
          opacity={0.72}
          dashed={false}
        />
      ))}
    </group>
  );
}

/* ── Animation + camera orbit driver ────────────────────────────────────── */
function SceneRig({
  walls,
  reducedMotion,
}: {
  walls: WallBox[];
  reducedMotion: boolean;
}) {
  const progressRef = useRef<number>(reducedMotion ? 0.6 : 0.001);
  const elapsedRef = useRef<number>(0);
  const { camera } = useThree();

  // Camera target: roughly the plan center, slightly raised.
  const target = useMemo(() => new THREE.Vector3(0, 0.9, 0), []);
  const radius = 15;
  const camHeight = 9.5;

  // Static framing for reduced-motion: a fixed 3/4 axonometric viewpoint.
  useEffect(() => {
    if (reducedMotion) {
      const a = Math.PI * 0.22;
      camera.position.set(
        Math.sin(a) * radius,
        camHeight,
        Math.cos(a) * radius,
      );
      camera.lookAt(target);
      progressRef.current = 0.6;
    }
  }, [reducedMotion, camera, target]);

  // The orbit + extrusion driver imperatively mutates the camera and the
  // shared progress ref every frame — standard r3f, outside React's render
  // model. The compiler immutability rule is opted out for this loop.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    if (reducedMotion) return; // frozen frame; render loop is also halted upstream

    // Clamp delta so a backgrounded tab doesn't jump the animation.
    const dt = Math.min(delta, 0.05);
    elapsedRef.current += dt;
    const t = elapsedRef.current;

    // ── Extrusion: ease up to full, then a gentle breathing hold. ─────────
    // Ramp 0→1 across the first ~3.5s, then oscillate subtly in [0.82, 1].
    const RAMP = 3.5;
    let targetP: number;
    if (t < RAMP) {
      const k = t / RAMP;
      targetP = k * k * (3 - 2 * k); // smoothstep
    } else {
      const breathe = 0.91 + 0.09 * Math.sin((t - RAMP) * 0.7);
      targetP = breathe;
    }
    progressRef.current = THREE.MathUtils.damp(
      progressRef.current ?? 0,
      targetP,
      4,
      dt,
    );

    // ── Slow camera orbit (no user controls). ─────────────────────────────
    const azimuth = Math.PI * 0.22 + t * 0.06; // ~slow technical sweep
    const desiredX = Math.sin(azimuth) * radius;
    const desiredZ = Math.cos(azimuth) * radius;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 3, dt);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      camHeight,
      3,
      dt,
    );
    camera.lookAt(target);
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <FlatPlan walls={walls} />
      {walls.map((wall, i) => (
        <WallMass
          key={`mass-${i}`}
          wall={wall}
          progressRef={progressRef}
          accent={i % 5 === 0}
        />
      ))}
    </>
  );
}

/* ── Canvas wrapper with offscreen pause + reduced-motion handling ──────── */
export default function LivingBlueprintScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Precompute wall geometry once.
  const walls = useMemo(() => PLAN_WALLS.map(buildWall), []);

  // prefers-reduced-motion (also re-evaluated if the user toggles it).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pause the render loop when the canvas scrolls offscreen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // frameloop: "never" freezes rendering entirely. For reduced motion we still
  // need exactly one frame to paint the static state, so we use "demand" there
  // and invalidate once via the key remount below.
  const frameloop: "always" | "demand" | "never" = reducedMotion
    ? "demand"
    : inView
      ? "always"
      : "never";

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        // alpha:true → page background shows through (transparent canvas)
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        frameloop={frameloop}
        camera={{ position: [6, 9.5, 12], fov: 32, near: 0.1, far: 100 }}
        // Remount when reduced-motion flips so the static frame paints once.
        key={reducedMotion ? "static" : "live"}
        onCreated={({ gl, invalidate }) => {
          gl.setClearAlpha(0);
          // Ensure one paint for the demand/static path.
          invalidate();
        }}
      >
        {/* Matte lighting — technical axonometric, never glossy. */}
        <ambientLight intensity={0.85} color={COLOR.paper} />
        <directionalLight
          position={[5, 12, 8]}
          intensity={0.55}
          color={COLOR.paper}
        />

        {/* Drafting grid floor — subtle ink/line, transparent background. */}
        <Grid
          position={[0, 0, 0]}
          args={[PLAN_HALF_X * 4, PLAN_HALF_Z * 4]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={COLOR.line}
          sectionSize={2}
          sectionThickness={0.8}
          sectionColor={COLOR.mute}
          fadeDistance={34}
          fadeStrength={1.4}
          infiniteGrid={false}
          followCamera={false}
          side={THREE.DoubleSide}
        />

        <SceneRig walls={walls} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
