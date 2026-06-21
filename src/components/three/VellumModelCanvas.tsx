"use client";

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Edges,
  Environment,
  Html,
  Line,
  OrbitControls,
  PerspectiveCamera,
  Text,
  useTexture,
} from '@react-three/drei'
import { EffectComposer, N8AO, SMAA } from '@react-three/postprocessing'
import { a, useSpring } from '@react-spring/three'
import type { Group } from 'three'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import {
  furniture3d,
  heroFloors,
  type DetailLayer,
  type FloorKey,
  type FloorSpec,
  type Furniture3D,
  type Wall3D,
  walls3d,
} from '@/lib/vellumHeroData'

type VellumModelCanvasProps = {
  selectedFloor: FloorKey
  layers: Record<DetailLayer, boolean>
  showCornerLabel?: boolean
  embedMode?: boolean
}

type TexSet = { map: THREE.Texture; nor: THREE.Texture }
type TexturePack = Record<'paper' | 'plaster' | 'concrete' | 'roof' | 'wood' | 'vellum', TexSet>

type MaterialPack = {
  glass: THREE.MeshPhysicalMaterial
  teal: THREE.MeshStandardMaterial
  ink: THREE.MeshStandardMaterial
  shadowLine: THREE.MeshStandardMaterial
  brass: THREE.MeshStandardMaterial
  olive: THREE.MeshStandardMaterial
  trunk: THREE.MeshStandardMaterial
}

export function VellumModelCanvas({
  selectedFloor,
  layers,
  showCornerLabel = true,
  embedMode = false,
}: VellumModelCanvasProps) {
  const reduce = useReducedMotion() ?? false
  return (
    <div className={embedMode ? 'vellum-model-canvas is-embed' : 'vellum-model-canvas'} data-testid="vellum-hero-3d">
      <Canvas shadows dpr={[1, 1.85]} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
        <Suspense fallback={null}>
          <SceneCamera embedMode={embedMode} />
          <Environment preset="apartment" />
          <ambientLight intensity={0.42} />
          <hemisphereLight args={['#fff8ea', '#9fb0a8', 0.5]} />
          <directionalLight
            position={[4.2, 8.4, 4.8]}
            intensity={1.9}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-5.6}
            shadow-camera-right={5.6}
            shadow-camera-top={5.6}
            shadow-camera-bottom={-5.6}
          />
          <spotLight
            position={[-3.2, 5.2, 4.4]}
            intensity={0.82}
            angle={0.42}
            penumbra={0.72}
            color="#fff2dc"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* teal rim/back light — detaches the maquette from the dark hero */}
          <directionalLight position={[-3.6, 4.7, -6]} intensity={1.1} color="#bfe6df" />
          <ModelScene selectedFloor={selectedFloor} layers={layers} embedMode={embedMode} reduce={reduce} />
          <ContactShadows position={[0, -0.24, 0]} opacity={0.52} scale={9} blur={2.9} far={4.6} color="#08201d" />
          <EffectComposer multisampling={0}>
            <N8AO aoRadius={2.0} intensity={0.78} color="#0b2a26" />
            <SMAA />
          </EffectComposer>
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={4.25}
            maxDistance={10.8}
            minPolarAngle={0.55}
            maxPolarAngle={1.32}
            autoRotate={!reduce}
            autoRotateSpeed={embedMode ? 0.34 : 0.2}
            target={[0, 1.12, 0]}
          />
        </Suspense>
      </Canvas>
      {showCornerLabel ? (
        <div className="model-corner-label">
          <span>DWG + MAQUETTE</span>
          <strong>{heroFloors.find((floor) => floor.id === selectedFloor)?.label}</strong>
        </div>
      ) : null}
    </div>
  )
}

function SceneCamera({ embedMode }: { embedMode: boolean }) {
  const { size } = useThree()
  const mobile = size.width < 620
  const tablet = size.width >= 620 && size.width < 980
  const position: [number, number, number] = mobile
    ? [10.7, 6.25, 11.1]
    : tablet
      ? [7.9, 5.2, 8.4]
      : embedMode
        ? [8.3, 5.4, 8.7]
        : [7.05, 4.9, 7.6]

  return <PerspectiveCamera makeDefault position={position} fov={mobile ? 50 : tablet ? 39 : embedMode ? 33 : 35} />
}

type ModelSceneProps = {
  selectedFloor: FloorKey
  layers: Record<DetailLayer, boolean>
  embedMode: boolean
  reduce: boolean
}

