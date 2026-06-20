"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero3DScene — the product made desirable: a small emerald BUILDING MASSING
 * (a plan become a 3D volume) on its base plate, turning slowly and following
 * the pointer. Uses the proven robust setup (on-axis camera, emerald physical
 * materials that read on the light paper, no EffectComposer / no environment /
 * no poster overlay — the causes of earlier blanks).
 */

function Building() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.25;
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      -0.22 + state.pointer.y * 0.1,
      0.05,
    );
  });

  return (
    <group ref={group} rotation={[-0.22, 0.5, 0]}>
      {/* Plan base plate (the 2D plan) */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[3.6, 0.14, 2.7]} />
        <meshStandardMaterial
          color="#0c5b53"
          roughness={0.5}
          metalness={0.2}
          emissive="#082f2b"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Ground floor */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[2.4, 1, 1.8]} />
        <meshStandardMaterial
          color="#0f766e"
          roughness={0.32}
          metalness={0.25}
          emissive="#0a4f49"
          emissiveIntensity={0.14}
        />
      </mesh>

      {/* Upper floor, offset (massing) */}
      <mesh position={[0.42, 0.58, -0.2]}>
        <boxGeometry args={[1.6, 0.95, 1.3]} />
        <meshStandardMaterial
          color="#10897b"
          roughness={0.28}
          metalness={0.25}
          emissive="#0c6b5f"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Bright emerald roof edge — the signature accent */}
      <mesh position={[0.42, 1.08, -0.2]}>
        <boxGeometry args={[1.72, 0.07, 1.42]} />
        <meshStandardMaterial
          color="#2f9e92"
          roughness={0.25}
          metalness={0.45}
          emissive="#0f766e"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={2.4} />
      <pointLight position={[2, 3, 5]} color="#ffffff" intensity={1.6} decay={0} />
      <pointLight position={[-5, 2, 4]} color="#0f766e" intensity={1.8} decay={0} />
      <Building />
    </Canvas>
  );
}
