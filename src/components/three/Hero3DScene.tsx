"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Hero3DScene — a real WebGL scene: an emerald gem with floating drafting forms
 * (rule, compass arc, set-square shard) that drift, rotate and follow the
 * pointer. Deliberately ROBUST: physical materials lit by colored lights, no
 * EffectComposer, no environment HDR, no poster overlay (that overlay hiding
 * the canvas was the cause of the earlier blank render). Transparent canvas so
 * the emerald glow + paper show through.
 */

function Tools() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.22;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.18, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.12, 0.05);
  });

  return (
    <group ref={group}>
      {/* The emerald gem */}
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh>
          <icosahedronGeometry args={[1.35, 0]} />
          <meshPhysicalMaterial
            color="#0f766e"
            roughness={0.12}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.12}
            emissive="#0a4f49"
            emissiveIntensity={0.3}
            reflectivity={0.7}
          />
        </mesh>
      </Float>

      {/* Rule */}
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.3}>
        <mesh position={[2.3, 0.9, -1]} rotation={[0.5, 0.3, 0.7]}>
          <boxGeometry args={[2.4, 0.2, 0.07]} />
          <meshStandardMaterial
            color="#0e7490"
            roughness={0.3}
            metalness={0.6}
            emissive="#0a3a45"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Compass arc */}
      <Float speed={1.9} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[-2.4, -1, -0.4]} rotation={[0.3, -0.4, -0.3]}>
          <torusGeometry args={[0.75, 0.07, 20, 64, Math.PI * 1.35]} />
          <meshStandardMaterial color="#6f8f86" roughness={0.35} metalness={0.4} />
        </mesh>
      </Float>

      {/* Set-square shard */}
      <Float speed={1.7} floatIntensity={1}>
        <mesh position={[1.6, -1.4, 0.6]} rotation={[0.2, 0.5, 0.9]}>
          <tetrahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color="#10b981"
            roughness={0.15}
            metalness={0.2}
            clearcoat={1}
            emissive="#0a5c44"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={2} />
      <pointLight position={[-5, 2, 4]} color="#10b981" intensity={2.4} decay={0} />
      <pointLight position={[4, -3, 3]} color="#0e7490" intensity={2} decay={0} />
      <Tools />
    </Canvas>
  );
}