function ModelScene({ selectedFloor, layers, embedMode, reduce }: ModelSceneProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  // Real CC0 PBR maps (Poly Haven) — diffuse + normal, replace the procedural look.
  const raw = useTexture({
    plasterMap: '/textures/plaster_diff.jpg',
    plasterNor: '/textures/plaster_nor.jpg',
    concreteMap: '/textures/concrete_diff.jpg',
    concreteNor: '/textures/concrete_nor.jpg',
    woodMap: '/textures/wood_diff.jpg',
    woodNor: '/textures/wood_nor.jpg',
  })
  const textures = useMemo<TexturePack>(() => {
    const cfg = (t: THREE.Texture, repeat: [number, number], srgb: boolean) => {
      t.wrapS = THREE.RepeatWrapping
      t.wrapT = THREE.RepeatWrapping
      t.repeat.set(repeat[0], repeat[1])
      t.anisotropy = 8
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
      t.needsUpdate = true
      return t
    }
    const plaster: TexSet = {
      map: cfg(raw.plasterMap, [2.6, 2.6], true),
      nor: cfg(raw.plasterNor, [2.6, 2.6], false),
    }
    const concrete: TexSet = {
      map: cfg(raw.concreteMap, [2.2, 2.2], true),
      nor: cfg(raw.concreteNor, [2.2, 2.2], false),
    }
    const wood: TexSet = {
      map: cfg(raw.woodMap, [1.4, 2.4], true),
      nor: cfg(raw.woodNor, [1.4, 2.4], false),
    }
    return { paper: plaster, plaster, concrete, roof: plaster, wood, vellum: plaster }
  }, [raw])

  const materials = useMemo<MaterialPack>(
    () => ({
      glass: new THREE.MeshPhysicalMaterial({
        color: '#d7eee8',
        transparent: true,
        opacity: 0.52,
        roughness: 0.06,
        metalness: 0.02,
        transmission: 0.28,
        thickness: 0.22,
        ior: 1.42,
        envMapIntensity: 0.9,
      }),
      teal: new THREE.MeshStandardMaterial({ color: '#0a4a44', roughness: 0.38, metalness: 0.08, envMapIntensity: 0.72 }),
      ink: new THREE.MeshStandardMaterial({ color: '#27231c', roughness: 0.62 }),
      shadowLine: new THREE.MeshStandardMaterial({
        color: '#2c261d',
        transparent: true,
        opacity: 0.34,
        roughness: 0.72,
      }),
      brass: new THREE.MeshStandardMaterial({ color: '#b89a63', roughness: 0.36, metalness: 0.26, envMapIntensity: 0.52 }),
      olive: new THREE.MeshStandardMaterial({ color: '#647052', roughness: 0.9 }),
      trunk: new THREE.MeshStandardMaterial({ color: '#7d6242', roughness: 0.82 }),
    }),
    [],
  )

  useFrame(({ clock }, delta) => {
    if (reduce || !groupRef.current) return
    groupRef.current.rotation.y += delta * (embedMode ? 0.022 : 0.014)
    groupRef.current.position.y = -0.12 + Math.sin(clock.elapsedTime * 0.8) * (embedMode ? 0.025 : 0.012)
  })

  return (
    <group ref={groupRef} rotation={[0, -0.42, 0]} position={[0, -0.12, 0]}>
      <PremiumSiteBase textures={textures} materials={materials} />
      {embedMode ? <KineticDraftingOverlays selectedFloor={selectedFloor} reduce={reduce} /> : null}
      <ExplodedGuides selectedFloor={selectedFloor} />
      {layers.dimensions ? <DimensionSystem /> : null}
      {heroFloors.map((floor) => (
          <FloorAssembly
            key={floor.id}
            floor={floor}
            selected={selectedFloor === floor.id}
            textures={textures}
            embedMode={embedMode}
            reduce={reduce}
          />
      ))}
      {layers.structure
        ? walls3d.map((wall) => (
            <WallMesh
              key={wall.id}
              wall={wall}
              active={selectedFloor === wall.floor}
              hovered={hovered === wall.id}
              textures={textures}
              onHover={setHovered}
            />
          ))
        : null}
      {layers.openings ? <OpeningsLayer selectedFloor={selectedFloor} materials={materials} /> : null}
      <ArchitecturalRefinements selectedFloor={selectedFloor} materials={materials} />
      {layers.furniture ? <FurnitureLayer selectedFloor={selectedFloor} textures={textures} /> : null}
      {layers.electrical ? <ElectricalLayer selectedFloor={selectedFloor} /> : null}
      {layers.plumbing ? <PlumbingLayer selectedFloor={selectedFloor} /> : null}
      {layers.annotations ? <AnnotationLayer selectedFloor={selectedFloor} /> : null}
    </group>
  )
}

function KineticDraftingOverlays({ selectedFloor, reduce }: { selectedFloor: FloorKey; reduce: boolean }) {
  const scanRef = useRef<THREE.Mesh>(null)
  const cursorRef = useRef<THREE.Mesh>(null)
  const activeY = selectedFloor === 'rdc' ? 0.14 : selectedFloor === 'etage' ? 1.32 : 2.76

  useFrame(({ clock }) => {
    if (reduce) return
    const time = clock.elapsedTime
    if (scanRef.current) {
      scanRef.current.position.x = -3.45 + ((time * 0.55) % 1) * 6.9
      scanRef.current.position.y = activeY
    }
    if (cursorRef.current) {
      const orbit = time * 0.82
      cursorRef.current.position.set(Math.sin(orbit) * 2.95, activeY + 0.09, Math.cos(orbit * 0.86) * 2.05)
    }
  })

  return (
    <group>
      <mesh ref={scanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, activeY, 0]}>
        <planeGeometry args={[0.065, 5.25]} />
        <meshBasicMaterial color="#0d4d47" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={cursorRef} castShadow>
        <sphereGeometry args={[0.055, 18, 18]} />
        <meshStandardMaterial color="#a75c41" roughness={0.42} emissive="#3d1208" emissiveIntensity={0.12} />
      </mesh>
      <Line
        points={[
          [-3.15, activeY + 0.03, -2.18],
          [3.15, activeY + 0.03, -2.18],
          [3.15, activeY + 0.03, 2.18],
          [-3.15, activeY + 0.03, 2.18],
          [-3.15, activeY + 0.03, -2.18],
        ]}
        color="#0d4d47"
        lineWidth={1.1}
        dashed
        dashSize={0.12}
        gapSize={0.08}
        transparent
        opacity={0.52}
      />
    </group>
  )
}

function PremiumSiteBase({ textures, materials }: { textures: TexturePack; materials: MaterialPack }) {
  return (
    <group>
      <mesh receiveShadow castShadow position={[0, -0.11, 0]}>
        <boxGeometry args={[6.95, 0.16, 4.95]} />
        <meshStandardMaterial
          color="#e9e2d2"
          map={textures.concrete.map}
          normalMap={textures.concrete.nor}
          normalScale={[0.85, 0.85]}
          roughness={0.93}
        />
        <Edges color="#968a78" linewidth={0.7} />
      </mesh>
      <mesh receiveShadow position={[-0.22, -0.015, 2.55]}>
        <boxGeometry args={[5.7, 0.075, 0.42]} />
        <meshStandardMaterial color="#e4dccb" map={textures.concrete.map} normalMap={textures.concrete.nor} normalScale={[0.6, 0.6]} roughness={0.93} />
      </mesh>
      <mesh receiveShadow position={[2.9, 0.0, -0.25]}>
        <boxGeometry args={[0.42, 0.075, 3.55]} />
        <meshStandardMaterial color="#e4dccb" map={textures.concrete.map} normalMap={textures.concrete.nor} normalScale={[0.6, 0.6]} roughness={0.93} />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.55, 0.03, 2.04]}>
        <boxGeometry args={[1.55, 0.12, 0.5]} />
        <meshStandardMaterial color="#cdbf9f" map={textures.wood.map} normalMap={textures.wood.nor} normalScale={[0.7, 0.7]} roughness={0.76} />
        <Edges color="#74634c" linewidth={0.5} />
      </mesh>
      <StairRun start={[-2.38, -0.02, 2.42]} />
      <Planter position={[-2.95, 0.05, 1.95]} size={[0.5, 0.22, 1.05]} textures={textures} materials={materials} />
      <Planter position={[2.65, 0.05, 1.82]} size={[0.46, 0.22, 1]} textures={textures} materials={materials} />
      <Planter position={[2.95, 0.05, -1.72]} size={[0.42, 0.22, 0.82]} textures={textures} materials={materials} />
      <Tree position={[-3.05, 0.05, 1.22]} scale={0.9} materials={materials} />
      <Tree position={[3.25, 0.05, 1.12]} scale={0.82} materials={materials} />
      <Tree position={[3.08, 0.05, -1.82]} scale={0.68} materials={materials} />
    </group>
  )
}

function Planter({
  position,
  size,
  textures,
  materials,
}: {
  position: [number, number, number]
  size: [number, number, number]
  textures: TexturePack
  materials: MaterialPack
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#e6ddcb"
          map={textures.concrete.map}
          normalMap={textures.concrete.nor}
          normalScale={[0.55, 0.55]}
          roughness={0.92}
        />
        <Edges color="#847969" linewidth={0.55} />
      </mesh>
      {[-0.28, 0, 0.28].map((offset) => (
        <mesh key={offset} position={[offset, size[1] * 0.8, 0]} castShadow material={materials.olive}>
          <icosahedronGeometry args={[0.13, 1]} />
        </mesh>
      ))}
    </group>
  )
}

function Tree({ position, scale, materials }: { position: [number, number, number]; scale: number; materials: MaterialPack }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow material={materials.trunk}>
        <cylinderGeometry args={[0.035, 0.05, 0.42, 8]} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow material={materials.olive}>
        <icosahedronGeometry args={[0.24, 2]} />
      </mesh>
      <mesh position={[0.16, 0.43, -0.02]} castShadow material={materials.olive}>
        <icosahedronGeometry args={[0.17, 1]} />
      </mesh>
      <mesh position={[-0.13, 0.41, 0.04]} castShadow material={materials.olive}>
        <icosahedronGeometry args={[0.16, 1]} />
      </mesh>
    </group>
  )
}

function StairRun({ start }: { start: [number, number, number] }) {
  return (
    <group position={start}>
      {Array.from({ length: 4 }).map((_, index) => (
        <mesh key={index} position={[index * 0.17, index * 0.035, index * 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.05, 0.18]} />
          <meshStandardMaterial color="#d5cab7" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

type FloorAssemblyProps = {
  floor: FloorSpec
  selected: boolean
  textures: TexturePack
  embedMode: boolean
  reduce: boolean
}

function FloorAssembly({ floor, selected, textures, embedMode, reduce }: FloorAssemblyProps) {
  const roof = floor.id === 'toiture'
  const bobRef = useRef<Group>(null)
  const spring = useSpring({
    position: [0, floor.y + (selected ? (embedMode ? 0.2 : 0.14) : 0), 0],
    scale: selected ? [1.025, 1, 1.025] : [1, 1, 1],
    config: { tension: 132, friction: 24 },
  })

  const opacity = selected ? 0.96 : roof ? 0.46 : 0.76
  useFrame(({ clock }) => {
    if (reduce || !bobRef.current) return
    const floorPhase = floor.id === 'rdc' ? 0 : floor.id === 'etage' ? 1.7 : 3.1
    bobRef.current.position.y = Math.sin(clock.elapsedTime * 1.25 + floorPhase) * (embedMode ? 0.035 : 0.012)
  })

  return (
    <a.group
      position={spring.position as unknown as [number, number, number]}
      scale={spring.scale as unknown as [number, number, number]}
    >
      <group ref={bobRef}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={floor.size} />
          <meshStandardMaterial
            color={roof ? '#e3d8c4' : selected ? '#f0e2c8' : '#dbcfb9'}
            map={(roof ? textures.roof : selected ? textures.vellum : textures.concrete).map}
            normalMap={(roof ? textures.roof : textures.concrete).nor}
            normalScale={[0.6, 0.6]}
            transparent
            opacity={opacity}
            roughness={0.9}
            metalness={0.02}
          />
          <Edges color={selected ? '#0d4d47' : '#766d60'} linewidth={selected ? 1.8 : 0.85} />
        </mesh>
        <PerimeterRim size={floor.size} selected={selected} roof={roof} />
        {selected && embedMode ? <SelectionGlow size={floor.size} roof={roof} /> : null}
        {roof ? <RoofDetails selected={selected} textures={textures} /> : null}
        <FloorPlanInk floor={floor} selected={selected} />
      </group>
    </a.group>
  )
}

function SelectionGlow({ size, roof }: { size: [number, number, number]; roof: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    const pulse = 0.96 + Math.sin(clock.elapsedTime * 2.2) * 0.035
    glowRef.current.scale.set(pulse, 1, pulse)
  })

  return (
    <mesh ref={glowRef} position={[0, size[1] / 2 + (roof ? 0.26 : 0.12), 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[Math.max(size[0], size[2]) * 0.46, Math.max(size[0], size[2]) * 0.54, 4]} />
      <meshBasicMaterial color="#0d4d47" transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  )
}

function PerimeterRim({ size, selected, roof }: { size: [number, number, number]; selected: boolean; roof: boolean }) {
  const [width, , depth] = size
  const color = selected ? '#0d4d47' : roof ? '#b9ae99' : '#c7b99f'
  const height = selected ? 0.085 : 0.055
  const thickness = selected ? 0.095 : 0.062

  return (
    <group position={[0, size[1] / 2 + height / 2, 0]}>
      <mesh castShadow position={[0, 0, depth / 2]}>
        <boxGeometry args={[width + thickness, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.58} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[0, 0, -depth / 2]}>
        <boxGeometry args={[width + thickness, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.58} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[width / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.58} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[-width / 2, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.58} metalness={0.03} />
      </mesh>
    </group>
  )
}

function RoofDetails({ selected, textures }: { selected: boolean; textures: TexturePack }) {
  return (
    <group position={[0, 0.13, 0]}>
      <mesh receiveShadow castShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[5.95, 0.08, 4.42]} />
        <meshStandardMaterial
          color={selected ? '#eee5d2' : '#ded4c1'}
          map={textures.roof.map}
          normalMap={textures.roof.nor}
          normalScale={[0.7, 0.7]}
          transparent
          opacity={0.86}
          roughness={0.88}
        />
        <Edges color="#7b7161" linewidth={0.6} />
      </mesh>
      {Array.from({ length: 18 }).map((_, index) => {
        const x = -2.65 + index * 0.31
        return (
          <mesh key={index} castShadow position={[x, 0.09, 0]}>
            <boxGeometry args={[0.026, 0.045, 4.2]} />
            <meshStandardMaterial color={selected ? '#cfc3aa' : '#bfb39d'} roughness={0.78} />
          </mesh>
        )
      })}
      <mesh castShadow position={[0.78, 0.18, -0.68]}>
        <boxGeometry args={[0.76, 0.06, 0.46]} />
        <meshStandardMaterial color="#0d4d47" roughness={0.42} />
      </mesh>
      <mesh castShadow position={[-1.18, 0.18, 0.76]}>
        <boxGeometry args={[0.58, 0.06, 0.38]} />
        <meshStandardMaterial color="#0d4d47" roughness={0.42} />
      </mesh>
    </group>
  )
}

function FloorPlanInk({ floor, selected }: { floor: FloorSpec; selected: boolean }) {
  const y = floor.id === 'toiture' ? 0.23 : 0.075
  const color = selected ? '#123f3b' : '#5d564d'
  const roomColor = selected ? '#8f563f' : '#827768'
  const halfX = floor.size[0] / 2 - 0.42
  const halfZ = floor.size[2] / 2 - 0.36

  return (
    <group position={[0, y, 0]}>
      <Line points={[[-halfX, 0, -halfZ], [halfX, 0, -halfZ], [halfX, 0, halfZ], [-halfX, 0, halfZ], [-halfX, 0, -halfZ]]} color={color} lineWidth={1.25} />
      <Line points={[[-halfX * 0.35, 0, -halfZ], [-halfX * 0.35, 0, halfZ]]} color={color} lineWidth={0.85} />
      <Line points={[[halfX * 0.42, 0, -halfZ], [halfX * 0.42, 0, halfZ * 0.2]]} color={color} lineWidth={0.85} />
      <Line points={[[-halfX, 0, 0], [halfX, 0, 0]]} color={color} lineWidth={0.85} />
      <Text position={[-halfX + 0.2, 0.022, -halfZ + 0.24]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.09} color={roomColor}>
        {floor.planNo}
      </Text>
    </group>
  )
}

type WallMeshProps = {
  wall: Wall3D
  active: boolean
  hovered: boolean
  textures: TexturePack
  onHover: (id: string | null) => void
}

function WallMesh({ wall, active, hovered, textures, onHover }: WallMeshProps) {
  const spring = useSpring({
    scale: active ? [1, 1, 1] : [1, 0.92, 1],
    config: { tension: 150, friction: 20 },
  })
  const opacity = active ? (wall.kind === 'low' ? 0.72 : 0.98) : wall.kind === 'outer' ? 0.6 : 0.42
  const color = hovered ? '#f2dfbd' : wall.kind === 'outer' ? '#e8ddc9' : '#ddd0b9'

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onHover(wall.id)
  }

  return (
    <a.mesh
      castShadow
      receiveShadow
      position={wall.position}
      scale={spring.scale as unknown as [number, number, number]}
      onPointerOver={handleOver}
      onPointerOut={() => onHover(null)}
    >
      <boxGeometry args={wall.size} />
      <meshStandardMaterial
        color={color}
        map={textures.plaster.map}
        normalMap={textures.plaster.nor}
        normalScale={wall.kind === 'outer' ? [1, 1] : [0.7, 0.7]}
        transparent
        opacity={opacity}
        roughness={0.86}
        metalness={0.025}
      />
      <Edges color={hovered ? '#a85d42' : active ? '#403a31' : '#837969'} linewidth={hovered ? 1.8 : 0.75} />
    </a.mesh>
  )
}

function OpeningsLayer({ selectedFloor, materials }: { selectedFloor: FloorKey; materials: MaterialPack }) {
  return (
    <group>
      {selectedFloor !== 'toiture' ? (
        <>
          <WindowPanel position={[-1.78, 0.48, 1.965]} size={[0.72, 0.42]} axis="x" materials={materials} />
          <WindowPanel position={[0.18, 0.48, 1.965]} size={[0.86, 0.42]} axis="x" materials={materials} />
          <WindowPanel position={[1.62, 0.48, 1.965]} size={[0.72, 0.42]} axis="x" materials={materials} />
          <WindowPanel position={[2.91, 0.48, -0.54]} size={[0.76, 0.42]} axis="z" materials={materials} />
          <WindowPanel position={[-1.42, 0.48, -1.965]} size={[0.76, 0.38]} axis="x" materials={materials} />
          <DoorPanel position={[-0.72, 0.45, 1.985]} materials={materials} />
          <WindowPanel position={[-1.45, 1.44, 1.735]} size={[0.68, 0.36]} axis="x" materials={materials} />
          <WindowPanel position={[0.75, 1.44, 1.735]} size={[0.72, 0.36]} axis="x" materials={materials} />
          <WindowPanel position={[2.59, 1.44, -0.4]} size={[0.72, 0.36]} axis="z" materials={materials} />
        </>
      ) : null}
      <WindowPanel position={[0.78, 2.23, -0.68]} size={[0.64, 0.18]} axis="x" materials={materials} compact />
      <WindowPanel position={[-1.18, 2.23, 0.76]} size={[0.5, 0.18]} axis="x" materials={materials} compact />
    </group>
  )
}

function WindowPanel({
  position,
  size,
  axis,
  materials,
  compact = false,
}: {
  position: [number, number, number]
  size: [number, number]
  axis: 'x' | 'z'
  materials: MaterialPack
  compact?: boolean
}) {
  const [width, height] = size
  const frame = compact ? 0.025 : 0.035
  const depth = compact ? 0.028 : 0.045
  const glassArgs: [number, number, number] = axis === 'x' ? [width, height, depth] : [depth, height, width]
  const horizontalArgs: [number, number, number] = axis === 'x' ? [width + frame, frame, depth * 1.3] : [depth * 1.3, frame, width + frame]
  const verticalArgs: [number, number, number] = axis === 'x' ? [frame, height + frame, depth * 1.3] : [depth * 1.3, height + frame, frame]

  return (
    <group position={position}>
      <mesh castShadow material={materials.glass}>
        <boxGeometry args={glassArgs} />
      </mesh>
      <mesh castShadow material={materials.teal} position={[0, height / 2, 0]}>
        <boxGeometry args={horizontalArgs} />
      </mesh>
      <mesh castShadow material={materials.teal} position={[0, -height / 2, 0]}>
        <boxGeometry args={horizontalArgs} />
      </mesh>
      <mesh castShadow material={materials.teal} position={axis === 'x' ? [-width / 2, 0, 0] : [0, 0, -width / 2]}>
        <boxGeometry args={verticalArgs} />
      </mesh>
      <mesh castShadow material={materials.teal} position={axis === 'x' ? [width / 2, 0, 0] : [0, 0, width / 2]}>
        <boxGeometry args={verticalArgs} />
      </mesh>
      <mesh castShadow material={materials.teal}>
        <boxGeometry args={axis === 'x' ? [frame, height, depth * 1.4] : [depth * 1.4, height, frame]} />
      </mesh>
    </group>
  )
}

function DoorPanel({ position, materials }: { position: [number, number, number]; materials: MaterialPack }) {
  return (
    <group position={position}>
      <mesh castShadow material={materials.glass}>
        <boxGeometry args={[0.46, 0.62, 0.05]} />
      </mesh>
      <mesh castShadow material={materials.teal} position={[0, 0.34, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.07]} />
      </mesh>
      <mesh castShadow material={materials.teal} position={[-0.26, 0, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.07]} />
      </mesh>
      <mesh castShadow material={materials.teal} position={[0.26, 0, 0]}>
        <boxGeometry args={[0.04, 0.7, 0.07]} />
      </mesh>
      <mesh castShadow material={materials.brass} position={[0.16, -0.05, 0.04]}>
        <sphereGeometry args={[0.028, 16, 16]} />
      </mesh>
    </group>
  )
}

function ArchitecturalRefinements({
  selectedFloor,
  materials,
}: {
  selectedFloor: FloorKey
  materials: MaterialPack
}) {
  const postOpacity = selectedFloor === 'toiture' ? 0.35 : 0.68

  return (
    <group>
      <ShadowRevealBand position={[0, 0.92, 1.98]} size={[5.95, 0.045, 0.055]} material={materials.shadowLine} />
      <ShadowRevealBand position={[0, 1.08, -1.98]} size={[5.95, 0.035, 0.05]} material={materials.shadowLine} />
      <ShadowRevealBand position={[0, 1.78, 1.72]} size={[5.35, 0.042, 0.052]} material={materials.shadowLine} />

      {[-2.55, -1.7, -0.85, 0, 0.85, 1.7, 2.55].map((x) => (
        <FacadeJoint key={`front-${x}`} position={[x, 0.48, 2.016]} height={0.72} material={materials.shadowLine} />
      ))}
      {[-2.15, -1.35, -0.55, 0.25, 1.05, 1.85, 2.35].map((x) => (
        <FacadeJoint key={`upper-${x}`} position={[x, 1.42, 1.748]} height={0.55} material={materials.shadowLine} />
      ))}

      <TerraceRailing y={1.06} z={1.95} width={5.55} opacity={postOpacity} />
      <TerraceRailing y={1.78} z={1.73} width={4.95} opacity={postOpacity} />
      <SideRailing x={-2.84} y={1.05} depth={3.45} opacity={postOpacity} />

      {[
        [-2.45, 0.48, -1.72],
        [2.45, 0.48, -1.72],
        [-2.25, 1.42, -1.48],
        [2.25, 1.42, -1.48],
      ].map((position) => (
        <SlimColumn key={position.join('-')} position={position as [number, number, number]} materials={materials} />
      ))}
    </group>
  )
}

function ShadowRevealBand({
  position,
  size,
  material,
}: {
  position: [number, number, number]
  size: [number, number, number]
  material: THREE.Material
}) {
  return (
    <mesh position={position} material={material} castShadow>
      <boxGeometry args={size} />
    </mesh>
  )
}

function FacadeJoint({
  position,
  height,
  material,
}: {
  position: [number, number, number]
  height: number
  material: THREE.Material
}) {
  return (
    <mesh position={position} material={material} castShadow>
      <boxGeometry args={[0.018, height, 0.018]} />
    </mesh>
  )
}

function TerraceRailing({
  y,
  z,
  width,
  opacity,
}: {
  y: number
  z: number
  width: number
  opacity: number
}) {
  const railMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a4a44',
        transparent: true,
        opacity,
        roughness: 0.42,
        metalness: 0.08,
      }),
    [opacity],
  )
  const railGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#d6e6df',
        transparent: true,
        opacity: 0.26,
        roughness: 0.09,
        transmission: 0.18,
        thickness: 0.12,
      }),
    [],
  )

  return (
    <group>
      <mesh position={[0, y + 0.38, z]} material={railMaterial} castShadow>
        <boxGeometry args={[width, 0.035, 0.035]} />
      </mesh>
      {Array.from({ length: 9 }).map((_, index) => {
        const x = -width / 2 + index * (width / 8)
        return (
          <mesh key={x} position={[x, y + 0.18, z]} material={railGlass} castShadow>
            <boxGeometry args={[0.035, 0.34, 0.02]} />
          </mesh>
        )
      })}
    </group>
  )
}

function SideRailing({
  x,
  y,
  depth,
  opacity,
}: {
  x: number
  y: number
  depth: number
  opacity: number
}) {
  const railMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a4a44',
        transparent: true,
        opacity,
        roughness: 0.42,
        metalness: 0.08,
      }),
    [opacity],
  )
  const railGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#d6e6df',
        transparent: true,
        opacity: 0.24,
        roughness: 0.09,
        transmission: 0.16,
        thickness: 0.1,
      }),
    [],
  )

  return (
    <group>
      <mesh position={[x, y + 0.38, 0]} material={railMaterial} castShadow>
        <boxGeometry args={[0.035, 0.035, depth]} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => {
        const z = -depth / 2 + index * (depth / 6)
        return (
          <mesh key={z} position={[x, y + 0.18, z]} material={railGlass} castShadow>
            <boxGeometry args={[0.02, 0.34, 0.035]} />
          </mesh>
        )
      })}
    </group>
  )
}

function SlimColumn({
  position,
  materials,
}: {
  position: [number, number, number]
  materials: MaterialPack
}) {
  return (
    <mesh position={position} material={materials.teal} castShadow receiveShadow>
      <cylinderGeometry args={[0.035, 0.04, 0.86, 14]} />
    </mesh>
  )
}

function FurnitureLayer({ selectedFloor, textures }: { selectedFloor: FloorKey; textures: TexturePack }) {
  const materials = useMemo(
    () => ({
      wood: new THREE.MeshStandardMaterial({
        color: '#9b7a52',
        map: textures.wood.map,
        normalMap: textures.wood.nor,
        normalScale: new THREE.Vector2(0.6, 0.6),
        roughness: 0.74,
      }),
      stone: new THREE.MeshStandardMaterial({
        color: '#d8ccb7',
        map: textures.concrete.map,
        normalMap: textures.concrete.nor,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughness: 0.92,
      }),
      fabric: new THREE.MeshStandardMaterial({ color: '#b9aa94', roughness: 0.88 }),
      brass: new THREE.MeshStandardMaterial({ color: '#b19a68', roughness: 0.45, metalness: 0.22 }),
    }),
    [textures],
  )

  return (
    <group>
      {furniture3d
        .filter((item) => selectedFloor === item.floor || selectedFloor === 'toiture')
        .map((item) => (
          <FurniturePiece item={item} material={materials[item.material]} key={item.id} />
        ))}
      {selectedFloor !== 'toiture' ? <StairCore /> : null}
    </group>
  )
}

function FurniturePiece({ item, material }: { item: Furniture3D; material: THREE.Material }) {
  return (
    <group position={item.position}>
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={item.size} />
        <Edges color="#5b5144" linewidth={0.45} />
      </mesh>
      {item.id.startsWith('bed') ? (
        <mesh position={[0.2, item.size[1] / 2 + 0.045, -0.18]} castShadow>
          <boxGeometry args={[0.38, 0.08, 0.24]} />
          <meshStandardMaterial color="#eee2cf" roughness={0.82} />
        </mesh>
      ) : null}
    </group>
  )
}

function StairCore() {
  return (
    <group position={[-0.48, 0.1, -1.22]}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={index} position={[index * 0.09, index * 0.048, index * 0.03]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.035, 0.2]} />
          <meshStandardMaterial color="#b79c72" roughness={0.78} />
        </mesh>
      ))}
      <Line points={[[-0.06, 0.1, -0.16], [0.75, 0.48, 0.1]]} color="#0d4d47" lineWidth={1.2} />
    </group>
  )
}

function ElectricalLayer({ selectedFloor }: { selectedFloor: FloorKey }) {
  const y = selectedFloor === 'etage' ? 1.88 : selectedFloor === 'toiture' ? 2.33 : 0.86
  return (
    <group>
      <Line points={[[-2.2, y, 1.45], [-0.65, y, 0.8], [0.2, y, -0.25], [1.9, y, -1.22]]} color="#a85d42" lineWidth={1.2} dashed dashSize={0.08} gapSize={0.05} />
      <Line points={[[-1.8, y, -1.28], [-0.2, y, -0.82], [1.52, y, 0.64]]} color="#a85d42" lineWidth={1.2} dashed dashSize={0.08} gapSize={0.05} />
      <SmallNode position={[-2.2, y, 1.45]} color="#a85d42" />
      <SmallNode position={[1.9, y, -1.22]} color="#a85d42" />
      <SmallNode position={[1.52, y, 0.64]} color="#a85d42" />
    </group>
  )
}

function PlumbingLayer({ selectedFloor }: { selectedFloor: FloorKey }) {
  const y = selectedFloor === 'etage' ? 1.82 : selectedFloor === 'toiture' ? 2.27 : 0.8
  return (
    <group>
      <Line points={[[1.86, y, -1.48], [1.86, y, -0.42], [2.72, y, -0.42]]} color="#134e4a" lineWidth={1.35} />
      <Line points={[[1.18, y, -1.36], [1.18, y, -0.76], [2.28, y, -0.76]]} color="#134e4a" lineWidth={1.35} />
      <SmallNode position={[1.86, y, -1.48]} color="#134e4a" />
      <SmallNode position={[2.72, y, -0.42]} color="#134e4a" />
      <SmallNode position={[1.18, y, -1.36]} color="#134e4a" />
    </group>
  )
}

function SmallNode({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.055, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  )
}

function DimensionSystem() {
  return (
    <group position={[0, -0.035, 0]}>
      <Line points={[[-3.1, 0, 2.42], [3.1, 0, 2.42]]} color="#134e4a" lineWidth={1.5} />
      <Line points={[[3.32, 0, -2.12], [3.32, 0, 2.12]]} color="#a85d42" lineWidth={1.2} />
      <Line points={[[-3.1, 0, 2.26], [-3.1, 0, 2.58]]} color="#134e4a" lineWidth={1} />
      <Line points={[[3.1, 0, 2.26], [3.1, 0, 2.58]]} color="#134e4a" lineWidth={1} />
      <Text position={[0, 0.02, 2.64]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.12} color="#134e4a">
        8.40 m
      </Text>
      <Text position={[3.52, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.12} color="#a85d42">
        5.12 m
      </Text>
    </group>
  )
}

function ExplodedGuides({ selectedFloor }: { selectedFloor: FloorKey }) {
  const selected = heroFloors.find((floor) => floor.id === selectedFloor) ?? heroFloors[0]

  return (
    <group>
      {[
        [-2.96, -2.02],
        [2.96, -2.02],
        [2.96, 2.02],
      ].map(([x, z]) => (
        <Line
          key={`${x}-${z}`}
          points={[[x, 0.05, z], [x, 2.38, z]]}
          color="#7d7466"
          lineWidth={0.65}
          dashed
          dashSize={0.09}
          gapSize={0.075}
          transparent
          opacity={0.42}
        />
      ))}
      <Html position={[2.96, 2.2, -1.55]} center className={selectedFloor === 'toiture' ? 'r3f-level-label active' : 'r3f-level-label'}>
        TOITURE <small>+12,80</small>
      </Html>
      <Html position={[2.93, 1.2, -1.25]} center className={selectedFloor === 'etage' ? 'r3f-level-label active' : 'r3f-level-label'}>
        ÉTAGE 1 <small>+6,40</small>
      </Html>
      <Html position={[2.9, 0.18, -1.08]} center className={selectedFloor === 'rdc' ? 'r3f-level-label active' : 'r3f-level-label'}>
        RDC <small>±0,00</small>
      </Html>
      <Html position={[-3.05, selected.y + 0.42, -1.94]} center className="r3f-dwg-tag">
        {selected.planNo}
      </Html>
    </group>
  )
}

function AnnotationLayer({ selectedFloor }: { selectedFloor: FloorKey }) {
  const floor = heroFloors.find((item) => item.id === selectedFloor) ?? heroFloors[0]
  const y = selectedFloor === 'rdc' ? 0.98 : selectedFloor === 'etage' ? 1.96 : 2.42

  return (
    <group>
      <Html position={[-2.72, y, -1.98]} center className="r3f-callout">
        {floor.planNo} / {floor.deliverable}
      </Html>
      <Html position={[1.92, y + 0.16, 1.74]} center className="r3f-callout warm">
        {floor.quoteLine}
      </Html>
      <Html position={[0, y + 0.46, -0.18]} center className="r3f-stamp">
        Prêt pour devis
      </Html>
    </group>
  )
}
